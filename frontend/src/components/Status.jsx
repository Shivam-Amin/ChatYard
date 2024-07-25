import React, { useContext, useEffect } from 'react'
import '../CSS/listChat.css'
import { getSender } from './Functions/ListChatFunctions';
import { Context } from '../main';

const Status = (props) => {
  const { activeChat, setActiveChat, 
    notifications, setNotifications, 
    lastSelected, setLastSelected } = props;
  const topLinks = JSON.parse(sessionStorage.getItem('topLinks'))
  const activeNotification = topLinks[4].selected;
  const {user,  setLoading, reset, setReset} = useContext(Context);


  useEffect(() => {
    console.log(notifications);
  }, [activeNotification])

  if (activeNotification) {
    return (
      (!notifications)
      ?<div className='listChat'>
        <nav className="container status">
          <h1>Notifications</h1>
          <p>no notifications</p>
        </nav>
      </div>
      :<div className='listChat'>
        <nav className="container status">
          <h1>Notifications</h1>
          { notifications.map(n => {
            const bool = n.chat.isGroupChat;
            var name;
            (bool) 
            ? name = n.chat.chatName
            : name = getSender(user, n.chat).name
            
            return (
              <div className='notification' onClick={async () => {
                await setActiveChat(n.chat)
                setLastSelected(n.chat);
                sessionStorage.setItem("previousSelected", JSON.stringify(n.chat));
                setReset(prev => !prev)
                setNotifications(notifications
                  .filter((notification) => notification !== n))
              }}>
                {(bool)
                ? `New Message in ${name}`
                : `New message from ${name}`}
              </div>
            )
            })
          }
        </nav>
      </div>
    )
  }
  return (
    <div className='listChat'>
      <nav className="container status">
        <h1>Active Now</h1>
      </nav>
    </div>
  )
}

export default Status