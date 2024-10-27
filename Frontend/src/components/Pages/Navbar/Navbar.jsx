import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import Menu from '../../../utilities/Hamburgers/menu'


function Navbar() {
  const [menu, setMene] = useState(true)
  const handlemenu = () => {
    setMene(!menu)
  }

  return (
      <div className='n-main'>
        <div className="n-logo">
          <img src="https://kothiwalinstitutetechnology.com/wp-content/themes/kitps/logo.png" alt="" />
        </div>
        <div className="n-navigation">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="menu-button" onClick={handlemenu}>
          <Menu isOpen={!menu}></Menu>
        </div>
        <div className={menu ? 'n-navigation-responsive true' : 'n-navigation-responsive'}>
          <div className="main-naviagtion">
            <Link to="/"><i class="ri-home-line"></i> Home</Link>
            <a href="#about"><i class="ri-discuss-line"></i> About</a>
            <a href="#contact"><i class="ri-contacts-book-2-line"></i> Contact</a>
          </div>
        </div>
        <div className="n-login">
          <Link to="/login"><button><span>Login</span> <i className="ri-arrow-right-line"></i></button></Link>
        </div>
      </div>
  )
}

export default Navbar