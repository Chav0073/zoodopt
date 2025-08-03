import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Eye, EyeSlashFill, PersonFill, KeyFill, ShieldLockFill } from "react-bootstrap-icons";
import './AuthForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5217/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'Public',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.errors) {
          const serverErrors = {};
          for (const field in data.errors) {
            serverErrors[field.toLowerCase()] = data.errors[field].join(' ');
          }
          setErrors(serverErrors);
        } else {
          setSubmitError(data.title || 'Registration failed.');
        }
        return;
      }

      console.log('Registration success:', data);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="register-card">
              <div className="register-header text-center text-white p-4 position-relative">
                <h2 className="mb-2 fw-bold register-title">Join Us Today</h2>
                <p className="mb-0 opacity-90 register-subtitle">Create your new account</p>
              </div>

              <div className="card-body p-5">
                {submitError && (
                  <div className="alert submit-error-alert" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {submitError}
                  </div>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <div className="mb-4">
                    <Form.Label className="label">Email Address</Form.Label>
                    <InputGroup className={errors.email ? 'has-error' : ''}>
                      <InputGroup.Text className="input-icon"><PersonFill /></InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        isInvalid={!!errors.email}
                        className="input-field"
                      />
                    </InputGroup>
                    {errors.email && (
                      <Form.Control.Feedback type="invalid" className="invalid-feedback">
                        {errors.email}
                      </Form.Control.Feedback>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <Form.Label className="label">Password</Form.Label>
                    <InputGroup className={errors.password ? 'has-error' : ''}>
                      <InputGroup.Text className="input-icon"><KeyFill /></InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        isInvalid={!!errors.password}
                        className="input-field input-no-right"
                      />
                      <InputGroup.Text
                        className="input-icon icon-right"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeSlashFill /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                    {errors.password && (
                      <Form.Control.Feedback type="invalid" className="invalid-feedback">
                        {errors.password}
                      </Form.Control.Feedback>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <Form.Label className="label">Confirm Password</Form.Label>
                    <InputGroup className={errors.confirmPassword ? 'has-error' : ''}>
                      <InputGroup.Text className="input-icon"><ShieldLockFill /></InputGroup.Text>
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        isInvalid={!!errors.confirmPassword}
                        className="input-field input-no-right"
                      />
                      <InputGroup.Text
                        className="input-icon icon-right"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeSlashFill /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                    {errors.confirmPassword && (
                      <Form.Control.Feedback type="invalid" className="invalid-feedback">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="mb-4">
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner">⏳</span> Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>

                  {/* Link */}
                  <div className="text-center">
                    <p className="login-link">
                      Already have an account?{' '}
                      <Link to="/login" className="login-anchor">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;