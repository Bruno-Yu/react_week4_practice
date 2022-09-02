import './style/App.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';
import { LogIn } from './components/LogIn';
import { SignUp } from './components/SignUp';
import { ToDos } from './components/ToDos';


function App() {
  const ApiURL= `https://todoo.5xcamp.us/`
  const [token, setToken] = useState(null); 
  const [userName, setUserName] = useState('');
  const [data, setData] = useState([]);
  return (
    <div className="App">
      <AuthContext.Provider value={{ token, setToken, userName, setUserName, data, setData, ApiURL }}>
        <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/todos' element={<ToDos/>} />
      </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
