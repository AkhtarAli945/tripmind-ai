export const budgetAgent = async (state) => {
  const { tripData, flights, hotels } = state;
  const total = tripData.budget;
  const days = tripData.duration || 5;
  const travelers = tripData.travelers || 1;

  const cheapestFlight = flights ? Math.min(...flights.map((f) => f.price)) * travelers : total * 0.3;
  const cheapestHotel = hotels ? Math.min(...hotels.map((h) => h.pricePerNight)) * days : total * 0.4;

  const flightBudget = Math.round(cheapestFlight);
  const hotelBudget = Math.round(cheapestHotel);
  const remaining = total - flightBudget - hotelBudget;
  const activitiesBudget = Math.round(remaining * 0.35);
  const foodBudget = Math.round(remaining * 0.4);
  const transportBudget = Math.round(remaining * 0.25);

  const budget = {
    totalBudget: total,
    allocation: {
      flights: flightBudget,
      hotels: hotelBudget,
      activities: activitiesBudget,
      food: foodBudget,
      transport: transportBudget,
    },
    spent: { flights: flightBudget, hotels: hotelBudget, activities: 0, food: 0, transport: 0 },
    remaining: Math.max(0, total - flightBudget - hotelBudget),
  };

  return {
    ...state,
    budget,
    agentStatuses: { ...state.agentStatuses, budget: { status: "completed", output: budget } },
    currentAgent: "activity",
  };
};
