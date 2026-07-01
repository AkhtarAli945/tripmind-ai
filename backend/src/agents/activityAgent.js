import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export const activityAgent = async (state) => {
  const { tripData } = state;

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
  });

  const systemPrompt = `You are an Activity Discovery AI Agent. Find top activities and attractions.
Return ONLY valid JSON array with 6 activities:
[{
  "name": "Activity Name",
  "description": "What to expect",
  "location": "Specific location",
  "timing": "Best time to visit",
  "duration": "2-3 hours",
  "cost": 30,
  "category": "sightseeing|adventure|culture|food|entertainment"
}]`;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Top activities in ${tripData.destination} for ${tripData.duration} days`),
    ]);

    const content = response.content.replace(/```json\n?|\n?```/g, "").trim();
    const activities = JSON.parse(content);

    return {
      ...state,
      activities,
      agentStatuses: { ...state.agentStatuses, activity: { status: "completed", output: activities } },
      currentAgent: "localGuide",
    };
  } catch (error) {
    return { ...state, activities: [], currentAgent: "localGuide" };
  }
};
