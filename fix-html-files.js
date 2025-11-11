const fs = require('fs');
const path = require('path');

// Define the file name mappings
const fileMappings = {
    'Feedbacks.html': 'feedbacks.html',
    'intrestespage.html': 'interests-page.html',
    'personalskill.html': 'personal-skill.html',
    'online-tutorial request.html': 'online-tutorial-request.html',
    'Skillswap.html': 'skillswap.html',
    'Skillswapsearchpage.html': 'skillswap-search-page.html'
};

// Define required scripts for each page type
const requiredScripts = {
    'index.html': ['api.js', 'auth-init.js', 'auth.js', 'fixed_merged_main.js'],
    'login.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'signup.html': ['api.js', 'signup.js', 'auth.js', 'fixed_merged_main.js'],
    'profilepage.html': ['api.js', 'profile.js', 'auth.js', 'auth-init.js', 'fixed_merged_main.js'],
    'chatspage.html': ['api.js', 'chat.js', 'auth.js', 'fixed_merged_main.js'],
    'chat.html': ['api.js', 'chat.js', 'auth.js', 'fixed_merged_main.js'],
    'skillswap.html': ['api.js', 'skillSwapManager.js', 'auth.js', 'fixed_merged_main.js'],
    'skillswap-search-page.html': ['api.js', 'skillSwapManager.js', 'auth.js', 'fixed_merged_main.js'],
    'edit-profile.html': ['api.js', 'profile.js', 'auth.js', 'fixed_merged_main.js'],
    'settings.html': ['api.js', 'profile.js', 'auth.js', 'fixed_merged_main.js'],
    'my-tutorials.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'online-tutorial-request.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'tutorial-details.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'tutorial-content.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'event.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'feedbacks.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'payment.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'pricingpage.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'aboutus.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'contactus.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'forgot-password.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'reset-password.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'interests-page.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'personal-skill.html': ['api.js', 'auth.js', 'fixed_merged_main.js'],
    'required-skill.html': ['api.js', 'auth.js', 'fixed_merged_main.js']
};

// Function to normalize file names
function normalizeFileName(fileName) {
    return fileName.toLowerCase().replace(/\s+/g, '-');
}

// Function to update HTML content
function updateHtmlContent(content, fileName) {
    // Update script tags
    const normalizedName = normalizeFileName(fileName);
    const scripts = requiredScripts[normalizedName] || ['api.js', 'auth.js', 'fixed_merged_main.js'];
    
    // Remove existing script tags
    let updatedContent = content.replace(/<script src="js\/[^"]+"><\/script>\n?/g, '');
    
    // Add new script tags
    const scriptTags = scripts.map(script => 
        `    <script src="js/${script}"></script>`
    ).join('\n');
    
    updatedContent = updatedContent.replace(
        '</body>',
        `${scriptTags}\n</body>`
    );
    
    // Update href attributes
    Object.entries(fileMappings).forEach(([oldName, newName]) => {
        const regex = new RegExp(`href="${oldName}"`, 'g');
        updatedContent = updatedContent.replace(regex, `href="${newName}"`);
    });
    
    return updatedContent;
}

// Function to process all HTML files
function processHtmlFiles() {
    const htmlDir = path.join(__dirname, '..');
    
    // First rename files
    fs.readdir(htmlDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        
        files.forEach(file => {
            if (file.endsWith('.html')) {
                const normalizedName = normalizeFileName(file);
                
                // Rename file if needed
                if (file !== normalizedName) {
                    const oldPath = path.join(htmlDir, file);
                    const newPath = path.join(htmlDir, normalizedName);
                    
                    fs.rename(oldPath, newPath, (err) => {
                        if (err) {
                            console.error(`Error renaming ${file}:`, err);
                            return;
                        }
                        console.log(`Renamed ${file} to ${normalizedName}`);
                        
                        // Update content after renaming
                        fs.readFile(newPath, 'utf8', (err, content) => {
                            if (err) {
                                console.error(`Error reading ${normalizedName}:`, err);
                                return;
                            }
                            
                            const updatedContent = updateHtmlContent(content, normalizedName);
                            
                            fs.writeFile(newPath, updatedContent, 'utf8', (err) => {
                                if (err) {
                                    console.error(`Error writing to ${normalizedName}:`, err);
                                    return;
                                }
                                console.log(`Updated content in ${normalizedName}`);
                            });
                        });
                    });
                } else {
                    // Update content for files that don't need renaming
                    const filePath = path.join(htmlDir, file);
                    
                    fs.readFile(filePath, 'utf8', (err, content) => {
                        if (err) {
                            console.error(`Error reading ${file}:`, err);
                            return;
                        }
                        
                        const updatedContent = updateHtmlContent(content, file);
                        
                        fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
                            if (err) {
                                console.error(`Error writing to ${file}:`, err);
                                return;
                            }
                            console.log(`Updated content in ${file}`);
                        });
                    });
                }
            }
        });
    });
}

// Run the process
processHtmlFiles();

console.log('\nFile processing completed!'); 