import React from 'react';
import './App.css';
import ChatBox from './ChatBox';

function App() {
  return (
    <div className="App">
      <div className='Header'>
        <h1 id='productName'>Delusion Bot</h1>
        <h3>Your AI Delusional Bestie!</h3>
      </div>
      <ChatBox />
    </div>
  );
}

export default App;
