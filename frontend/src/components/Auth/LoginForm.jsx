import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Eye, EyeSlashFill, PersonFill, KeyFill } from "react-bootstrap-icons";
import './AuthForm.css'; 
import Spinner from "react-bootstrap/Spinner";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
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
      const res = await fetch('http://localhost:5217/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
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
        } else if (res.status === 401) {
          setErrors({ password: data.title || data.message || 'Invalid email or password.' });
        } else {
          setSubmitError(data.title || 'Login failed.');
        }
        return;
      }

      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      console.error('Network or unexpected error:', err);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="login-card">
              <div className="login-header">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to your account</p>
              </div>

              <div className="card-body p-5">
                {submitError && (
                  <div className="alert login-error-alert" role="alert">
                    {submitError}
                  </div>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <div className="mb-4">
                    <Form.Label className="login-label">Email Address</Form.Label>
                    <InputGroup className={errors.email ? 'has-error' : ''}>
                      <InputGroup.Text className="login-icon">
                        <PersonFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        isInvalid={!!errors.email}
                        className="login-input"
                      />
                    </InputGroup>
                    {errors.email && (
                      <div className="login-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <Form.Label className="login-label">Password</Form.Label>
                    <InputGroup className={errors.password ? 'has-error' : ''}>
                      <InputGroup.Text className="login-icon">
                        <KeyFill />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        isInvalid={!!errors.password}
                        className="login-input"
                      />
                      <InputGroup.Text
                        className="login-icon toggle-icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeSlashFill /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                    {errors.password && (
                      <div className="login-feedback">{errors.password}</div>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="mb-4 d-flex justify-content-between align-items-center login-options">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      label={<span className="remember-label">Remember me</span>}
                    />

                    <Link to="/forgot-password" className="forgot-link">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div className="mb-4">
                    <button type="submit" className="login-button" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="register-text">
                      Don't have an account?{' '}
                      <Link to="/register" className="register-link">
                        Create account
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

export default LoginForm;