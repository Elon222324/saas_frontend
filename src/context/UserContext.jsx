import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem('access_token')
    
    // Skip fetching on login page
    if (location.pathname === '/login') {
      setLoading(false)
      return
    }
    
    if (!accessToken) {
      setLoading(false)
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user:', error)
      // If fetch fails, redirect to login
      localStorage.removeItem('access_token')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [location.pathname])

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    navigate('/login')
  }

  const isSuperAdmin = user?.role === 'super_admin'

  return (
    <UserContext.Provider value={{ user, loading, logout, isSuperAdmin, refetch: fetchCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

