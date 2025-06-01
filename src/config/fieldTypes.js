import TextInput from '@/components/fields/TextInput'
import SelectInput from '@/components/fields/SelectInput'
import ColorInput from '@/components/fields/ColorInput'
import TextAreaInput from '@/components/fields/TextAreaInput'
import ToggleInput from '@/components/fields/ToggleInput'
import FontSizeInput from '@/components/fields/FontSizeInput'
import ImageInput from '@/components/fields/ImageInput'
import NumberInput from '@/components/fields/NumberInput'
import DurationInput from '@/components/fields/DurationInput'
import CheckboxField from '@/components/fields/CheckboxField'
import MultiCheckboxField from '@/components/fields/MultiCheckboxField'

export const fieldTypes = {
  text: TextInput,
  select: SelectInput,
  color: ColorInput,
  textarea: TextAreaInput,
  boolean: ToggleInput,
  fontsize: FontSizeInput,
  image: ImageInput,
  number: NumberInput,
  duration: DurationInput,
  checkbox: CheckboxField,
  multicheckbox: MultiCheckboxField,
}
