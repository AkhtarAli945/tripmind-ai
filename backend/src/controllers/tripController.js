import Trip from '../models/Trip.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import Budget from '../models/Budget.js';
import Itinerary from '../models/Itinerary.js';
import { createError } from '../utils/errors.js';

export const createTrip = async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, trip });
  } catch (error) { next(error); }
};

export const getTrips = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (status && status !== 'all') query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };
    const trips = await Trip.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('flights hotels activities budget_breakdown');
    const total = await Trip.countDocuments(query);
    res.json({ success: true, trips, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

export const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id })
      .populate('flights hotels activities budget_breakdown itinerary');
    if (!trip) return next(createError(404, 'Trip not found'));
    res.json({ success: true, trip });
  } catch (error) { next(error); }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, { new: true }
    );
    if (!trip) return next(createError(404, 'Trip not found'));
    res.json({ success: true, trip });
  } catch (error) { next(error); }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!trip) return next(createError(404, 'Trip not found'));
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) { next(error); }
};

export const getTripDetails = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return next(createError(404, 'Trip not found'));
    const [flights, hotels, activities, itinerary, budget] = await Promise.all([
      Flight.find({ trip: trip._id }),
      Hotel.find({ trip: trip._id }),
      Activity.find({ trip: trip._id }),
      Itinerary.find({ trip: trip._id }).sort('day'),
      Budget.findOne({ trip: trip._id }),
    ]);
    res.json({ success: true, trip, flights, hotels, activities, itinerary, budget });
  } catch (error) { next(error); }
};
