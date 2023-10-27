import React, { useContext, useEffect } from "react";
import ReactLoading from "react-loading";
import '../CSS/loading.css'

const Loading = () => {
  // const {loading} = useContext(Context)
  
  return (
    <div className="loading">
      <ReactLoading type="bubbles" color="#fff"
        height={100} width={50} />
    </div>
  );
}

export default Loading;