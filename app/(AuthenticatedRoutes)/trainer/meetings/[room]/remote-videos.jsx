import Player from "@components/TrainerComponents/Player";
import AudioPlayer from "@components/TrainerComponents/AudioPlayer";
import RemoteVideoControls from "./remote-video-controls";
import Image from "next/image";
import blank from "@public/assets/blank.jpg";
import { cn } from "@lib/utils";
const RemoteVideos = ({
  players,
  audioPlayer,
  isAdmin,
  toggleRemoteUserAudio,
  toggleRemoteUserVideo,
}) => {
  return (
    <>
      {Object.keys(players).map((playerId) => {
        const { url, muted, playing, email } = players[playerId];
        const indexOfPlayerId = Object.keys(players).indexOf(playerId);
        return (
          <div
            key={playerId}
            className="relative max-w-[965px] aspect-video transition-transform duration-300 ease-in-out"
          >
            <RemoteVideo
              url={url}
              muted={muted}
              playing={playing}
              playerId={playerId}
              email={email}
              indexOfPlayerId={indexOfPlayerId}
              isAdmin={isAdmin}
              toggleRemoteUserAudio={toggleRemoteUserAudio}
              toggleRemoteUserVideo={toggleRemoteUserVideo}
              audioPlayer={audioPlayer}
            />

            {!playing && (
              <Image
                src={blank}
                height={"100"}
                width={"100"}
                alt="black screen"
                className="absolute top-0 w-full   h-full rounded-md pointer-events-none"
              />
            )}
          </div>
        );
      })}

      {Object.keys(audioPlayer).map((playerId) => {
        const { url, muted } = audioPlayer[playerId];
        return <AudioPlayer key={playerId} url={url} muted={muted} />;
      })}
    </>
  );
};

export default RemoteVideos;

const RemoteVideo = ({
  className,
  playerId,
  url,
  email,
  muted,
  isAdmin,
  toggleRemoteUserAudio,
  toggleRemoteUserVideo,
  playing,
  indexOfPlayerId,
  audioPlayer,
}) => {
  return (
    <div className={cn(className)}>
      <div className="absolute bottom-0 text-gray-200 right-0 px-3">
        {email}
      </div>
      <Player url={url} muted={muted} playing={playing} />

      <RemoteVideoControls
        toggleRemoteUserAudio={toggleRemoteUserAudio}
        toggleRemoteUserVideo={toggleRemoteUserVideo}
        playerId={playerId}
        playing={playing}
        isAdmin={isAdmin}
        index={indexOfPlayerId}
        audioPlayer={audioPlayer}
        muted={muted}
      />
    </div>
  );
};
