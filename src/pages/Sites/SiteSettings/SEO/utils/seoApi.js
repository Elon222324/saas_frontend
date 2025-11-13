const baseDomain = import.meta.env.VITE_BASE_DOMAIN;

export const saveSEOSettings = async (siteName, siteToken, seoData) => {
  // Убираем суффикс _app для нового API
  const siteNameForApi = siteName.replace('_app', '');
  const url = `https://${siteNameForApi}.${baseDomain}/site-api/site-info`;

  const payload = {
    seo: {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      og_title: seoData.og_title,
      og_description: seoData.og_description,
      og_image: seoData.og_image,
      twitter_title: seoData.twitter_title,
      twitter_description: seoData.twitter_description,
      twitter_image: seoData.twitter_image,
      robots: seoData.robots,
      canonical_url: seoData.canonical_url,
      yandex_verification: seoData.yandex_verification,
      yandex_metrica: seoData.yandex_metrica,
      schema_org: seoData.schema_org,
      hreflang: seoData.hreflang,
    }
  };

  console.log('🔑 [SEO] → сохраняю SEO настройки:', url);
  console.log('🔑 [SEO] → данные:', payload);

  const res = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  console.log('🔑 [SEO] ← статус ответа:', res.status, res.statusText);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('🔑 [SEO] ❌ Ошибка:', errorText);
    throw new Error('Ошибка сохранения: ' + errorText);
  }

  return res;
};

