import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context, server } from '../main';
import { HiSearch } from 'react-icons/hi';
import '../CSS/listChat.css'
import axios from 'axios';
import toast from 'react-hot-toast';
// import { ObjectId } from 'mongodb';


var userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const ListChat = (props) => {
  const {loading, setLoading, reset, setReset} = useContext(Context);

  const { chats, setChats, setActiveChat} = props;
  const { topLinks, user } = useContext(Context);
  const selectedLink = topLinks.find(link => link.selected);

  // to save the last selected chat.
  const [lastSelected, setLastSelected] = useState({});

  // for scrolling to top.
  // const containerRef = useRef(null);

  
  useEffect(() => {
    try {
      setLoading(true)
      const fetchData = async () => {
        const { data } = await axios.get(`${server}/chat`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        })
        setChats(data);

      }
      const  getPreviousSelected = async() => {
        const chat = (sessionStorage.getItem("previousSelected")) 
        ? sessionStorage.getItem("previousSelected") 
        : null
        await setLastSelected(JSON.parse(chat))
        await setActiveChat(JSON.parse(chat))
        
      }
      fetchData().then(getPreviousSelected())

      setLoading(false);
    } catch (error) {
      console.log(error.messge);
      toast.error(error.message)
    }
  }, [chats, reset])

  function getSender(loggedUser, chat) {
    if (chat.isGroupChat) {
      return chat;
    } 
      
    if (chat.users[1]._id === loggedUser._id) {
      return chat.users[0];
    } 
    return chat.users[1];
  }

  async function setPreviousSelected(chat, index) {
    setActiveChat(chat);
    setLastSelected(chat);
    sessionStorage.setItem("previousSelected", JSON.stringify(chat));
  }

  
  return (
    <>
      <div className='listChat'>
        <nav className="container">
          {selectedLink && <h1>{ selectedLink.title }</h1> }

          <div className="search">
            <input type="text" id='search' placeholder='search' />
            <label htmlFor="search">
              <HiSearch />
            </label>
          </div>

          <nav className="chats">
            { chats.map((chat, index) => {
                const person = getSender(user, chat);
                return (
                  <div className='profile__container' key={index} >
                    <input type='radio' 
                      name='chat' 
                      id={chat._id} 
                      // defaultChecked={chat._id === lastSelected?._id}
                      checked={chat._id === lastSelected?._id}
                      onChange={() =>{
                        setPreviousSelected(chat, index);
                        setReset(prev => !prev)
                      }} />
                    <label htmlFor={chat._id} >
                      <img className='avatar' 
                      src={(person.isGroupChat) ? person.groupPic : person.pic} 
                      alt="user logo" />

                      <div className="info">
                        { (chat.isGroupChat)
                          ? <h2>{chat.chatName}</h2>
                          : <h2>{person.name}</h2>
                        }
                        { (chat.latestMessage)
                          ? <div className='chat-info'>
                              { (chat.latestMessage.sender._id === user._id)
                                ? <p className='name'>You: </p>
                                : <p className='name'>{chat.latestMessage.sender.name}: </p>
                              }
                              <p className='latestMessage'>{chat.latestMessage.message}</p>
                            </div>
                          : <div className='chat-info'>
                            <p className='latestMessage'>Start messge.!</p>
                          </div>
                        }  
                      </div>
                    </label>
                  </div>
                )
              })
            }
          </nav>
        </nav>
      </div>
    </>
  )
}

export default ListChat;