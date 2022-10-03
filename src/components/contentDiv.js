import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Employees from '../components/employees';
import Orders from '../components/orders';
import Admins from '../components/admins';
import Billboard from '../components/billboard';
import Profile from '../components/adminProfile';
import '../styles/content-div.css';

function ContentDiv() {
  useEffect(() => {
    const adjustContentDivWidth = () => {
      // set panel and content div widths
      const w = document.getElementById('main-content-div');
      const sidePanelWidth = parseInt(
        window.getComputedStyle(document.getElementById('side-panel'), null)['width']
          .replace('px', '')
      );
      w.style.height = `${window.innerHeight}px`;
      w.style.width = `${window.innerWidth - sidePanelWidth}px`;
    };
    window.addEventListener('resize', adjustContentDivWidth);
    // initial rendering after DOM Loads
    setTimeout(() => {
      adjustContentDivWidth();
    }, 1);
  }, []);

  return (
    <div id='main-content-div'>
      <Routes>
        <Route path='/orders' element={<Orders />} />
        <Route path='/employees' element={<Employees />} />
        <Route path='/administrators' element={<Admins />} />
        <Route path='/billboard' element={<Billboard />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
}

export default ContentDiv;
