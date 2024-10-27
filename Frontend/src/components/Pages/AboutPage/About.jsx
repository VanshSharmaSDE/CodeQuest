import React, { useState } from 'react'
import './About.css'
import AboutAnimation from '../../../utilities/Animations/AboutAnimation'
import principal from '../../../assets/principal.jpg';
import DemoDashboard from '../../../assets/Demo-Dashboard.png';
import DemoDashboardDark from '../../../assets/Demo-dashboard-dark.png';
import { useEffect } from 'react';

function About() {

  const [demoDashboard, setDemoDashboard] = useState(DemoDashboard);
  const mode = JSON.parse(localStorage.getItem('dark-mode'));

  useEffect(() => {
    if (!mode) {
      setDemoDashboard(DemoDashboardDark)
    } else {
      setDemoDashboard(DemoDashboard)
    }
  }, [mode])


  const navigate = (location) => {
    window.location.href = location;
  }

  AboutAnimation()
  return (
    <div className="a-main">
      <div className="a-background">

        <div className="a-main-demo-dashboard" id='about'>
          <img src={demoDashboard} alt="" />
        </div>

        <div className="a-main-line line1"></div>

        <h1 className='vision'>Our Vision</h1>

        <p className='vision-paragraph'><i class="ri-arrow-left-s-line"></i>CodeQuest envisions a world where every aspiring programmer has a platform to hone their skills, compete globally, and transform their potential into reality<i class="ri-arrow-right-s-line"></i></p>

        <div className="a-main-line line2"></div>

        <h1 className='mission'>Our Mission</h1>

        <div className="a-main-mission-circles">
          <div className="a-main-circle-1 circle">
            <p>Provide a dynamic platform for college students to showcase and hone their coding skills.</p>
          </div>
          <div className="a-main-circle-2 circle">
            <p>Foster a community where students from around the world can engage, compete, and learn together.</p>
          </div>
          <div className="a-main-circle-3 circle">
            <p>Expand access to quality coding competitions, making them available to every institution worldwide.</p>
          </div>
        </div>

        <div className="a-main-line line3"></div>

        <h1 className='developer'>Our Guide 💡</h1>

        <div className="a-main-intro-section">
          <div className="main-intro-left">
            <strong>
              <span>"</span>At KITPS, we pride ourselves on our commitment to innovation and collaboration in the field of education. Our founding team comprises visionary leaders dedicated to fostering an environment where technology meets academia. Together, we strive to empower students and institutions alike through state-of-the-art solutions.<span>"</span>
            </strong>
          </div>
          <div className="guide-profile">
            <div className="intro-profile-card">
              <img src={principal} alt="" />
              <h2>Dr Atul Rai (Principal) <i class="ri-verified-badge-fill"></i></h2>
              <div>
                <button onClick={() => navigate('/')}><i className="ri-instagram-line"></i></button>
                <button onClick={() => navigate('/')}><i class="ri-linkedin-box-line"></i></button>
                <button onClick={() => navigate('/')}><i className="ri-github-line"></i></button>
                <button onClick={() => navigate('/about')}><i className="ri-arrow-right-up-line"></i></button>
              </div>
            </div>
            <div className="main-intro-left">
              <strong>
                <i className="ri-play-large-fill"></i> We are not merely educators; we are facilitators of potential. Our software is meticulously crafted to not only challenge students but also to equip them with the necessary skills to navigate the complexities of the tech industry with confidence and competence.  &nbsp;  &nbsp;
                <span>— [Dr Atul Rai], [Principal of KITPS]</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <hr /> &nbsp; &nbsp;
                <strong>
                  <i className="ri-play-large-fill"></i> I would also like to take this opportunity to commend our exceptional development team. Their dedication and innovative spirit have been instrumental in bringing this vision to life, ensuring that our students receive the best possible tools to succeed in their coding endeavors.
                </strong>
                <a href="/about">read more...</a>
              </strong>
            </div>
          </div>
        </div>
        <div className="feature-section">
          <h3 className="features-title">FEATURES</h3>
          <h1 className="features-heading">Create fast and stay flexible</h1>
          <p className="features-subheading">
            Our platform brings together the best of coding education: secure competition creation for teachers, seamless participation for students
          </p>

          <div className="features-cards">
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h2 className="feature-title">Built for modern coding</h2>
              <p className="feature-description">
                Teachers can create powerful coding competitions using the latest technologies, with support for multiple programming languages and real-time collaboration.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h2 className="feature-title">Pre-configured security</h2>
              <p className="feature-description">
                Our system ensures secure sessions for students with features like session lockdowns, anti-cheating mechanisms, and monitored environments.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h2 className="feature-title">Automatic answer checking</h2>
              <p className="feature-description">
                Save time with built-in automatic answer checking for programming questions, ensuring immediate feedback and score calculation.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h2 className="feature-title">Student & teacher dashboards</h2>
              <p className="feature-description">
                Both students and teachers have dedicated dashboards: students can track their progress, while teachers can manage competitions, view results, and allow/disallow participation.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h2 className="feature-title">Automatic winner calculation</h2>
              <p className="feature-description">
                Our platform calculates winners automatically based on performance, with real-time score updates and leaderboard functionality.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h2 className="feature-title">Dark Mode</h2>
              <p className="feature-description">
                Give your eyes a break! Switch between light and dark mode for a more comfortable coding experience during competitions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h2 className="feature-title">Secure OTP Authentication</h2>
              <p className="feature-description">
                Ensure secure logins with OTP authentication for both students and teachers, adding an extra layer of security to your competitions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h2 className="feature-title">Admin Control</h2>
              <p className="feature-description">
                Admins have full control over the platform, from managing competitions to monitoring activity and handling user permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About