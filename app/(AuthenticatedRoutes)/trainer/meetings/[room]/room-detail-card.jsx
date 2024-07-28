"use client";
import { useState, useEffect } from "react";
import { Clipboard, ClipboardCheck, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import CopyButton from "@components/UiComponents/copy-btn";

const RoomDetailCard = ({
  roomId,
  showRoomDetailCard,
  setShowRoomDetailCard,
}) => {
  return (
    showRoomDetailCard && (
      <Card className="absolute bottom-1/4 md:bottom-2 md:left-44 z-50 w-full max-w-sm shadow-md">
        <X
          className="absolute right-0 p-1 cursor-pointer z-[51]"
          onClick={() => setShowRoomDetailCard(false)}
        />
        <CardContent className="p-0">
          <CardHeader className="flex flex-col">
            <div className="text-lg font-semibold">Room ID</div>
            <div className="bg-gray-200 rounded-md py-2 flex px-1 justify-between shadow-sm">
              <span className=" text-gray-800">{roomId}</span>
              <CopyButton text={roomId} checkTime={10000} />
            </div>
          </CardHeader>
        </CardContent>
      </Card>
    )
  );
};

export default RoomDetailCard;
