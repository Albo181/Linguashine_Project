import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Proxy middleware configuration
const apiProxy = createProxyMiddleware(['/api', '/users', '/feedback', '/files'], {
  target: 'https://linguashineproject-production.up.railway.app',
  changeOrigin: true,
  secure: true,
  cookieDomainRewrite: {
    '*': ''  // This will rewrite the cookie domain to match your frontend domain
  },
  onProxyRes: function(proxyRes, req, res) {
    // Log cookies for debugging
    console.log('Received cookies:', proxyRes.headers['set-cookie']);
  }
});

// Use the proxy middleware
app.use(apiProxy);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
