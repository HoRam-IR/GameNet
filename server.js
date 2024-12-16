const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const validUsers = [
  { username: 'admin', password: '123' }, // Replace with your own user validation logic
];

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(cookieParser());

  let timers = [0, 0, 0, 0, 0, 0];
  let controllers = [1, 1, 1, 1, 1, 1];

  // Login endpoint
  server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = validUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      res.cookie('authToken', 'secure_token', {
        httpOnly: true,
        secure: !dev, // Secure cookies in production
      });
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });

  // Auth check middleware
  const isAuthenticated = (req, res, next) => {
    const token = req.cookies.authToken;
    if (token === 'secure_token') {
      return next();
    }
    res.redirect('/login');
  };

  // Protect your gaming center route
  server.get('/', isAuthenticated, (req, res) => {
    return handle(req, res);
  });

  server.get('/api/timers', isAuthenticated, (req, res) => {
    res.json({ timers, controllers });
  });

    server.post('/api/timers', isAuthenticated, (req, res) => {
        const { index, action, controllerCount } = req.body;

        if (action === 'start') {
            timers[index] = Date.now();
        } else if (action === 'reset') {
            timers[index] = 0;
        }

        if (controllerCount !== undefined) {
            controllers[index] = controllerCount;
        }

        res.json({ message: 'Timer and/or controller updated', timers, controllers });
    });

    server.post('/api/controller', isAuthenticated, (req, res) => {
        const { index, controllerCount } = req.body;
        controllers[index] = controllerCount;
        res.json({ message: 'Timer and/or controller updated', timers, controllers });
    });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
