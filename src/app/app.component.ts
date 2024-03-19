import { Component } from '@angular/core';
import { DynamicField } from './dynamic-form/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  metadata: DynamicField = {
    type: 'object',
    inputType: 'object',
    label: 'SHERIFF_LTR',
    required: [
      'date',
      'dateSelection',
      'isMoreThanOneDefendant',
      'plaintiff',
      'extra',
    ],
    properties: {
      date: {
        type: 'string',
        inputType: 'date',
        styleClass: 'col-6',
        description: 'Date',
        minimum: '2024-01-01',
        maximum: '2024-03-31',
      },
      datetime: {
        type: 'string',
        inputType: 'datetime',
        styleClass: 'col-3',
        description: 'Date',
      },
      dateSelection: {
        type: 'string',
        inputType: 'select',
        styleClass: 'col-3',
        options: [
          {
            label: 'Today',
            value: 'today',
          },
          {
            label: 'Next Business Day',
            value: 'nextBusinessDay',
          },
          {
            label: 'Other Future date',
            value: 'otherFutureDate',
          },
        ],
        description: 'Date Sent',
        optionValue: 'value',
        // optionLabel: 'label',
      },
      days: {
        type: 'string',
        inputType: 'multi-select',
        styleClass: 'col-4',
        options: [
          {
            label: 'Monday',
            value: 'monday',
          },
          {
            label: 'Tuesday',
            value: 'tuesday',
          },
          {
            label: 'Wednesday',
            value: 'wednesday',
          },
          {
            label: 'Thursday',
            value: 'thursday',
          },
          {
            label: 'Friday',
            value: 'friday',
          },
          {
            label: 'Saturday',
            value: 'saturday',
          },
          {
            label: 'Sunday',
            value: 'sunday',
          },
        ],
        description: 'days',
        optionValue: 'value',
        // optionLabel: 'value',
      },
      plaintiff: {
        type: 'string',
        styleClass: 'col-3',
        inputType: 'text',
        label: 'Holder/Plaintiff Name',
        description: 'Plaintiff: Ocean 18, LLC',
        value: 'Ocean 18, LLC',
      },
      primaryDefendant: {
        type: 'string',
        inputType: 'text',
        styleClass: 'col-3',
        description: 'Primary Defendant: John Doe',
      },
      extra: {
        type: 'string',
        inputType: 'textarea',
        styleClass: 'col-2',
        description: 'Extra: John Doe',
      },
      haveVehicle: {
        type: 'string',
        inputType: 'switch',
        styleClass: 'col-3',
        description: 'Have Vehicle',
      },
      isMoreThanOneDefendant: {
        type: 'boolean',
        inputType: 'mcq',
        options: [
          {
            label: 'Yes',
            value: 'true',
            dependents: ['numberOfDefendants'],
          },
          {
            label: 'No',
            value: 'dA',
            dependents: ['address'],
          },
          {
            label: 'Not Sure',
            value: 'null',
            dependents: ['personalDetails'],
          },
        ],
        styleClass: 'col-4',
        optionValue: 'value',
        description: 'More than one defendant',
      },
      address: {
        type: 'object',
        inputType: 'object',
        label: 'Address',
        isDependent: true,
        properties: {
          street: {
            type: 'string',
            inputType: 'text',
            styleClass: 'col-12',
            description: 'Street',
          },
          city: {
            type: 'string',
            inputType: 'text',
            styleClass: 'col-12',
            description: 'City',
          },
          state: {
            type: 'string',
            inputType: 'text',
            styleClass: 'col-12',
            description: 'State',
          },
          zip: {
            type: 'string',
            inputType: 'text',
            styleClass: 'col-12',
            description: 'Zip',
          },
        },
      },
      numberOfDefendants: {
        isDependent: true,
        type: 'string',
        inputType: 'number',
        styleClass: 'col-4',
        description: 'How many defendants are we serving?',
      },
      sheriffsName: {
        type: 'string',
        inputType: 'text',
        styleClass: 'col-12',
        description: "Sheriff's Actual Name, if known",
      },
      personalDetails: {
        isDependent: true,
        type: 'object',
        inputType: 'object',
        required: ['firstName'],
        properties: {
          firstName: {
            type: 'string',
            inputType: 'text',
            styleClass: 'col-12',
            description: 'First Name',
          },
          lastName: {
            type: 'string',
            inputType: 'text',
            styleClass: 'col-12',
            description: 'Last Name',
          },
          email: {
            type: 'string',
            inputType: 'text',
            styleClass: 'col-12',
            description: 'Email',
            pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$',
          },
          phone: {
            type: 'string',
            inputType: 'text',
            styleClass: 'col-12',
            description: 'Phone',
            maxLength: 10,
            minLength: 10,
          },
        },
      },
    },
  };

  submit(event: any) {
    alert(JSON.stringify(event, null, 2));
  }

  cancel() {
    alert('Cancel Event');
  }
}
