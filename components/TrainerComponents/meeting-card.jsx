import { Card, CardContent } from "@components/ui/card";
import { cn } from "@lib/utils";

const MeetingCard = ({ className, title, description, icon, handleClick }) => {
  return (
    <Card
      onClick={handleClick}
      className={cn(
        "border-none w-full h-48 px-4 py-6 flex flex-col justify-between rounded-sm bg-orange-400 shadow-md  cursor-pointer",
        className
      )}
    >
      {/* icon */}
      <div className="bg-white/20 size-10 rounded-md flex-center shadow-sm backdrop-blur-md">
        {icon}
      </div>

      <CardContent className="p-0 flex flex-col justify-center items-center w-full text-primary-foreground">
        <h1 className="text-2xl ">{title}</h1>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
