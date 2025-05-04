
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import StatusBar from '@/components/StatusBar';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;
        
        navigate('/profile');
        toast({
          title: '登录成功',
          description: '欢迎回来！',
        });
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              nickname: nickname
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: '注册成功',
          description: '请验证您的邮箱',
        });
        setMode('login');
      }
    } catch (error: any) {
      toast({
        title: '错误',
        description: error.message || '认证失败',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />

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
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 py-6 bg-gray-50"
            />
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
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
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
