const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const validUsers = [
    { username: 'admin', password: '123' },
];

app.prepare().then(() => {
    const server = express();
    server.use(express.json());
    server.use(cookieParser());

    let timers = [0, 0, 0, 0, 0, 0];
    let controllers = [1, 1, 1, 1, 1, 1];
    let notes = ['', '', '', '', '', '']

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

    const isAuthenticated = (req, res, next) => {
        const token = req.cookies.authToken;
        if (token === 'secure_token') {
        return next();
        }
        res.redirect('/login');
    };

    server.get('/', isAuthenticated, (req, res) => {
        return handle(req, res);
    });

    server.get('/api/timers', isAuthenticated, (req, res) => {
        res.json({ timers, controllers, notes });
    });

    server.post('/api/notes', isAuthenticated, (req, res) => {
        const { index, note } = req.body;
        // Save the note to your database or in-memory storage
        notes[index] = note;
        res.status(200).json({ message: 'Note saved successfully!' });
    });

    server.post('/api/timers', isAuthenticated, (req, res) => {
        const { index, action, controllerCount, totalSeconds } = req.body;
        console.log(totalSeconds)
        if (action === 'start') {
            timers[index] = Date.now() - totalSeconds*1000;
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
