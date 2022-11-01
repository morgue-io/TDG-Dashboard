import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentBar from './contentDivBar';
import '../styles/form-view.css';
import '../styles/content-div.css';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const navigate = useNavigate();
  const [ordersDataState, setOrdersDataState] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState(false);

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
        url: 'https://tdg-api.onrender.com/api/v1/adm/orders',
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
      setOrdersDataState(res.data.payload);
    } catch (e) {
      alert("Couldn't refresh list :(");
    }
  };

  const [updateFormDataState, setUpdateFormDataState] = useState({});
  const [updateFormViewState, setUpdateFormViewState] = useState(false); // must be falsed

  const handleUpdateFormChange = (event) => {
    if (event.target.name === 'processing_state') {
      const upd = {
        ...updateFormDataState,
        status: {
          ...updateFormDataState.status,
          processing: {
            state: event.target.value === 'TRUE' ? true : false,
            time:
              event.target.value === 'TRUE' ?
                new Date().toLocaleString("en-IN", { timeZone: 'Asia/Kolkata' })
                : null
          }
        }
      };
      setUpdateFormDataState(upd);
      document.getElementById('processing_state_str').value =
        `${upd.status.processing.state} ➜ ${upd.status.processing.time}`
    }
  };

  const updateFormDataSave = async () => {
    try {
      const req = {
        url: `https://tdg-api.onrender.com/api/v1/adm/orders?id=${updateFormDataState._id}`,
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
        <div id='all-orderss-form-flex'>
          <div style={{ position: 'absolute', top: '0px', right: '0px' }}><button className='db-button button-cancel' style={{ width: '8px' }} onClick={() => { setUpdateFormViewState(false); }}><b>X</b></button></div>
          <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Orders</b> form view:</span></div>
          <br />
          <form>
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Order ID</span></div>
            <input type='text' value={item._id} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Customer ID</span></div>
            <input type='text' value={item.customer_id} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Customer name</span></div>
            <input type='text' value={item.customer_name} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Customer phone</span></div>
            <input type='text' value={item.phone} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Customer address</span></div>
            <textarea style={{ width: '100%', marginTop: '3px', resize: 'vertical', minHeight: '50px', fontFamily: 'Fira Mono' }} defaultValue={item.address} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Order bill</span></div>
            <input type='text' value={item.bill} name='customer' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Todo</span></div>
            <textarea name='todo' style={{ width: '100%', minHeight: '200px', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} defaultValue={JSON.stringify(item.todo, null, 4)} disabled /><br /><br />



            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Order Status: Acceptance [State ➜ Timestamp]</span></div>
            <input type='text' style={{ width: '100%', marginTop: '3px', height: '20px', fontFamily: 'Fira Mono' }} defaultValue={`${item.status.accepted.state} ➜ ${item.status.accepted.time}`} disabled /><br /><br />

            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Order Status: Pick-up [State ➜ (Employee ID) ➜ Employee Name ➜ Timestamp]</span></div>
            <input type='text' style={{ width: '100%', marginTop: '3px', height: '20px', fontFamily: 'Fira Mono' }} defaultValue={`${item.status.picked_up.state} ➜ (${item.status.picked_up.assignee_id}) ➜ ${item.status.picked_up.assignee_name} ➜ ${item.status.picked_up.time}`} disabled /><br /><br />

            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Order Status: Processing [State ➜ Timestamp]</span></div>
            <input type='text' id='processing_state_str' style={{ width: '100%', marginTop: '3px', height: '20px', fontFamily: 'Fira Mono' }} defaultValue={`${item.status.processing.state} ➜ ${item.status.processing.time}`} disabled />
            <select name='processing_state' value={item.status.processing.state ? `TRUE ${item.status.processing.time}` : 'FALSE'} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '25px', fontFamily: 'Fira Mono' }} onChange={handleUpdateFormChange}>
              <option value='TRUE' style={{ color: 'green', fontWeight: '700' }}>TRUE</option>
              <option value='FALSE' style={{ color: 'red', fontWeight: '700' }}>FALSE</option>
            </select>
            <br /><br />

            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Order Status: Delivery [State ➜ (Employee ID) ➜ Employee Name ➜ Timestamp]</span></div>
            <input type='text' style={{ width: '100%', marginTop: '3px', height: '20px', fontFamily: 'Fira Mono' }} defaultValue={`${item.status.delivered.state} ➜ (${item.status.delivered.assignee_id}) ➜ ${item.status.delivered.assignee_name} ➜ ${item.status.delivered.time}`} disabled /><br /><br />




            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div><button className='db-button button-cancel' onClick={() => { setUpdateFormViewState(false); setUpdateFormDataState({}); }}><b>Cancel</b></button></div>
              <div style={{ flex: '1 1 auto' }} />
              <div><button type='button' className='db-button button-update' onClick={async () => { updateFormDataSave(); setUpdateFormViewState(false); }}><b>Save</b></button></div>
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
        url: 'https://tdg-api.onrender.com/api/v1/adm/orders',
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

      setOrdersDataState(res.data.payload);
      setIsLoadingState(false);
    };
    deed();
  }, []);

  return (
    <>
      <div id='content-div-bar'>
        <ContentBar
          title='Orders'
          sub='An enumeration of all orders from customers'
        />
      </div>
      <div id='db-box' className='content-font-header-2 content-div-indent' style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', border: '1px solid', borderColor: '#c6c6c6' }}>
        Database Entries: ({isLoadingState ? 'Loading...' : ordersDataState.length})<br /><br />
        {ordersDataState.map((item) => <>
          <div key={item._id} className='item-box'>
            <div className='table'>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Order ID:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item._id}</div>
                  </div>
                </div>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Customer ID:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.customer_id}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='table'>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Timestamp:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.status.accepted.time}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Customer Name:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.customer_name}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Customer Phone:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.phone}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Address:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.address}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Bill:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.bill}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Todo:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{JSON.stringify(item.todo, null, 2)}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Status:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{JSON.stringify(item.status, null, 2)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', minWidth: '800px' }}>
              <div style={{ flex: '1' }} />
              <button className="db-button" onClick={() => { setUpdateFormViewState(true); setUpdateFormDataState(item) }}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>edit_note</span>&nbsp;<b>Edit</b></button>
            </div>
          </div>
          <div style={{ height: '30px' }} />
        </>)
        }
        &nbsp;
      </div>
      {updateFormViewState ? updateFormViewDiv(updateFormDataState) : <> </>}
    </>
  );
}

export default Orders;