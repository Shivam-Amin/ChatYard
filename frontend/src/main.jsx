import React, { createContext, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

export const server = "http://localhost:5000/api/v1";
export const Context = createContext({isAuth: false})

const AppWrapper = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})

  return (
    <Context.Provider
        value={{
          isAuth,
          setIsAuth,
          loading,
          setLoading,
          user, 
          setUser
        }}>
        <App />
    </Context.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)
