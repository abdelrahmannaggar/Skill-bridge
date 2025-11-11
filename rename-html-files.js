const fs = require('fs');
const path = require('path');

// Define the file name mappings
const fileMappings = {
    'Feedbacks.html': 'feedbacks.html',
    'intrestespage.html': 'interests-page.html',
    'personalskill.html': 'personal-skill.html',
    'online-tutorial request.html': 'online-tutorial-request.html'
};

// Function to normalize file names
function normalizeFileName(fileName) {
    return fileName.toLowerCase().replace(/\s+/g, '-');
}

// Function to rename files
function renameFiles() {
    const htmlDir = path.join(__dirname, '..');

    // Read all HTML files
    fs.readdir(htmlDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            if (file.endsWith('.html')) {
                const normalizedName = normalizeFileName(file);
                
                // Only rename if the file name needs to be changed
                if (file !== normalizedName) {
                    const oldPath = path.join(htmlDir, file);
                    const newPath = path.join(htmlDir, normalizedName);

                    fs.rename(oldPath, newPath, (err) => {
                        if (err) {
                            console.error(`Error renaming ${file}:`, err);
                            return;
                        }
                        console.log(`Renamed ${file} to ${normalizedName}`);
                    });
                }
            }
        });
    });
}

// Run the rename operation
renameFiles();

console.log('\nFile renaming completed!'); 