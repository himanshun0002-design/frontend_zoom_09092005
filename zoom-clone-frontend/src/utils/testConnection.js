/**
 * Test utility to verify connection to the Django backend
 */
import { getApiBaseUrl, getWebSocketUrl, getSocketIOUrl } from '../config/serverConfig';

/**
 * Tests the API connection to the Django backend
 * @returns {Promise<Object>} The test results
 */
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', getApiBaseUrl());
    const response = await fetch(`${getApiBaseUrl()}/api/health-check/`);
    const data = await response.json();
    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error('API connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Tests the WebSocket connection
 * @returns {Promise<Object>} The test results
 */
export const testWebSocketConnection = () => {
  return new Promise((resolve) => {
    try {
      console.log('Testing WebSocket connection to:', getWebSocketUrl());
      const ws = new WebSocket(`${getWebSocketUrl()}/ws/test/`);
      
      const timeout = setTimeout(() => {
        ws.close();
        resolve({
          success: false,
          error: 'Connection timeout'
        });
      }, 5000);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        ws.close();
        resolve({
          success: true,
          message: 'WebSocket connection successful'
        });
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          error: 'WebSocket connection failed'
        });
      };
    } catch (error) {
      resolve({
        success: false,
        error: error.message
      });
    }
  });
};

/**
 * Tests the Socket.IO connection
 * @returns {Promise<Object>} The test results
 */
export const testSocketIOConnection = () => {
  return new Promise((resolve) => {
    try {
      const io = require('socket.io-client');
      console.log('Testing Socket.IO connection to:', getSocketIOUrl());
      const socket = io(getSocketIOUrl(), { 
        transports: ['websocket'],
        timeout: 5000
      });
      
      const timeout = setTimeout(() => {
        socket.disconnect();
        resolve({
          success: false,
          error: 'Connection timeout'
        });
      }, 5000);
      
      socket.on('connect', () => {
        clearTimeout(timeout);
        socket.disconnect();
        resolve({
          success: true,
          message: 'Socket.IO connection successful'
        });
      });
      
      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        socket.disconnect();
        resolve({
          success: false,
          error: 'Socket.IO connection failed: ' + error.message
        });
      });
    } catch (error) {
      resolve({
        success: false,
        error: error.message
      });
    }
  });
};

/**
 * Run all connection tests
 */
export const runAllTests = async () => {
  const apiResult = await testApiConnection();
  const wsResult = await testWebSocketConnection();
  const socketIOResult = await testSocketIOConnection();
  
  console.log('API Test Result:', apiResult);
  console.log('WebSocket Test Result:', wsResult);
  console.log('Socket.IO Test Result:', socketIOResult);
  
  return {
    api: apiResult,
    webSocket: wsResult,
    socketIO: socketIOResult,
    allSuccessful: apiResult.success && wsResult.success && socketIOResult.success
  };
};