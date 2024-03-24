## Keylogger

A simple keylogger built with Node.js that captures keystrokes and sends them to a specified server endpoint via HTTP POST requests.

Introduction

Keylogger is a lightweight utility designed to demonstrate the basic functionality of capturing keystrokes and sending them to a server. It leverages the popular Axios library for making HTTP requests and the iohook library for capturing keyboard events.
Features

    Captures keystrokes in real-time.
    Sends captured keystrokes to a specified server endpoint via HTTP POST requests.
    Configurable interval for sending logs to the server.
    Graceful shutdown mechanism to stop capturing keystrokes.

Prerequisites

Before you begin, ensure you have the following installed on your system:

    Node.js
    npm (Node Package Manager)

Installation

    Clone the repository to your local machine
    Navigate to the project directory
    Install dependencies using npm

Usage

    Start the keylogger by running the following command:

    node keylogger.js

    This will start capturing keystrokes and sending them to the specified server endpoint.

Stopping the Keylogger

To stop the keylogger, press Ctrl+C. This will trigger a graceful shutdown, stopping the capture of keystrokes and terminating the program.

Security Considerations

    Use the keylogger responsibly and only for legitimate purposes.
    Ensure that the server endpoint where the keystrokes are sent is secure and properly protected.
    Do not use the keylogger for malicious activities or without obtaining proper authorization.

Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

    Fork the repository.
    Create a new branch (git checkout -b feature/new-feature).
    Make your changes.
    Commit your changes (git commit -am 'Add new feature').
    Push to the branch (git push origin feature/new-feature).
    Create a new Pull Request.
