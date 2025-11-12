import axios from '../../../../../lib/axios'

export const serviceApi = {
  // Обновляет образ и перезапускает контейнер saas_web
  updateSaasWeb: async () => {
    try {
      const response = await axios.post('/api/service/update-saas-web')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при обновлении saas_web')
    }
  },

  // Обновляет образ и пересоздает фронтовый site-ISR контейнер
  updateFrontend: async () => {
    try {
      const response = await axios.post('/api/service/update-frontend')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при обновлении frontend')
    }
  },

  // Обновляет шаблонный образ site-api и перезапускает все сайты
  updateSiteTemplate: async () => {
    try {
      const response = await axios.post('/api/service/update-site-template')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при обновлении site-template')
    }
  },

  // Загружает новый образ docker-update и устанавливает флаг на обновление
  selfUpdate: async () => {
    try {
      const response = await axios.post('/api/service/self-update')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при self-update')
    }
  },

  // Инициализирует библиотеку
  initLibrary: async () => {
    try {
      const response = await axios.post('/api/cloud/library/import')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при инициализации библиотеки')
    }
  },
}

