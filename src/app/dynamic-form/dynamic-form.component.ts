import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
import { DynamicField } from './model';

import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'outa-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    ButtonModule,
    CalendarModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    DropdownModule,
    InputSwitchModule,
    InputTextareaModule,
  ],

  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnChanges {
  @Input() metaData: DynamicField = {
    type: 'object',
    inputType: 'object',
    properties: {},
  };
  @Input() fontFamily: string =
    "'Montserrat', 'Helvetica', 'Arial', 'sans-serif'";
  @Input() gridCss: string = '';
  @Input() headerCss: string = '';
  @Input() labelCss: string = '';
  @Input() submitButtonLabel: string = 'Submit';
  @Input() sectionIndent: string = '0.4rem';
  @Input() resetButtonLabel: string = 'Clear';
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  formMetaData: DynamicField[] = [];

  mappedFormGroups: { [key: string]: FormGroup } = {};
  mappedJsonSchema: { [key: string]: DynamicField } = {};
  mappedIds: { [key: string]: string } = {};
  formOuterSchema: any = {};

  dependentForms: { [key: string]: boolean } = {};
  dependentControls: { [key: string]: string[] } = {};

  get uuid() {
    return Math.random().toString(36).substring(2);
  }

  get isFormEmpty() {
    return Object.keys(this.metaData).length === 0;
  }

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['metaData']) {
      this.initForm();
    }
  }

  initForm() {
    const rootId = this.uuid;
    this.mappedIds[rootId] = 'root';
    this.mappedJsonSchema[rootId] = this.metaData;
    let reponseGroupedForm = {};
    [this.mappedFormGroups[rootId], reponseGroupedForm] = this.generateForm(
      this.metaData
    );
    this.formOuterSchema = (() => {
      const response: any = {};
      response[rootId] = reponseGroupedForm;
      return response;
    })();
  }
  
  min = new Date(2024, 2, 1);
  max = new Date(2024, 3, 1);

  getFormPropertyKeys(properties: DynamicField) {
    return Object.keys(properties);
  }

  cancelCallback() {
    this.cancel.emit();
  }

  submitForm() {
    let valid = true;
    for (let key in this.mappedFormGroups) {
      if (
        (this.dependentForms[key] ?? false) === false &&
        this.mappedFormGroups[key].invalid
      ) {
        valid = false;
        this.mappedFormGroups[key].markAllAsTouched();
        this.mappedFormGroups[key].markAsDirty();
      }
    }
    if (!valid) return;

    const setFormData = (schema: any) => {
      const response: any = {};
      const keys = Object.keys(schema);
      if (keys) {
        keys.forEach((key) => {
          if ((this.dependentForms[key] ?? false) === false)
            response[this.mappedIds[key]] = {
              ...setFormData(schema[key]),
              ...this.mappedFormGroups[key].value,
            };
        });
      }
      return response;
    };
    const formData = setFormData(this.formOuterSchema);
    this.submit.emit(formData.root);
  }

  resetForm() {
    Object.values(this.mappedFormGroups).forEach((formGroup) => {
      // store all control name with type array in arrayControls
      const arrayControls: string[] = [];
      Object.keys(formGroup.controls).forEach((key) => {
        if (formGroup.get(key)?.value instanceof Array) arrayControls.push(key);
      });
      formGroup.reset();
      // reset all array controls
      arrayControls.forEach((control) => {
        formGroup.get(control)?.setValue([]);
      });
    });
    Object.keys(this.dependentForms).forEach((key) => {
      this.dependentForms[key] = true;
    });
    Object.keys(this.dependentControls).forEach((key) => {
      this.dependentControls[key].forEach((control) => {
        this.mappedFormGroups[key].removeControl(control);
      });
    });
  }

  generateForm(data: DynamicField): [FormGroup, any] {
    const fg = this.fb.group({});
    const schema: any = {};
    if (!Object.keys(data).includes('properties')) return [fg, schema];

    const properties = (data as any).properties;
    const mappedDependentFormKeys: {
      [key: string]: string;
    } = {};
    // first have to calculate all the dependent forms
    Object.keys(properties).forEach((key) => {
      if (properties[key].type === 'object') {
        const id = this.uuid;
        this.dependentForms[id] = properties[key].isDependent ?? false;
        const [form, _schema] = this.generateForm(properties[key]);
        this.mappedIds[id] = key;
        this.mappedFormGroups[id] = form;
        schema[id] = _schema;
        this.mappedJsonSchema[id] = properties[key];
        mappedDependentFormKeys[key] = id;
      }
    });

    Object.keys(properties).forEach((key) => {
      if (
        properties[key].type !== 'object' &&
        properties[key].type !== 'array' &&
        properties[key].type !== 'null'
      ) {
        if (properties[key].isDependent) return;
        let validations = [];
        let defaultValue = null;
        if (
          properties[key].inputType === 'textarea' ||
          properties[key].inputType === 'text'
        ) {
          if (properties[key].maxLength !== undefined)
            validations.push(Validators.maxLength(properties[key].maxLength!));

          if (properties[key].minLength !== undefined)
            validations.push(Validators.minLength(properties[key].minLength!));

          defaultValue = '';
        } else if (properties[key].inputType === 'number') {
          if (properties[key].maximum !== undefined)
            validations.push(Validators.max(properties[key].maximum!));
          if (properties[key].minimum !== undefined)
            validations.push(Validators.min(properties[key].minimum!));
        } else if (properties[key].inputType === 'multi-select') {
          defaultValue = <any>[];
        } else if (properties[key].inputType === 'date') {
          defaultValue = properties[key].default
            ? Date.parse(properties[key].default)
            : null;
          // properties[key].maximum = properties[key].maximum ?? '9999-12-31';
          // properties[key].minimum = properties[key].minimum ?? '1970-01-01';

          validations.push(
            (
              (maxDates: Date) => (control: any) =>
                new Date(control.value) > maxDates
                  ? {
                      max: { max: maxDates.toISOString().split('T')[0] },
                      actual: control.value,
                    }
                  : null
            )(new Date(properties[key].maximum))
          );

          validations.push(
            (
              (minDate: Date) => (control: any) =>
                new Date(control.value) < minDate
                  ? {
                      min: { min: minDate.toISOString().split('T')[0] },
                      actual: control.value,
                    }
                  : null
            )(new Date(properties[key].minimum))
          );
        }
        if ((data as any).required?.includes(key))
          validations.push(Validators.required);

        if (properties[key].pattern)
          validations.push(Validators.pattern(properties[key].pattern!));

        fg.addControl(
          key,
          this.fb.control(
            properties[key].value !== undefined
              ? properties[key].value
              : defaultValue,
            validations
          )
        );
        if (
          properties[key].inputType === 'radio' ||
          properties[key].inputType === 'mcq'
        ) {
          properties[key].options.forEach((option: any) => {
            if (option.dependents)
              for (let i = 0; i < option.dependents.length; ++i) {
                if (mappedDependentFormKeys[option.dependents[i]]) {
                  option.dependents[i] =
                    mappedDependentFormKeys[option.dependents[i]];
                }
              }
          });
        }
      } else if (
        properties[key].type === 'object' &&
        !properties[key].isDependent
      ) {
        const id = this.uuid;
        const [form, _schema] = this.generateForm(properties[key]);
        this.mappedIds[id] = key;
        this.mappedFormGroups[id] = form;
        schema[id] = _schema;
        this.mappedJsonSchema[id] = properties[key];
        this.dependentForms[id] = false;
      }
    });
    return [fg, schema];
  }

  getKeys(obj: any) {
    return Object.keys(obj);
  }

  checkIfRequired(key: string, group: FormGroup) {
    return group.get(key)?.hasValidator(Validators.required);
  }

  nameGetter(item: any, optionValue: any) {
    return item.label ?? item[optionValue];
  }

  clearAllDropdownValues(group: FormGroup, control: any) {
    group.get(control)?.setValue([]);
  }

  selectAllDropdownValues(group: FormGroup, control: any, options: any) {
    group.get(control)?.setValue(options.map((option: any) => option.value));
  }
  // getDependents(options: any[], value:any)
  // {

  // }

  // getDependents(options: any[], value: any) {
  //   options.forEach((option) => {
  //     if (option.value === value) {
  //       if (option.dependents) {
  //         option.dependents.forEach((dependent: any) => {
  //           console.log('Dependent:', dependent);
  //           // Do something with the dependent value here
  //         });
  //       }
  //     }
  //   });
  // }
  getDependents(options: any[], value: any): string[] {
    let dependents: string[] = [];
    options.forEach((option) => {
      if (option.value === value && option.dependents) {
        dependents = [...option.dependents];
      }
    });
    return dependents;
  }

  radioChange(
    group: FormGroup,
    control: string,
    dependents: any[],
    model: any,
    key: string
  ) {
    // REMOVE ALL DEPENDENTS FROM GROUP
    model[control].options.forEach((option: any) => {
      if (option.dependents) {
        option.dependents.forEach((dependent: any) => {
          const actualKey = this.mappedIds[dependent];
          if (!actualKey) {
            group.removeControl(dependent);
            if (this.dependentControls[key]) {
              const index = this.dependentControls[key].indexOf(dependent);
              if (index > -1) this.dependentControls[key].splice(index, 1);
            }
          } else {
            if (model[actualKey]?.inputType !== 'object') {
              group.addControl(
                dependent,
                new FormControl((model[actualKey] as any)?.default)
              );
            } else if (model[actualKey]?.inputType === 'object') {
              this.dependentForms[dependent] = true;
            }
          }
        });
      }
    });
    // ADD DEPENDENTS TO GROUP USING MODEL
    dependents?.forEach((dependent) => {
      const actualKey = this.mappedIds[dependent];
      if (model[actualKey]?.inputType !== 'object') {
        if (this.dependentControls[key])
          this.dependentControls[key].push(dependent);
        else this.dependentControls[key] = [dependent];
        group.addControl(
          dependent,
          new FormControl((model[actualKey] as any)?.default)
        );
        this.dependentControls;
      } else if (model[actualKey]?.inputType === 'object') {
        this.dependentForms[dependent] = false;
      }
    });
  }

  getFieldCssClass(
    isDependent: boolean | undefined,
    styleClass: string | undefined
  ) {
    return `grid-item ${isDependent ? ' ml-3 ' : ''}
      ${styleClass ?? ' col-12 '} `;
  }

  getIndependentPropertyKeys(properties: { [key: string]: DynamicField }) {
    return Object.keys(properties).filter(
      (key) => !properties[key].isDependent
    );
  }
}
