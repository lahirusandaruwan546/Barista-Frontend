import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Coffee} from 'lucide-react';
import {useDispatch} from "react-redux";
import {signup} from "../../store/slice/authSlice.ts";

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('password do not match');
      return
    }

    setPasswordError('')
    const response = await dispatch(signup({ name, email, password }) as any);
    if (response.meta.requestStatus === 'fulfilled') {
      // window.location.href = '/';
      const user = response.payload.email;
      localStorage.setItem('user', user);
      navigate('/')
    } else {
      setPasswordError('Failed to signup');
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3a1c1c] via-[#6b3d2e] to-[#c78d65] py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Space Grotesk' , sans-serif" }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Coffee className="h-12 w-12 text-[#c4a287] hover:text-[#d4b59b] transition duration-300 ease-in-out transform hover:rotate-12" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-[#f5f5f5]">
            Barista Shop
          </h2>
          <p className="mt-2 text-sm text-[#c4a287]">
            Create your admin account
          </p>
        </div>
        <div className="bg-[#2a1a1f]/90 border border-[#3e2d34]/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg shadow-[#c792ea]/20 space-y-6">
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a1a1f] border border-[#3e2d34] placeholder-[#7a6a5f] text-[#f5f5f5] rounded-md focus:ring-[#c4a287] focus:border-[#c4a287] transition duration-200"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a1a1f] border border-[#3e2d34] placeholder-[#7a6a5f] text-[#f5f5f5] rounded-md focus:ring-[#c4a287] focus:border-[#c4a287] transition duration-200"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a1a1f] border border-[#3e2d34] placeholder-[#7a6a5f] text-[#f5f5f5] rounded-md focus:ring-[#c4a287] focus:border-[#c4a287] transition duration-200"
                placeholder="Password"
              />
              <div className="h-1 mb-2 bg-[#2a1a1f] rounded-full">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  password.length === 0 ? 'bg-transparent' :
                  password.length < 4 ? 'bg-red-500' :
                  password.length < 8 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, (password.length / 12) * 100)}%` }}
              />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a1a1f] border border-[#3e2d34] placeholder-[#7a6a5f] text-[#f5f5f5] rounded-md focus:ring-[#c4a287] focus:border-[#c4a287] transition duration-200"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          {passwordError && <div className="text-[#ff6b6b] text-sm text-center py-2 px-3 bg-[#3e2d34]/50 rounded-md">{passwordError}</div>}

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-[#f5f5f5] bg-[#6f4e37] hover:bg-[#8b6b4f] focus:outline-none focus:ring-[#d2b48c] focus:ring-offset-2 shadow-md shadow-[#3e2d34]/40 hover:shadow-lg hover:shadow-[#3e2d34]/50 transition-transform duration-200 transform hover:scale-[1.02]"
            >
              Sign up
            </button>

          <div className="text-sm text-center text-[#7a6a5f]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#c4a287] hover:text-[#d4b59b] underline underline-offset-4">
                Sign in
              </Link>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;