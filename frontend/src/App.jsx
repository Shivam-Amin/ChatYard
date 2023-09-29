import { useContext, useEffect } from 'react'
import './App.css'
import { Context, server } from './main';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Register';
import axios from 'axios';
import Chat from './components/Chat';


function App() {

  const {setUser, setIsAuth, isAuth} = useContext(Context);
  
  useEffect(() => {
    axios.get(`${server}/user/me`, {
      withCredentials: true,
    })
    .then((res) => {
      setUser(res.data.user);
      setIsAuth(true)
    })
    .catch((error) => {
      setUser({});
      setIsAuth(false)
    })
  }, [])

  return (
    <div className="App ">
      <div>
        <Router>
          <Routes>
            <Route path='/' element = {<Chat />} />
            <Route path = '/login' element = { <Login /> } />
            <Route path = '/register' element = { <Signup /> } />
          </Routes>
          <Toaster toastOptions={{
            style: {
              background: '#333',
              color: 'whitesmoke',
              fontSize: '14px',
            }
          }} />
        </Router>
      </div>
    </div>
  );
}

export default App
