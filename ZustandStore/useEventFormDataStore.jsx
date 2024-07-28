import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const eventFormDataStore = (set) => ({
  id: null,
  start: null,
  end: null,
  title: null,
  action: null,
  meeting: null,

  setEventFormData: (id, start, end, title, action, meeting) =>
    set({ id, start, end, title, action, meeting }),
});

const useEventFormDataStore = create(
  devtools(
    persist(eventFormDataStore, {
      name: "eventFormData",
    })
  )
);

export default useEventFormDataStore;
