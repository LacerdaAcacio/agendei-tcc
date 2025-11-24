import { Router } from 'express';
import { ServicesController } from './ServicesController';
import { FavoritesController } from './FavoritesController';
import { SlotsController } from './SlotsController';
import { validateRequest } from '@shared/middlewares/validateRequest';
import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';
import { optionalAuth } from '@shared/middlewares/optionalAuth';
import {
  createServiceSchema,
  updateServiceSchema,
  getServiceSchema,
  deleteServiceSchema,
  searchServicesSchema,
} from './services.schema';

const router = Router();
const servicesController = new ServicesController();
const favoritesController = new FavoritesController();
const slotsController = new SlotsController();

/**
 * @swagger
 * /api/v1/services/search:
 *   get:
 *     tags: [Services]
 *     summary: Search services with filters
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 */
router.get('/search', optionalAuth, validateRequest(searchServicesSchema), servicesController.search);

/**
 * @swagger
 * /api/v1/services:
 *   post:
 *     tags: [Services]
 *     summary: Create a new service
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - location
 *               - latitude
 *               - longitude
 *               - images
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', ensureAuthenticated, validateRequest(createServiceSchema), servicesController.create);

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     tags: [Services]
 *     summary: Get all services
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 */
router.get('/', optionalAuth, servicesController.getAll);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Get service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       404:
 *         description: Service not found
 */
router.get('/:id', optionalAuth, validateRequest(getServiceSchema), servicesController.getById);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Update service
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service not found
 */
router.put(
  '/:id',
  ensureAuthenticated,
  validateRequest(updateServiceSchema),
  servicesController.update
);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Delete service
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service not found
 */
router.delete(
  '/:id',
  ensureAuthenticated,
  validateRequest(deleteServiceSchema),
  servicesController.delete
);

/**
 * @swagger
 * /api/v1/services/{id}/favorite:
 *   post:
 *     tags: [Services]
 *     summary: Toggle favorite status for a service
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorited:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/favorite', ensureAuthenticated, favoritesController.toggle);

/**
 * @swagger
 * /api/v1/services/{id}/slots:
 *   get:
 *     tags: [Services]
 *     summary: Get available time slots for a service on a specific date
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Available time slots retrieved successfully
 *       400:
 *         description: Invalid date format
 *       404:
 *         description: Service not found
 */
router.get('/:id/slots', slotsController.getAvailableSlots);

export default router;
