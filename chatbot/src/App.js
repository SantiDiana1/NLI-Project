import './App.css';
import ChatBot from 'react-simple-chatbot';
import Socket from './Components/Socket';
import React, { useState } from 'react';

function ChatBotWrapper() {
  const [enableTTS, setTTS] = useState(false)

  function toggleTTS() {
    setTTS(!enableTTS)
  }

  const steps = [
    {
      id: '1',
      message: 'Hey there, I am the best SMC chatbot ever made, what can I do for you?',
      trigger: 'search'
    },
    {
      id: 'search',
      user: true,
      trigger: '3'
    },
    {
      id: '3',
      component: <Socket key={enableTTS} enableTTS={enableTTS} />,
      asMessage: true,
      waitAction: true,
      trigger: 'search',
    }
  ]

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={enableTTS}
          onChange={toggleTTS}
        />
        Toggle Text-to-Speech
      </label>
      <ChatBot
        key={enableTTS}
        recognitionEnable={true}
        steps={steps} />
    </div >
  );
}

function App() {

  return (
    <div>
      <ChatBotWrapper />
    </div >
  );
}

export default App;
