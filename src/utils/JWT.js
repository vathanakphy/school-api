import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

export default class JWT {
    static JWT_SECRET = process.env.JWT_SECRET;

    static create(user_email, user_name) {
        return jwt.sign(
            {
                email: user_email,
                name: user_name,
            },
            JWT.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static verify(token) {
        if (!token) {
            throw new Error('Access token missing');
        }

        try {
            return jwt.verify(token, JWT.JWT_SECRET);
        } catch (err) {
            throw new Error('Invalid or expired token');
        }   
    }
}