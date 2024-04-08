"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import moment from "moment";
import { z } from "zod";
import { formatDateForInput, parseDateTimeString } from "@utils/dateFormatter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useEventFormDataStore from "@ZustandStore/useEventFormDataStore";
// import useEventStore from "@ZustandStore/useEventStore";
import useCalendarStore from "@ZustandStore/useCalenderStore";
import { useToast } from "@/components/ui/use-toast";
import { useDialog } from "@ZustandStore/useDialog";
// form Schema

const dateTimeFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const formSchema = z
  .object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    start: z.string().regex(dateTimeFormatRegex, {
      message:
        "Invalid dateTime format. It should be in the format YYYY-MM-DDTHH:MM.",
    }),
    end: z.string().regex(dateTimeFormatRegex, {
      message:
        "Invalid dateTime format. It should be in the format YYYY-MM-DDTHH:MM.",
    }),
  })
  .refine(
    (data) => {
      const startDate = moment(data.start);
      const endDate = moment(data.end);
      if (!endDate.isAfter(startDate)) {
        return;
      }
      return data;
    },
    {
      message: "End date must be after start date",
      path: ["end"],
    }
  );

const CreateEventForm = () => {
  const { id, start, end, title, action } = useEventFormDataStore();
  const scheduleId = id;
  const { onClose } = useDialog();

  const { success, addEvent, updateEvent, deleteEvent, message } =
    useCalendarStore((state) => ({
      addEvent: state.addEvent,
      updateEvent: state.updateEvent,
      deleteEvent: state.deleteEvent,
      message: state.message,
      success: state.success,
    }));
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title,
      start: formatDateForInput(start),
      end: formatDateForInput(end),
    },
  });

  // 2. Define a submit handler.

  const createEvent = async (value) => {
    try {
      const startDate = parseDateTimeString(value.start);
      const endDate = parseDateTimeString(value.end);
      addEvent({ title: value.title, start: startDate, end: endDate });
      success &&
        toast({
          variant: "primary",
          title: "Schedule Added",
        });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const updateEvents = async (value) => {
    console.log("updating...", value);
    const startDate = parseDateTimeString(value.start);
    const endDate = parseDateTimeString(value.end);
    try {
      updateEvent({
        _id: scheduleId,
        title: value.title,
        start: startDate,
        end: endDate,
      });
      success &&
        toast({
          title: "Schedule Updated",
        });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  async function onSubmit(value) {
    if (action === "create") {
      createEvent(value);
    } else if (action === "update") {
      updateEvents(value);
    }
  }

  const handelDelete = async (e) => {
    e.preventDefault();
    try {
      deleteEvent(scheduleId);
      if (success) {
        toast({
          title: message,
        });
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-evenly">
          <Button type="submit">Submit</Button>
          {action === "update" && (
            <Button
              className="bg-destructive hover:bg-destructive/95"
              onClick={handelDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CreateEventForm;
