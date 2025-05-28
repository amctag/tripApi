// app.js (updated version)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Verify the required
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Config
const API_CONFIG = {
  basePath: process.env.API_BASE_PATH || '/api',
  currentVersion: process.env.API_CURRENT_VERSION || '/v1',
  enableVersioning: process.env.ENABLE_VERSIONING === "true"
};

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());

// Health Check
// app.get(`${API_CONFIG.basePath}/health`, (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date() });
// });
const versionPrefix = API_CONFIG.enableVersioning ? `/${API_CONFIG.currentVersion.replace(/^\/?/, '')}` : '';
app.get(`${API_CONFIG.basePath}${versionPrefix}/health`, (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), config: API_CONFIG });
});


// Improved Route Loader
const loadRoute = (routeFilePath, mountPath) => {
  try {
    const route = require(routeFilePath);
    app.use(mountPath, route);
    console.log(`Mounted ${mountPath} -> ${routeFilePath}`);
  } catch (err) {
    console.error(`Route loading failed: ${mountPath}`, err.message);
    console.log('Full error stack:', err.stack);
  }
};

// API Routes
const loadApiRoutes = () => {
  const versionFolder = API_CONFIG.currentVersion.replace(/^\/?/, '');
  const versionPrefix = API_CONFIG.enableVersioning ? `/${versionFolder}` : '';
  const basePath = API_CONFIG.basePath.replace(/\/$/, ''); // remove trailing slash
  const routesDir = path.join(__dirname, 'api', 'routes', versionFolder);

  const routesToLoad = [
    { file: 'loginRoute.js', path: '/login' },
    { file: 'registerRoute.js', path: '/register' },
    { file: 'usersRoute.js', path: '/users' },
    { file: 'changePasswordRoute.js', path: '/change_password' },
  ];

  routesToLoad.forEach(({ file, path: subPath }) => {
    const routeFilePath = path.join(routesDir, file);
    const mountPath = `${basePath}${versionPrefix}${subPath}`;

    console.log(`Preparing to mount route:\n  File: ${routeFilePath}\n  At:   ${mountPath}`);

    loadRoute(routeFilePath, mountPath);
  });
};


// Debugging middleware to see routing
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.originalUrl}`);
  next();
});

// Load routes
loadApiRoutes();

// 404 Handler (must come after routes)
app.use((req, res) => {
  console.warn(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    reason: `Cannot ${req.method} ${req.originalUrl}`,
    config: API_CONFIG
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\nAPI Endpoints:`);
  console.log(`\nServer ready on port ${PORT}`);
});
