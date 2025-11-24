import { Router } from 'express';
import { ReportsController } from './ReportsController';
import { validateRequest } from '@shared/middlewares/validateRequest';
import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';
import { createReportSchema } from './reports.schema';

const router = Router();
const reportsController = new ReportsController();

/**
 * @swagger
 * /api/v1/reports:
 *   post:
 *     tags: [Reports]
 *     summary: Create a new report
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
 *               - reason
 *               - description
 *             properties:
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Validation error or self-report attempt
 *       404:
 *         description: Service not found
 */
router.post('/', ensureAuthenticated, validateRequest(createReportSchema), reportsController.create);

export default router;
