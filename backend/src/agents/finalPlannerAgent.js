import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export const finalPlannerAgent = async (state) => {
  const { tripData, flights, hotels, activities } = state;

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
  });

  const systemPrompt = `You are the Final Travel Planner AI. Create a friendly 3-4 paragraph summary of the complete travel package in a conversational, helpful tone.`;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Summarize this trip:
Destination: ${tripData.destination}
Duration: ${tripData.duration} days
Budget: $${tripData.budget}
Travelers: ${tripData.travelers}
Best flight: ${flights?.[0]?.airline} at $${flights?.[0]?.price}
Best hotel: ${hotels?.[0]?.name} at $${hotels?.[0]?.pricePerNight}/night
Top activity: ${activities?.[0]?.name || "Various activities planned"}`),
    ]);

    return {
      ...state,
      finalSummary: response.content,
      agentStatuses: { ...state.agentStatuses, finalPlanner: { status: "completed", output: response.content } },
      currentAgent: "end",
    };
  } catch (error) {
    return {
      ...state,
      finalSummary: `Your ${tripData.duration}-day trip to ${tripData.destination} has been planned! We found great flights starting at $${
        flights?.[0]?.price || "N/A"
      }, hotels from $${hotels?.[0]?.pricePerNight || "N/A"}/night, and exciting activities — all within your $${
        tripData.budget
      } budget. Check the tabs above to explore your full itinerary!`,
      currentAgent: "end",
    };
  }
};
