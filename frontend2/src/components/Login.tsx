import React, { useEffect } from 'react';
import { LoginForm } from '@/components/Login-form'; // Adjust the import path as needed
import Navbar from './navbar'; // Adjust the import path as needed

const LoginPage = () => {
  useEffect(() => {
    // Set the body background styles dynamically
    document.body.style.backgroundImage = `url('/wallpaper.jpg')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.margin = '0';
    document.body.style.minHeight = '100vh';

    // Cleanup background styles when the component unmounts
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.margin = '';
      document.body.style.minHeight = '';
    };
  }, []);

  return (
    <>
     

      {/* Centered Login Form */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10" style={{ marginTop: '20vh' }}>
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
