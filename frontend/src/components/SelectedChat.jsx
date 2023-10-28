import React, { useContext, useEffect, useRef, useState } from 'react'
import '../CSS/selectedChat.css'
import { Context, server } from '../main';
import Loading from './Loading';
import { VscSend } from 'react-icons/vsc';
import axios from 'axios';
import toast from 'react-hot-toast';
import ChatMessages from './ChatMessages';
import img from '../assets/DefaultImage.png';
import io from 'socket.io-client';
// import { limitText, name, pic } from './Functions/selectedChatFunctions';

const EndPoint = "http://localhost:5000";
var socket, selectedChatCompare;
  // To check where the message is from selected chat or not..
  // if it's not then will give notification.

const SelectedChat = ({ activeChat, setActiveChat, notifications, setNotifications }) => {
  // const {loading} = useContext(Context);
  // console.log(activeChat);
  const {user, loading, setLoading, reset, setReset} = useContext(Context);

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const textareaRef = useRef(null);

  
  const [socketConnected, setSocketConnected] = useState(false)

  useEffect(() => {
    socket = io(EndPoint);
    socket.emit('setup', user);
  }, []);

  useEffect(() => {
    getAllMessages();   
    setNewMessage("");

    // auto foucus to textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [reset]);


  // in this no [] in end, caz we want this to run sync.
  useEffect(() => {
    socket.on('RecieveMessage', async (newMessage) => {
      // add recieved message to every other users messages.
      // & not to current user as it would be added by the enter effect.
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        // send notification

        if (!notifications.includes(newMessage)) {
          await setNotifications([newMessage, ...notifications]);
        }
      } else {
        await setMessages([...messages, newMessage]);
      }
    })
  })

  useEffect(() => {
    socket.emit('joinChat', (activeChat) ? activeChat._id : null);
    socket.on('connected', () => setSocketConnected(true));
    selectedChatCompare = activeChat;
  }, [activeChat]);

  const addMessage = async (e) => {
    // Shift + Enter for new line
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const m = newMessage + '\n'
      setNewMessage(m);
      console.log(m);
      return;
    }

    // Only Enter then send message
    if (e.key === 'Enter' && newMessage) {
      e.preventDefault();
      addMessage_onLabelClick_inaddMessage();
    }
  }

  const addMessage_onLabelClick_inaddMessage = async () => {
    try {
      setNewMessage("");
      const { data } = await axios.post(`${server}/message`, JSON.stringify({
        message: newMessage,
        chatId: activeChat._id
      }), {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })

      setMessages([...messages, data]);
      socket.emit('newMessage', data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getAllMessages = async () => {
    if (!activeChat) {
      const chat = (sessionStorage.getItem("previousSelected"))
        ? sessionStorage.getItem("previousSelected")
        : null

      if (chat) {
        const parsedChat = JSON.parse(chat);
        try {
          setLoading(true);
          const {data} = await axios.get(`${server}/message/${parsedChat._id}`, {
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true,
          })
          setMessages(data)
          setLoading(false);

        } catch (error) {
          toast.error(error.response);
        }
      }
      return;
    }

    try {
      setLoading(true);
      const {data} = await axios.get(`${server}/message/${activeChat._id}`, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      await setMessages(data)

      // console.log(data);
      setLoading(false);
    } catch (error) {
      // console.log(error);
      toast.error(error.response);
    }
  }

  function name() {
    // console.log(activeChat);
    if (activeChat.chatName !== "sender") {
      return activeChat.chatName;
    } else {
      const u =activeChat.users
        .find((u) => (u._id !== user._id))
      return u.name
    }
  }
  
  function pic() {
    if (activeChat.isGroupChat) {
      return activeChat.groupPic;
    } else {
      const u =activeChat.users
        .find((u) => (u._id !== user._id))
      return u.pic
    }
  }
  
  // function for max words you can enter in message..
  function limitText(element, maxLength) {
    if (element.target.value.length > maxLength) {
      element.target.value = element.target.value.slice(0, maxLength);
    }
  }
  
  

  if (!activeChat) return (
    <div className='selectedChat img'>
      <img src={img} alt="DefaultImage" />
    </div>
  ) 

  return (
    <div className='selectedChat'>
      <div className="top-bar">
        <img className='avatar' src={pic()} alt="" />
        <div>
          <h2 className="name">{name()}</h2>
        </div>
      </div>

      <div className="mid">
        { (loading)
          ? <Loading />
          : <ChatMessages activeChat={activeChat} messages={messages} />
        }
      </div>

      <div className="bottom-bar">
        <textarea 
          ref={textareaRef}
          id="text" 
          rows="1" 
          cols="50" 
          value={newMessage}
          placeholder="Message..."
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={addMessage}
          onInput={(e) =>limitText(e, 500)} />

        <label htmlFor="text" onClick={addMessage_onLabelClick_inaddMessage}> <VscSend /> </label>
      </div>
    </div>
  )
}

export default SelectedChat;