import { Home, LogOut, PlusCircle } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const items = [
  { label: 'Dashboard', to: '/faculty/dashboard', icon: Home },
  { label: 'Opportunities', to: '/faculty/opportunities', icon: PlusCircle },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <aside className="glass-panel min-h-[400px] p-4 md:p-6 md:sticky md:top-24 shadow-lg shadow-slate-300/20 rounded-2xl bg-gray-50/50">
      <nav className="flex flex-col space-y-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-1 md:gap-2 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/40 hover:brightness-105'
                  : 'text-slate-700 hover:bg-slate-100 hover:shadow-md'
              }`
            }
          >
            <item.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="hidden md:inline">{item.label}</span>
            <span className="md:hidden text-xs font-medium">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="flex items-center gap-1 md:gap-2 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-semibold text-rose-700 transition-all duration-200 hover:bg-rose-50 hover:shadow-md md:w-full"
        >
          <LogOut className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
          <span className="hidden md:inline">Logout</span>
          <span className="md:hidden text-xs font-medium">Log Out</span>
        </button>
      </nav>
    </aside>
  )
}
