import React, { useContext, useEffect, useState } from 'react';
import { Context, server } from '../main';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../CSS/sidebar.css';
import { HiMiniHome } from "react-icons/hi2";
import { HiOutlineMoon } from 'react-icons/hi2';
import { HiLogout } from 'react-icons/hi';
import { PiBellBold, PiChatCircleTextDuotone, PiChatsCircleDuotone } from 'react-icons/pi';
import { FaBots } from 'react-icons/fa6';

const Sidebar = () => {
  const { user, setIsAuth, loading, topLinks, bottomLinks} = useContext(Context);
  const [mode, setMode] = useState(bottomLinks[0].selected ? 'light' : 'dark');

  return (
    <div className={`sidebar ${mode}`}>
      <nav className='sidebar__nav'>
        <div className="sidebar-top">
          <input
            type='radio'
            name='sidebarLink'
            id={topLinks[0].title}
            key={topLinks[0].title}
            onChange={() => selectThisLink(topLinks[0].title)}
            defaultChecked = {topLinks[0].selected === true} />

          <label htmlFor={topLinks[0].title} className='tooltip' >
            <HiMiniHome className='svg' />
            <span className="tooltip__content">{topLinks[0].label}</span>
          </label>
        </div>

        <SidebarSection links={topLinks} setMode={setMode} setIsAuth={setIsAuth} />

        <div className="sidebar-bottom">
          <SidebarSection links={bottomLinks} setMode={setMode} setIsAuth={setIsAuth} />
        </div>

        <Profile user={user} />
      </nav>
    </div>
  )
}

const SidebarLink = ({ title, label, selected,  setMode, setIsAuth }) => {  

  const { topLinks, bottomLinks, loading, setLoading} = useContext(Context);

  const selectThisLink = async (title) => {
    setLoading(true)
    // console.log(loading);
    if (title == 'Logout') {
      try {
        const { data } = await axios.get(`${server}/user/logout`, {
          withCredentials: true,
        })
        setIsAuth(false);
        toast.success(data.message);
      } catch(error) {
          // console.log(error);
          toast.error(error.response.data.message);
      }
    } else if (title === 'Mode') {
      bottomLinks[0].selected = !bottomLinks[0].selected;
      setMode(bottomLinks[0].selected ? 'light' : 'dark');
    } else if (title === 'Notifications') {
      topLinks[4].selected = !topLinks[4].selected;
    } else {
      topLinks.forEach((link) => {
        link.selected = (link.title == title) ? true : false;
      })
    }
  
    sessionStorage.setItem('topLinks', JSON.stringify(topLinks))
    sessionStorage.setItem('bottomLinks', JSON.stringify(bottomLinks))
    setLoading(false)
  }

  // const [name, setName] = useState(second)
  // if (title === 'Chats' || title === 'Group Chats' || title === 'Bots') {
  //   await setName('topLinks')
  // } else if (title === 'Mode' ||  title === 'Logout') {
  //   await setName('bottomLinks')
  // } else {

  // }

  return (
    <>
    {
      (title === 'Mode' || title === 'Logout' || title === 'Notifications')
      ?<li>
        <input
          type='checkbox'
          name={'sidebarLink2'}
          id={title}
          key={title}
          defaultChecked={(selected) ? true :false} />

        <label htmlFor={title} className='tooltip' onClick={() => selectThisLink(title)} >
            {title === 'Chats' && <PiChatCircleTextDuotone />}
            {title === 'Group Chats' && <PiChatsCircleDuotone />}
            {title === 'Bots' && <FaBots />}
            {title === 'Notifications' && <PiBellBold /> }
            {title === 'Mode' && <HiOutlineMoon />}
            {title === 'Logout' && <HiLogout />}
          <span className="tooltip__content">{label}</span>
        </label>
      </li>
      :<li>
        <input
          type='radio'
          name={'sidebarLink'}
          id={title}
          key={title}
          defaultChecked = {selected} />

        <label htmlFor={title} className='tooltip' onClick={() => selectThisLink(title)} >
            {title === 'Chats' && <PiChatCircleTextDuotone />}
            {title === 'Group Chats' && <PiChatsCircleDuotone />}
            {title === 'Bots' && <FaBots />}
            {title === 'Notifications' && <PiBellBold /> }
            {title === 'Mode' && <HiOutlineMoon />}
            {title === 'Logout' && <HiLogout />}
          <span className="tooltip__content">{label}</span>
        </label>
      </li>
    
    }
    </>
    
  );
};

const SidebarSection = ({ links, setMode, setIsAuth }) => {
  return (
    <div className="sidebar-links">
      <ul>
        {links.map((link, index) => {
          if (link.title === 'Home') return null;
          else 
          return (<SidebarLink
            key={index}
            setMode={setMode}
            setIsAuth={setIsAuth}
            title={link.title}
            label={link.label}
            selected={link.selected} />)
        })}
        
      </ul>
    </div>
  );
};

const Profile = ({ user }) => {
  return (
   <div className="sidebar__profile">
     <div className="avatar__wrapper">
       <img className="avatar" src={user.pic} alt="Profile" />
       <div className="online__status"></div>
     </div>
   </div>
  )
}

export { Sidebar };