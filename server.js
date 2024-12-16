const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    let timers = [0, 0, 0, 0, 0, 0]; // Timer state
    let controllers = [1, 1, 1, 1, 1, 1];
    
    server.get('/api/timers', (req, res) => {
        res.json({ timers, controllers });
    });

    // Update timer and/or controller state
    server.post('/api/timers', express.json(), (req, res) => {
        const { index, action, controllerCount } = req.body;

        if (action === 'start') {
            // Start timer: store current timestamp
            timers[index] = Date.now();
        } else if (action === 'reset') {
            // Reset timer: reset to 0
            timers[index] = 0;
        }

        // Update controller count if provided
        if (controllerCount !== undefined) {
            controllers[index] = controllerCount;
        }

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
