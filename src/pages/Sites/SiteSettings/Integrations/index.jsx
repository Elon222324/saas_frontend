// src/pages/Sites/SiteSettings/Integrations/index.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

// Простой компонент для текстового поля, чтобы не дублировать код
const TextField = ({ label, value, onChange, placeholder, helpText }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    {helpText && <p className="mt-2 text-sm text-gray-500">{helpText}</p>}
  </div>
);

export default function Integrations() {
  const { domain } = useParams();
  const { data, loading, site_name, siteToken, refetch } = useSiteSettings();

  // Состояние для данных формы
  const [integrations, setIntegrations] = useState({});
  // Состояние для первоначальных данных, чтобы проверять изменения
  const [initial, setInitial] = useState({});
  const [hasInitialized, setHasInitialized] = useState(false);

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN;
  const API_URL = import.meta.env.VITE_API_URL;
  const full_domain = `${domain}.${baseDomain}`;

  // Этот эффект запускается один раз, когда данные загружены
  useEffect(() => {
    // Проверяем, что данные есть и мы еще не инициализировали состояние
    if (data?.integrations && !hasInitialized) {
      // Ищем настройки интеграций в общем объекте настроек
      const initialIntegrations = data.integrations || {};
      setIntegrations(initialIntegrations);
      setInitial(initialIntegrations);
      setHasInitialized(true);
    }
  }, [data, hasInitialized]);

  // Обработчик для обновления состояния при вводе в поле
  const handleChange = (key, value) => {
    setIntegrations(prev => ({ ...prev, [key]: value }));
  };

  // Обработчик для сохранения данных на бэкенд
  const handleSave = async () => {
    try {
      if (!siteToken) {
        alert('Токен сайта ещё не получен. Попробуйте позже.');
        return;
      }

      // Убираем суффикс для нового API
      const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'
      const siteNameForApi = site_name?.replace(containerSuffix, '') || domain;
      const url = `https://${siteNameForApi}.${baseDomain}/site-api/site-info`;

      const payload = {
        integrations: {
          yandex_metrica_id: integrations.yandex_metrica_id,
          // Здесь можно будет добавить другие ключи в будущем
        }
      };

      console.log('🔗 [Integrations] → Сохраняю настройки интеграций');
      console.log('🔗 [Integrations] → URL:', url);
      console.log('🔗 [Integrations] → Payload:', payload);
      console.log('🔑 [Integrations] Authorization: Bearer', siteToken ? siteToken.substring(0, 20) + '...' : 'no token');

      const res = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('🔗 [Integrations] ← Статус ответа:', res.status, res.statusText);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('🔗 [Integrations] ❌ Ошибка:', errorText);
        throw new Error('Ошибка сохранения: ' + errorText);
      }

      const responseData = await res.json();
      console.log('🔗 [Integrations] ✅ Ответ:', responseData);

      alert('Настройки интеграций сохранены');
      await refetch(); // Обновляем данные в контексте
      setInitial(integrations); // Обновляем "начальное" состояние
    } catch (err) {
      console.error('🔗 [Integrations] ❌ Ошибка сохранения:', err);
      alert('Не удалось сохранить настройки: ' + err.message);
    }
  };

  // Проверяем, есть ли несохраненные изменения
  const isDirty = useMemo(() => {
    return JSON.stringify(integrations) !== JSON.stringify(initial);
  }, [integrations, initial]);

  if (loading || !hasInitialized) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Интеграции: {full_domain}</h1>
        <Link
          to={`/settings/${site_name}/pages`}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          ← Назад
        </Link>
      </div>

      <div className="flex items-center text-gray-500 text-sm mb-4">
        <Info size={16} className="mr-2" />
        Укажите идентификаторы для подключения внешних сервисов.
      </div>

      <div className="space-y-4">
        <TextField
          label="Yandex.Metrica Counter ID"
          value={integrations.yandex_metrica_id}
          onChange={(val) => handleChange('yandex_metrica_id', val)}
          placeholder="Например: 12345678"
          helpText="Номер вашего счетчика Яндекс.Метрики."
        />
        {/* Здесь можно будет добавить другие поля для интеграций */}
      </div>

      <Button onClick={handleSave} disabled={!isDirty}>
        Сохранить
      </Button>
    </div>
  );
}