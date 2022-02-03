// import './App.css';
import UserLogin from './Components/UserLogin';
import { Toaster } from 'react-hot-toast';
import ChattingTemplate from './Components/ChattingTemplate';

function App() {
  return (
    <div className="App">
      <Toaster />
      {/* <UserLogin /> */}
      <ChattingTemplate />
    </div>
  );
}

export default App;
