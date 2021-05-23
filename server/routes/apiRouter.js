import express from 'express';
import apiController from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.route('/heatmap/coords').get(apiController.getFilteredCoords);

export default apiRouter;