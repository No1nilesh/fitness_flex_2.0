import Player from "@components/TrainerComponents/Player";
import Image from "next/image";
import blank from "@public/assets/blank.jpg";
import { cn } from "@lib/utils";

const MyVideo = ({ myVideo, className }) => {
  return (
    <div className={cn(className)}>
      <Player
        url={myVideo.url}
        muted={myVideo.muted}
        playing={myVideo.playing}
      />
      {!myVideo.playing && (
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
};

export default MyVideo;
