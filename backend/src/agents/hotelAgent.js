import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export const hotelAgent = async (state) => {
  const { tripData } = state;

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
  });

  const systemPrompt = `You are a Hotel Search AI Agent. Generate realistic hotel options.
Return ONLY valid JSON array with 3 hotel options:
[{
  "name": "Hotel Name",
  "location": "Area, City",
  "address": "Full Address",
  "rating": 4.5,
  "reviewCount": 1200,
  "pricePerNight": 120,
  "amenities": ["WiFi", "Pool", "Spa"],
  "description": "Brief description"
}]`;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Find hotels in ${tripData.destination} for ${tripData.duration} nights, budget per night: $${Math.round(
          (tripData.budget * 0.4) / (tripData.duration || 5)
        )}`
      ),
    ]);

    const content = response.content.replace(/```json\n?|\n?```/g, "").trim();
    const hotels = JSON.parse(content);

    return {
      ...state,
      hotels,
      agentStatuses: { ...state.agentStatuses, hotel: { status: "completed", output: hotels } },
      currentAgent: "itinerary",
    };
  } catch (error) {
    return { ...state, hotels: getMockHotels(tripData), currentAgent: "itinerary" };
  }
};

const getMockHotels = (tripData) => [
  {
    name: "Marina View Hotel",
    location: "Dubai Marina",
    address: "Marina Walk, Dubai",
    rating: 4.5,
    reviewCount: 1200,
    pricePerNight: 120,
    amenities: ["WiFi", "Pool", "Gym", "Spa"],
    description: "Luxury hotel with stunning marina views",
  },
  {
    name: "Rove Downtown",
    location: "Downtown Dubai",
    address: "Sheikh Mohammed Bin Rashid Blvd",
    rating: 4.6,
    reviewCount: 900,
    pricePerNight: 110,
    amenities: ["WiFi", "Pool", "Restaurant"],
    description: "Modern hotel in the heart of Downtown",
  },
  {
    name: "Premier Inn Dubai",
    location: "Deira",
    address: "Al Rigga Road, Deira",
    rating: 4.2,
    reviewCount: 650,
    pricePerNight: 75,
    amenities: ["WiFi", "Restaurant", "Parking"],
    description: "Comfortable budget-friendly option",
  },
];
