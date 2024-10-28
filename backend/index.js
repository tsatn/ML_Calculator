const express = require('express');
const cors = require('cors');
const simplexLP = require('./simplexLP');
const nonLinearOptimization = require('./nonLinearOptimization');
const convexOptimization = require('./convexOptimization');
const app = express();
const port = 3001;   

app.use(cors());
app.use(express.json());

// root route for a basic message
app.get('/', (req, res) => {
    res.send('Server is running. Use /api/calculate for calculations.');
});

app.post('/api/calculate', (req, res) => {
    const { A, B, C } = req.body; // inputs for linear optimization
    try {
        const result = simplexLP(A, B, C); // linear optimization logic
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/calculateNonLinear', (req, res) => {
    const { X } = req.body; // inputs for non-linear optimization
    try {
        const result = nonLinearOptimization(X); // non-linear optimization logic using gradient descent
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/calculateConvex', (req, res) => {
    const { x0 } = req.body; // Initial guess for convex optimization
    const f = (x) => x.reduce((sum, xi) => sum + xi ** 2, 0); // Example convex function: f(x) = x^2
    const gradF = (x) => x.map(xi => 2 * xi); // Gradient of f(x) = x^2
    const hessianF = (x) => Array(x.length).fill().map((_, i) => Array(x.length).fill().map((_, j) => i === j ? 2 : 0)); // Hessian of f(x) = x^2

    try {
        const result = convexOptimization(f, gradF, hessianF, x0); // Convex optimization logic using Newton's method
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Optimization backend listening at http://localhost:${port}`);
});
