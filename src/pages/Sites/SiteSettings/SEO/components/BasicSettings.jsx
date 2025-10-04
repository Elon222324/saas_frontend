import { Search } from 'lucide-react';
import TextField from './TextField';
import TextAreaField from './TextAreaField';

const BasicSettings = ({ seo, handleChange }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      <Search className="w-5 h-5" />
      Основные настройки
    </div>
    
    <div className="space-y-4">
      <TextField
        label="Title (заголовок страницы)"
        value={seo.title}
        onChange={(val) => handleChange('title', val)}
        placeholder="Название вашего сайта"
        helpText="Заголовок для Яндекс и Google (рекомендуется до 60 символов на русском)"
        maxLength={60}
      />

      <TextAreaField
        label="Description (описание)"
        value={seo.description}
        onChange={(val) => handleChange('description', val)}
        placeholder="Краткое описание вашего сайта"
        helpText="Описание для поисковиков (рекомендуется до 160 символов на русском)"
        maxLength={160}
        rows={3}
      />

      <TextField
        label="Keywords (ключевые слова)"
        value={seo.keywords}
        onChange={(val) => handleChange('keywords', val)}
        placeholder="ключевое слово 1, ключевое слово 2"
        helpText="Ключевые слова через запятую, релевантные для России"
      />

      <TextField
        label="Robots"
        value={seo.robots}
        onChange={(val) => handleChange('robots', val)}
        placeholder="index, follow"
        helpText="Инструкции для Яндекс и Google (например, index, follow)"
      />

      <TextField
        label="Canonical URL"
        value={seo.canonical_url}
        onChange={(val) => handleChange('canonical_url', val)}
        placeholder="https://example.com"
        helpText="Канонический URL для предотвращения дублирования"
      />

      <TextField
        label="Yandex Verification"
        value={seo.yandex_verification}
        onChange={(val) => handleChange('yandex_verification', val)}
        placeholder="xxxxxxxxxxxx"
        helpText="Код верификации для Яндекс.Вебмастер"
      />

      <TextField
        label="Hreflang"
        value={seo.hreflang}
        onChange={(val) => handleChange('hreflang', val)}
        placeholder="ru-RU"
        helpText="Язык и регион (например, ru-RU для России)"
      />
    </div>
  </div>
);

export default BasicSettings;

