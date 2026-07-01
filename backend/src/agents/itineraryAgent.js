import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export const itineraryAgent = async (state) => {
  const { tripData } = state;
  const days = tripData.duration || 5;

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.6,
  });

  const systemPrompt = `You are an Itinerary Planning AI Agent. Create a day-by-day itinerary.
Return ONLY valid JSON array with ${days} day objects:
[{
  "day": 1,
  "theme": "Arrival & Exploration",
  "items": [
    { "time": "09:00 AM", "activity": "Activity Name", "description": "Brief description", "location": "Location", "duration": "2h", "cost": 0, "type": "attraction" }
  ]
}]
Types: attraction, food, transport, hotel, other`;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Create ${days}-day itinerary for ${tripData.destination}. Travelers: ${tripData.travelers}. Style: ${
          tripData.preferences?.travelStyle || "Comfort"
        }`
      ),
    ]);

    const content = response.content.replace(/```json\n?|\n?```/g, "").trim();
    const itinerary = JSON.parse(content);

    return {
      ...state,
      itinerary,
      agentStatuses: { ...state.agentStatuses, itinerary: { status: "completed", output: itinerary } },
      currentAgent: "budget",
    };
  } catch (error) {
    return { ...state, itinerary: getMockItinerary(tripData), currentAgent: "budget" };
  }
};

const getMockItinerary = (tripData) => {
  const days = tripData.duration || 5;
  const themes = [
    "Arrival & City Exploration",
    "Iconic Landmarks",
    "Culture & Shopping",
    "Adventure & Nature",
    "Farewell Day",
  ];
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    theme: themes[i] || `Day ${i + 1}`,
    items: [
      {
        time: "09:00 AM",
        activity: "Morning Visit",
        description: "Explore local attractions",
        location: tripData.destination,
        duration: "2h",
        cost: 0,
        type: "attraction",
      },
      {
        time: "12:00 PM",
        activity: "Lunch",
        description: "Local cuisine experience",
        location: "City Center",
        duration: "1h",
        cost: 25,
        type: "food",
      },
      {
        time: "03:00 PM",
        activity: "Afternoon Activity",
        description: "Continue exploration",
        location: tripData.destination,
        duration: "3h",
        cost: 30,
        type: "attraction",
      },
      {
        time: "07:00 PM",
        activity: "Dinner",
        description: "Evening dining",
        location: "Restaurant District",
        duration: "2h",
        cost: 40,
        type: "food",
      },
    ],
  }));
};
