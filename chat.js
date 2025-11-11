// Global variables
let currentUser = null;
let currentChat = null;
let ws = null;
let typingTimeout = null;

// Initialize the chat application
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Get current user
    try {
        const response = await fetch('http://localhost:5000/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        currentUser = await response.json();
    } catch (error) {
        console.error('Failed to get current user:', error);
        showToast('Failed to load user data', 'error');
        return;
    }

    // Initialize WebSocket connection
    initializeWebSocket();

    // Load chat list
    loadChatList();

    // Set up event listeners
    setupEventListeners();

    if (document.getElementById('new-chat-user-list')) {
        loadUsers();
    }
});

// Initialize WebSocket connection
function initializeWebSocket() {
    ws = new WebSocket(`ws://localhost:5000/ws?token=${localStorage.getItem('token')}`);

    ws.onopen = () => {
        console.log('WebSocket connected');
        // Only show success message on initial connection
        if (!ws._hasConnected) {
            showToast('Connected to chat server', 'success');
            ws._hasConnected = true;
        }
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Only show error if we haven't shown one recently
        if (!ws._lastErrorShown || Date.now() - ws._lastErrorShown > 30000) {
            showToast('Connection error', 'error');
            ws._lastErrorShown = Date.now();
        }
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Only attempt reconnect if we haven't tried too many times
        if (!ws._reconnectAttempts || ws._reconnectAttempts < 3) {
            ws._reconnectAttempts = (ws._reconnectAttempts || 0) + 1;
            setTimeout(initializeWebSocket, 5000);
        } else {
            showToast('Connection lost. Please refresh the page.', 'error');
        }
    };
}

// Handle WebSocket messages
function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'message':
            if (data.chatId === currentChat?.id) {
                appendMessage(data);
            }
            updateChatList();
            break;
        case 'typing':
            if (data.chatId === currentChat?.id) {
                showTypingIndicator(data.userId);
            }
            break;
        case 'status':
            updateUserStatus(data.userId, data.status);
            break;
    }
}

