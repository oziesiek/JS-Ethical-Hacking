# Cookie Stealer

This repository contains a simple web application and script designed to demonstrate a basic cookie stealing attack for educational purposes. It consists of two main components:

1. **Server**: An Express.js server configured to receive POST requests containing stolen cookies and log them to a file.
2. **Stealer**: A JavaScript script that runs in the browser and steals cookies from the current website, sending them to the server.

## Usage

### Running the Server

1. Install Node.js if you haven't already: [Node.js Installation](https://nodejs.org/)
2. Clone this repository to your local machine.
3. Navigate to the `server` directory.
4. Install dependencies by running `npm install`.
5. Start the server by running `npm start`.

### Running the Attack Locally

1. Ensure the server is running by following the above steps.
2. Open the `index.html` file in your browser.
3. The JavaScript script (`steal.js`) will automatically execute, stealing cookies and sending them to the server.

## Scenarios

This demonstration can be used to understand:

- How cookies can be stolen from websites using client-side scripts.
- The importance of secure coding practices to prevent such attacks.
- How attackers can use stolen cookies to impersonate users and perform unauthorized actions.
- How to implement server-side defenses such as validating and sanitizing user inputs, implementing CSRF tokens, and using HTTP-only cookies.

**Note**: This repository is intended for educational purposes only. Unauthorized use of these techniques on real-world systems is illegal and unethical.
