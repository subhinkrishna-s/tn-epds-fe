import React from "react";

const LoadingPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "90vh" }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mt-3">Please wait, Loading...</h2>
      </div>
    </div>
  );
};

export default LoadingPage;