// Load chat list
async function loadChatList() {
    try {
        const response = await fetch('http://localhost:5000/api/chats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const chats = await response.json();
        renderChatList(chats);
    } catch (error) {
        console.error('Failed to load chats:', error);
        showToast('Failed to load conversations', 'error');
    }
}

// Render chat list
function renderChatList(chats) {
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';

    chats.forEach(chat => {
        const chatDiv = document.createElement('div');
        chatDiv.className = 'recent-chat';
        chatDiv.dataset.chatId = chat.id;
        
        const otherUser = chat.participants.find(p => p.id !== currentUser.id);
        const initials = getInitials(otherUser.full_name);
        
        chatDiv.innerHTML = `
            <div class="avatar status-dot ${otherUser.is_online ? 'online' : 'offline'}">${initials}</div>
            <div class="chat-info">
                <div class="chat-header">
                    <h4>${otherUser.full_name}</h4>
                    <span class="time">${formatTime(chat.last_message?.timestamp)}</span>
                </div>
                <p class="last-message">${chat.last_message?.content || 'No messages yet'}</p>
                <span class="user-status-text">${otherUser.is_online ? 'Online' : 'Offline'}</span>
            </div>
        `;

        chatDiv.addEventListener('click', () => openChat(chat));
        chatList.appendChild(chatDiv);
    });
}

// Open chat
async function openChat(chat) {
    currentChat = chat;
    const otherUser = chat.participants.find(p => p.id !== currentUser.id);
    
    // Update chat header
    document.getElementById('chat-username').textContent = otherUser.full_name;
    document.getElementById('chat-avatar').textContent = getInitials(otherUser.full_name);
    document.getElementById('chat-status').textContent = otherUser.is_online ? 'Online' : 'Offline';
    
    // Load messages
    try {
        const response = await fetch(`http://localhost:5000/api/chats/${chat.id}/messages`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const messages = await response.json();
        renderMessages(messages);
    } catch (error) {
        console.error('Failed to load messages:', error);
        showToast('Failed to load messages', 'error');
    }
}

// Render messages
function renderMessages(messages) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-group ${message.sender_id === currentUser.id ? 'sent' : 'received'}`;
        
        if (message.sender_id !== currentUser.id) {
            messageDiv.innerHTML = `
                <div class="avatar">${getInitials(currentChat.participants.find(p => p.id === message.sender_id).full_name)}</div>
            `;
        }
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        switch (message.type) {
            case 'text':
                bubble.textContent = message.content;
                break;
            case 'image':
                bubble.innerHTML = `<img src="${message.content}" alt="Image">`;
                break;
            case 'file':
                bubble.innerHTML = `
                    <div class="file-attachment">
                        <i class="fas fa-file"></i>
                        <a href="${message.content}" target="_blank">${message.file_name}</a>
                    </div>
                `;
                break;
            case 'audio':
                bubble.innerHTML = `<audio controls src="${message.content}"></audio>`;
                break;
        }
        
        bubble.innerHTML += `
            <span class="timestamp">${formatTime(message.timestamp)}</span>
            ${message.sender_id === currentUser.id ? '<span class="read-receipt">✓</span>' : ''}
        `;
        
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
function sendMessage(content, type = 'text') {
    if (!currentChat) {
        showToast('Please select a chat first', 'error');
        return;
    }

    // Find the other user's id
    const otherUser = currentChat.participants.find(p => p.id !== currentUser.id);
    if (!otherUser) {
        showToast('No recipient found for this chat', 'error');
        return;
    }

    const message = {
        type: 'message',
        senderId: currentUser.id,
        receiverId: otherUser.id,
        content,
        messageType: type,
        timestamp: new Date().toISOString()
    };

    ws.send(JSON.stringify(message));
}

// Show typing indicator
function showTypingIndicator(userId) {
    const typingIndicator = document.querySelector('.typing-indicator-header');
    typingIndicator.style.display = 'inline-block';
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        typingIndicator.style.display = 'none';
    }, 3000);
}

// Update user status
function updateUserStatus(userId, status) {
    const chatDiv = document.querySelector(`.recent-chat[data-chat-id="${currentChat.id}"]`);
    if (chatDiv) {
        const statusDot = chatDiv.querySelector('.status-dot');
        const statusText = chatDiv.querySelector('.user-status-text');
        
        statusDot.className = `status-dot ${status === 'online' ? 'online' : 'offline'}`;
        statusText.textContent = status === 'online' ? 'Online' : 'Offline';
    }
}

// Utility functions
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Set up event listeners
function setupEventListeners() {
    // Message input
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-btn');

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = messageInput.value.trim();
            if (message) {
                sendMessage(message);
                messageInput.value = '';
            }
        }
    });

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    // Typing indicator
    messageInput.addEventListener('input', () => {
        if (currentChat) {
            const otherUser = currentChat.participants.find(p => p.id !== currentUser.id);
            if (!otherUser) return;
            ws.send(JSON.stringify({
                type: 'typing',
                senderId: currentUser.id,
                receiverId: otherUser.id,
                chatId: currentChat.id
            }));
        }
    });

    // File upload
    document.getElementById('attach-btn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.txt';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });
                
                if (!response.ok) throw new Error('Upload failed');
                
                const { url } = await response.json();
                const type = file.type.startsWith('image/') ? 'image' : 'file';
                sendMessage(url, type);
            } catch (error) {
                console.error('Upload error:', error);
                showToast('Failed to upload file', 'error');
            }
        };
        
        input.click();
    });

    // Voice recording
    let mediaRecorder = null;
    let audioChunks = [];

    document.getElementById('voice-btn').addEventListener('click', async function() {
        if (!mediaRecorder) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };
                
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const formData = new FormData();
                    formData.append('file', audioBlob, 'recording.webm');
                    
                    try {
                        const response = await fetch('http://localhost:5000/api/upload', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: formData
                        });
                        
                        if (!response.ok) throw new Error('Upload failed');
                        
                        const { url } = await response.json();
                        sendMessage(url, 'audio');
                    } catch (error) {
                        console.error('Upload error:', error);
                        showToast('Failed to upload audio', 'error');
                    }
                    
                    audioChunks = [];
                    mediaRecorder = null;
                };
                
                mediaRecorder.start();
                this.classList.add('recording');
            } catch (error) {
                console.error('Recording error:', error);
                showToast('Failed to start recording', 'error');
            }
        } else {
            mediaRecorder.stop();
            this.classList.remove('recording');
        }
    });

    // Search functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const chats = document.querySelectorAll('.recent-chat');
        
        chats.forEach(chat => {
            const name = chat.querySelector('h4').textContent.toLowerCase();
            const lastMessage = chat.querySelector('.last-message').textContent.toLowerCase();
            chat.style.display = name.includes(query) || lastMessage.includes(query) ? '' : 'none';
        });
    });

    // New chat modal
    const newChatBtn = document.querySelector('.new-chat-btn');
    const newChatModal = document.getElementById('new-chat-modal');
    const closeNewChatModal = document.querySelector('#new-chat-modal .close');
    
    newChatBtn.addEventListener('click', () => {
        newChatModal.style.display = 'block';
        loadUsers();
    });
    
    closeNewChatModal.addEventListener('click', () => {
        newChatModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === newChatModal) {
            newChatModal.style.display = 'none';
        }
    });
}

// Load users for new chat
async function loadUsers() {
    try {
        const response = await fetch('http://localhost:5000/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const users = await response.json();
        
        const userList = document.getElementById('new-chat-user-list');
        userList.innerHTML = '';
        
        users.forEach(user => {
            if (user.id !== currentUser.id) {
                const userDiv = document.createElement('div');
                userDiv.className = 'new-chat-user-item';
                userDiv.innerHTML = `
                    <div class="avatar">${getInitials(user.full_name)}</div>
                    <div class="user-info">
                        <h4>${user.full_name}</h4>
                        <span class="status">${user.is_online ? 'Online' : 'Offline'}</span>
                    </div>
                `;
                
                userDiv.addEventListener('click', () => {
                    startNewChat(user);
                    document.getElementById('new-chat-modal').style.display = 'none';
                });
                
                userList.appendChild(userDiv);
            }
        });
    } catch (error) {
        console.error('Failed to load users:', error);
        showToast('Failed to load users', 'error');
    }
}

// Start new chat
async function startNewChat(user) {
    try {
        const response = await fetch('http://localhost:5000/api/chats', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                participantId: user.id
            })
        });
        
        if (!response.ok) throw new Error('Failed to create chat');
        
        const chat = await response.json();
        openChat(chat);
        loadChatList();
    } catch (error) {
        console.error('Failed to start new chat:', error);
        showToast('Failed to start new chat', 'error');
    }
} 