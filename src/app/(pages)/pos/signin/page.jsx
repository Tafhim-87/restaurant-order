// components/SignInForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useApi from '@/app/hooks/useApi';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Use your custom API hook
    const { data, error, loading, post } = useApi('/pos/signin')

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
        const response = await post('/pos/signin', { email, password });

        if (response && response.success) {
          // Store token (you might want to use a more secure method)
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);

          // Redirect to dashboard or home page
          router.push('/pos');
        } else if (response && response.message) {
          alert(response.message || 'Sign-in failed');
        } else if (error) {
          alert(error.message || 'Sign-in failed');
        }
      } catch (err) {
        console.error('Sign-in error:', err);
        alert('An error occurred during sign-in');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-8 border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your admin account</p>
          </div>

          {/* Success Message */}
          {data?.success && (
            <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6">
              Sign-in successful! Redirecting...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isLoading || loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Demo Credentials:</h3>
            <p className="text-xs text-gray-400">Email: abc@gmail.com</p>
            <p className="text-xs text-gray-400">Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import useApi from '@/app/hooks/useApi';
// import { useRouter } from 'next/navigation';

// /**
//  * @typedef {Object} LoginResponse
//  * @property {string} token
//  * @property {{id: string, email: string, role: string, name?: string}} user
//  */

// const SignInPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useAuth();
//   const { post, loading, error } = useApi('/pos/signin');
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const response = await post('/pos/signin', { email, password });
//     if (response) {
//       login(response.token, response.user);
//       router.push('/pos');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <h1>Sign In</h1>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           className="border p-2"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="border p-2"
//         />
//         <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
//           {loading ? 'Logging in...' : 'Log In'}
//         </button>
//         {error && <p className="text-red-500">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default SignInPage;