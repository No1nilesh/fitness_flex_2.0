"use client";
import React, { useState, useCallback, useEffect } from "react";
const { v4: uuidv4 } = require("uuid");
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import MeetingCard from "@components/TrainerComponents/meeting-card";
import { useRouter } from "next/navigation";
import { CustomDialog } from "@components/UiComponents/custom-dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useDialog } from "@ZustandStore/useDialog";
import CreateEventForm from "@components/TrainerComponents/create-event-form";
import useEventFormDataStore from "@ZustandStore/useEventFormDataStore";
import { useSocket } from "@components/SocketProvider";
import axios from "axios";
const Meetings = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const socket = useSocket();
  const { onOpen } = useDialog();
  const { setEventFormData } = useEventFormDataStore();
  const room = uuidv4();
  const [meetingState, setMeetingState] = useState(undefined);

  const [assignedMember, setAssignedMemberData] = useState([]);
  useEffect(() => {
    const fetchAssignMember = async () => {
      try {
        const res = await axios.get("/api/trainer/assigned-users");
        const assignedMembers = res.data.assigned_members;
        const data = assignedMembers?.assigned_members;
        const emails = data.map((obj) => obj.email);
        setAssignedMemberData(emails);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssignMember();
  }, []);

  const handleCreateInstantMeeting = useCallback(async () => {
    router.push(`/trainer/meetings/${room}`);
    if (socket) {
      socket.emit("creatingMeeting", {
        email: session?.user.email,
        roomName: room,
        assignedMembers: assignedMember,
      });
    }
  }, [room, socket, session?.user.email, assignedMember]);

  const handleScheduleMeeting = useCallback(() => {
    const currentDate = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set the time to end of the day
    onOpen();
    const title = ""; // Initialize title
    const id = null; // Initialize id
    const start = currentDate;
    const end = endOfDay;
    setEventFormData(id, start, end, title, "create", true);
    setMeetingState("isScheduleMeeting");
  }, []);

  const handleJoinExistingMeeting = () => {
    onOpen();
    setMeetingState("isJoinExistingMeeting");
  };

  return (
    <section className="mx-2 md:mx-0">
      <MeetModal meetingState={meetingState} />
      <div className="meeting-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-2 ">
        <MeetingCard
          className={"bg-orange-500"}
          title={"New Meeting."}
          description={"Set up a new meeting."}
          icon={<Plus className="size-12 text-primary-foreground" />}
          handleClick={handleCreateInstantMeeting}
        />
        <MeetingCard
          className={"bg-purple-600"}
          title={"Schedule Meeting"}
          description={"Schedule a meeting"}
          handleClick={handleScheduleMeeting}
          icon={<Plus className="size-12 text-primary-foreground" />}
        />
        <MeetingCard
          className={"bg-red-600"}
          title={"Join Meeting."}
          description={"Join an existing meeting"}
          icon={<Plus className="size-12 text-primary-foreground" />}
          handleClick={handleJoinExistingMeeting}
        />
        <MeetingCard
          className={"bg-blue-600"}
          title={"Schedule Meeting"}
          description={"Schedule a meeting"}
          icon={<Plus className="size-12 text-primary-foreground" />}
        />
      </div>
    </section>
  );
};

export default Meetings;

const MeetModal = ({ meetingState }) => {
  const { onClose } = useDialog();
  const [inputLink, setInputLink] = useState("");
  const router = useRouter();

  const handleJoinMeeting = useCallback(() => {
    router.push(`/trainer/meetings/${inputLink}`);
    onClose();
  }, [inputLink]);

  return (
    <CustomDialog>
      {meetingState === "isScheduleMeeting" && <CreateEventForm />}
      {meetingState === "isJoinExistingMeeting" && (
        <>
          <Input onChange={(e) => setInputLink(e.target.value)} />
          <Button onClick={handleJoinMeeting}>Submit</Button>
        </>
      )}
    </CustomDialog>
  );
};
