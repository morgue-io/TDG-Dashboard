import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentBar from './contentDivBar';
import '../styles/form-view.css';
import '../styles/content-div.css';
import { useNavigate } from 'react-router-dom';

function Employees() {
  const navigate = useNavigate();
  const [adminsDataState, setAdminsDataState] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState();

  const getNewToken = async () => {
    var res;
    try {
      console.log('getting new token')
      res = await axios({
        url: 'https://tdg-api.onrender.com/api/v1/adm/token',
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

  const reload = async () => {
    try {
      setIsLoadingState(true);
      const req = {
        url: 'https://tdg-api.onrender.com/api/v1/adm/admins',
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      };

      var res;
      try {
        res = await axios(req);
      } catch (e) {
        console.log(e);
        if (e.response.status === 400) {
          await getNewToken();
          req.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
          res = await axios(req);
        }
      }

      setIsLoadingState(false);
      setAdminsDataState(res.data.payload);
    } catch (e) {
      alert("Couldn't refresh list :(");
    }
  };

  const deleteItem = async (id, email) => {
    try {
      if (window.confirm('Are you sure you want to delete this item from the database?')) {
        var req = {
          url: `https://tdg-api.onrender.com/api/v1/adm/deregister?id=${id}&email=${email}`,
          method: 'post',
          data: {
            sudo: require('buffer').Buffer.from(window.prompt('Enter superuser token'), 'utf8').toString('hex')
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        };
        try {
          await axios(req);
        } catch (e) {
          console.log(e);
          if (e.response.status === 400) {
            await getNewToken();
            req.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
            await axios(req);
          }
        }
        reload();
      }
    } catch (e) {
      console.log(e);
      alert('Deletion failed :(');
    }
  };

  const [newFormDataState, setNewFormDataState] = useState({});
  const [newFormViewState, setNewFormViewState] = useState(false);

  const handleNewFormChange = (event) => {
    setNewFormDataState({
      ...newFormDataState,
      [event.target.name]: event.target.value
    });
  };

  const newFormSave = async () => {
    try {
      console.log(newFormDataState);
      const req = {
        url: `https://tdg-api.onrender.com/api/v1/adm/register`,
        method: 'post',
        data: {
          ...newFormDataState,
          password: require('buffer').Buffer.from(newFormDataState.password, 'utf8').toString('hex'),
          sudo: require('buffer').Buffer.from(newFormDataState.sudo, 'utf8').toString('hex')
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      };

      try {
        await axios(req);
      } catch (e) {
        if (e.response.status === 400) {
          await getNewToken();
          req.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
          await axios(req);
        }
      }

      reload();
    } catch (e) {
      console.error(e)
      alert('Upload failed :(');
    }
  };

  var newFormViewDiv = <>
    <div id='form-root'>
      <div id='form-sub-root'>
        <div id='all-treks-form-flex'>
          <div style={{ position: 'absolute', top: '0px', right: '0px' }}><button className='db-button button-cancel' style={{ width: '8px' }} onClick={() => { setNewFormViewState(false); }}><b>X</b></button></div>
          <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Administrator</b> form view:</span></div>
          <br />
          <form>
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Name</span></div>
            <input type='text' onChange={handleNewFormChange} name='name' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Email</span></div>
            <input type='text' onChange={handleNewFormChange} name='email' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Password</span></div>
            <input type='text' onChange={handleNewFormChange} name='password' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Phone</span></div>
            <input type='text' name='phone' onChange={handleNewFormChange} style={{ width: '100%', marginTop: '3px', height: '20px', resize: 'vertical', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ color: 'red', fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '800' }}>Superuser token</span></div>
            <input type='text' name='sudo' onChange={handleNewFormChange} style={{ width: '100%', marginTop: '3px', height: '20px', resize: 'vertical', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div><button className='db-button button-cancel' onClick={() => { setNewFormViewState(false); setNewFormDataState({}); }}><b>Cancel</b></button></div>
              <div style={{ flex: '1 1 auto' }} />
              <div><button className='db-button button-update' onClick={() => { newFormSave(); setNewFormViewState(false); }}><b>Save</b></button></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;

  useEffect(() => {
    const adjustContentDivWidth = () => {
      // set panel and content div widths
      const x = document.getElementById('content-div-bar');
      const y = document.getElementById('db-box');
      const sidePanelWidth = parseInt(
        window.getComputedStyle(document.getElementById('side-panel'), null)['width']
          .replace('px', '')
      );

      const contentBarHeight = () => parseInt(
        window.getComputedStyle(document.getElementById('content-div-bar'), null)['height']
          .replace('px', '')
      );
      x.style.width = `${window.innerWidth - sidePanelWidth - 2 * 40}px`;
      y.style.height = `${window.innerHeight - 120 - contentBarHeight()}px`;
      y.style.marginTop = `${contentBarHeight() + 60}px`
    };
    window.addEventListener('resize', adjustContentDivWidth);
    // initial rendering after DOM Loads
    adjustContentDivWidth();
  }, []);

  useEffect(() => {
    async function deed() {
      setIsLoadingState(true);

      const req = {
        url: 'https://tdg-api.onrender.com/api/v1/adm/admins',
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      };

      var res;
      try {
        res = await axios(req);
      } catch (e) {
        console.log(e);
        if (e.response.status === 400) {
          await getNewToken();
          req.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
          res = await axios(req);
        }
      }
      console.log(res.data.payload)
      setAdminsDataState(res.data.payload);
      setIsLoadingState(false);
    };
    deed();
  }, []);

  return (
    <>
      <div id='content-div-bar'>
        <ContentBar
          title='Administrator Data'
          sub='An enumeration of all administrative staff under TDG'
        />
        <div style={{ position: 'fixed', top: '10px', right: '10px' }}>
          <button className="db-button" onClick={() => setNewFormViewState(true)}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>add</span>&nbsp;<b>New Admin</b></button>
        </div>
      </div>
      <div id='db-box' className='content-font-header-2 content-div-indent' style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', border: '1px solid', borderColor: '#c6c6c6' }}>
        Database Entries: ({isLoadingState ? 'Loading...' : adminsDataState.length})<br /><br />
        {adminsDataState.map((item) => <>
          <div className='item-box'>
            <div className='table'>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Administrator ID:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item._id}</div>
                  </div>
                </div>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Name:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.name}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Email:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.email}</div>
                  </div>
                </div>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Phone:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.phone}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Created:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{new Date(item.createdAt).toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Updated:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{new Date(item.updatedAt).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', minWidth: '800px' }}>
              <div style={{ flex: '1' }} />
              <button className="db-button" onClick={() => deleteItem(item._id, item.email)}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>delete_forever</span>&nbsp;<b>Delete</b></button>
            </div>
          </div>
          <div style={{ height: '30px' }} />
        </>)
        }
        &nbsp;
      </div>
      {newFormViewState ? newFormViewDiv : <> </>}
    </>
  );
}

export default Employees;