"use client";
import useVideoConference from "@Hooks/useVedoConference";
import VideoControls from "./video-controls";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Drawer from "@components/UiComponents/drawer";
import { MessageSquareText, Users } from "lucide-react";
import ControlButtons from "@components/TrainerComponents/control-btn";
import MyVideo from "./my-video";
import RemoteVideos from "./remote-videos";
import RoomDetailCard from "./room-detail-card";
import { useRouter } from "next/navigation";
import Chat from "./chat";
import UsersComponent from "./users-room";
export default function Room({ params }) {
  const [myVideo, setMyVideo] = useState({});
  const [showRoomDetailCard, setShowRoomDetailCard] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeOption, setActiveOption] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const {
    localStream,
    socket,
    players,
    toggleAudio,
    toggleVideo,
    toggleRemoteUserAudio,
    toggleRemoteUserVideo,
    handleCallDisconnect,
    audioPlayer,
    isAdmin,
  } = useVideoConference(params.room, setMyVideo, myVideo);
  useEffect(() => {
    if (!localStream) return;
    setMyVideo({ url: localStream, muted: false, playing: true });
  }, [localStream]);

  useEffect(() => {
    setTimeout(() => {
      setShowRoomDetailCard(false);
    }, 15000);
  }, []);

  const gridLayout = (participants) => {
    switch (participants) {
      case 0:
        return "grid-cols-1";
      case 1:
        return "grid-cols-2 md:grid-cols-2";
      case 2:
      case 3:
        return "grid-cols-2 md:grid-cols-2";
      case 4:
      case 5:
        return "grid-cols-2 md:grid-cols-3";
      case 6:
        return "grid-cols-3 md:grid-cols-3";
      case 7:
      case 8:
      case 9:
        return "grid-cols-3 md:grid-cols-4";
      default:
        return "grid-cols-3 md:grid-cols-4";
    }
  };

  const disConnectCall = () => {
    handleCallDisconnect();
    router.push("/trainer/meetings");
  };

  const drawerOptions = [
    { name: "users", label: "Users", component: UsersComponent },
    {
      name: "chats",
      label: "Chats",
      component: () => <Chat socket={socket} room={params.room} />,
    },
  ];

  const handleDrawers = useCallback(
    (newOption) => {
      setActiveOption(newOption);
      // setDrawer(newOption);
      if (activeOption === newOption) {
        setOpenDrawer(false);
        setActiveOption("");
      } else {
        setOpenDrawer(true);
      }
    },
    [activeOption]
  );

  return (
    myVideo &&
    localStream && (
      <section className="size-full flex-center flex-col gap-y-2 ">
        <RoomDetailCard
          roomId={params.room}
          showRoomDetailCard={showRoomDetailCard}
          setShowRoomDetailCard={setShowRoomDetailCard}
        />
        <div className="h-full w-full mt-1  md:max-h-[calc(100%-70px)] flex justify-center items-center flex-col md:flex-row  gap-4 ">
          <div
            className={`w-full h-full max-w-[1000px] grid place-content-center transition-all ease-in-out duration-300  ${gridLayout(
              Object.keys(players).length
            )} gap-2`}
          >
            <MyVideo myVideo={myVideo} className={"relative  aspect-video"} />
            <RemoteVideos
              isAdmin={isAdmin}
              players={players}
              audioPlayer={audioPlayer}
              toggleRemoteUserAudio={toggleRemoteUserAudio}
              toggleRemoteUserVideo={toggleRemoteUserVideo}
            />
          </div>

          <Drawer
            className={"h-full py-3 hidden sm:block bg-background rounded-md"}
            width={" w-full md:w-[22rem]"}
            open={openDrawer}
            drawerOptions={drawerOptions}
            activeOption={activeOption}
          ></Drawer>
        </div>

        <div className="w-screen py-2 flex flex-col sm:flex-row items-center justify-between px-2 absolute bottom-2 md:relative ">
          {/* Email */}
          <div className="mb-4 sm:mb-0 font-semibold ">
            {session?.user.email}
          </div>

          {/* Video Controls and Chat/User Buttons */}
          <div className="flex items-center justify-around space-x-2 sm:space-x-4 ">
            {/* Video Controls */}
            <div className=" md:absolute  top-1/2 left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
              <VideoControls
                muted={myVideo.muted}
                playing={myVideo.playing}
                setMyVideo={setMyVideo}
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                handleCallDisconnect={disConnectCall}
              />
            </div>

            {/* Chat/User Buttons */}
            <div className=" items-center space-x-2 hidden sm:flex">
              <ControlButtons
                handleClick={() => handleDrawers("users")}
                icon={<Users className="w-5 h-5 text-primary-foreground" />}
              />
              <ControlButtons
                handleClick={() => handleDrawers("chats")}
                icon={
                  <MessageSquareText className="w-5 h-5 text-primary-foreground" />
                }
              />
            </div>
          </div>
        </div>
      </section>
    )
  );
}
