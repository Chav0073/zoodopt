import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5217/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'Public', // Default role
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        // Handle 400 validation errors
        if (res.status === 400 && data.errors) {
          const serverErrors = {};
          for (const field in data.errors) {
            serverErrors[field.toLowerCase()] = data.errors[field].join(' ');
          }
          setErrors(serverErrors);
        } else {
          setSubmitError(data.title || 'Registration failed.');
        }

        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      console.log('Registration success:', data);

      // OPTIONAL: store token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
      setSubmitError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
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
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
      />
      <Button type="submit" loading={isSubmitting} className="w-100">
        Register
      </Button>

      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </form>
  );
};

export default RegisterForm;