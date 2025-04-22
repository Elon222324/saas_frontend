import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
  
    try {
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)
  
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
        }
      )
  
      console.log('✅ УСПЕХ ОТ БЕКА:', res)
      const accessToken = res.data.access_token
      console.log('🎟️ accessToken:', accessToken)
  
      localStorage.setItem('access_token', accessToken)
      navigate('/')
    } catch (err) {
      console.error('❌ ОШИБКА axios:', err)
      console.log('📦 err.response:', err.response)
      setError('Ошибка входа. Проверь логин и пароль.')
    }
  }
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Вход</h2>

        <div>
          <Label htmlFor="username">Имя пользователя</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
        </div>

        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>
    </div>
  )
}
