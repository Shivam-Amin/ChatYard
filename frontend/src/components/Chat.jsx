import React, { useContext, useEffect, useState } from 'react'
import { Sidebar } from './Sidebar';
import '../CSS/chat.css';
import { Context, server } from '../main';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import SelectedChat from './SelectedChat.jsx';
import Status from './Status.jsx';
import Loading from './Loading.jsx';
import ListChat from './ListChat';

const Chat = () => {
  const {notifications, setNotifications, lastSelected, setLastSelected} = useContext(Context)
  const {user, setUser, setIsAuth, isAuth, loading} = useContext(Context);
  const [activeChat, setActiveChat] = useState();
  const [chats, setChats] = useState([]);
  
  
  
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
    console.log(notifications);
  }, [])

  if (!isAuth) {
    return <Navigate to={'/login'} />
  }

  // console.log(activeChat);
  return (
    <div className='chat'>
      {/* { loading && <Loading /> } */}
      <div className="chat__sidebar">
        <Sidebar />
      </div>
      <div className="chat__listChat">
        <ListChat 
        chats={chats} 
        setChats={setChats} 
        setActiveChat={setActiveChat}
        lastSelected={lastSelected}
        setLastSelected={setLastSelected} />

      </div>

      <div className="chat__main">
        <SelectedChat 
          activeChat={activeChat} 
          setActiveChat={setActiveChat}
          notifications={notifications}
          setNotifications={setNotifications} />
      </div>

      <div className="chat__listYard2">
        <Status activeChat={activeChat}
          setActiveChat={setActiveChat}
          notifications={notifications}
          setNotifications={setNotifications}
          lastSelected={lastSelected}
          setLastSelected={setLastSelected} />
      </div>
    </div>
  )
}

export default Chat;

