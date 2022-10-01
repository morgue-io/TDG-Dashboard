import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentBar from './contentDivBar';
import '../styles/form-view.css';
import '../styles/content-div.css';

function Orders() {
  const [ordersDataState, setOrdersDataState] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState();

  const reload = async () => {
    setIsLoadingState(true);
    const res = await axios({
      url: 'http://localhost:4000/api/v1/adm/orders',
      method: 'get',
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM3OTU0ZTE3NWZhYzkzNmVkODI0NjgiLCJlbWFpbCI6IjY4QDY4LjY4IiwiaWF0IjoxNjY0NjA0OTM1LCJleHAiOjE2NjU1MDQ5MzV9.uxbKJtimisSMyyMPooSs9Z2kGtlr_lw2rBEJ5YS8X0g"
      }
    });
    console.log(res)
    setIsLoadingState(false);
    setOrdersDataState(res.data.payload);
  };

  const [updateFormDataState, setUpdateFormDataState] = useState({});
  const [updateFormViewState, setUpdateFormViewState] = useState(false); // must be falsed

  function isValidJSON(text) {
    try {
      const x = JSON.parse(text);
      return x;
    } catch {
      return false;
    }
  }

  const handleUpdateFormChange = (event) => {
    if (event.target.name === 'status') {
      if (isValidJSON(event.target.value))
        setUpdateFormDataState({
          ...updateFormDataState,
          [event.target.name]: isValidJSON(event.target.value)
        });
    } else {
      setUpdateFormDataState({
        ...updateFormDataState,
        [event.target.name]: event.target.value
      });
    }

  };

  const updateFormSave = async () => {
    try {
      await axios({
        url: `http://localhost:4000/api/v1/adm/orders?id=${updateFormDataState._id}`,
        method: 'post',
        data: updateFormDataState,
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM3OTU0ZTE3NWZhYzkzNmVkODI0NjgiLCJlbWFpbCI6IjY4QDY4LjY4IiwiaWF0IjoxNjY0NjA0OTM1LCJleHAiOjE2NjU1MDQ5MzV9.uxbKJtimisSMyyMPooSs9Z2kGtlr_lw2rBEJ5YS8X0g"
        }
      });
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
          <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Blogs</b> form view:</span></div>
          <br />
          <form>
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Order ID</span></div>
            <input type='text' onChange={handleUpdateFormChange} name='_id' value={item._id} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Customer ID</span></div>
            <input type='text' onChange={handleUpdateFormChange} value={item.customer} name='customer' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Customer address</span></div>
            <textarea name='address' onChange={handleUpdateFormChange} style={{ width: '100%', marginTop: '3px', resize: 'vertical', minHeight: '50px', fontFamily: 'Fira Mono' }} disabled>{item.address}</textarea><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Todo</span></div>
            <textarea onChange={handleUpdateFormChange} name='todo' style={{ width: '100%', minHeight: '200px', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled>{JSON.stringify(item.todo, null, 4)}</textarea><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Order status</span></div>
            <textarea onChange={handleUpdateFormChange} name='status' style={{ width: '100%', minHeight: '200px', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }}>{JSON.stringify(item.status, null, 4)}</textarea><br /><br />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div><button className='db-button button-cancel' onClick={() => { setUpdateFormViewState(false); setUpdateFormDataState({}); }}><b>Cancel</b></button></div>
              <div style={{ flex: '1 1 auto' }} />
              <div><button className='db-button button-update' onClick={async () => { await updateFormSave(); setUpdateFormViewState(false); setUpdateFormDataState({}); }}><b>Save</b></button></div>
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

      const contentBarHeight = parseInt(
        window.getComputedStyle(document.getElementById('content-div-bar'), null)['height']
          .replace('px', '')
      );
      x.style.width = `${window.innerWidth - sidePanelWidth - 2 * 40}px`;
      y.style.height = `${window.innerHeight - 120 - contentBarHeight}px`;
      y.style.marginTop = `${contentBarHeight + 60}px`
    };
    window.addEventListener('resize', adjustContentDivWidth);
    // initial rendering after DOM Loads
    adjustContentDivWidth();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoadingState(true);
      const res = await axios({
        url: 'http://localhost:4000/api/v1/adm/orders',
        method: 'get',
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM3OTU0ZTE3NWZhYzkzNmVkODI0NjgiLCJlbWFpbCI6IjY4QDY4LjY4IiwiaWF0IjoxNjY0NjA0OTM1LCJleHAiOjE2NjU1MDQ5MzV9.uxbKJtimisSMyyMPooSs9Z2kGtlr_lw2rBEJ5YS8X0g"
        }
      });
      console.log(res.data.payload)
      setOrdersDataState(res.data.payload);
      setIsLoadingState(false);
    })();
  }, []);

  return (
    <>
      <div id='content-div-bar'>
        <ContentBar
          title='Orders'
          sub='An enumeration of all orders from customers'
        />
      </div>
      <div id='db-box' className='content-font-header-2 content-div-indent' style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', borders: '1px solid', bordersColor: '#c6c6c6' }}>
        Database Entries: ({isLoadingState ? 'Loading...' : ordersDataState.length})<br /><br />
        {ordersDataState.map((item) => <>
          <div className='item-box'>
            <div className='table'>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>ID:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item._id}</div>
                  </div>
                </div>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Customer ID:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.customer}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='table'>
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