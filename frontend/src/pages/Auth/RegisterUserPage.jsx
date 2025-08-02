import React from 'react';
import RegisterForm from '../../components/Auth/RegisterForm';

const RegisterUserPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg rounded-4 p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Create an Account</h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterUserPage;