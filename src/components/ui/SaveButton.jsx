// components/SaveButton.jsx

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
  </svg>
);


export default function SaveButton({ isVisible, onSave }) {
  // Используем более мягкую анимацию 'animate-breathe' (требует настройки в tailwind.config.js)
  const animationClass = isVisible ? 'animate-breathe' : '';

  return (
    <div
      // Позиционируем внизу справа — это стандарт для FAB
      className={`
        fixed top-36 right-24 z-50
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      // Добавляем aria-live для анонса статуса скрин-ридерам
      aria-live="polite"
    >
      <button
        onClick={onSave}
        className={`
          flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl
          hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
          ${animationClass}
        `}
      >
        <SaveIcon />
        <span>Сохранить изменения</span>
      </button>
    </div>
  );
}