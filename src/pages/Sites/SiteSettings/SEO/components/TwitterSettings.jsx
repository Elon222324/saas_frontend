import { Eye } from 'lucide-react';
import TextField from './TextField';
import TextAreaField from './TextAreaField';

const TwitterSettings = ({ seo, handleChange }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      <Eye className="w-5 h-5" />
      Twitter Card
    </div>
    
    <div className="space-y-4">
      <TextField
        label="Twitter Title"
        value={seo.twitter_title}
        onChange={(val) => handleChange('twitter_title', val)}
        placeholder="Заголовок для Twitter"
        helpText="Заголовок для Twitter карточек (до 60 символов)"
        maxLength={60}
      />

      <TextAreaField
        label="Twitter Description"
        value={seo.twitter_description}
        onChange={(val) => handleChange('twitter_description', val)}
        placeholder="Описание для Twitter"
        helpText="Описание для Twitter карточек (до 160 символов)"
        maxLength={160}
        rows={3}
      />

      <TextField
        label="Twitter Image URL"
        value={seo.twitter_image}
        onChange={(val) => handleChange('twitter_image', val)}
        placeholder="https://example.com/twitter-image.jpg"
        helpText="URL изображения для Twitter (1200x675px, сжатое)"
      />
    </div>
  </div>
);

export default TwitterSettings;

