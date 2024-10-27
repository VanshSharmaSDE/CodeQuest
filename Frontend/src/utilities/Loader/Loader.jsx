import React from "react";
import HashLoader from "react-spinners/HashLoader";
import './Loader.css'

const override = {
  display: "block",
  margin: "10px",
  borderColor: "red",
};

function Loader({content}) {
  return (
    <div className="Loader">
      <HashLoader
        color="#9a342d"
        loading="true"
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <h2>Loading...</h2>
      {/* <p>{content}</p> */}
    </div>
  );
}

export default Loader;
