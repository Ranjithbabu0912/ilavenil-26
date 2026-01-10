import { EVENTS } from "../config/events.js";

export const isTeamRequired = ({ events, soloOrGroup }) => {
  const selectedEvents = Object.values(events).filter(Boolean);

  return selectedEvents.some(event => {
    const config = EVENTS[event];

    if (!config) return false;

    // Hybrid event (Yourspark)
    if (config.type === "hybrid") {
      return soloOrGroup === "group";
    }

    // Normal group event
    return config.type === "group";
  });
};
