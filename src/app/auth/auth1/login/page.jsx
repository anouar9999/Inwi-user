'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  ImageIcon,
  FileTextIcon,
  Mail,
  User,
} from 'lucide-react';
import FloatingLabelInput from '@/app/components/input/FloatingInput';
import ServerMessage from './ServerMessage';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });
  const registerSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Too short')
      .max(50, 'Too long')
      .matches(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'Min 8 characters')
      .matches(/[a-z]/, '1 lowercase')
      .matches(/[A-Z]/, '1 uppercase')
      .matches(/[0-9]/, '1 number')
      .matches(/[^a-zA-Z0-9]/, '1 special character')
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
    avatar: Yup.mixed(), // Changed from URL to mixed for file upload
    bio: Yup.string().max(500, 'Too long'),
  });

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerMessage({
          type: 'error',
          message: 'File size should be less than 5MB',
        });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setServerMessage({
          type: 'error',
          message: 'Please upload a valid image file (JPG, PNG, or GIF)',
        });
        return;
      }

      setFieldValue('avatar', file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const initialValues = isLogin
    ? { email: '', password: '' }
    : {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        bio: '',
        is_verified: 1,
      };

  const inputClasses = ` w-full 
            bg-gray-800 
            text-white 
            rounded-xl 
            text-sm 
            text-[10pt] 
            px-6 
            py-3 
            mb-4
            focus:outline-none 
            focus:ring-2 
            focus:ring-black/20 
            peer
        
            pr-12`;

  const inputWithIconClasses = ` ${inputClasses}`;

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setServerMessage({ type: '', message: '' });

    try {
      const url = isLogin
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_login.php`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_register.php`;

      let response;

      if (isLogin) {
        // Handle login - simple JSON submission
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
      } else {
        // Handle registration with file upload
        const formData = new FormData();

        // Add all fields except avatar and confirmPassword
        Object.keys(values).forEach((key) => {
          if (key !== 'avatar' && key !== 'confirmPassword') {
            formData.append(key, values[key]);
          }
        });

        // Add avatar file if exists
        if (values.avatar) {
          formData.append('avatar', values.avatar);
        }

        // Add additional metadata
        formData.append('created_at', new Date().toISOString());
        formData.append('is_verified', 1);

        response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        if (isLogin) {
          // Store user session data
          console.log(data);
          localStorage.setItem('userSessionToken', data.session_token);
          localStorage.setItem('userId', data.user_id);
          localStorage.setItem('username', data.username);
          localStorage.setItem('userType', data.user_type);
          localStorage.setItem('avatarUrl', data.avatar);

          // Show success message with username
          setServerMessage({
            type: 'success',
            message: `Welcome back, ${data.username}! Redirecting to dashboard...`,
          });

          // Delayed redirect for better UX
          setTimeout(() => {
            router.push('/dashboards/my-tournaments');
          }, 1500);
        } else {
          // Registration success
          setServerMessage({
            type: 'success',
            message: 'Account created successfully! You can now log in.',
          });

          // Delayed switch to login form
          setTimeout(() => {
            setIsLogin(true);
          }, 2000);
        }
      } else {
        // Handle API-level failures
        setServerMessage({
          type: 'error',
          message: data.message || (isLogin ? 'Login failed' : 'Registration failed'),
        });
      }
    } catch (error) {
      // Handle network or other errors
      setServerMessage({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Message component for better organization


  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/videoplayback.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-bl from-gray-900/95 via-gray-900/80 to-gray-950"></div>
        <div
          className={`absolute inset-0 bg-gradient-to-l from-gray-900/95 via-gray-900 to-transparent`}
        ></div>
      </div>

      {/* Left side content - hidden on mobile */}
      <div
        className={`relative z-10 w-full md:${
          isLogin ? 'w-1/2' : 'w-1/3'
        } p-12 hidden md:flex flex-col justify-center`}
      >
        <div className="space-y-4 max-w-xl">
          <div className="mb-6 w-56">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
              alt="Travelzo"
              width={220}
              height={40}
              className="w-full h-auto"
            />
          </div>

          <h1 className="font-custom tracking-widest text-5xl font-bold text-white leading-tight">
            Unleash the traveler
            <br />
            <span className="text-primary">inside you</span>, Enjoy your
            <br />
            Dream Vacation
          </h1>

          <p className="text-gray-300 text-sm max-w-md">
            Get started with the easiest and most secure website to buy travel tickets
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div
        className={`relative z-10 w-full md:${
          isLogin ? 'w-1/2' : 'w-2/3'
        } min-h-screen flex flex-col items-center justify-center px-6 py-8`}
      >
        {/* Logo container - centered on mobile */}
        <div className="md:hidden w-48 mb-12">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
            alt="Travelzo"
            width={220}
            height={40}
            className="w-full h-auto"
          />
        </div>

        <div className={isLogin ? 'max-w-md w-full' : ' w-full max-w-2xl'}>
          <div className="space-y-3 mb-8 text-center md:text-left">
            {isLogin ? (
              <h2 className="text-xl sm:text-4xl md:text-5xl tracking-wider text-white font-custom leading-tight">
                Log in <span className="text-primary">.</span> <br />
                welcome back
              </h2>
            ) : (
              <h2 className="text-xl sm:text-4xl md:text-5xl tracking-wider text-white font-custom leading-tight">
                Sign up <span className="text-primary">.</span> And
                <br />
                Join us now
              </h2>
            )}
            <p className="text-gray-500 text-sm sm:text-sm">
              Get started with the easiest and most secure website to buy travel tickets
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values, handleChange, handleBlur }) => (
              <Form className={isLogin ? 'space-y-10' : 'space-y-7'}>
                {serverMessage.message && (
                  <ServerMessage
                    type={serverMessage.type}
                    message={serverMessage.message}
                    onClose={() => setServerMessage({ type: '', message: '' })}
                  />
                )}

                {/* Login Form - Stays the same */}
                {isLogin && (
                  <>
                    <FloatingLabelInput
                      label="Email"
                      type="email"
                      icon={MailIcon}
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                      placeholder="Enter your email"
                    />

                    <FloatingLabelInput
                      label="Password"
                      type="password"
                      icon={LockIcon}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && errors.password}
                      placeholder="Enter your password"
                    />
                  </>
                )}

                {/* Registration Form - With Grid */}
                {!isLogin && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* File Upload Section */}
       {/* Avatar Preview */}
       {/* {avatarPreview && (
          <div className="shrink-0">
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              width={60}
              height={60}
              className="rounded-full object-cover ring-2 ring-gray-700/50"
            />
          </div>
        )} */}
    <div className="lg:col-span-2 space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-6">
     
        
        {/* File Input */}
        <div className="relative flex-grow w-full">
          <label
            className={`
              absolute 
              transition-all 
              text-[12pt] 
              font-custom 
              leading-tight 
              tracking-widest 
              duration-200 
              pointer-events-none 
              -translate-y-9 
              top-5 
              left-4 
              text-xs 
              rounded-md 
              text-gray-400 
              bg-gray-800 
              px-2
            `}
          >
            Profile Picture
          </label>
          <input
            type="file"
            onChange={(event) => handleFileChange(event, setFieldValue)}
            accept="image/jpeg,image/png,image/gif"
            className={`${inputWithIconClasses} file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 file:text-sm file:bg-gray-700 
              file:text-gray-300 hover:file:bg-gray-600 cursor-pointer`}
          />
        </div>
      </div>
    </div>

    {/* Form Fields */}
    <div className="space-y-6 lg:space-y-0">
      <FloatingLabelInput
        label="Username"
        type="text"
        icon={UserIcon}
        name="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.username && errors.username}
        placeholder="Choose a username"
      />

      <FloatingLabelInput
        label="Email"
        type="email"
        icon={MailIcon}
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
        placeholder="Enter your email"
      />
    </div>

    <div className="space-y-6 lg:space-y-0">
      <FloatingLabelInput
        label="Password"
        type="password"
        icon={LockIcon}
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && errors.password}
        placeholder="Create a strong password"
      />

      <FloatingLabelInput
        label="Confirm Password"
        type="password"
        icon={LockIcon}
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword && errors.confirmPassword}
        placeholder="Confirm your password"
      />
    </div>

    {/* Bio Section */}
    <div className="lg:col-span-2">
      <FloatingLabelInput
        label="Bio"
        type="textarea"
        icon={FileTextIcon}
        name="bio"
        value={values.bio}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.bio && errors.bio}
        placeholder="Tell us about yourself..."
      />
    </div>
  </div>
)}

                {/* Button and account toggle remain the same for both forms */}
                <motion.button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-3xl font-medium
          hover:bg-primary/20 focus:ring-2 focus:ring-primary/20 
          transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
                </motion.button>

                <p className="mt-8 text-center text-gray-400 max-w-lg mx-auto w-full">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setServerError('');
                    }}
                    className="ml-2 text-primary hover:underline font-medium transition-colors"
                  >
                    {isLogin ? 'Create an account' : 'Sign in'}
                  </button>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
