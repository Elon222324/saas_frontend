export const headerSchema = [
  {
    key: "custom_appearance",
    label: "Изменить внешний вид блока (цвета, кнопки и фон)",
    type: "boolean",
    default: false,
    editable: true
  },

  // 🎨 Цвета
  {
    key: "background_color",
    label: "Фон шапки",
    type: "color",
    default: "#FFFFFF",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "text_color",
    label: "Цвет основного текста",
    type: "color",
    default: "#212121",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "secondary_color",
    label: "Цвет вторичного текста",
    type: "color",
    default: "#6B7280",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "primary_color",
    label: "Цвет акцента (hover)",
    type: "color",
    default: "#1976D2",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "button_bg_color",
    label: "Фон кнопки 'Войти'",
    type: "color",
    default: "#F3F4F6",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "button_text_color",
    label: "Текст кнопки 'Войти'",
    type: "color",
    default: "#000000",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "button_hover_color",
    label: "Hover кнопки 'Войти'",
    type: "color",
    default: "#E5E7EB",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "rating_color",
    label: "Цвет звезды рейтинга",
    type: "color",
    default: "#FACC15",
    editable: true,
    visible_if: { custom_appearance: true }
  },

  // 👁️ Видимость блоков
  {
    key: "show_login_button",
    label: "Показывать кнопку 'Войти'",
    type: "boolean",
    default: true,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "show_bonus_button",
    label: "Показывать кнопку 'Бонусы'",
    type: "boolean",
    default: true,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "show_rating",
    label: "Показывать рейтинг",
    type: "boolean",
    default: true,
    editable: true,
    visible_if: { custom_appearance: true }
  },

  // 🎯 Выравнивание
  {
    key: "alignment",
    label: "Выравнивание содержимого (логотип + текст)",
    type: "select",
    options: ["left", "center"],
    default: "left",
    editable: true,
    visible_if: { custom_appearance: true }
  },

  // 📐 Отступы
  {
    key: "padding_x",
    label: "Горизонтальный отступ (px)",
    type: "number",
    default: 16,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "padding_y",
    label: "Вертикальный отступ (px)",
    type: "number",
    default: 12,
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
