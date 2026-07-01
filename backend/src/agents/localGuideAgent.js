import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export const localGuideAgent = async (state) => {
  const { tripData } = state;

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
  });

  const systemPrompt = `You are a Local Guide AI Agent. Provide practical travel tips.
Return ONLY valid JSON:
{
  "weather": { "season": "", "temperature": "", "advice": "" },
  "transport": { "options": [], "tips": "" },
  "safety": { "level": "safe", "tips": [] },
  "currency": { "local": "", "tips": "" },
  "localTips": []
}`;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Local guide for ${tripData.destination} in ${tripData.startDate || "July"}`),
    ]);

    const content = response.content.replace(/```json\n?|\n?```/g, "").trim();
    const localGuide = JSON.parse(content);

    return {
      ...state,
      localGuide,
      agentStatuses: { ...state.agentStatuses, localGuide: { status: "completed", output: localGuide } },
      currentAgent: "finalPlanner",
    };
  } catch (error) {
    return { ...state, localGuide: {}, currentAgent: "finalPlanner" };
  }
};
