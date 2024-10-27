import React from 'react'
import './sHome.css'
import SD from './SD/SD';

function sHome() {
  return (
    <div className="sHome-main">
      <div className="sHome-left">
        <div className="sJC-content-buttons">
          <button
            className={`sJC-button isActive`}
          >
            Dashboard
          </button>
        </div>
        <div className="sHome-left-content">
          <SD></SD>
        </div>
      </div>
    </div>
  )
}

export default sHome