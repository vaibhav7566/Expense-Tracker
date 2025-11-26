
import Expense from '../models/Expense.js';
import User from '../models/User.js';

export const getAllExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        // console.log(req.body);
        // const userID = req.user.id;
        const userID = req.userId;
        // console.log(userID);

        if (!title || !amount || !category || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const expense = await Expense.create({
            title,
            amount,
            category,
            date,
            userId: userID
        });

        // console.log(expense);

        const user = await User.findById({ _id: userID });
        // console.log(user);
        user.expenses.push(expense._id);
        await user.save();


        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        const userId = req.userId; 
        const expenseId = req.params.id;
        await User.findByIdAndUpdate(
            userId,
            { $pull: { expenses: expenseId } }, 
            { new: true }
        );



        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { title, amount, category, date },
            { new: true, runValidators: true }
        );
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


