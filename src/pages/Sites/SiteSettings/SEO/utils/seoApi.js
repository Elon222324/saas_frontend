const API_URL = import.meta.env.VITE_API_URL;

export const saveSEOSettings = async (siteName, seoData) => {
  const payload = {
    'seo.title': seoData.title,
    'seo.description': seoData.description,
    'seo.keywords': seoData.keywords,
    'seo.og_title': seoData.og_title,
    'seo.og_description': seoData.og_description,
    'seo.og_image': seoData.og_image,
    'seo.twitter_title': seoData.twitter_title,
    'seo.twitter_description': seoData.twitter_description,
    'seo.twitter_image': seoData.twitter_image,
    'seo.robots': seoData.robots,
    'seo.canonical_url': seoData.canonical_url,
    'seo.yandex_verification': seoData.yandex_verification,
    'seo.yandex_metrica': seoData.yandex_metrica,
    'seo.schema_org': seoData.schema_org,
    'seo.hreflang': seoData.hreflang,
  };

  const res = await fetch(
    `${API_URL}/schema/site-settings/${siteName}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error('Ошибка сохранения');
  return res;
};

