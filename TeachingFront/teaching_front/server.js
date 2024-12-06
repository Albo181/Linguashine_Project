import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRFToken');
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
  target: 'https://linguashineproject-production.up.railway.app',
  changeOrigin: true,
  secure: true,
  ws: true,
  xfwd: true,
  cookieDomainRewrite: {
    '*': ''  // Rewrite cookie domain to match frontend
  },
  onProxyReq: function(proxyReq, req, res) {
    // Add headers that Django typically expects
    proxyReq.setHeader('X-Forwarded-Proto', 'https');
    proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
    proxyReq.setHeader('X-Real-IP', req.ip);
    
    // Forward CSRF token
    const csrfToken = req.headers['x-csrftoken'] || req.headers['x-csrf-token'];
    if (csrfToken) {
      proxyReq.setHeader('X-CSRFToken', csrfToken);
    }

    // Forward cookies
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }

    // Special handling for POST requests
    if (req.method === 'POST') {
      // Ensure content length is correct for POST requests
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  },
  onProxyRes: function(proxyRes, req, res) {
    // Handle cookies
    const cookies = proxyRes.headers['set-cookie'];
    if (cookies) {
      const modifiedCookies = cookies.map(cookie =>
        cookie
          .replace(/Domain=[^;]+;/, '')
          .replace(/SameSite=Lax/, 'SameSite=None; Secure')
          // Ensure cookies are accessible in all contexts
          .replace(/Secure;/, 'Secure; SameSite=None;')
      );
      proxyRes.headers['set-cookie'] = modifiedCookies;
    }

    // Add CORS headers
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
  },
  // Handle proxy errors
  onError: function(err, req, res) {
    console.error('Proxy Error:', err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong with the proxy.');
  }
}));

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start the server
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
