import { cn } from "@lib/utils";
import ReactPlayer from "react-player";

const Player = ({ url, muted, playing, light, className }) => {
  return (
    <ReactPlayer
      url={url}
      muted={true}
      playing={playing}
      light={light}
      width="100%"
      height="100%"
      className={cn("aspect-video rounded-md overflow-hidden ", className)}
    />
  );
};

export default Player;
