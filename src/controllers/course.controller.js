import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: Course management
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, TeacherId]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               TeacherId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Course created
 */
export const createCourse = async (req, res) => {
    try {
        const course = await db.Course.create(req.body);
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: include
 *         schema: { type : string, default:'' }
 *         description: Join with another table
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: '' }
 *         description: sort by acs [A-Z] or desc [Z-A]
 *       - in: query
 *         name: column
 *         schema: { type: string, default: 'createdAt' }
 *         description: sort by column
 * 
 *     responses:
 *       200:
 *         description: List of courses
 */
export const getAllCourses = async (req, res) => {

    // take certain amount at a time
    const limit = parseInt(req.query.limit) || 10;
    // which page to take
    const page = parseInt(req.query.page) || 1;
    const joinWith = req.query.include || ''
    const sortType = req.query.sort || 'ASC'
    const sortColumn = req.query.column || 'id'
    const total = await db.Course.count();
    const joinWithArray = [...new Set(  
        joinWith.split(',').map(item => item.trim())
    )];
    const JoinOption = {
        Teachers:{model : db.Teacher},
        Students:{model : db.Student},
    }
    const include = joinWithArray
                        .filter(key => JoinOption[key])
                        .map(key => JoinOption[key]);
    const order = [
        [sortColumn,sortType]
    ]
    try {
        const courses = await db.Course.findAll(
            {
                order,
                include,
                limit: limit, offset: (page - 1) * limit
            }
        );
        res.json({
            meta: {
                totalItems: total,
                page: page,
                totalPages: Math.ceil(total / limit),
            },
            data: courses,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Not found
 */
export const getCourseById = async (req, res) => {
    try {
        const course = await db.Course.findByPk(req.params.id, { include: [db.Student, db.Teacher] });
        if (!course) return res.status(404).json({ message: 'Not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Course updated
 */
export const updateCourse = async (req, res) => {
    try {
        const course = await db.Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ message: 'Not found' });
        await course.update(req.body);
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Course deleted
 */
export const deleteCourse = async (req, res) => {
    try {
        const course = await db.Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ message: 'Not found' });
        await course.destroy();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
