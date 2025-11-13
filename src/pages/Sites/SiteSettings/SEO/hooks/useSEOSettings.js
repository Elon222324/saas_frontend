import { useState, useEffect, useMemo } from 'react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { saveSEOSettings } from '../utils/seoApi';

export const useSEOSettings = () => {
  const { data, loading, site_name, siteToken, refetch } = useSiteSettings();

  // Состояние для данных формы
  const [seo, setSeo] = useState({});
  // Состояние для первоначальных данных
  const [initial, setInitial] = useState({});
  const [hasInitialized, setHasInitialized] = useState(false);

  // Инициализация данных
  useEffect(() => {
    if (data && !hasInitialized) {
      console.log('[SEO Hook] Data received:', data);
      console.log('[SEO Hook] SEO data:', data.seo);
      
      // Проверяем, есть ли SEO данные в ответе API
      const initialSeo = data.seo || {
        title: '',
        description: '',
        keywords: '',
        og_title: '',
        og_description: '',
        og_image: '',
        twitter_title: '',
        twitter_description: '',
        twitter_image: '',
        robots: 'index, follow',
        canonical_url: '',
        yandex_verification: '',
        yandex_metrica: '',
        schema_org: '',
        hreflang: 'ru-RU',
      };
      
      console.log('[SEO Hook] Initial SEO data:', initialSeo);
      setSeo(initialSeo);
      setInitial(initialSeo);
      setHasInitialized(true);
    }
  }, [data, hasInitialized]);

  // Обработчик для обновления состояния
  const handleChange = (key, value) => {
    setSeo(prev => ({ ...prev, [key]: value }));
  };

  // Обработчик для сохранения данных
  const handleSave = async () => {
    try {
      if (!siteToken) {
        alert('Токен сайта ещё не получен. Попробуйте позже.');
        return;
      }

      await saveSEOSettings(site_name, siteToken, seo);
      alert('SEO настройки сохранены');
      await refetch();
      setInitial(seo);
    } catch (err) {
      console.error(err);
      alert('Не удалось сохранить SEO настройки: ' + err.message);
    }
  };

  // Проверка несохраненных изменений
  const isDirty = useMemo(() => {
    return JSON.stringify(seo) !== JSON.stringify(initial);
  }, [seo, initial]);

  return {
    seo,
    loading,
    hasInitialized,
    isDirty,
    handleChange,
    handleSave,
  };
};
