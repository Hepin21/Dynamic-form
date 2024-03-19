interface BaseDynamicField {
  type: string | string[];
  isDependent?: boolean;
  styleClass?: string;
  label?: string;
  description?: string;
  value?: any;
  jsonPath?: string;
}

interface DynamicTextField extends BaseDynamicField {
  inputType: 'text';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  placeholder?: string;
}
interface DynamicTextAreaField extends BaseDynamicField {
  inputType: 'textarea';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
}

interface DynamicNumberField extends BaseDynamicField {
  inputType: 'number';
  maximum?: number;
  minimum?: number;
  placeholder?: string;
}

interface DynamicSwitchField extends BaseDynamicField {
  inputType: 'switch';
}

interface DynamicRadioField extends BaseDynamicField {
  inputType: 'radio' | 'mcq';
  options: { label: string; value: any; dependents?: string[] }[];
  optionValue?: string;
}

interface DynamicSelectField extends BaseDynamicField {
  inputType: 'select' | 'multi-select';
  options: { label: string; value: any }[];
  placeholder?: string;
  optionValue?: string;
  optionLabel?: string;
}

interface DynamicDateField extends BaseDynamicField {
  inputType: 'date';
  minimum?: string;
  maximum?: string;
  format?: 'MM/dd/yyyy';
  placeholder?: string;
}

export interface DynamicDateTimeField extends BaseDynamicField {
  inputType: 'datetime';
  minimum?: string;
  maximum?: string;
  format?: 'MM/dd/yyyy HH:mm aa';
  placeholder?: string;
}

interface DynamicObjectField extends BaseDynamicField {
  inputType: 'object';
  properties: {
    [key: string]: DynamicField;
  };
  required?: string[];
}

export type DynamicField =
  | DynamicTextField
  | DynamicNumberField
  | DynamicSwitchField
  | DynamicRadioField
  | DynamicDateField
  | DynamicSelectField
  | DynamicDateTimeField
  | DynamicTextAreaField
  | DynamicObjectField;
