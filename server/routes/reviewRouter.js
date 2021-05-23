import express from 'express';

import reviewController from '../controllers/reviewController.js';
import loginRequiredMiddleware from "../utils.js";

const reviewRouter = express.Router();
reviewRouter.post('/', loginRequiredMiddleware, reviewController.create);
reviewRouter.get('/', reviewController.getAllReviews);
reviewRouter.get('/rating', reviewController.getAverageRatingsForAllBusinesses);
reviewRouter.delete('/', reviewController.deleteAll);

export default reviewRouter;