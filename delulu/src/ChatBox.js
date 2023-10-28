import React, { useState } from 'react';
import Message from './Message';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessages([...messages, { sender: 'user', text: inputVal }]);

    // Provide a predefined bot response
    setTimeout(() => {
      setMessages([...messages, { sender: 'user', text: inputVal }, { sender: 'bot', text: 'Hello there!' }]);
    }, 1000);

    setInputVal('');
  };

  return (
    <div className="chat-box">
      <header>
        Welcome to Delusion-Bot
      </header>
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatBox;
