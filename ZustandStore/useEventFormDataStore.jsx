import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const eventFormDataStore = (set) => ({
  id: null,
  start: null,
  end: null,
  title: null,
  action: null,

  setEventFormData: (id, start, end, title, action) =>
    set({ id, start, end, title, action }),
});

const useEventFormDataStore = create(
  devtools(
    persist(eventFormDataStore, {
      name: "eventFormData",
    })
  )
);

export default useEventFormDataStore;
