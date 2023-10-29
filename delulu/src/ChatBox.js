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

  const sendToHumeAPI = async (audioBlob) => {
    const formData = new FormData();

    // Append the JSON data
    formData.append("json", JSON.stringify({
      "models": {
        "audio": {}  // Assuming the model name is "audio", adjust as needed
      }
    }));

    // Append the audio file
    formData.append("file", audioBlob, "audio.wav");

    console.log("Sending audio data to Hume API...");

    try {
      const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
        method: 'POST',
        headers: {
          'X-Hume-Api-Key': 'ZOYDAGJtcZ41Aw0vf1f3RQmjUbyYR0vzGlusUuVgDICxXv1m'
        },
        body: formData
      });

      console.log("Response received:", response);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Parsed JSON data:", data);

      // Handle the API response here
      // setMessages([...messages, { sender: "bot", text: data.someField }]);
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };




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
        sendToHumeAPI(audioBlob);

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

    // Call the Hume API
    sendToHumeAPI();

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
                🎙️ Start Recording
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
    </div >
  );

}

export default ChatBox;
