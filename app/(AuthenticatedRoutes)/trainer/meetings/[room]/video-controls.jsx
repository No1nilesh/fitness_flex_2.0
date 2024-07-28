import { Video, VideoOff, MicOff, Mic, Phone } from "lucide-react";
const VideoControls = ({
  muted,
  playing,
  toggleAudio,
  toggleVideo,
  handleCallDisconnect,
}) => {
  return (
    <div className="flex gap-x-2 justify-center items-center">
      <div
        onClick={toggleVideo}
        className="bg-secondary-foreground rounded-full px-4 md:px-3 size-12  flex-center drop-shadow-md cursor-pointer"
      >
        {playing ? (
          <Video className="size-10  text-primary-foreground" />
        ) : (
          <VideoOff className="size-10  text-primary-foreground" />
        )}
      </div>
      <div
        onClick={toggleAudio}
        className="bg-secondary-foreground rounded-full px-4 md:px-3 size-12  flex-center drop-shadow-md cursor-pointer"
      >
        {muted ? (
          <MicOff className="size-10  text-primary-foreground" />
        ) : (
          <Mic className="size-10  text-primary-foreground" />
        )}
      </div>
      <div
        onClick={handleCallDisconnect}
        className="bg-red-600 rotate-[135deg] rounded-full px-4 md:px-3 size-12  flex-center drop-shadow-md cursor-pointer"
      >
        <Phone className="size-10  text-primary-foreground" />
      </div>
    </div>
  );
};

export default VideoControls;
