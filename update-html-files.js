const fs = require('fs');
const path = require('path');

// Define the mapping of HTML files to their corresponding JS files
const fileMappings = {
    'index.html': ['auth-init.js', 'auth.js', 'fixed_merged_main.js'],
    'login.html': ['auth.js', 'fixed_merged_main.js'],
    'signup.html': ['signup.js', 'auth.js', 'fixed_merged_main.js'],
    'profilepage.html': ['profile.js', 'auth.js', 'fixed_merged_main.js'],
    'chatspage.html': ['chat.js', 'auth.js', 'fixed_merged_main.js'],
    'chat.html': ['chat.js', 'auth.js', 'fixed_merged_main.js'],
    'Skillswap.html': ['skillSwapManager.js', 'auth.js', 'fixed_merged_main.js'],
    'Skillswapsearchpage.html': ['skillSwapManager.js', 'auth.js', 'fixed_merged_main.js'],
    'edit-profile.html': ['profile.js', 'auth.js', 'fixed_merged_main.js'],
    'settings.html': ['profile.js', 'auth.js', 'fixed_merged_main.js'],
    'my-tutorials.html': ['auth.js', 'fixed_merged_main.js'],
    'online-tutorial-request.html': ['auth.js', 'fixed_merged_main.js'],
    'tutorial-details.html': ['auth.js', 'fixed_merged_main.js'],
    'tutorial-content.html': ['auth.js', 'fixed_merged_main.js'],
    'event.html': ['auth.js', 'fixed_merged_main.js'],
    'feedbacks.html': ['auth.js', 'fixed_merged_main.js'],
    'payment.html': ['auth.js', 'fixed_merged_main.js'],
    'pricingpage.html': ['auth.js', 'fixed_merged_main.js'],
    'aboutus.html': ['auth.js', 'fixed_merged_main.js'],
    'contactus.html': ['auth.js', 'fixed_merged_main.js'],
    'forgot-password.html': ['auth.js', 'fixed_merged_main.js'],
    'reset-password.html': ['auth.js', 'fixed_merged_main.js'],
    'interests-page.html': ['auth.js', 'fixed_merged_main.js'],
    'personal-skill.html': ['auth.js', 'fixed_merged_main.js'],
    'required-skill.html': ['auth.js', 'fixed_merged_main.js']
};

// Function to normalize file names
function normalizeFileName(fileName) {
    return fileName.toLowerCase().replace(/\s+/g, '-');
}

// Function to update HTML files
function updateHtmlFiles() {
    const htmlDir = path.join(__dirname, '..');
    const jsDir = path.join(__dirname);

    // Read all HTML files
    fs.readdir(htmlDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            if (file.endsWith('.html')) {
                const filePath = path.join(htmlDir, file);
                const normalizedFileName = normalizeFileName(file);
                
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error reading ${file}:`, err);
                        return;
                    }

                    // Get the JS files for this HTML file
                    const jsFiles = fileMappings[normalizedFileName] || ['auth.js', 'fixed_merged_main.js'];
                    
                    // Create script tags for JS files
                    const scriptTags = jsFiles.map(jsFile => 
                        `    <script src="js/${jsFile}"></script>`
                    ).join('\n');

                    // Remove existing script tags that reference js/ files
                    let updatedData = data.replace(/<script src="js\/[^"]+"><\/script>\n?/g, '');

                    // Add new script tags before closing body tag
                    updatedData = updatedData.replace(
                        '</body>',
                        `${scriptTags}\n</body>`
                    );

                    // Write the updated content back to the file
                    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                        if (err) {
                            console.error(`Error writing to ${file}:`, err);
                            return;
                        }
                        console.log(`Updated ${file} with JavaScript references`);
                    });
                });
            }
        });
    });
}

// Run the update
updateHtmlFiles();

console.log('\nScript execution completed!'); 