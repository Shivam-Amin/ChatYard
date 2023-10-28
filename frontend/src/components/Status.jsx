import React, { useEffect } from 'react'
import '../CSS/listChat.css'

const Status = ({ notifications }) => {

  const topLinks = JSON.parse(sessionStorage.getItem('topLinks'))
  const activeNotification = topLinks[4].selected;
  
  useEffect(() => {
    // if (activeNotification) {
    //   // returnNotifications();
    // }
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
          <h1>dsfsdfsjlksdjflksjfkj</h1>
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