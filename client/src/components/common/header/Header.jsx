import React from 'react';
import './Header.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userImg from './user-image.png'

export default function Header(props) {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [data, setData] = useState({jwtToken: false});

  
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem('data'));
    if(!userData){
      userData = {jwtToken : false};
    }
    setData(userData);
    setName(userData.name);
  }, [])

  return (
    <div className='headerBlock'>
      <h2>Jobfinder</h2>
      <div className='navItemsWrapper'>
        { !data.jwtToken ? 
            <>
            <button onClick={() => {navigate('./login')}} className='loginButton' >Login</button>
            <button onClick={() => {navigate('./register')}} className='registerButton'>Register</button>
            </>
          :
            <>
              <span className='logoutButton' onClick={() => {localStorage.removeItem('data');  navigate('/')}}>Logout</span>
              <span className='userName'>Hello {name}</span>
              <img className='userImage' src={userImg} alt='use icon' />
            </>
        }
      </div>
    </div>
  )
}
