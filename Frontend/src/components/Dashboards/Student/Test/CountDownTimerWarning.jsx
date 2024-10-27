import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CountdownTimerWarning = ({enterFullScreen, limit}) => {
  const [seconds, setSeconds] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    if(limit > 2) navigate('/')
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      navigate("/");
    }
  }, [seconds]);

  return (
    <>
      <div className="display_warning">
        <h1>
          You've <span>Exited</span> Full Screen Mode {limit}/2 time{limit <= 1? "": "s"}!!
        </h1>
        <p>Enter again to continue</p>
        <button onClick={ enterFullScreen}>Enter</button>
        <h2>
          Or you will be <span>Disqualified</span> in ...
          <span>
            <p>{seconds} seconds</p>
          </span>
        </h2>
      </div>
    </>
  );
};

export default CountdownTimerWarning;
