'use client'; // Add this if using Next.js App Router

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use this with App Router
// OR import { useRouter } from 'next/router'; // Use this with Pages Router

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    try {
      setLoading(true);
      setError('');

      // Make API call to your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Optionally save user data if your backend returns it
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect to dashboard or home page
      router.push('/dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img 
                    src="../../assets/images/logo.jpg" 
                    style={{height: '91px', width: '91px'}} 
                    alt="logo" 
                  />
                </div>
                <h4>Welcome Back</h4>
                <h6 className="fw-light">Sign in to continue.</h6>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form className="pt-3" onSubmit={handleLogin}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="exampleInputEmail1"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="exampleInputPassword1"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-3 d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-block btn-primary btn-lg fw-medium auth-form-btn"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'SIGN IN'}
                    </button>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" />{" "}
                        Keep me signed in{" "}
                      </label>
                    </div>
                    <a href="#" className="auth-link text-black">
                      Forgot password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}