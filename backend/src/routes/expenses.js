import express from 'express';
import { getAllExpenses, createExpense, deleteExpense, updateExpense } from '../controllers/expenseController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// GET all expenses
router.get('/', protect , getAllExpenses );

// POST new expense
router.post('/create',  protect ,createExpense );

// DELETE expense*
router.delete('/:id', protect ,  deleteExpense);

// PUT update expense
router.put('/:id', protect , updateExpense);

export default router;


