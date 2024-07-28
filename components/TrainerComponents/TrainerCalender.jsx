"use client";
import { useEffect, useCallback, useState, useMemo } from "react";
import {
  Calendar as BigCalender,
  Views,
  momentLocalizer,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
moment.locale("en-GB");
const localizer = momentLocalizer(moment);

//Css for react-big-calender
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "@styles/calendar.css";
// State Management store

import { useDialog } from "@ZustandStore/useDialog"; //state for Dialog Modal for Create, Update, Delete Events.
import useEventFormDataStore from "@ZustandStore/useEventFormDataStore"; //Contains states for event form
import useCalendarStore from "@ZustandStore/useCalenderStore"; // contains all API end Points state for react-big-calender

import { Button } from "@components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
// Imports end Here //

const TrainerCalender = () => {
  //Initial View for calender set to month
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date()); //Date

  //Form Data Store
  const setEventFormData = useEventFormDataStore(
    (state) => state.setEventFormData
  );

  //Calender Store
  const { fetchEvents, events, onEventDrop } = useCalendarStore((state) => ({
    fetchEvents: state.fetchEvents,
    events: state.events,
    onEventDrop: state.onEventDrop,
  }));

  // Setting Calender to Drag and Drop
  const DnDCalender = withDragAndDrop(BigCalender);

  // OnView Function sets the view on selecting slots or button
  const onView = useCallback((newView) => setView(newView), [setView]);

  //dialog Modal Open Function
  const { onOpen } = useDialog();

  /**
   *
   * @param {*} events
   * @returns the events with converted start and end to date datatype
   */
  const formatEventsForCalendar = (events) => {
    return events.map((event) => ({
      _id: event._id,
      title: event.title,
      meeting: event.meeting,
      roomId: event.roomId,
      start: moment.utc(event.start).toDate(),
      end: moment.utc(event.end).toDate(),
      task_done: event.task_done,
      allDay: false,
    }));
  };

  // Calling formatEventForCalender and passing the events to it
  const eventsForCalendar = formatEventsForCalendar(events);

  /**
   *  fetchEvents //from useCalenderStore
   *
   */
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  //function trigger on onSelectSlot
  /**
   * @param start
   * @param end
   *
   */
  const handleSelect = useCallback(
    ({ start, end }) => {
      // open Modal Dialog
      onOpen();
      let title = "";
      let id;
      let meeting = false;
      // set from data to create event

      /**
       * @param id // null
       * @param start start date
       * @param end end date
       * @param tittle empty String
       * @param action //create
       *
       */
      setEventFormData(id, start, end, title, "create", meeting);
    },
    [setEventFormData]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      onOpen();

      /**
       * @param id // event._id
       * @param start start date
       * @param end end date
       * @param tittle title String
       * @param action //update
       *
       */

      setEventFormData(
        event._id,
        event.start,
        event.end,
        event.title,
        "update",
        event.meeting
      );
    },
    [setEventFormData]
  );

  // Drag & Drop Events
  const onChangeEventTime = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
      let updatedEvent = {
        _id: event._id,
        title: event.title,
        start,
        end,
      };

      onEventDrop(updatedEvent);
    },
    [onEventDrop]
  );

  const onChangeSize = useCallback(
    ({ event, start, end }) => {
      let updatedEvent = {
        _id: event._id,
        title: event.title,
        meeting: event.meeting,
        roomId: event.roomId,
        start,
        end,
      };

      onEventDrop(updatedEvent);
    },
    [onEventDrop]
  );

  const VIEWS_OPTIONS = [
    { id: Views.MONTH, label: "Month" },
    { id: Views.WEEK, label: "Week" },
    { id: Views.DAY, label: "Day" },
  ];

  const handleBack = useCallback(() => {
    if (view === Views.DAY) setDate(moment(date).subtract(1, "d").toDate());
    if (view === Views.WEEK) setDate(moment(date).subtract(1, "w").toDate());
    if (view === Views.MONTH) setDate(moment(date).subtract(1, "M").toDate());
  }, [view, date]);
  const handleNext = useCallback(() => {
    if (view === Views.DAY) setDate(moment(date).add(1, "d").toDate());
    if (view === Views.WEEK) setDate(moment(date).add(1, "w").toDate());
    if (view === Views.MONTH) setDate(moment(date).add(1, "M").toDate());
  }, [view, date]);

  const dateText = useMemo(() => {
    if (view === Views.DAY) return moment(date).format("dddd", "MMMM", "DD");
    if (view === Views.WEEK) {
      const from = moment(date)?.startOf("week");
      const to = moment(date).endOf("week");
      return `${from.format("MMMM DD")} to ${to.format("MMMM DD")}`;
    }
    if (view === Views.MONTH) return moment(date).format("MMMM DD");
  }, [view, date]);

  return (
    <div className="size-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center  mb-2 flex-wrap ">
        {/* today next prev buttons */}
        <div className="flex gap-1 rounded-sm   w-fit">
          <Button
            onClick={handleBack}
            variant="secondary"
            className=" rounded-sm "
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDate(moment().toDate())}
            className=" rounded-sm "
          >
            Today
          </Button>
          <Button
            onClick={handleNext}
            variant="secondary"
            className=" py rounded-sm  "
          >
            <ChevronRight />
          </Button>
        </div>

        {/* date header */}
        <div className="bg-slate-200 px-4 py-1 rounded-sm order-first md:order-none">
          <p className=" scroll-m-20 text-xl font-semibold tracking-tight">
            {dateText}
          </p>
        </div>

        {/* day week month buttons */}
        <div className="flex items-center px-1 gap-1 bg-slate-200 rounded-sm  w-fit h-10">
          {VIEWS_OPTIONS.map(({ id, label }) => (
            <Button
              className={`h-8 rounded-sm  text-muted-foreground bg-inherit hover:bg-inherit ${
                id === view
                  ? "bg-background hover:bg-background text-foreground"
                  : ""
              }`}
              key={id}
              onClick={() => setView(id)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <DnDCalender
        selectable
        resizable
        popup
        defaultDate={date}
        localizer={localizer}
        draggableAccessor={(event) => true}
        resizableAccessor={(event) => true}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={view}
        view={view} // Include the view prop
        // date={date} // Include the date prop
        onView={onView}
        events={eventsForCalendar}
        onSelecting={(slot) => true}
        onSelectEvent={(event) => handleSelectEvent(event)}
        onSelectSlot={handleSelect}
        onEventDrop={onChangeEventTime}
        onEventResize={onChangeSize}
        toolbar={false}
        // onNavigate={(date) => {
        //   setDate(new Date(date));
        // }}
        components={{ event: EventComponent }}
      />
    </div>
  );
};

export default TrainerCalender;

const EventComponent = (event) => {
  console.log(event);
  return (
    <div
      className={`border-none  rounded-sm text-[#333333] font-medium h-full w-full ${
        event.event.meeting ? "bg-[#99b3d0]" : "bg-blue-300"
      }`}
    >
      <div className="py-1 text-center ">{event.title}</div>
    </div>
  );
};
