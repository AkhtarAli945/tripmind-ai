import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export const flightAgent = async (state) => {
  const { tripData } = state;

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
  });

  const systemPrompt = `You are a Flight Search AI Agent. Generate realistic flight options for the given trip.
Return ONLY valid JSON array with 3 flight options:
[{
  "airline": "Airline Name",
  "airlineCode": "XX",
  "flightNumber": "XX123",
  "departure": { "city": "", "code": "XXX", "time": "HH:MM AM/PM" },
  "arrival": { "city": "", "code": "XXX", "time": "HH:MM AM/PM" },
  "duration": "Xh Xm",
  "stops": 0,
  "stopLabel": "Non-stop",
  "price": 450,
  "cabinClass": "Economy",
  "rating": 4.7
}]`;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Find flights from ${tripData.origin || "Karachi"} to ${tripData.destination} budget per person: $${Math.round(
          tripData.budget * 0.3
        )}`
      ),
    ]);

    const content = response.content.replace(/```json\n?|\n?```/g, "").trim();
    const flights = JSON.parse(content);

    return {
      ...state,
      flights,
      agentStatuses: { ...state.agentStatuses, flight: { status: "completed", output: flights } },
      currentAgent: "hotel",
    };
  } catch (error) {
    return { ...state, flights: getMockFlights(tripData), currentAgent: "hotel" };
  }
};

const getMockFlights = (tripData) => [
  {
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK607",
    departure: { city: tripData.origin || "Karachi", code: "KHI", time: "9:30 AM" },
    arrival: { city: tripData.destination, code: "DXB", time: "11:25 AM" },
    duration: "1h 55m",
    stops: 0,
    stopLabel: "Non-stop",
    price: 450,
    cabinClass: "Economy",
    rating: 4.7,
  },
  {
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR584",
    departure: { city: tripData.origin || "Karachi", code: "KHI", time: "10:15 AM" },
    arrival: { city: tripData.destination, code: "DXB", time: "12:25 PM" },
    duration: "2h 10m",
    stops: 0,
    stopLabel: "Non-stop",
    price: 520,
    cabinClass: "Economy",
    rating: 4.5,
  },
  {
    airline: "Air Arabia",
    airlineCode: "G9",
    flightNumber: "G9421",
    departure: { city: tripData.origin || "Karachi", code: "KHI", time: "6:00 AM" },
    arrival: { city: tripData.destination, code: "DXB", time: "8:10 AM" },
    duration: "2h 10m",
    stops: 0,
    stopLabel: "Non-stop",
    price: 320,
    cabinClass: "Economy",
    rating: 4.1,
  },
];
