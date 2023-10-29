import React, { useState } from "react";
import Message from "./Message";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  //new
  const [isAudioMode, setIsAudioMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  //new
  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

        // Convert blob to FormData
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.wav"); // 'audio' is the field name, adjust if the API expects something else

        // API Call
        try {
          const response = await fetch("YOUR_HUME_API_ENDPOINT", {
            method: "POST",
            body: formData,
          });

          // Handle API response
          const data = await response.json();
          // You can use the response data to update your state or perform other actions
          // e.g., setMessages([...messages, { sender: "bot", text: data.transcription }]);
        } catch (error) {
          console.error("Error uploading audio:", error);
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        setMessages([...messages, { sender: "user", text: audioUrl }]);
      };


      recorder.start();
      setIsRecording(true);
    });
  };
  //new
  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
    setAudioChunks([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessages([...messages, { sender: "user", text: inputVal }]);

    // Provide a predefined bot response
    setTimeout(() => {
      setMessages([
        ...messages,
        { sender: "user", text: inputVal },
        { sender: "bot", text: "Hello there!" },
      ]);
    }, 1000);

    setInputVal("");
  };

  return (
    <div className="chat-box">
      <header>
        Welcome to Delusion-Bot. Please share anything which is on your mind.
      </header>
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          margin: "10px 0",
        }}
      >
        <form onSubmit={handleSubmit}>
          {isAudioMode ? (
            <div>
              {isRecording ? (
                <button type="button" onClick={stopRecording}>
                  Stop Recording
                </button>
              ) : (
                <button type="button" onClick={startRecording}>
                  Start Recording
                </button>
              )}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </div>
          )}
        </form>
        <p>
          {isAudioMode
            ? "Can't speak right now? "
            : "Want to send an audio message? "}
          <button onClick={() => setIsAudioMode(!isAudioMode)}>
            {isAudioMode
              ? "Click here to chat in text."
              : "Click here to record audio."}
          </button>
        </p>
      </div>
    </div>
  );

}

export default ChatBox;
