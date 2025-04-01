// Components
import ReminderPage from "./pages/reminder";
import TimerPage from "./pages/timer";
import TodoPage from "./pages/todo";
import VoiceRemoinderPage from "./pages/reminder/voiceReminder";
import TradingView from "./components/tradingTest/botTestPage";

export default function Home() {
  // JSX
  return (
    <>
      <TradingView />
    </>
    // <div className="flex flex-col">
    //   <div className="flex justify-center">
    //     <div className="flex flex-col justify-center items-center h-[50vh] w-[50vw] border-black border-2 gap-10">
    //       <h1 className="text-[20pt] font-bold ">Reminder</h1>
    //       <ReminderPage />
    //     </div>
    //     <div className="flex flex-col justify-center items-center h-[50vh] w-[50vw] border-black border-2 gap-10">
    //       <h1 className="text-[20pt] font-bold ">
    //         Task 1: Develop Countdown Timer
    //       </h1>
    //       <TimerPage duration={30 * 60 * 1000} />
    //     </div>
    //   </div>
    //   <div className="flex justify-center ">
    //     <div className="flex flex-col justify-center items-center h-[50vh] w-[50vw] border-black border-2 gap-10">
    //       <h1 className="text-[20pt] font-bold ">
    //         Task 2: Develop a voice record task manager
    //       </h1>
    //       <VoiceRemoinderPage />
    //     </div>
    //     <div className="flex flex-col justify-center items-center h-[50vh] w-[50vw] border-black border-2 gap-10">
    //       <h1 className="text-[20pt] font-bold ">Task 3: Develop a mind map</h1>
    //     </div>
    //   </div>
    // </div>
  );
}
