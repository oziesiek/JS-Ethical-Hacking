const fs = require('fs');
const readline = require('readline');
const temp = require('temp');
const colors = require('colors');

// Function to display a colored banner
function displayBanner() {
    const banner = `
    ┏┓                   ┓   
    ┗┓╋┏┓┏┓┏┓┏┓┏┓┏┓┏┓┏┓┏┓┣┓┓┏
    ┗┛┗┗ ┗┫┗┻┛┗┗┛┗┫┛ ┗┻┣┛┛┗┗┫
          ┛       ┛    ┛    ┛
               by Oziesiek	
               
               `;
  
    console.log(colors.magenta(banner));
}

// Display the banner at the beginning
displayBanner();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the path to the image file: ', (jpgFile) => {
    // Check if the provided path is empty or if the file does not exist
    if (!jpgFile || !fs.existsSync(jpgFile)) {
        console.error('Error: Invalid path for the image file.');
        rl.close();
        return;
    }

    rl.question('Enter the string to be added: ', (originalScript) => {
        rl.question('Do you want to encode the string as ASCII? (y/n): ', (answer) => {
            const encodeAsAscii = (answer.toLowerCase() === 'y');

            // Function to convert string to ASCII representation
            function stringToAscii(str) {
                return str.split('').map(char => char.charCodeAt(0)).join(',');
            }

            // Encode the script as ASCII if requested
            const script = encodeAsAscii ? stringToAscii(originalScript) : originalScript;

            // Create a temporary file to store the encoded script
            temp.open('temp', (err, info) => {
                if (err) throw err;
                // Write the encoded script to the temporary file
                fs.writeFile(info.path, script, (err) => {
                    if (err) throw err;
                    // Append the content of the temporary file to the original JPG file
                    fs.appendFile(jpgFile, ',' + fs.readFileSync(info.path), (err) => {
                        if (err) throw err;
                        console.log('String embedded into JPG file successfully.');
                        // Delete the temporary file
                        fs.unlink(info.path, (err) => {
                            if (err) throw err;
                            rl.close(); // Close the readline interface
                        });
                    });
                });
            });
        });
    });
});
