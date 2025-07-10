import db from '../models/index.js';
import { Encryption } from '../utils/encription.js';
import JWT from '../utils/JWT.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: user registered
 */

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(name && email && password){
            const hashPassword = Encryption.hashPassword(password)
            const newUser = await db.User.create({
                email:email,
                name:name,
                password:hashPassword
            });
            console.log(password,Encryption.hashPassword(password))
            res.status(201).json({message:'user create success!'});
        }else{
            res.status(400).json({error:'mission filed email or password or name'})
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to  user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: user registered
 */

export const userLogin = async (req, res) => {
    try {
        const {email,password} = req.body
        // const newUser = await db.User.create(req.body);
        const user = await db.User.findOne({
            where:{email:email},
        })
        if(!user){
            res.status(404).json({message:'user not found'})
        }else{
            if(Encryption.verifyPassword(user.password,password)){
                const token = JWT.create(user.email,user.name);
                res.status(200).json({
                    success: true, 
                    message: 'Login successful', 
                    token, 
                    user: {
                        email: user.email,
                        name: user.name,
                    }
                });
            }else{
                res.status(400).json({message:'password Incorrect'})
            }
        }
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all User
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 * 
 *     responses:
 *       200:
 *         description: List of student
 */
export const getAllUsers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const total = await db.User.count();
    try {
        const users = await db.User.findAll({ 
            limit: limit, 
            offset: (page - 1) * limit
        });
        res.json({
            meta: {
                totalItems: total,
                page: page,
                totalPages: Math.ceil(total / limit),
            },
            
            data: {users},
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};