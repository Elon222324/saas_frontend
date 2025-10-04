import { MapPin } from 'lucide-react';
import TextAreaField from './TextAreaField';

const SchemaSettings = ({ seo, handleChange }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      <MapPin className="w-5 h-5" />
      Структурированные данные (Schema.org)
    </div>

    <TextAreaField
      label="Schema.org JSON-LD"
      value={seo.schema_org}
      onChange={(val) => handleChange('schema_org', val)}
      placeholder='{"@context": "https://schema.org", "@type": "WebSite", "name": "Ваш сайт", "url": "https://example.com"}'
      helpText="JSON-LD для улучшения индексации в Яндекс и Google"
      rows={5}
    />
  </div>
);

export default SchemaSettings;

