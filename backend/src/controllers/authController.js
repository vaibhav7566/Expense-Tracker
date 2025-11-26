// backend/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'expense-tracker';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';


export const registerUser = async (req, res) => {
  // express-validator errors (if used in route)
 

  try {
    const { name, email, password } = req.body;
    // basic server-side validation
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });

    // check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    res.cookie('token', token, {
            httpOnly: true,
            ssecure: false,
            sameSite: 'lax',

    });


    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
 

  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',

    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.userId is set by auth middleware
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
