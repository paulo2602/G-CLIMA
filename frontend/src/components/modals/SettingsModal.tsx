import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface SettingsDropdownProps {
  isOpen: boolean
}

export default function SettingsDropdown({ isOpen }: SettingsDropdownProps) {
  const { isDark, toggleTheme } = useTheme()

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 p-3 z-50">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition text-sm"
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

        {/* Toggle Switch Small */}
        <div
          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
            isDark ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform transform ${
              isDark ? 'translate-x-5' : 'translate-x-0'
            }`}
          ></div>
        </div>
      </button>
    </div>
  )
}
