import { StateGraph, END } from '@langchain/langgraph';
import { supervisorAgent } from './supervisorAgent.js';
import { flightAgent } from './flightAgent.js';
import { hotelAgent } from './hotelAgent.js';
import { itineraryAgent } from './itineraryAgent.js';
import { budgetAgent } from './budgetAgent.js';
import { activityAgent } from './activityAgent.js';
import { localGuideAgent } from './localGuideAgent.js';
import { finalPlannerAgent } from './finalPlannerAgent.js';
import logger from '../utils/logger.js';

const initialState = {
  userQuery: '',
  tripData: null,
  flights: [],
  hotels: [],
  itinerary: [],
  budget: null,
  activities: [],
  localGuide: null,
  finalSummary: '',
  agentStatuses: {
    supervisor: { status: 'pending' },
    flight: { status: 'pending' },
    hotel: { status: 'pending' },
    itinerary: { status: 'pending' },
    budget: { status: 'pending' },
    activity: { status: 'pending' },
    localGuide: { status: 'pending' },
    finalPlanner: { status: 'pending' },
  },
  currentAgent: 'supervisor',
  error: null,
};

const routeNext = (state) => {
  if (state.error) return END;

  switch (state.currentAgent) {
    case "flight":      return "flightNode";
    case "hotel":       return "hotelNode";
    case "itinerary":   return "itineraryNode";
    case "budget":      return "budgetNode";
    case "activity":    return "activityNode";
    case "localGuide":  return "localGuideNode";
    case "finalPlanner":return "finalPlannerNode";
    default:            return END;
  }
};

export const createTravelGraph = () => {
  const graph = new StateGraph({
    channels: Object.fromEntries(
      Object.keys(initialState).map((k) => [
        k,
        {
          value: (x, y) => y ?? x,
          default: () => initialState[k],
        },
      ])
    ),
  });

  graph.addNode("supervisor", supervisorAgent);
  graph.addNode("flightNode", flightAgent);
  graph.addNode("hotelNode", hotelAgent);
  graph.addNode("itineraryNode", itineraryAgent);
  graph.addNode("budgetNode", budgetAgent);
  graph.addNode("activityNode", activityAgent);
  graph.addNode("localGuideNode", localGuideAgent);
  graph.addNode("finalPlannerNode", finalPlannerAgent);

  graph.setEntryPoint("supervisor");

  graph.addConditionalEdges("supervisor", routeNext);
  graph.addConditionalEdges("flightNode", routeNext);
  graph.addConditionalEdges("hotelNode", routeNext);
  graph.addConditionalEdges("itineraryNode", routeNext);
  graph.addConditionalEdges("budgetNode", routeNext);
  graph.addConditionalEdges("activityNode", routeNext);
  graph.addConditionalEdges("localGuideNode", routeNext);
  graph.addConditionalEdges("finalPlannerNode", routeNext);

  return graph.compile();
};

export const runTravelAgents = async (userQuery, onAgentUpdate) => {
  const app = createTravelGraph();

  const agentNames = {
    supervisor:      "Supervisor Agent",
    flightNode:      "Flight Agent",
    hotelNode:       "Hotel Agent",
    itineraryNode:   "Itinerary Agent",
    budgetNode:      "Budget Agent",
    activityNode:    "Activity Agent",
    localGuideNode:  "Local Guide Agent",
    finalPlannerNode:"Final Planner Agent",
  };

  const agentTasks = {
    supervisor:      "Planning trip...",
    flightNode:      "Searching best flights...",
    hotelNode:       "Finding hotels...",
    itineraryNode:   "Creating itinerary...",
    budgetNode:      "Optimizing budget...",
    activityNode:    "Discovering activities...",
    localGuideNode:  "Getting local tips...",
    finalPlannerNode:"Preparing final plan...",
  };

  // Start with initialState so we always have a complete base
  let finalState = { ...initialState, userQuery };

  try {
    const stream = await app.stream({ userQuery });

    for await (const chunk of stream) {
      const [agentKey, state] = Object.entries(chunk)[0];

      // MERGE each chunk into accumulated state instead of replacing
      finalState = { ...finalState, ...state };

      if (onAgentUpdate && agentNames[agentKey]) {
        onAgentUpdate({
          agent: agentKey,
          name: agentNames[agentKey],
          task: agentTasks[agentKey],
          status: finalState.agentStatuses?.[agentKey]?.status || 'running',
          output: finalState.agentStatuses?.[agentKey]?.output,
        });
      }
    }
  } catch (error) {
    logger.error('Agent orchestration error:', error);
    throw error;
  }

  return finalState;
};