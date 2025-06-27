import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { config } from "../../../config";

// Accepts a list of jobs: { id: string, onComplete: () => void }
export const useJobStatus = (jobList: { id: string; onComplete: () => void }[]) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!jobList || jobList.length === 0) return;

    const socket = io(config.NGINX_BASE_URL, { path: "/socket.io" });
    socketRef.current = socket;

    socket.on("connect", () => {
      jobList.forEach((job) => {
        socket.emit("subscribe", job.id);
      });
    });

    socket.on("done", (data: any) => {
      const job = jobList.find((j) => j.id === data.jobID);
      if (job) {
        job.onComplete();
      }
    });

    return () => {
      socket.disconnect();
    };
    // Use JSON.stringify to avoid missing changes in jobList
  }, [JSON.stringify(jobList)]);
};
