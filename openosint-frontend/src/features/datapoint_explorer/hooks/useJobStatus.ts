import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { config } from "../../../config";

export const useJobStatus = (jobID: string, onComplete: () => void) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!jobID) return;

    console.log(jobID)

    const socket = io(config.NGINX_BASE_URL, {path: "/socket.io"});
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected via WebSocket");
      socket.emit("subscribe", jobID);
    });

    socket.on("done", (data: any) => {

      if (data.jobID === jobID) {
        console.log("Job completed:", jobID);
        onComplete();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [jobID, onComplete]);
};
