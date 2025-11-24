import { Router } from 'express';
import { BookingsController } from './BookingsController';
import { validateRequest } from '@shared/middlewares/validateRequest';
import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';
import { createBookingSchema, updateBookingSchema } from './bookings.schema';

const router = Router();
const bookingsController = new BookingsController();

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - startDate
 *               - endDate
 *             properties:
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Conflict (Overbooking)
 */
router.post('/', ensureAuthenticated, validateRequest(createBookingSchema), bookingsController.create);

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Get my bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings retrieved successfully
 */
router.get('/', ensureAuthenticated, bookingsController.getMyBookings);

/**
 * @swagger
 * /api/v1/bookings/{id}/cancel:
 *   patch:
 *     tags: [Bookings]
 *     summary: Cancel a booking
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
 *         description: Booking cancelled successfully
 *       400:
 *         description: Cannot cancel completed or already cancelled booking
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.patch('/:id/cancel', ensureAuthenticated, bookingsController.cancel);

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   put:
 *     tags: [Bookings]
 *     summary: Reschedule a booking
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
 *             required:
 *               - startDate
 *               - endDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Booking rescheduled successfully
 *       400:
 *         description: Validation error or invalid status
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       409:
 *         description: Conflict (Selected dates not available)
 */
router.put('/:id', ensureAuthenticated, validateRequest(updateBookingSchema), bookingsController.update);

export default router;
