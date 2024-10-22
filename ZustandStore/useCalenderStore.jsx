import { create } from "zustand";
import axios from "axios";

const useCalendarStore = create((set) => ({
  events: [],
  fetchEvents: async () => {
    try {
      const response = await axios.get("/api/trainer/schedule"); // Replace with your API endpoint
      set({ events: response.data.schedule });
    } catch (error) {
      console.log(error);
    }
  },

  addEvent: async (event) => {
    const response = await axios.post("/api/trainer/schedule", event);
    set((state) => ({
      events: [...state.events, response.data.schedule],
    }));

    const addedRes = response.data;
    return addedRes;
  },

  updateEvent: async (updatedEvent) => {
    try {
      const response = await axios.patch(
        `/api/trainer/schedule/${updatedEvent._id}`,
        updatedEvent
      );
      set((state) => ({
        events: state.events.map((event) =>
          event._id === updatedEvent._id ? response.data.updatedSchedule : event
        ),
      }));
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const response = await axios.delete(`/api/trainer/schedule/${eventId}`);
      set((state) => ({
        events: state.events.filter((event) => event._id !== eventId),
      }));
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  onEventDrop: async (updatedEvent) => {
    set((state) => ({
      events: state.events.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      ),
    }));
    try {
      await axios.patch(`/api/trainer/schedule/${updatedEvent._id}`, {
        ...updatedEvent,
        start: updatedEvent.start,
        end: updatedEvent.end,
      });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useCalendarStore;
