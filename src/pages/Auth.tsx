
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import StatusBar from '@/components/StatusBar';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already authenticated, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/profile');
      } else {
        if (!nickname.trim()) {
          throw new Error('请输入昵称');
        }
        
        await signUp(email, password, {
          nickname: nickname
        });
        
        // After successful registration, switch to login mode
        setMode('login');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || '认证失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar />

      <div className="p-4">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'login' ? '欢迎回来' : '创建账号'}
          </h1>
          <p className="text-gray-500 mt-2">
            {mode === 'login' ? '登录您的Nico账号' : '加入Nico社区'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                id="nickname"
                type="text"
                placeholder="昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="pl-10 py-6 bg-gray-50"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              id="email"
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 py-6 bg-gray-50"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 py-6 bg-gray-50"
            />
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-red-500 hover:bg-red-600 text-white text-lg"
          >
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-red-500"
          >
            {mode === 'login' ? '没有账号？立即注册' : '已有账号？立即登录'}
          </button>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">其他登录方式</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="bg-gray-50 p-3 rounded-lg flex justify-center">
              <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10zm3 15H9v-2h6v2zm0-4H9v-2h6v2zm0-4H9V7h6v2z" />
              </svg>
            </button>
            <button className="bg-gray-50 p-3 rounded-lg flex justify-center">
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12zm8.5-4.5v9l5.5-4.5-5.5-4.5z" />
              </svg>
            </button>
            <button className="bg-gray-50 p-3 rounded-lg flex justify-center">
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 8l6 4-6 4V8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
