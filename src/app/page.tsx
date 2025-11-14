'use client';

import { useState, useEffect, useCallback } from 'react';
import QRLogin from '@/components/auth/QRLogin';
import VideoSubmissionForm from '@/components/video/VideoSubmissionForm';
import VideoList from '@/components/video/VideoList';
import TaskQueueStats from '@/components/dashboard/TaskQueueStats';
import ScheduleManager from '@/components/schedule/ScheduleManager';
import { User, LogOut, Upload, List, Settings, BarChart3, Clock } from 'lucide-react';

interface UserInfo {
  id: string;
  name: string;
  mid: string;
  avatar?: string;
}

export default function HomePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [currentView, setCurrentView] = useState<'videos' | 'upload' | 'settings' | 'dashboard' | 'schedule'>('dashboard');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取API基础URL
  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const { protocol, hostname, port } = window.location;
      // 在embed模式下，前端和后端运行在同一个端口
      return `${protocol}//${hostname}${port ? ':' + port : ''}`;
    }
    return 'http://localhost:8096';
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/status`);
      const data = await response.json();
      
      console.log('Auth status response:', data); // 调试日志
      
      if (data.code === 0 && data.is_logged_in && data.user) {
        console.log('User is logged in:', data.user); // 调试日志
        setUser(data.user);
      } else {
        console.log('User is not logged in'); // 调试日志
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 检查登录状态
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLoginSuccess = (userData: UserInfo) => {
    setUser(userData);
  };

  const handleRefreshStatus = async () => {
    // 重新检查登录状态，用于二维码登录成功后的状态同步
    await checkAuthStatus();
  };

  const handleLogout = async () => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      await fetch(`${apiBaseUrl}/api/v1/auth/logout`, { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const handleVideoSubmit = (video: any) => {
    // 视频提交成功后切换到视频列表
    setCurrentView('videos');
    setSelectedVideoId(null);
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const handleBackToList = () => {
    setSelectedVideoId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录状态
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bili-Up Web
              </h1>
              <p className="text-gray-600">
                Bilibili 视频管理平台
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg">
              <QRLogin 
                onLoginSuccess={handleLoginSuccess}
                onRefreshStatus={handleRefreshStatus}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 已登录状态
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Bili-Up Web
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* 侧边栏 */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setSelectedVideoId(null);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      currentView === 'dashboard' && !selectedVideoId
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>任务队列</span>
                  </button>
                </li>
                
         
                
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('schedule');
                      setSelectedVideoId(null);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      currentView === 'schedule'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    <span>定时上传</span>
                  </button>
                </li>
                
       
                
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setSelectedVideoId(null);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      currentView === 'settings'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span>设置</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* 主内容区 */}
          <div className="flex-1">
            {/* 显示视频详情页面 */}
            {currentView === 'dashboard' && (
              <TaskQueueStats onVideoSelect={handleVideoSelect} />
            )}
            
            {currentView === 'videos' && (
              <VideoList onVideoSelect={handleVideoSelect} />
            )}
            
            {currentView === 'schedule' && (
              <ScheduleManager onVideoSelect={handleVideoSelect} />
            )}
            
            {currentView === 'upload' && (
              <VideoSubmissionForm onSubmit={handleVideoSubmit} />
            )}
            
            {currentView === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  设置
                </h2>
                <p className="text-gray-600">
                  设置页面正在开发中...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}