import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentBar from './contentDivBar';
import '../styles/form-view.css';
import '../styles/content-div.css';
import { useNavigate } from 'react-router-dom';

function Billboard() {
  const navigate = useNavigate();
  const [billboardDataState, setBillboardDataState] = useState([]);
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
        url: 'https://tdg-api.onrender.com/api/v1/adm/billboard',
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
      setBillboardDataState(res.data.payload);
    } catch (e) {
      alert("Couldn't refresh billboard :(");
    }
  };

  const [updateFormDataState, setUpdateFormDataState] = useState({});
  const [updateFormViewState, setUpdateFormViewState] = useState(false); // must be falsed

  const handleUpdateFormalWash = (event) => setUpdateFormDataState({
    ...updateFormDataState,
    formal_wash: {
      ...updateFormDataState.formal_wash,
      [event.target.name]: parseInt(event.target.value)
    }
  });

  const handleUpdateDryWash = (event) => setUpdateFormDataState({
    ...updateFormDataState,
    dry_wash: {
      ...updateFormDataState.dry_wash,
      [event.target.name]: parseInt(event.target.value)
    }
  });

  const handleUpdateSteamIron = (event) => setUpdateFormDataState({
    ...updateFormDataState,
    steam_iron: {
      ...updateFormDataState.steam_iron,
      [event.target.name]: parseInt(event.target.value)
    }
  });

  const updateFormDataSave = async () => {
    try {
      const req = {
        url: `https://tdg-api.onrender.com/api/v1/adm/billboard`,
        method: 'post',
        data: updateFormDataState,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      };

      console.log(req)
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
          <div style={{ textAlign: 'left' }}><span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}><b>Billboard</b> rate view (all values in ₹):</span></div>
          <br />
          <form>

            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>FormalWash.Blazer</span></div>
            <input name='blazer' type='text' onChange={handleUpdateFormalWash} value={item.formal_wash.blazer} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>FormalWash.ShirtAndTshirt</span></div>
            <input name='shirt_and_tshirt' type='text' onChange={handleUpdateFormalWash} value={item.formal_wash.shirt_and_tshirt} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>FormalWash.PantAndTrousers</span></div>
            <input name='pant_and_trousers' type='text' onChange={handleUpdateFormalWash} value={item.formal_wash.pant_and_trousers} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>FormalWash.Saree</span></div>
            <input name='saree' type='text' onChange={handleUpdateFormalWash} value={item.formal_wash.saree} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>FormalWash.LadiesUpper</span></div>
            <input name='ladies_upper' type='text' onChange={handleUpdateFormalWash} value={item.formal_wash.ladies_upper} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>FormalWash.LadiesLower</span></div>
            <input name='ladies_lower' type='text' onChange={handleUpdateFormalWash} value={item.formal_wash.ladies_lower} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>FormalWash.ClothsAndOthers</span></div>
            <input name='cloths_and_others' type='text' onChange={handleUpdateFormalWash} value={item.formal_wash.cloths_and_others} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />

            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>DryWash.Blazer</span></div>
            <input name='blazer' type='text' onChange={handleUpdateDryWash} value={item.dry_wash.blazer} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>DryWash.ShirtAndTshirt</span></div>
            <input name='shirt_and_tshirt' type='text' onChange={handleUpdateDryWash} value={item.dry_wash.shirt_and_tshirt} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>DryWash.PantAndTrousers</span></div>
            <input name='pant_and_trousers' type='text' onChange={handleUpdateDryWash} value={item.dry_wash.pant_and_trousers} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>DryWash.Saree</span></div>
            <input name='saree' type='text' onChange={handleUpdateDryWash} value={item.dry_wash.saree} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>DryWash.LadiesUpper</span></div>
            <input name='ladies_upper' type='text' onChange={handleUpdateDryWash} value={item.dry_wash.ladies_upper} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>DryWash.LadiesLower</span></div>
            <input name='ladies_lower' type='text' onChange={handleUpdateDryWash} value={item.dry_wash.ladies_lower} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>DryWash.ClothsAndOthers</span></div>
            <input name='cloths_and_others' type='text' onChange={handleUpdateDryWash} value={item.dry_wash.cloths_and_others} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />

            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>SteamIron.Blazer</span></div>
            <input name='blazer' type='text' onChange={handleUpdateSteamIron} value={item.steam_iron.blazer} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>SteamIron.ShirtAndTshirt</span></div>
            <input name='shirt_and_tshirt' type='text' onChange={handleUpdateSteamIron} value={item.steam_iron.shirt_and_tshirt} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>SteamIron.PantAndTrousers</span></div>
            <input name='pant_and_trousers' type='text' onChange={handleUpdateSteamIron} value={item.steam_iron.pant_and_trousers} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>SteamIron.Saree</span></div>
            <input name='saree' type='text' onChange={handleUpdateSteamIron} value={item.steam_iron.saree} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>SteamIron.LadiesUpper</span></div>
            <input name='ladies_upper' type='text' onChange={handleUpdateSteamIron} value={item.steam_iron.ladies_upper} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>SteamIron.LadiesLower</span></div>
            <input name='ladies_lower' type='text' onChange={handleUpdateSteamIron} value={item.steam_iron.ladies_lower} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />
            <div style={{ textAlign: 'left' }}><span style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: '500' }}>SteamIron.ClothsAndOthers</span></div>
            <input name='cloths_and_others' type='text' onChange={handleUpdateSteamIron} value={item.steam_iron.cloths_and_others} style={{ width: '100%', marginTop: '3px', resize: 'vertical', height: '20px', fontFamily: 'Fira Mono' }} /><br /><br />

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
        url: 'https://tdg-api.onrender.com/api/v1/adm/billboard',
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
      setBillboardDataState(res.data.payload);
      setIsLoadingState(false);
    };
    deed();
  }, []);

  return (
    <>
      <div id='content-div-bar'>
        <ContentBar
          title='Billboard Data'
          sub='An enumeration of all services from TDG and their costs (all values in ₹)'
        />
      </div>
      <div id='db-box' className='content-font-header-2 content-div-indent' style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', border: '1px solid', borderColor: '#c6c6c6' }}>
        Database Entries: ({isLoadingState ? 'Loading...' : billboardDataState.length})<br /><br />
        {billboardDataState.map((item) => <>
          <div className='item-box'>
            <div className='table'>
              <div className='table-row'>
                <div className='table-cell'>
                  <div className='item-box-flex-row-item'>
                    <div className='content-font-header-2'>Billboard&nbsp;&nbsp;</div><br />
                    <div className='content-font-sub-2-mono'>{JSON.stringify(item, null, 4)}</div>
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

export default Billboard;