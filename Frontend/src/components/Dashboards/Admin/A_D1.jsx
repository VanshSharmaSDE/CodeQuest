import React from 'react'
import '../../Dashboards/Dashboard.css';
import { useState, useEffect } from 'react';
import Menu from '../../../utilities/Hamburgers/menu';
import AHome from './adminHome/aHome';
import ACT from './adminCT/aCT';
import ATU from './adminTU/aTU';
import AStatus from './adminStatus/aStatus';
import ASetting from './adminSetting/aSetting';
import ConfirmPopup from '../../../utilities/Popups/ConfirmPopup';
import { useNavigate } from 'react-router-dom';
import KITPS from '../../../assets/KITPS.png'

function A_D1() {

  const navigate = useNavigate();
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [active, setActive] = useState(true);
  const [menu, setMene] = useState(true)
  const [home, setHome] = useState(true);
  const [CT, setCT] = useState(false);
  const [TU, setTU] = useState(false);
  const [status, setStatus] = useState(false);
  const [setting, setSetting] = useState(false);

  const handlemenu = () => {
    setMene(!menu);
  }

  const handleH1 = () => {
    setHome(true);
    setCT(false);
    setTU(false);
    setStatus(false);
    setSetting(false);
  }

  const handleH2 = () => {
    setHome(false);
    setCT(true);
    setTU(false);
    setStatus(false);
    setSetting(false);
  }

  const handleH3 = () => {
    setHome(false);
    setCT(false);
    setTU(true);
    setStatus(false);
    setSetting(false);
  }

  const handleH4 = () => {
    setHome(false);
    setCT(false);
    setTU(false);
    setStatus(true);
    setSetting(false);
  }

  const handleH5 = () => {
    setHome(false);
    setCT(false);
    setTU(false);
    setStatus(false);
    setSetting(true);
  }

  const handelLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    notifyA("Logout successfully")
  }

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  const savedTheme = localStorage.getItem('dark-mode') === 'true';
  const [dark, setDark] = useState(savedTheme);
  const toggleDarkMode = () => {
    setDark(prevMode => {
      localStorage.setItem('dark-mode', !prevMode);
      return !prevMode;
    });
  };

  useEffect(() => {
    if (!dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [dark]);

  return (
    <div className="D-main">
      <div className="menu-button-dashboard" onClick={handlemenu}>
        <Menu isOpen={!menu}></Menu>
      </div>
      <div className={menu ? "D-sidebar" : "D-sidebar D-sidebar-responsive"}>
        <h2><span>CQ</span>DASHBOARD</h2>
        <div className="D-profile">
          <div className="D-profile-image">
            <img src="" alt="" />
          </div>
          <h4>Admin</h4>
          <div className="D-edit-profile">
            <i class="ri-edit-line"></i>
          </div>
        </div>
        <div className="D-sidebar-navigation">
          <h3 className={active === home ? "active" : ""} onClick={handleH1}>Dashboard <i class="ri-arrow-right-s-line"></i></h3>
          <h3 className={active === CT ? "active" : ""} onClick={handleH2}>Add Teacher  <i class="ri-arrow-right-s-line"></i></h3>
          <h3 className={active === status ? "active" : ""} onClick={handleH4}>Saved Comp..<i class="ri-arrow-right-s-line"></i></h3>
          <h3 className={active === TU ? "active" : ""} onClick={handleH3}>Result<i class="ri-arrow-right-s-line"></i></h3>
          <h3 className={active === setting ? "active" : ""} onClick={handleH5}>Winners<i class="ri-arrow-right-s-line"></i></h3>
        </div>
      </div>

      <div className="D-dashboard">
        <div className="D-dashboard-navbar">
          <h2><span>CQ</span>DASHBOARD</h2>
          <div className="D-dashboard-navbar-searcbar">
              <img src={KITPS} alt="" />
              <h1>A KITPS Initiative</h1>
            </div>
          <div className="D-dashboard-navbar-NandD">
            <i class="ri-home-5-line" onClick={() => navigate('/')}></i>
            <i class={dark ? "ri-moon-line" : "ri-sun-line"} onClick={toggleDarkMode}></i>
            <i class="ri-logout-circle-r-line" onClick={() => setShowConfirmPopup(true)}></i>
            {showConfirmPopup && <ConfirmPopup message="Are you sure?" onConfirm={handelLogout} onCancel={handleCancel} />}
          </div>
        </div>
        <div className="D-dashboard-content">
          {home && <AHome></AHome>}
          {CT && <ACT></ACT>}
          {TU && <ATU></ATU>}
          {status && <AStatus></AStatus>}
          {setting && <ASetting></ASetting>}
        </div>
      </div>

    </div>
  )
}

export default A_D1;