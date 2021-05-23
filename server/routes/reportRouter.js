import express from 'express';

import reportController from '../controllers/reportController.js';
import loginRequiredMiddleware from "../utils.js";

const reportRouter = express.Router();

reportRouter.post('/', loginRequiredMiddleware, reportController.create);
reportRouter.get('/', reportController.getAllReports);

export default reportRouter;