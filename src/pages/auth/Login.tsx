import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import {useDispatch} from "react-redux";
import {login} from "../../store/slice/authSlice.ts";
import Swal from "sweetalert2";

// testuser3@gmail.com , 12345689
// namal@gmail.com , 7890
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await dispatch(login({ email, password }) as any);
    if (response.meta.requestStatus === 'fulfilled') {
      // window.location.href = '/';
      const user = response.payload.sendingUser.email;
      localStorage.setItem('user', user);
      navigate('/')
    } else {
      Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid email or password",
      background: "#2a1a1f", 
      color: "#f5f5f5", 
      iconColor: "#c4a287", 
      confirmButtonColor: "#6f4e37", 
      confirmButtonText: "Try Again",
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
      },
      customClass: {
        popup: "rounded-xl border border-[#3e2d34]/50", 
        title: "text-[#c4a287] font-[Space Grotesk]", 
        confirmButton: "px-6 py-2 text-sm font-semibold hover:bg-[#8b6b4f] transition-colors", 
        container: "font-[Space Grotesk]" 
      }
    });
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3a1c1c] via-[#6b3d2e] to-[#c78d65] py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Space Grotesk' , sans-serif" }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Coffee className="h-12 w-12 text-[#c4a287] hover:text-[#d4b59b] transition duration-300 ease-in-out transform hover:rotate-12" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#f5f5f5]">
            Barista Shop
          </h2>
          <p className="mt-2 text-center text-sm text-[#c4a287]">
            Sign in to your admin account
          </p>
        </div>
        <div className="max-w-md w-full space-y-8 bg-[#2a1a1f]/90 border border-[#3e2d34]/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg shadow-[#c792ea]/20 hover:shadow-[0_0_0_2px_#c4a28730] transition-shadow duration-300">
        <form className="mt-8 space-y-6 focus:outline-none focus:ring-2 focus:ring-[#c4a287]/50" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="transition duration-150 ease-in-out appearance-none rounded-none relative block w-full px-3 py-2 bg-[#2a1a1f] border border-[#3e2d34] placeholder-[#7a6a5f] text-[#f5f5f5] focus:ring-[#c4a287] focus:border-[#c4a287] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className='relative'>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition duration-150 ease-in-out appearance-none rounded-none relative block w-full px-3 py-2 bg-[#2a1a1f] border border-[#3e2d34] placeholder-[#7a6a5f] text-[#f5f5f5] focus:ring-[#c4a287] focus:border-[#c4a287] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button type='button' 
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a6a5f] hover:text-[#c4a287]' >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-[#f5f5f5] bg-[#6f4e37] hover:bg-[#8b6b4f] focus:outline-none focus:ring-[#d2b48c] focus:ring-offset-2 shadow-md shadow-[#3e2d34]/40 hover:shadow-lg hover:shadow-[#3e2d34]/50 transition-transform duration-200 transform hover:scale-[1.02]"
            >
            Sign in
            </button>
          </div>

          <div className="text-sm text-center">
            <p className='text-[#7a6a5f]'>
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-[#c4a287] hover:text-[#d4b59b] underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Login;