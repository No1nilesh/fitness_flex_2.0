import React, { useState } from "react";
import { Video, VideoOff, MicOff, Mic, EllipsisVertical } from "lucide-react";
import { Dropdown } from "@components/UiComponents/dropdown";
const RemoteVideoControls = ({
  playing,
  isAdmin,
  muted,
  playerId,
  toggleRemoteUserVideo,
  toggleRemoteUserAudio,
  audioPlayer,
  index,
}) => {
  const handleRemoteUserAudio = () => {
    toggleRemoteUserAudio(Object.keys(audioPlayer)[index], playerId);
    // console.log(Object.keys(audioPlayer)[index], playerId);
  };

  const menu = [{ name: "Audio", func: handleRemoteUserAudio }];

  return (
    <div className="remote-video-controls w-full flex gap-1 absolute top-1 px-2 opacity-60">
      <div className="">
        {audioPlayer[Object.keys(audioPlayer)[index]]?.muted ? (
          <MicOff className=" size-5 text-primary-foreground" />
        ) : (
          <Mic className=" size-5 text-primary-foreground" />
        )}
      </div>

      <div
        className=""
        // onClick={() => toggleRemoteUserVideo(playerId)}
      >
        {playing ? (
          <Video className=" size-5 text-primary-foreground" />
        ) : (
          <VideoOff className=" size-5 text-primary-foreground" />
        )}
      </div>

      {isAdmin && (
        <Dropdown label={"User Media"} menu={menu}>
          <div className="absolute right-0 cursor-pointer">
            <EllipsisVertical className=" size-5 text-primary-foreground" />
          </div>
        </Dropdown>
      )}
    </div>
  );
};

export default RemoteVideoControls;
