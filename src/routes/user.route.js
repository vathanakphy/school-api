import express from 'express';
import { getAllUsers, registerUser, userLogin } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/authToken.middleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', userLogin);
router.get('/users',authenticateToken, getAllUsers);

export default router;
