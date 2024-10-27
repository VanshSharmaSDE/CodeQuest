import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Dashboards/Dashboard.css';
import THome from './teacherHome/tHome';
import TCC from './teacherCC/tCC'
import TRR from './teacherRR/tRR'
import TSC from './teacherSC/tSC'
import TeacherModal from './TeacherModal'
import Menu from '../../../utilities/Hamburgers/menu'
import ConfirmPopup from '../../../utilities/Popups/ConfirmPopup';
import { toast } from 'react-toastify'
import TWN from './teacherWN/TWN';
import Loader from '../../../utilities/Loader/Loader';
import KITPS from '../../../assets/KITPS.png'

function T_D2() {
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const [active, setActive] = useState(true);
  const notifyA = (e) => toast.error(e)
  const [menu, setMene] = useState(true)
  const [home, setHome] = useState(true);
  const [CC, setCC] = useState(false);
  const [RR, setRR] = useState(false);
  const [LC, setLC] = useState(false);
  const [WN, setWN] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [teacherData, settecherData] = useState({});
  const [userImage, setUserImage] = useState(' ');

  const handlemenu = () => {
    setMene(!menu);
  }

  const handleH1 = () => {
    setHome(true);
    setCC(false);
    setRR(false);
    setLC(false);
    setMene(!menu)
    setWN(false)

  }

  const handleH2 = () => {
    setHome(false);
    setCC(true);
    setRR(false);
    setLC(false);
    setMene(!menu)
    setWN(false)
  }

  const handleH3 = () => {
    setHome(false);
    setCC(false);
    setRR(true);
    setLC(false);
    setMene(!menu)
    setWN(false)
  }

  const handleH4 = () => {
    setHome(false);
    setCC(false);
    setRR(false);
    setLC(true);
    setMene(!menu)
    setWN(false)

  }

  const handleH5 = () => {
    setHome(false);
    setCC(false);
    setRR(false);
    setLC(false);
    setMene(!menu)
    setWN(true)

  }

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const savedTheme = localStorage.getItem('dark-mode') === 'true';
  const [dark, setDark] = useState(savedTheme);
  const toggleDarkMode = () => {
    setDark(prevMode => {
      localStorage.setItem('dark-mode', !prevMode); // Save new preference
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

  const navigate = useNavigate();

  const handelLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    notifyA("Logout successfully")
  }

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      setShowLoading(true)
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const id = user ? user.id : null;
        if (!id) {
          alert("User is not logged in");
          return;
        }
        const response = await fetch(`${apiUrl}/api/getteacher/${id}`);
        const data = await response.json();
        if (response.ok) {
          setShowLoading(false)
          if (data.image) {
            setUserImage(data.image)
          } else {
            setUserImage(user)
          }
          settecherData(data)
        } else {
          setShowLoading(false)
        }
      } catch (error) {
        setShowLoading(false)
      }
    };
    fetchTeacherDetails();
  }, []);

  return (
    <div className="D-main">
      {showLoading ? <Loader content={"Wait While Loading !"}></Loader> : <>
        <div className="menu-button-dashboard" onClick={handlemenu}>
          <Menu isOpen={!menu}></Menu>
        </div>
        <div className={menu ? "D-sidebar" : "D-sidebar D-sidebar-responsive"}>
          <h2><span>CQ</span>DASHBOARD</h2>
          <div className="D-profile">
            <div className="D-profile-image">
              <img src={userImage} alt="" />
            </div>
            <h4>{teacherData.name}</h4>
            <div className="D-edit-profile">
              <i class="ri-edit-line" onClick={handleShowModal}></i>
              {showModal && <TeacherModal onClose={handleCloseModal} />}
            </div>
          </div>
          <div className="D-sidebar-navigation">
            <h3 className={active === home ? "active" : ""} onClick={handleH1}>Dashboard <i class="ri-arrow-right-s-line"></i></h3>
            <h3 className={active === CC ? "active" : ""} onClick={handleH2}>Create Comp..  <i class="ri-arrow-right-s-line"></i></h3>
            <h3 className={active === LC ? "active" : ""} onClick={handleH4}>Saved Comp..<i class="ri-arrow-right-s-line"></i></h3>
            <h3 className={active === RR ? "active" : ""} onClick={handleH3}>Result<i class="ri-arrow-right-s-line"></i></h3>
            <h3 className={active === WN ? "active" : ""} onClick={handleH5}>Winners<i class="ri-arrow-right-s-line"></i></h3>
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
            {home && <THome></THome>}
            {CC && <TCC></TCC>}
            {RR && <TRR teacherId={teacherData.id}></TRR>}
            {LC && <TSC></TSC>}
            {WN && <TWN></TWN>}
          </div>
        </div>
      </>}
    </div>
  );
}

export default T_D2;
