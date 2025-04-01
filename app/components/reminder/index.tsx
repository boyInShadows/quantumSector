"use client";
import { useState, useEffect, useRef } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import "tailwindcss/tailwind.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReminderComponent: NextPage = () => {
  const [tasks, setTasks] = useState<
    { id: number; task: string; deadline: Date; completed: boolean }[]
  >([]);
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const intervalsRef = useRef<{ [id: number]: NodeJS.Timeout }>({});

  const addTask = () => {
    const now = new Date();
    if (!task || !deadline) {
      alert("Please enter a task and pick a valid date and time.");
      return;
    }
    if (deadline <= now) {
      alert("The selected date and time must be in the future.");
      return;
    }
    const newTask = { id: Date.now(), task, deadline, completed: false };
    setTasks((prev) => [...prev, newTask]);
    startCountdown(newTask);
    setTask("");
    setDeadline(null);
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
  };

  const completeTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
  };

  const startCountdown = (task: { id: number; deadline: Date }) => {
    intervalsRef.current[task.id] = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id === task.id && !t.completed) {
            const now = new Date();
            const timeRemaining = task.deadline.getTime() - now.getTime();

            if (timeRemaining <= 0) {
              alert(`Time's up for: ${t.task}`);
              clearInterval(intervalsRef.current[task.id]);
              delete intervalsRef.current[task.id];
              return { ...t, completed: true };
            }
          }
          return t;
        })
      );
    }, 1000);
  };

  const getFormattedTime = (deadline: Date) => {
    const now = new Date();
    const difference = deadline.getTime() - now.getTime();

    if (difference <= 0) return "Time's up!";

    const total_seconds = Math.floor(difference / 1000);
    const total_minutes = Math.floor(total_seconds / 60);
    const total_hours = Math.floor(total_minutes / 60);
    const days = Math.floor(total_hours / 24);

    const seconds = total_seconds % 60;
    const minutes = total_minutes % 60;
    const hours = total_hours % 24;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    return () => {
      // Clear all intervals on component unmount
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Reminder App</title>
      </Head>
      <div className=" bg-base-200 p-6">
        <div className="max-w-lg mx-auto">
          <div className="card-body shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-4">
              Simple Reminder App
            </h1>
            <div className="flex flex-col gap-4">
              <input
                placeholder="Enter task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="input input-bordered w-full"
              />
              <DatePicker
                selected={deadline}
                onChange={(date: Date) => setDeadline(date)}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Select date and time"
                className="input input-bordered w-full"
              />
              <button onClick={addTask} className="btn btn-primary w-full">
                Add Reminder
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {tasks.map((t) => (
              <div
                key={t.id}
                className={`shadow-lg flex justify-between items-center p-4 ${
                  t.completed ? "opacity-50 line-through" : ""
                }`}
              >
                <div>
                  <p className="font-semibold">{t.task}</p>
                  <p className="text-sm text-gray-500">
                    Time Left: {getFormattedTime(t.deadline)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => completeTask(t.id)}
                    className={
                      t.completed ? "btn btn-sm " : "btn btn-success btn-sm"
                    }
                    // disabled={t.completed}
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="btn btn-error btn-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReminderComponent;
