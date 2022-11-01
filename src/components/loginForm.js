import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login-form.css';

function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [invCredState, setInvCredState] = useState(false);
  var invcred = <div className='inv-cred'><b>Invalid credentials!</b></div>;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };


  const onClickLoginBtn = async () => {
    try {
      const req = {
        method: 'post',
        url: 'https://thedhobighat.co.in/api/v1/adm/login',
        data: {
          email: formData.username,
          password: await require('buffer').Buffer.from(formData.password, 'utf8').toString('hex')
        }
      };

      const res = await axios(req);
      if (res.status === 200) {
        console.log('Logged in')
        localStorage.setItem('jwt', res.data.jwt);
        localStorage.setItem('jwt_refresh', res.data.jwt_refresh);
        navigate('/dashboard');
      }
    } catch (e) {
      console.log(e);
      setInvCredState(true);
    }
  };

  return (
    <div id='login-root-div'>
      <div id='login-form'>
        <div className='login-title'>&lt; Administrator Login &gt;</div>
        <form>
          <input type='text' name='username' onChange={handleChange} placeholder='username' className='text-field' required /> <br /><br />
          <input type='password' name='password' onChange={handleChange} placeholder='password' className='text-field' required /> <br /><br />
        </form>
        {invCredState ? invcred : <></>}
        <button className='button-29' onClick={onClickLoginBtn}><b>Login</b></button>
      </div>
    </div>
  );
}

export default LoginForm;