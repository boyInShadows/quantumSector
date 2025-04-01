"use client";
import React, { useState, useEffect } from "react";

type TimerPageProps = {
  duration: number;
};

const TimerPage: React.FC<TimerPageProps> = ({ duration }) => {
  const [time, setTime] = useState(() => {
    // Load saved time from localStorage, or use initial duration
    if (typeof window !== "undefined") {
      const savedTime = localStorage.getItem("timer");
      return savedTime ? parseInt(savedTime, 10) : duration;
    }
  });

  // Format time as days:hours:minutes:seconds
  const getFormattedTime = (milliseconds: number) => {
    const total_seconds = Math.floor(milliseconds / 1000);
    const total_minutes = Math.floor(total_seconds / 60);
    const total_hours = Math.floor(total_minutes / 60);
    const days = Math.floor(total_hours / 24);

    const seconds = total_seconds % 60;
    const minutes = total_minutes % 60;
    const hours = total_hours % 24;

    return `${days} : ${hours} : ${minutes} : ${seconds}`;
  };

  useEffect(() => {
    if (time <= 0) return; // Stop the timer when it reaches 0

    const timer = setTimeout(() => {
      const newTime = time - 1000;
      setTime(newTime);
      localStorage.setItem("timer", newTime.toString()); // Save new time to localStorage
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer
  }, [time]);

  const handleReset = () => {
    setTime(duration);
    localStorage.setItem("timer", duration.toString()); // Reset localStorage timer
  };

  return (
    <div className="h-[100vh] flex flex-col justify-center items-center gap-10">
      <div>{getFormattedTime(time)}</div>
      <button onClick={handleReset} className="btn btn-accent">
        Refresh Timer
      </button>
    </div>
  );
};

export default TimerPage;
