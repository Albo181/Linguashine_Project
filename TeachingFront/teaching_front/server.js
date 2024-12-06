import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_URL = 'https://attractive-upliftment-production.up.railway.app';

// Parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  // Allow the specific origin instead of '*'
  res.header('Access-Control-Allow-Origin', req.headers.origin || BACKEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRFToken, Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Proxy middleware configuration
app.use(['/api', '/users', '/feedback', '/files'], createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  secure: true,
  ws: true,
  xfwd: true,
  cookieDomainRewrite: {
    '*': ''  // Rewrite cookie domain to match frontend
  },
  onProxyReq: function(proxyReq, req, res) {
    // Copy cookies from the original request
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }

    // Add headers that Django typically expects
    proxyReq.setHeader('X-Forwarded-Proto', 'https');
    proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
    proxyReq.setHeader('X-Real-IP', req.ip);
    
    // Forward CSRF token
    const csrfToken = req.headers['x-csrftoken'] || req.headers['x-csrf-token'];
    if (csrfToken) {
      proxyReq.setHeader('X-CSRFToken', csrfToken);
    }

    // Handle POST/PUT requests
    if (['POST', 'PUT'].includes(req.method) && req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: function(proxyRes, req, res) {
    // Copy all headers from the proxy response
    Object.keys(proxyRes.headers).forEach(function (key) {
      res.setHeader(key, proxyRes.headers[key]);
    });

    // Ensure cookies are properly set
    const cookies = proxyRes.headers['set-cookie'];
    if (cookies) {
      res.setHeader('Set-Cookie', cookies.map(cookie => 
        cookie.replace(/Domain=[^;]+;/, '')
             .replace(/SameSite=[^;]+;/, 'SameSite=Lax;')
      ));
    }
  },
  onError: function(err, req, res) {
    console.error('Proxy Error:', err);
    res.status(500).json({
      error: 'Proxy Error',
      message: err.message
    });
  }
}));

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Create HTTP server
const server = createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
