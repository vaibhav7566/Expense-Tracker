// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'expense-tracker';

export default function protect(req, res, next) {

    let {token} = req.cookies; 
    // console.log('Token:', token);

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

   token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log('Decoded token:', decoded);
    req.userId = decoded.id; // attach user id to request
    // console.log('User ID:', req.userId);
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}
