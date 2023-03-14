import './App.css';
import ChatBot from 'react-simple-chatbot';
import Socket from './Components/Socket';

function App() {
  return (
    <ChatBot
      headerTitle="Come talk to me please 🥺"
      recognitionEnable={true}
      steps={[
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
          component: <Socket />,
          asMessage: true,
          waitAction: true,
          trigger: 'search',
        },
      ]}
    />
  );
}

export default App;
