import {Component} from '@angular/core';
import {FormGroup, AbstractControl} from "@angular/forms";

@Component({
  template: ''
})
export abstract class BaseFormComponent {
// the form model
  form!: FormGroup;

  constructor() {
  }


  getErrors(control: AbstractControl, displayName: string,customerMessage:{[key:string]:string}|null=null): string[] {
    var errors: string[] = [];
    Object.keys(control.errors || {}).forEach((key) => {
      switch (key) {
        case 'required':
          errors.push(`${displayName} ${customerMessage?.[key] ?? 'is required'} `);
          break;
        case 'pattern':
          errors.push(`${displayName}  ${customerMessage?.[key] ?? 'contains invalid characters.'}`);
          break;
        case 'isDupeField':
          errors.push(`${displayName} ${customerMessage?.[key] ?? 'already exists: please choose another.'}`);
          break;
        default:
          errors.push(`${displayName} is invalid.`);
          break;
      }
    });
    return errors;
  }
}
