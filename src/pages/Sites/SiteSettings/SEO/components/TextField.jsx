// Компонент для текстового поля
const TextField = ({ label, value, onChange, placeholder, helpText, maxLength }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    {helpText && <p className="mt-2 text-sm text-gray-500">{helpText}</p>}
    {maxLength && (
      <p className="mt-1 text-xs text-gray-400">
        {(value || '').length}/{maxLength} символов
      </p>
    )}
  </div>
);

export default TextField;

