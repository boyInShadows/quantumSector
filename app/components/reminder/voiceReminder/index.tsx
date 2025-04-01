"use client";
import { useState, useRef } from "react";

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Initialize SpeechRecognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("SpeechRecognition API not supported");
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        console.log("SpeechRecognition result:", event.results);
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript((prev) => prev + finalTranscript);
        setInterimTranscript(interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognitionRef.current.start();
      console.log("SpeechRecognition started");
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    recognitionRef.current.stop();
    setIsRecording(false);
    console.log("Recording stopped");
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  return (
    <div>
      <h1>Voice Recorder</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <div>
          <button onClick={playRecording}>Play Recording</button>
        </div>
      )}
      <div>
        <h2>Transcript:</h2>
        <p>{transcript}</p>
        {interimTranscript && (
          <p style={{ color: "gray" }}>{interimTranscript}</p>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
