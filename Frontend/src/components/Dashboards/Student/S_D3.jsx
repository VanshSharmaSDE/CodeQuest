import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../../Dashboards/Dashboard.css';
import SHome from './studentHome/sHome';
import SCR from './studentCR/sCR';
import SJC from './studentJC/sJC';
import Menu from '../../../utilities/Hamburgers/menu';
import ConfirmPopup from '../../../utilities/Popups/ConfirmPopup';
import { toast } from 'react-toastify';
import StudentModal from './StudentModal';
import { StudentCompetitionContext } from '../../../context/S_D3_CompetitionContext';
import Loader from '../../../utilities/Loader/Loader'
import KITPS from '../../../assets/KITPS.png'


function S_D3() {

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const notifyA = (e) => toast.error(e);
  const [home, setHome] = useState(true);
  const [JC, setJC] = useState(false);
  const [CR, setCR] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [menu, setMene] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [userImage, setUserImage] = useState('');
  const {studentData, setStudentData} = useContext(StudentCompetitionContext);

  const handleH1 = () => {
    setHome(true);
    setJC(false);
    setCR(false);
    setMene(!menu)
  }

  const handleH2 = () => {
    setHome(false);
    setJC(true);
    setCR(false);
    setMene(!menu)
  }

  const handleH3 = () => {
    setHome(false);
    setJC(false);
    setCR(true);
    setMene(!menu)
  }

  const handlemenu = () => {
    setMene(!menu)
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
    const fetchStudentDetails = async () => {
      try {
        setShowLoading(true)
        const user = JSON.parse(localStorage.getItem('user'));
        const id = user ? user.id : null;
        if (!id) {
          alert("User is not logged in");
          return;
        }
        const response = await fetch(`${apiUrl}/api/getstudent/${id}`);
        const data = await response.json();
        if (response.ok) {
          setShowLoading(false)
          setUserImage(data.image)
          setStudentData(data)
        } else {
          setShowLoading(false)
        }
      } catch (error) {
        setShowLoading(false)
      }
    };
    fetchStudentDetails();
  }, []);

  return (
    <div className="D-main">

      {showLoading ? <Loader content={"Wait While Fetching Data"}></Loader> : <>
        <div className="menu-button-dashboard" onClick={handlemenu}>
          <Menu isOpen={!menu}></Menu>
        </div>
        <div className={menu ? "D-sidebar" : "D-sidebar D-sidebar-responsive"}>
          <h2><span>CQ</span>DASHBOARD</h2>
          <div className="D-profile">
            <div className="D-profile-image">
              <img src={userImage} alt="" />
            </div>
            <h4>{studentData.name}</h4>
            <div className="D-edit-profile">
              <i className="ri-edit-line" onClick={handleShowModal}></i>
              {showModal && <StudentModal onClose={handleCloseModal} />}
            </div>
          </div>
          <div className="D-sidebar-navigation">
            <h3 onClick={handleH1}>Home<i className="ri-arrow-right-s-line"></i></h3>
            <h3 onClick={handleH2}>Join Comp..<i className="ri-arrow-right-s-line"></i></h3>
            <h3 onClick={handleH3}>Check Result<i className="ri-arrow-right-s-line"></i></h3>
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
              <i className={dark ? "ri-moon-line" : "ri-sun-line"} onClick={toggleDarkMode}></i>
              <i className="ri-logout-circle-r-line" onClick={() => setShowConfirmPopup(true)}></i>
              {showConfirmPopup && <ConfirmPopup message="Are you sure?" onConfirm={handelLogout} onCancel={handleCancel} />}
            </div>
          </div>
          <div className="D-dashboard-content">
            {home && <SHome />}
            {JC && <SJC />}
            {CR && <SCR studentId={studentData.id} />}
          </div>
        </div>
      </>}
    </div>
  )
}

export default S_D3;