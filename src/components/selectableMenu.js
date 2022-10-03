import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SMenuItem from '../components/selectableMenuItem';
import '../styles/selectable-menu.css';

function SelectableMenu(props) {
  const [selectedMenu, setSelectedMenuState] = useState();

  // dashSelectables & dashSelectableItems must describe the same components
  const dashSelectablesList = ['orders-btn', 'employees-btn', 'admins-btn', 'billboard-btn'];
  const dashSelectables = () => <>
    <SMenuItem id='orders-btn' icon='local_mall' label='Orders' isInvoked={selectedMenu === 'orders-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('orders-btn')} />
    <SMenuItem id='employees-btn' icon='badge' label='Employees' isInvoked={selectedMenu === 'employees-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('employees-btn')} />
    <SMenuItem id='admins-btn' icon='admin_panel_settings' label='Administrators' isInvoked={selectedMenu === 'admins-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('admins-btn')} />
    <SMenuItem id='billboard-btn' icon='receipt_long' label='Billboard' isInvoked={selectedMenu === 'billboard-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('billboard-btn')} />
  </>;

  const profSelectablesList = ['ch-pwd-btn'];
  const profSelectables = () => <>
    <SMenuItem id='ch-pwd-btn' icon='lock' label='Change password' isInvoked={selectedMenu === 'ch-pwd-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('ch-pwd-btn')} />
  </>;

  const navigate = useNavigate();
  const [selectableMenuVar, setSelectableMenuVarState] = useState((props.invoked === 'dash-btn') ? dashSelectables : profSelectables);
  useEffect(() => setSelectableMenuVarState((props.invoked === 'dash-btn') ? dashSelectables() : (props.invoked === 'prof-btn') ? profSelectables() : <></>), [props.invoked]);

  const onClickThisBtn = async (thisBtn) => {
    if (dashSelectablesList.includes(thisBtn)) {
      await setSelectableMenuVarState(<>
        <SMenuItem id='orders-btn' icon='local_mall' label='Orders' isInvoked={thisBtn === 'orders-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('orders-btn')} />
        <SMenuItem id='employees-btn' icon='badge' label='Employees' isInvoked={thisBtn === 'employees-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('employees-btn')} />
        <SMenuItem id='admins-btn' icon='admin_panel_settings' label='Administrators' isInvoked={thisBtn === 'admins-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('admins-btn')} />
        <SMenuItem id='billboard-btn' icon='receipt_long' label='Billboard' isInvoked={thisBtn === 'billboard-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('billboard-btn')} />
      </>);
      (thisBtn === 'orders-btn') ?
        (() => { navigate('/dashboard/orders'); setSelectedMenuState('orders-btn') })() :
        (thisBtn === 'employees-btn') ?
          (() => { navigate('/dashboard/employees'); setSelectedMenuState('employees-btn') })() :
          (thisBtn === 'admins-btn') ?
            (() => { navigate('/dashboard/administrators'); setSelectedMenuState('administrators-btn') })() :
            (thisBtn === 'billboard-btn') ?
              (() => { navigate('/dashboard/billboard'); setSelectedMenuState('billboard-btn') })() :
              console.error('invalid button');
    }
    else if (profSelectablesList.includes(thisBtn)) {
      await setSelectableMenuVarState(<>
        <SMenuItem id='ch-pwd-btn' icon='lock' label='Change password' isInvoked={thisBtn === 'ch-pwd-btn' ? 'true' : 'false'} onClickCallback={() => onClickThisBtn('ch-pwd-btn')} />
      </>);
      (thisBtn === 'ch-pwd-btn') ?
        (() => { navigate('/dashboard/profile'); setSelectedMenuState('ch-pwd-btn'); })() :
        console.error('Invalid button: ', thisBtn);
    }
  };

  return (
    <div id='selectable-menu'>
      {selectableMenuVar}
    </div>
  );
}

export default SelectableMenu;