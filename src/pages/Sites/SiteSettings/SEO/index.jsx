import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Info, Search } from 'lucide-react';
import { useSEOSettings } from './hooks/useSEOSettings';
import BasicSettings from './components/BasicSettings';
import OpenGraphSettings from './components/OpenGraphSettings';
import TwitterSettings from './components/TwitterSettings';
import SchemaSettings from './components/SchemaSettings';
import SEOPreview from './components/SEOPreview';

export default function SEOSettings() {
  const { domain } = useParams();
  const { seo, loading, hasInitialized, isDirty, handleChange, handleSave } = useSEOSettings();

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN;
  const full_domain = `${domain}.${baseDomain}`;

  if (loading || !hasInitialized) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Search className="w-6 h-6" />
          SEO настройки: {full_domain}
        </h1>
        <Link
          to={`/settings/${domain}/pages`}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          ← Назад
        </Link>
      </div>

      <div className="flex items-center text-gray-500 text-sm mb-4">
        <Info size={16} className="mr-2" />
        Настройте мета-теги для улучшения видимости в Яндекс, Google и соцсетях (например, ВКонтакте).
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BasicSettings seo={seo} handleChange={handleChange} />
        
        <div className="space-y-8">
          <OpenGraphSettings seo={seo} handleChange={handleChange} />
          <TwitterSettings seo={seo} handleChange={handleChange} />
          <SchemaSettings seo={seo} handleChange={handleChange} />
        </div>
      </div>

      <SEOPreview
        title={seo.title}
        description={seo.description}
        url={full_domain}
        image={seo.og_image}
      />

      <div className="flex justify-between pt-6 border-t">
        <Button 
          onClick={handleSave} 
          variant="outline"
          className="px-6"
        >
          Инициализировать SEO
        </Button>
        <Button onClick={handleSave} disabled={!isDirty} className="px-8">
          Сохранить SEO настройки
        </Button>
      </div>
    </div>
  );
}