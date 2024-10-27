import React from 'react'
import './Footer.css'
import FooterAnimation from '../../../utilities/Animations/FooterAnimation'

function Footer() {
  FooterAnimation();
  return (
    <div className="f-main">
        <div className="f-background">
            <div className="F-info">
              <h4><strong>Phone:</strong>0000000000</h4>
              <h4>codequest@gmail.com</h4>
              <div className="F-social">
              <i class="ri-instagram-fill"></i>
              <i class="ri-twitter-fill"></i>
              <i class="ri-facebook-box-fill"></i>
              </div>
            </div>
            <div className="F-logo">
              <h1>CQ</h1>
              <h3>CodeQuest <sub><h6>By KITPS</h6></sub></h3>
            </div>
            <div className="F-content">
              <h3>Stay Connected with Us</h3>
              <p>Join our mailing list to receive updates and be the first to know when our community feature launches!</p>
              <div className="F-input">
                <input type="text" placeholder='email address'/>
                <button>Join..</button>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Footer