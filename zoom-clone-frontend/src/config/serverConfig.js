// Server configuration for API endpoints

// Array of available server IPs from Render deployment
const SERVER_IPS = [
  '13.228.225.19',
  '18.142.128.26',
  '54.254.162.138'
];

// Simple round-robin load balancer
let currentServerIndex = 0;

// Function to get the next server in round-robin fashion
const getNextServer = () => {
  const server = SERVER_IPS[currentServerIndex];
  currentServerIndex = (currentServerIndex + 1) % SERVER_IPS.length;
  return server;
};

// Base URLs for HTTP and WebSocket connections
const getApiBaseUrl = () => `http://${getNextServer()}`;
const getWebSocketUrl = () => `ws://${getNextServer()}`;

// Socket.IO URL
const getSocketIOUrl = () => `http://${getNextServer()}`;

export { getApiBaseUrl, getWebSocketUrl, getSocketIOUrl, SERVER_IPS };