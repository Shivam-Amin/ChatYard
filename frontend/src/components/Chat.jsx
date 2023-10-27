import React, { useContext, useEffect, useState } from 'react'
import { Sidebar } from './Sidebar';
import '../CSS/chat.css';
import { Context, server } from '../main';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import ListYard from './ListChat';
import SelectedChat from './SelectedChat.jsx';
import Status from './Status.jsx';
import Loading from './Loading.jsx';

const Chat = () => {
  
  const {setUser, setIsAuth, isAuth, loading} = useContext(Context);
  const [activeChat, setActiveChat] = useState();
  const [chats, setChats] = useState([]);

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

  // console.log(activeChat);
  return (
    <div className='chat'>
      {/* { loading && <Loading /> } */}
      <div className="chat__sidebar">
        <Sidebar />
      </div>
      <div className="chat__listYard">
        <ListYard chats={chats} setChats={setChats} setActiveChat={setActiveChat} />
      </div>

      <div className="chat__main">
        <SelectedChat 
          activeChat={activeChat} 
          setActiveChat={setActiveChat} />
      </div>

      <div className="chat__listYard2">
        <Status activeChat={activeChat}/>
      </div>
    </div>
  )
}

export default Chat;

