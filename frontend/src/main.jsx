import React, { createContext, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import store from '../store.js';

export const server = 'https://nodejs-chatyard.onrender.com';
export const Context = createContext();

// Check if the session storage values exist
const storedTopLinksJSON = sessionStorage.getItem('topLinks');
const storedBottomLinksJSON = sessionStorage.getItem('bottomLinks');

const topLinks = storedTopLinksJSON ? JSON.parse(storedTopLinksJSON) : [
  { href: '#home', title: 'Home', label: 'Home', selected: true },
  { href: '#chat', title: 'Chats', label: 'Chat', selected: true },
  { href: '#groupChat', title: 'Group Chats', label: 'GroupChat', selected: false },
  { href: '#bots', title: 'Bots', label: 'Bots', selected: false },
  { href: '#notification', title: 'Notifications', label: 'Notifications', selected: false },
];

const bottomLinks = storedBottomLinksJSON ? JSON.parse(storedBottomLinksJSON) : [
  { href: '#mode', title: 'Mode', label: 'Mode', selected: false },
  { href: '#logout', title: 'Logout', label: 'Logout', selected: false },
];

sessionStorage.setItem("topLinks", JSON.stringify(topLinks))
sessionStorage.setItem("bottomLinks", JSON.stringify(bottomLinks))


const AppWrapper = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [reset, setReset] = useState(false)
  const [notifications, setNotifications] = useState([]);

  // to save the last selected chat.
  const [lastSelected, setLastSelected] = useState({});

  return (
    <Context.Provider
      value={{
        isAuth, setIsAuth,
        loading, setLoading,
        user, setUser,
        reset, setReset,
        topLinks, bottomLinks,
        notifications, setNotifications,
        lastSelected, setLastSelected }} >
        <App />
    </Context.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store} >
      <AppWrapper />
    </Provider>
  </React.StrictMode>,
)
