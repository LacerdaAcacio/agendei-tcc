import { Router } from 'express';
import { CategoriesController } from './CategoriesController';

const router = Router();
const categoriesController = new CategoriesController();

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags: [Categories]
 *     summary: List all categories
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 */
router.get('/', categoriesController.index);

export default router;
