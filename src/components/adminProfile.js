import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/form-view.css';
import '../styles/content-div.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  const getNewToken = async () => {
    var res;
    try {
      console.log('getting new token')
      res = await axios({
        url: 'https://thedhobighat.co.in/api/v1/adm/token',
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_refresh')}`
        }
      });
    } catch (e) {
      if (e.response.status === 500) {
        alert('Session timed out. Login again to continue.');
        return navigate('/');
      }
    }
    localStorage.setItem('jwt', res.data.jwt);
    localStorage.setItem('jwt_refresh', res.data.jwt_refresh);
    console.log('got new token');
  };

  const [updateFormDataState, setUpdateFormDataState] = useState({});

  const handleUpdateFormChange = (event) => setUpdateFormDataState({
    ...updateFormDataState,
    [event.target.name]: require('buffer').Buffer.from(event.target.value, 'utf8').toString('hex')
  });

  const updateFormDataSave = async () => {
    try {
      const req = {
        url: `https://thedhobighat.co.in/api/v1/adm/change-credentials`,
        method: 'post',
        data: updateFormDataState,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      };

      console.log(req)
      try {
        await axios(req);
        alert('Password changed');
        navigate('/dashboard');
      } catch (e) {
        if (e.response.status === 400) {
          await getNewToken();
          req.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
          await axios(req);
        } else if (e.response.status === 401) {
          alert('Wrong password');
        }
      }
    } catch {
      alert('Update failed :(');
    }
  };

  useEffect(() => {
    const adjustContentDivWidth = () => {
      // set panel and content div widths
      const y = document.getElementById('db-box');
      y.style.height = `${window.innerHeight - 120}px`;
      y.style.marginTop = `${60}px`
    };
    window.addEventListener('resize', adjustContentDivWidth);
    // initial rendering after DOM Loads
    adjustContentDivWidth();
  }, []);

  return (
    <>
      <div id='db-box' className='content-font-header-2 content-div-indent' style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', border: '1px solid', borderColor: '#c6c6c6' }}></div>
      <div id='form-root'>
        <div id='form-sub-root'>
          <div id='all-treks-form-flex'>
            <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Credentials</b> form view:</span></div>
            <br />
            <form>
              <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>New password</span></div>
              <input type='text' onChange={handleUpdateFormChange} name='new_password' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
              <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Current password</span></div>
              <input type='password' onChange={handleUpdateFormChange} name='password' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: '1 1 auto' }} />
                <div><button className='db-button button-update' onClick={(e) => { e.preventDefault(); updateFormDataSave(); }}><b>Save</b></button></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;