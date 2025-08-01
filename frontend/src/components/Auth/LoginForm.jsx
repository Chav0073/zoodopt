import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
        body: JSON.stringify(formData),
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
          const errorMessage = data.title || data.message || 'Invalid email or password.';
          setErrors({ password: errorMessage });
        } else {
          setSubmitError(data.title || 'Login failed.');
        }

        return; // prevent finally from clearing isSubmitting too soon
      }

      // Store token and redirect on success
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      console.error('Network or unexpected error:', err);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4" noValidate>
      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required={false} // disable browser validation
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required={false} // disable browser validation
      />
      <Button type="submit" loading={isSubmitting} className="w-100">
        Login
      </Button>

      <p className="mt-3 text-center">
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </form>
  );
};

export default LoginForm;