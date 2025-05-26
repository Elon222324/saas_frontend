export const headerSchema = [
  {
    key: "custom_appearance",
    label: "Изменить внешний вид блока (цвета, кнопки и фон)",
    type: "boolean",
    default: false,
    editable: true
  },
  {
    key: "bg_color",
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
  }
]
