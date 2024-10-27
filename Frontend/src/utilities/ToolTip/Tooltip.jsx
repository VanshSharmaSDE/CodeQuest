import React from 'react';
import './Tooltip.css';

const Tooltip = ({ children, text, position = { top: 0, right: 0, bottom: 0, left: 0 } }) => {
    const tooltipStyle = {
        top: position.top !== 0 ? `${position.top}px` : 'auto',
        right: position.right !== 0 ? `${position.right}px` : 'auto',
        bottom: position.bottom !== 0 ? `${position.bottom}px` : 'auto',
        left: position.left !== 0 ? `${position.left}px` : 'auto',
    };

    return (
        <div className="tooltip-container">
            {children}
            <span className="tooltip-text" style={tooltipStyle}>{text}</span>
        </div>
    );
};

export default Tooltip;
