import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentBar from './contentDivBar';
import '../styles/form-view.css';
import '../styles/content-div.css';
import { useNavigate } from 'react-router-dom';

function Employees() {
  const navigate = useNavigate();
  const [employeesDataState, setEmployeesDataState] = useState([]);
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
        url: 'https://tdg-api.onrender.com/api/v1/adm/employee-view',
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
      setEmployeesDataState(res.data.payload);
    } catch (e) {
      alert("Couldn't refresh list :(");
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item from the database?')) {
      var req = {
        url: `https://tdg-api.onrender.com/api/v1/adm/employee-view?id=${id}`,
        method: 'delete',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      };
      try {
        await axios(req);
        console.log('deleted?')
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
  };

  const [newFormDataState, setNewFormDataState] = useState({});
  const [updateFormDataState, setUpdateFormDataState] = useState({});
  const [newFormViewState, setNewFormViewState] = useState(false);
  const [updateFormViewState, setUpdateFormViewState] = useState(false); // must be falsed */

  const handleUpdateFormChange = (event) => {
    if (event.target.name !== 'is_activated')
      setUpdateFormDataState({
        ...updateFormDataState,
        [event.target.name]: event.target.value
      });
    else {
      setUpdateFormDataState({
        ...updateFormDataState,
        meta: {
          ...updateFormDataState.meta,
          is_activated: (event.target.value === 'TRUE') ? true : false
        }
      });
    }
  };

  const updateFormDataSave = async () => {
    try {
      const req = {
        url: `https://tdg-api.onrender.com/api/v1/adm/employee-view?id=${updateFormDataState._id}`,
        method: 'post',
        data: updateFormDataState,
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
    } catch {
      alert('Update failed :(');
    }
  };

  var updateFormViewDiv = (item) => <>
    <div id='form-root'>
      <div id='form-sub-root'>
        <div id='all-treks-form-flex'>
          <div style={{ position: 'absolute', top: '0px', right: '0px' }}><button className='db-button button-cancel' style={{ width: '8px' }} onClick={() => { setUpdateFormViewState(false); }}><b>X</b></button></div>
          <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Employee</b> form view:</span></div>
          <br />
          <form>
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }} disabled>Employee ID</span></div>
            <input type='text' onChange={handleUpdateFormChange} name='_id' value={item._id} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Service access</span></div>
            <select name='is_activated' value={item.meta.is_activated ? 'TRUE' : 'FALSE'} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '25px', fontFamily: 'Fira Mono' }} onChange={handleUpdateFormChange}>
              <option value='TRUE' style={{ color: 'green', fontWeight: '700' }}>TRUE</option>
              <option value='FALSE' style={{ color: 'red', fontWeight: '700' }}>FALSE</option>
            </select>
            <br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Name</span></div>
            <input type='text' onChange={handleUpdateFormChange} value={item.name} name='name' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Email</span></div>
            <input type='text' onChange={handleUpdateFormChange} value={item.email} name='email' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Phone</span></div>
            <input name='phone' onChange={handleUpdateFormChange} value={item.phone} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Service history</span></div>
            <textarea onChange={handleUpdateFormChange} name='shipping_history' style={{ width: '100%', minHeight: '200px', marginTop: '3px', resize: 'vertical', fontFamily: 'Fira Mono' }} defaultValue={JSON.stringify(item.service_history, null, 4)} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Login attendance</span></div>
            <textarea onChange={handleUpdateFormChange} name='shipping_history' style={{ width: '100%', minHeight: '200px', marginTop: '3px', resize: 'vertical', fontFamily: 'Fira Mono' }} defaultValue={JSON.stringify(item.attendance, null, 4)} disabled /><br /><br />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div><button className='db-button button-cancel' onClick={() => { setUpdateFormViewState(false); setUpdateFormDataState(item); }}><b>Cancel</b></button></div>
              <div style={{ flex: '1 1 auto' }} />
              <div><button className='db-button button-update' onClick={() => { updateFormDataSave(); setUpdateFormViewState(false); }}><b>Save</b></button></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;

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
        url: `https://tdg-api.onrender.com/api/v1/adm/employee-view`,
        method: 'post',
        data: {
          ...newFormDataState,
          password: require('buffer').Buffer.from(newFormDataState.password, 'utf8').toString('hex')
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
          <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Employee</b> form view:</span></div>
          <br />
          <form>
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Name</span></div>
            <input type='text' onChange={handleNewFormChange} name='name' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Email</span></div>
            <input type='text' onChange={handleNewFormChange} name='email' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Password</span></div>
            <input type='text' onChange={handleNewFormChange} name='password' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Phone</span></div>
            <input name='phone' onChange={handleNewFormChange} style={{ width: '100%', marginTop: '3px', height: '20px', resize: 'vertical', fontFamily: 'Fira Mono' }} /><br /><br />
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
        url: 'https://tdg-api.onrender.com/api/v1/adm/employee-view',
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
      setEmployeesDataState(res.data.payload);
      setIsLoadingState(false);
    };
    deed();
  }, []);

  return (
    <>
      <div id='content-div-bar'>
        <ContentBar
          title='Employee Data'
          sub='An enumeration of all delivery servicemen under TDG'
        />
        <div style={{ position: 'fixed', top: '10px', right: '10px' }}>
          <button className="db-button" onClick={() => setNewFormViewState(true)}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>add</span>&nbsp;<b>New Employee</b></button>
        </div>
      </div>
      <div id='db-box' className='content-font-header-2 content-div-indent' style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', border: '1px solid', borderColor: '#c6c6c6' }}>
        Database Entries: ({isLoadingState ? 'Loading...' : employeesDataState.length})<br /><br />
        {employeesDataState.map((item) => <>
          <div className='item-box'>
            <div className='table'>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Employee ID:&nbsp;&nbsp;</div>
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
              <button className="db-button" onClick={() => { setUpdateFormViewState(true); setUpdateFormDataState(item) }}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>edit_note</span>&nbsp;<b>Edit</b></button>
              <button className="db-button" onClick={() => deleteItem(item._id)}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>delete_forever</span>&nbsp;<b>Delete</b></button>
            </div>
          </div>
          <div style={{ height: '30px' }} />
        </>)
        }
        &nbsp;
      </div>
      {updateFormViewState ? updateFormViewDiv(updateFormDataState) : <> </>}
      {newFormViewState ? newFormViewDiv : <> </>}
    </>
  );
}

export default Employees;