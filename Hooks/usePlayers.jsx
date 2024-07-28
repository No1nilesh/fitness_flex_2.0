"use client";
import { useState } from "react";

const usePlayers = () => {
  const [players, setPlayers] = useState({});
  const [audioPlayer, setAudioPlayer] = useState({});

  return { players, setPlayers, audioPlayer, setAudioPlayer };
};

export default usePlayers;
