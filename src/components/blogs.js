import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentBar from './contentDivBar';
import '../styles/form-view.css';
import '../styles/content-div.css';

function Blogs(props) {
  const [trekDataState, setTrekDataState] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState();

  const reload = async () => {
    setIsLoadingState(true);
    const res = await axios({
      url: 'https://himalyan-explorations.herokuapp.com/api/blogList',
      method: 'get'
    });
    setIsLoadingState(false);
    setTrekDataState(res.data);
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item from the database?')) {
      await fetch(`https://himalyan-explorations.herokuapp.com/api/blogDelete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      reload();
    }
  };

  const [newFormState, setNewFormState] = useState({});
  const [updateFormState, setUpdateFormState] = useState({});
  const [newFormViewState, setNewFormViewState] = useState(false);
  const [updateFormViewState, setUpdateFormViewState] = useState(false); // must be falsed */

  const handleUpdateFormChange = (event) => {
    setUpdateFormState({
      ...updateFormState,
      [event.target.name]: event.target.value
    });
  };

  const updateFormSave = async () => {
    try {
      await axios({
        url: `https://himalyan-explorations.herokuapp.com/api/updateBlog/${updateFormState.id}`,
        method: 'put',
        data: updateFormState,
        headers: {
          'Content-Type': 'application/json'
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
        <div id='all-treks-form-flex'>
          <div style={{ position: 'absolute', top: '0px', right: '0px' }}><button className='db-button button-cancel' style={{ width: '8px' }} onClick={() => { setUpdateFormViewState(false); }}><b>X</b></button></div>
          <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Blogs</b> form view:</span></div>
          <br />
          <form>
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>ID</span></div>
            <input type='text' onChange={handleUpdateFormChange} name='id' value={item.id} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} disabled /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Blog title</span></div>
            <input type='text' onChange={handleUpdateFormChange} value={item.title} name='title' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Date</span></div>
            <input type='text' onChange={handleUpdateFormChange} value={item.date} name='date' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Banner image</span></div>
            <input type='text' onChange={handleUpdateFormChange} value={item.banner} name='banner' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Description</span></div>
            <textarea name='desp' onChange={handleUpdateFormChange} value={item.desp} style={{ width: '100%', marginTop: '3px', resize: 'vertical', minHeight: '200px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div><button className='db-button button-cancel' onClick={() => { setUpdateFormViewState(false); setUpdateFormState(item); }}><b>Cancel</b></button></div>
              <div style={{ flex: '1 1 auto' }} />
              <div><button className='db-button button-update' onClick={() => { updateFormSave(); setUpdateFormViewState(false); reload(); }}><b>Save</b></button></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;

  const handleNewFormChange = (event) => {
    setNewFormState({
      ...newFormState,
      [event.target.name]: event.target.value
    });
  };

  const newFormSave = async () => {
    const form = new FormData();
    for (const key in newFormState)
      form.append(key, newFormState[key]);

    await axios({
      url: 'https://himalyan-explorations.herokuapp.com/api/blogForm',
      method: 'post',
      data: form
    });
    reload();
  };

  var newFormViewDiv = <>
    <div id='form-root'>
      <div id='form-sub-root'>
        <div id='all-treks-form-flex'>
          <div style={{ position: 'absolute', top: '0px', right: '0px' }}><button className='db-button button-cancel' style={{ width: '8px' }} onClick={() => { setNewFormViewState(false); }}><b>X</b></button></div>
          <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Blogs</b> form view:</span></div>
          <br />
          <form>
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Blog title</span></div>
            <input type='text' onChange={handleNewFormChange} name='title' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Date</span></div>
            <input type='text' onChange={handleNewFormChange} name='date' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Banner image</span></div>
            <input type='text' onChange={handleNewFormChange} name='banner' style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>Description</span></div>
            <textarea name='desp' onChange={handleNewFormChange} style={{ width: '100%', marginTop: '3px', resize: 'vertical', minHeight: '200px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div><button className='db-button button-cancel' onClick={() => { setNewFormViewState(false); setNewFormState({}); }}><b>Cancel</b></button></div>
              <div style={{ flex: '1 1 auto' }} />
              <div><button className='db-button button-update' onClick={() => { newFormSave(); setNewFormViewState(false); reload(); }}><b>Save</b></button></div>
            </div>
          </form>
        </div>
      </div>
    </div >
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
        url: 'https://himalyan-explorations.herokuapp.com/api/blogList',
        method: 'get'
      });
      setTrekDataState(res.data);
      setIsLoadingState(false);
    })();
  }, []);

  return (
    <>
      <div id='content-div-bar'>
        <ContentBar
          title='Blogs'
          sub='An enumeration of all blog posts listed in the website.'
        />
        <div style={{ position: 'fixed', top: '10px', right: '10px' }}>
          <button className="db-button" onClick={() => setNewFormViewState(true)}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>add</span>&nbsp;<b>New Blog</b></button>
        </div>
      </div>
      <div id='db-box' className='content-font-header-2 content-div-indent' style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', border: '1px solid', borderColor: '#c6c6c6' }}>
        Database Entries: ({isLoadingState ? 'Loading...' : trekDataState.length})<br /><br />
        {trekDataState.map((item) => <>
          <div className='item-box'>
            <div className='table'>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>ID:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.id}</div>
                  </div>
                </div>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Blog Title:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.title}</div>
                  </div>
                </div>
              </div>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Date:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.date}</div>
                  </div>
                </div>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Banner Image:&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.banner}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='table'>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Description:&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <div className='content-font-sub-2-mono'>{item.desp}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', minWidth: '800px' }}>
              <div style={{ flex: '1' }} />
              <button className="db-button" onClick={() => { setUpdateFormViewState(true); setUpdateFormState(item) }}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>edit_note</span>&nbsp;<b>Edit</b></button>
              <button className="db-button" onClick={() => deleteItem(item.id)}><span className='material-symbols-outlined' style={{ fontSize: '20px' }}>delete_forever</span>&nbsp;<b>Delete</b></button>
            </div>
          </div>
          <div style={{ height: '30px' }} />
        </>)
        }
        &nbsp;
      </div>
      {updateFormViewState ? updateFormViewDiv(updateFormState) : <> </>}
      {newFormViewState ? newFormViewDiv : <> </>}
    </>
  );
}

export default Blogs;