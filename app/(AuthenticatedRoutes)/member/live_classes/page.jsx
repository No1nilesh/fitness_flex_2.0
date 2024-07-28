"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDialog } from "@ZustandStore/useDialog";
import MeetingCard from "@components/TrainerComponents/meeting-card";
import CopyButton from "@components/UiComponents/copy-btn";
import { CustomDialog } from "@components/UiComponents/custom-dialog";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSocket } from "@components/SocketProvider";
import { toast } from "sonner";

const LiveClass = () => {
  const [upComingMeetings, setUpComingMeetings] = useState(null);
  const [trainerEmail, setTrainerEmail] = useState(null);
  const [meetingState, setMeetingState] = useState("");
  const [liveMeetings, setLiveMeeting] = useState(null);
  const { onOpen } = useDialog();
  const socket = useSocket();
  const router = useRouter();
  function formatDateTime(dateTime) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  }

  const handleJoinMeeting = () => {
    onOpen();
    setMeetingState("isJoinExistingMeeting");
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("notification", ({ message, roomName }) => {
      console.log(message);
      toast.success(message, {
        action: {
          label: "Join",
          onClick: () => router.push(`/member/live_classes/${roomName}`),
        },
      });
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        const res = await axios.get("/api/member/live_class");
        setUpComingMeetings(res.data.schedule);
        setTrainerEmail(res.data.trainerEmail);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUpcomingMeetings();
  }, []);

  useEffect(() => {
    if (!trainerEmail) return;

    const fetchLiveEventData = async () => {
      const res = await axios.get(
        `/api/redis/get?key=live_meeting:${trainerEmail}`
      );
      const meetData = JSON.parse(res.data.value);
      console.log(meetData);
      setLiveMeeting(meetData);
    };
    fetchLiveEventData();
  }, [trainerEmail]);

  return (
    <div className="grid md:grid-rows-3 md:grid-flow-col gap-4  h-full max-h-[90vh] w-full max-w-screen mt-10 px-2 lg:px-6">
      <JoinEventModal meetingState={meetingState} />
      <Card className="p-4 bg-gray-100 rounded-md shadow-md   md:row-span-3 max-h-[90vh] lg:w-[28rem] lg:max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <ul className="flex  flex-row overflow-x-auto md:overflow-y-auto md:flex-col gap-4 w-[calc(100vw-3.10rem)] md:w-fit md:h-[80vh]">
          {upComingMeetings?.map((event, index) => (
            <li
              key={index}
              className="bg-white py-4 px-2 md:px-4 rounded-md shadow-sm flex flex-col md:flex-row items-start justify-between min-w-[20rem] md:min-w-md"
            >
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-gray-600">{formatDateTime(event.start)}</p>
                <div className="bg-gray-200 h-24 w-full  md:h-auto py-2 md:px-2 rounded-md flex flex-row justify-around items-center gap-1 relative text-sm">
                  <span className="text-base font-semibold absolute top-4 md:static md:top-auto">
                    Room ID
                  </span>{" "}
                  {event.roomId}
                  <CopyButton
                    className={""}
                    text={event.roomId}
                    checkTime={10000}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <MeetingCard
        className={"bg-purple-600 md:col-span-12 order-first md:order-none"}
        title={"Join Class"}
        description={"Join Ongoing Class"}
        icon={<Plus className="size-12 text-primary-foreground" />}
        handleClick={handleJoinMeeting}
      />
      <Card className="p-4 bg-gray-100 rounded-md shadow-md row-span-2 md:col-span-12">
        <h2 className="text-xl font-semibold mb-4">Live Events</h2>
        {liveMeetings && (
          <div>
            {`${liveMeetings.email} started live class ${liveMeetings.roomName}`}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LiveClass;

const JoinEventModal = ({ meetingState }) => {
  const { onClose } = useDialog();
  const [inputLink, setInputLink] = useState("");
  const router = useRouter();

  const handleJoinMeeting = useCallback(() => {
    router.push(`/member/live_classes/${inputLink}`);
    onClose();
  }, [inputLink]);

  return (
    <CustomDialog>
      {meetingState === "isJoinExistingMeeting" && (
        <>
          <Input onChange={(e) => setInputLink(e.target.value)} />
          <Button onClick={handleJoinMeeting}>Submit</Button>
        </>
      )}
    </CustomDialog>
  );
};
