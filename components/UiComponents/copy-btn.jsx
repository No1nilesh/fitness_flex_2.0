"use client";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { cn } from "@lib/utils";
import { useState, useEffect } from "react";

const CopyButton = ({ text, className, checkTime }) => {
  const [isCopy, setIsCopied] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, checkTime);
  }, []);

  return (
    <div className={cn(className)}>
      {isCopy ? (
        <ClipboardCheck className="cursor-pointer" />
      ) : (
        <Clipboard
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
          }}
        />
      )}
    </div>
  );
};

export default CopyButton;
