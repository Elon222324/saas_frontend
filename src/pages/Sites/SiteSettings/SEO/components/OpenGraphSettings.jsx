import { Globe } from 'lucide-react';
import TextField from './TextField';
import TextAreaField from './TextAreaField';

const OpenGraphSettings = ({ seo, handleChange }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      <Globe className="w-5 h-5" />
      Open Graph (ВКонтакте, Telegram)
    </div>
    
    <div className="space-y-4">
      <TextField
        label="OG Title"
        value={seo.og_title}
        onChange={(val) => handleChange('og_title', val)}
        placeholder="Заголовок для соцсетей"
        helpText="Заголовок для ВКонтакте и Telegram (до 60 символов)"
        maxLength={60}
      />

      <TextAreaField
        label="OG Description"
        value={seo.og_description}
        onChange={(val) => handleChange('og_description', val)}
        placeholder="Описание для соцсетей"
        helpText="Описание для ВКонтакте и Telegram (до 160 символов)"
        maxLength={160}
        rows={3}
      />

      <TextField
        label="OG Image URL"
        value={seo.og_image}
        onChange={(val) => handleChange('og_image', val)}
        placeholder="https://example.com/image.jpg"
        helpText="URL изображения (1200x630px, сжатое, <100KB)"
      />
    </div>
  </div>
);

export default OpenGraphSettings;

