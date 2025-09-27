import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onRoleChange: (role: UserType['role']) => void;
  onLogout: () => void;
}

export default function Header({ user, onRoleChange, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">♻</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">EcoConnect</h1>
            </div>
            
            {!user && (
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => onRoleChange('local')}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  For Users
                </button>
                <button
                  onClick={() => onRoleChange('manufacturer')}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  For Manufacturers
                </button>
                <button
                  onClick={() => onRoleChange('recycler')}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  For Recyclers
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex space-x-2 md:hidden">
                <button
                  onClick={() => onRoleChange('local')}
                  className="px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  User
                </button>
                <button
                  onClick={() => onRoleChange('manufacturer')}
                  className="px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Mfr
                </button>
                <button
                  onClick={() => onRoleChange('recycler')}
                  className="px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Rec
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}