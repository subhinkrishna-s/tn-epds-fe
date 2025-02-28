import React from 'react';

const AccessDenied = () => {

    setTimeout(()=>{
        window.location.href="/"
    },5000)

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-center">
      <div className="card shadow-lg p-4 mx-2" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          {/* Illustration */}
          <div className="mb-4">
            <i className="bi bi-shield-lock-fill text-danger" style={{ fontSize: '80px' }}></i>
          </div>

          {/* Title */}
          <h1 className="text-danger mb-3">Access Denied</h1>

          {/* Description */}
          <p className="text-muted">
            Sorry, you don’t have permission to access this page. Please check your credentials or contact support.
          </p>

          {/* Go Back Button */}
          <a href="/" className="btn btn-primary mt-3">
            <i className="bi bi-arrow-left"></i> Go Back
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;