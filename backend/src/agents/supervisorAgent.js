import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export const supervisorAgent = async (state) => {
  const { userQuery } = state;

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
  });

  const systemPrompt = `
You are a Travel Planning Supervisor AI.

Extract structured travel information.

Return ONLY valid JSON.

{
  "destination":"city,country",
  "origin":"departure city",
  "startDate":null,
  "endDate":null,
  "duration":0,
  "travelers":1,
  "budget":0,
  "currency":"USD",
  "preferences":{
      "travelStyle":"Comfort",
      "accommodation":"4 Star",
      "activities":[]
  },
  "tripTitle":""
}
`;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userQuery),
    ]);

    const content = response.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(content);

    return {
      ...state,
      tripData: parsed,
      agentStatuses: {
        ...state.agentStatuses,
        supervisor: {
          status: "completed",
          output: parsed,
        },
      },
      currentAgent: "flight",
    };
  } catch (err) {
    return {
      ...state,
      error: err.message,
      currentAgent: "end",
    };
  }
};
