export const navigationSchema = [
  {
    key: "custom_appearance",
    label: "Изменить внешний вид блока (цвета, граница, фон)",
    type: "boolean",
    default: false,
    editable: true
  },
  {
    key: "bg_color",
    label: "Фон навигации",
    type: "color",
    default: "#FFFFFF",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "text_color",
    label: "Цвет текста меню",
    type: "color",
    default: "#212121",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "hover_color",
    label: "Цвет при наведении",
    type: "color",
    default: "#1976D2",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "border_color",
    label: "Цвет нижней границы",
    type: "color",
    default: "#E5E7EB",
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: "show_border",
    label: "Показать нижнюю границу",
    type: "boolean",
    default: true,
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
