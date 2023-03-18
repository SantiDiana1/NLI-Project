import './App.css';
import ChatBot from 'react-simple-chatbot';
import Socket from './Components/Socket';
import LanguageSwitcher from './Components/LanguageSwitcher';
import React, { useState, useEffect } from 'react';


function ChatBotWrapper() {
  const [enableTTS, setTTS] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const bool = currentLanguage === "English" ? false : !!currentLanguage
    setToggle(enableTTS !== bool);
  }, [enableTTS, currentLanguage]);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
  };

  function toggleTTS() {
    setTTS(!enableTTS)
  }

  var defaultMessage = 'Hey there, I am the best UPF chatbot ever made, what can I do for you?'
  if (currentLanguage !== 'English') {
    defaultMessage = 'Hola, soy el mejor chatbot de UPF jamás creado, ¿qué puedo hacer por ti?'
  }

  const steps = [
    {
      id: '1',
      message: defaultMessage,
      trigger: 'search'
    },
    {
      id: 'search',
      user: true,
      trigger: '3'
    },
    {
      id: '3',
      component: <Socket key={toggle} enableTTS={enableTTS} language={currentLanguage} />,
      asMessage: true,
      waitAction: true,
      trigger: 'search',
    }
  ]

  return (
    <div>
      <LanguageSwitcher
        languages={['English', 'Spanish']}
        onChange={handleLanguageChange}
      />
      <label>
        <input
          type="checkbox"
          checked={enableTTS}
          onChange={toggleTTS}
        />
        Toggle Text-to-Speech
      </label>
      <ChatBot
        key={toggle}
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
