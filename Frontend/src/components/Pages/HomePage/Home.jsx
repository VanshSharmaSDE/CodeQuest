import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar';
import About from '../AboutPage/About';
import Contact from '../ContactPage/Contact';
import Footer from '../Footer/Footer';
import FQ from '../F&Q/F&Q';
import { useNavigate } from 'react-router-dom';
import HomeAnimation from '../../../utilities/Animations/HomeAnimation';
import Tooltip from '../../../utilities/ToolTip/Tooltip';
import SmoothScrollProvider from '../../../utilities/Locomotive/SmoothScrollProvider';



function Home() {
 
  HomeAnimation();

  const navigate = useNavigate();
  const savedTheme = localStorage.getItem('dark-mode') === 'true';
  const [dark, setDark] = useState(savedTheme);
  const [profile, setProfile] = useState(true);

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
  },); 

  const token = JSON.parse(localStorage.getItem('user')) || null;
  useEffect(() => {
    if (token && token.role) {
      setProfile(false)
    }
    else {
      setProfile(true)
    }
  }, [])

  const handleProfile = () => {
    if (token && token.role) {
      setProfile(false)
      navigate(`/${token.role}-dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <SmoothScrollProvider>
        <div className='h-main'>
          <div className="dark-profile-button">
            <button onClick={toggleDarkMode}><Tooltip text={dark ? 'Enable Dark Mode' : 'Enable Light Mode'} position={{ top: -5, left: -170 }}>{dark ? <i class="ri-moon-line"></i> : <i class="ri-sun-line"></i>}</Tooltip></button>
            <button onClick={handleProfile}><Tooltip text='Dashboard' position={{ top: -5, left: -170 }}>{profile ? <i class="ri-user-minus-line"></i> : <i class="ri-user-follow-line"></i>}</Tooltip></button>
          </div>
          <Navbar></Navbar>
          <div className="h-background">

            <div className="b-box-1"></div>
            <div className="b-box-2"></div>
            <div className="b-box-3"></div>  
            <div className="b-box-4"></div>


            <div className="border-box-1"></div>
            <div className="border-box-2"></div>
            <div className="border-box-3"></div>
            <div className="border-box-4"></div>
 
          </div>
          <div className="h-main-content">
            <div className="h-main-heading">
              <h1>Bring some <span>Flair</span> to your Code</h1>
              <div className="h-main-paragraph">
                <p>Join us to master coding through innovative challenges and global competition.</p>
              </div>
              <div className="h-main-button">
                <button onClick={() => navigate('/login')} id='h-main-B1'>Get Started</button>
                <button id='h-main-B2'>Request a Demo</button>
              </div>
            </div>
          </div>
        </div>
        <About></About>
        <Contact></Contact>
        <FQ></FQ>
        <Footer></Footer>
      </SmoothScrollProvider>
    </>
  )
}

export default Home