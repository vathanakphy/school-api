import JWT from '../utils/JWT.js';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || '';
    try {
        JWT.verify(token);
        next();
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}
