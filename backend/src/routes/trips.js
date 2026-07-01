import express from 'express';
import { createTrip, getTrips, getTrip, updateTrip, deleteTrip, getTripDetails } from '../controllers/tripController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.route('/').get(getTrips).post(createTrip);
router.route('/:id').get(getTrip).put(updateTrip).delete(deleteTrip);
router.get('/:id/details', getTripDetails);

export default router;
