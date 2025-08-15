
import React from 'react';
import AuthBackground from '@/components/AuthBackground';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground />
      <AuthForm />
    </div>
  );
};

export default Auth;
