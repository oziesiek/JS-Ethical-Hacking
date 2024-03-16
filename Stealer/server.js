const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://0.0.0.0:8000',
  credentials: true
}));

app.use(express.json());

app.post('/server', (req, res) => { // Change the route to /server
  console.log('Received cookies:', req.body);
  // Process the received cookies here
  res.send('Cookies received successfully');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
