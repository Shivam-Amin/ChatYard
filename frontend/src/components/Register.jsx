import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import '../CSS/auth.css';
import axios from 'axios';
import { Context, server } from '../main';
import toast from 'react-hot-toast';

const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {isAuth, setIsAuth, loading, setLoading} = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${server}/users/newUser`, {
        name,
        email,
        password
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      toast.success(data.message)
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuth(false);
      setLoading(false);
    }
  }

  if (isAuth) return <Navigate to={'/'} />
  
  return (
    <div className="box box-signup">
      <div className="box__form">
        <form onSubmit={handleSubmit}>
          <h2 className="form__h2">Sign up </h2>

          <div className="form__inputBox">
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              type="text" 
              id="username" 
              autoComplete="on" 
              required 
              autoFocus />
            <label htmlFor="username">Username</label>
            <i></i>
          </div> 

          <div className="form__inputBox">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              type="text" 
              id="email" 
              autoComplete="on" 
              required />
            <label htmlFor="email">Email</label>
            <i></i>
          </div> 

          <div className="form__inputBox">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              id="password" 
              required />
            <label htmlFor="password">Password</label>
            <i></i>
          </div>
          
          <div className="form__links-signup">
            <Link to="/"> Login </Link>
          </div>
          
          <button disabled={loading} type="submit"> Signup </button>
        </form>
      </div>
    </div>
  )
}

export default Signup;