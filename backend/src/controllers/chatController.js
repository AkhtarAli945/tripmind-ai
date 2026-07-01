
import { v4 as uuidv4 } from 'uuid';
import Message from '../models/Message.js';
import Trip from '../models/Trip.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import Budget from '../models/Budget.js';
import Itinerary from '../models/Itinerary.js';
import { runTravelAgents } from '../agents/orchestrator.js';
import { createError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const startChat = async (req, res, next) => {
  const { message, sessionId: existingSessionId } = req.body;
  const sessionId = existingSessionId || uuidv4();
  const io = req.app.get('io');

  try {
    // Save user message
    await Message.create({
      user: req.user._id,
      sessionId,
      role: 'user',
      content: message,
    });

    // Emit agent started
    io.to(sessionId).emit('agent:start', { sessionId });

    // Run agents with real-time updates
    const onAgentUpdate = (agentData) => {
      io.to(sessionId).emit('agent:update', { sessionId, ...agentData });
    };

    const finalState = await runTravelAgents(message, onAgentUpdate);

    if (finalState.error) {
      throw new Error(finalState.error);
    }

    // Persist trip data
    const trip = await Trip.create({
      user: req.user._id,
      title: finalState.tripData?.tripTitle || `Trip to ${finalState.tripData?.destination}`,
      destination: finalState.tripData?.destination,
      origin: finalState.tripData?.origin,
      startDate: finalState.tripData?.startDate,
      endDate: finalState.tripData?.endDate,
      duration: finalState.tripData?.duration,
      travelers: finalState.tripData?.travelers,
      budget: finalState.tripData?.budget,
      agentSessionId: sessionId,
    });

    // Save flights
    const savedFlights = await Flight.insertMany(
      (finalState.flights || []).map(f => ({ ...f, trip: trip._id }))
    );

    // Save hotels
    const savedHotels = await Hotel.insertMany(
      (finalState.hotels || []).map(h => ({ ...h, trip: trip._id }))
    );

    // Save activities
    const savedActivities = await Activity.insertMany(
      (finalState.activities || []).map(a => ({ ...a, trip: trip._id }))
    );

    // Save itinerary
    const savedItinerary = await Itinerary.insertMany(
      (finalState.itinerary || []).map(day => ({ ...day, trip: trip._id }))
    );

    // Save budget with fallback in case budgetAgent returned null
    const budgetData = finalState.budget || {
      totalBudget: finalState.tripData?.budget || 0,
      allocation: { flights: 0, hotels: 0, activities: 0, food: 0, transport: 0 },
      spent: { flights: 0, hotels: 0, activities: 0, food: 0, transport: 0 },
      remaining: 0,
    };
    const savedBudget = await Budget.create({ ...budgetData, trip: trip._id });

    // Update trip with refs
    await Trip.findByIdAndUpdate(trip._id, {
      flights: savedFlights.map(f => f._id),
      hotels: savedHotels.map(h => h._id),
      activities: savedActivities.map(a => a._id),
      itinerary: savedItinerary.map(i => i._id),
      budget_breakdown: savedBudget._id,
    });

    // Save assistant message
    const assistantMsg = await Message.create({
      trip: trip._id,
      user: req.user._id,
      sessionId,
      role: 'assistant',
      content: finalState.finalSummary || 'Your trip has been planned!',
    });

    // Emit completion
    io.to(sessionId).emit('agent:complete', {
      sessionId,
      tripId: trip._id,
      summary: finalState.finalSummary,
      agentStatuses: finalState.agentStatuses,
    });

    res.json({
      success: true,
      sessionId,
      tripId: trip._id,
      message: assistantMsg,
      summary: finalState.finalSummary,
    });
  } catch (error) {
    logger.error('Chat error:', error);
    io.to(sessionId).emit('agent:error', { sessionId, error: error.message });
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const messages = await Message.find({
      user: req.user._id,
      sessionId: req.params.sessionId,
    }).sort('createdAt');
    res.json({ success: true, messages });
  } catch (error) { next(error); }
};


