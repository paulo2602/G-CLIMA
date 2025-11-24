import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Cloud, Map, LogOut, Settings, Moon, Sun } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useTheme } from '../../contexts/ThemeContext'
import { useState, useEffect } from 'react'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        setUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Cloud },
    { path: '/explore', label: 'Explorar', icon: Map },
  ]

  const userName = user?.name || 'Usuário'
  const userEmail = user?.email || 'user@clima.ai'
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="fixed left-0 top-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 h-screen overflow-y-auto border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
          <Cloud size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          GDASH CLIMA
        </h1>
      </div>

      {/* User Profile Card */}
      <div className="bg-gray-700/50 rounded-lg p-4 mb-8 border border-gray-600/50">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                active
                  ? 'bg-blue-600/80 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {active && <div className="ml-auto w-1 h-6 bg-blue-300 rounded-full"></div>}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-600/50 my-6"></div>

      {/* Bottom Actions */}
      <div className="space-y-2">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition duration-200">
          <Settings size={20} />
          <span className="font-medium">Configurações</span>
        </button>
        
        {/* Settings Dropdown - empurra botão pra baixo */}
        {showSettings && (
          <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition duration-200 text-sm"
            >
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Moon size={16} className="text-blue-500" />
                ) : (
                  <Sun size={16} className="text-yellow-500" />
                )}
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {isDark ? 'Modo Claro' : 'Modo Escuro'}
                </span>
              </div>

              {/* Toggle Switch */}
              <div
                className={`relative w-10 h-5 rounded-full flex-shrink-0 transition-colors duration-300 ${
                  isDark ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                    isDark ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </button>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600/20 hover:text-red-300 transition duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  )
}
