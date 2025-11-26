import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import expenseRoutes from './routes/expenses.js';
import authRoutes from './routes/auth.js';

const app = express();


// Middleware
app.use(cors( { origin: "http://localhost:5173" , credentials: true } ));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API' });
});

export default app;

