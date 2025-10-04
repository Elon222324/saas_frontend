// Компонент для предварительного просмотра
const SEOPreview = ({ title, description, url, image }) => (
  <div className="mt-6 p-4 border rounded-md bg-gray-50">
    <h3 className="text-sm font-semibold text-gray-700">Предпросмотр в поиске</h3>
    <div className="mt-2">
      <p className="text-blue-600 text-sm font-medium">{title || 'Название вашего сайта'}</p>
      <p className="text-green-600 text-xs">{url}</p>
      <p className="text-gray-600 text-sm">{description || 'Краткое описание вашего сайта'}</p>
      {image && <img src={image} alt="Preview" className="mt-2 w-32 h-16 object-cover rounded" />}
    </div>
  </div>
);

export default SEOPreview;

