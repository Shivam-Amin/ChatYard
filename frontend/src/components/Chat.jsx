import React, { useContext, useEffect } from 'react'
import { Sidebar } from './Sidebar';
import '../CSS/chat.css';
import { Context, server } from '../main';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import ListYard from './ListYard';

const Chat = () => {
  
  const {setUser, setIsAuth, isAuth} = useContext(Context);
  if (!isAuth) {
    return <Navigate to={'/login'} />
  } 

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
    <div className='chat'>
      <div className="chat__sidebar">
        <Sidebar />
      </div>
      <div className="chat__listYard">
        <ListYard />
      </div>
    </div>
  )
}

export default Chat;

