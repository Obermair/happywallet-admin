import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Option {
  value: string;
  text: string;
}

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-select.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() options: Option[] = [];
  @Input() disabled: boolean = false;

  selectedOptions: string[] = [];
  isOpen = false;

  // Angular callbacks
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  // Wird von Angular aufgerufen, wenn ein Wert von außen gesetzt wird
  writeValue(value: string[]): void {
    this.selectedOptions = value || [];
  }

  // Angular ruft das auf, um "Wertänderungen" zu abonnieren
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  // Angular ruft das auf, um "Touch-Events" zu abonnieren
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown() {
    if (!this.disabled) this.isOpen = !this.isOpen;
  }

  handleSelect(optionValue: string) {
    if (this.selectedOptions.includes(optionValue)) {
      this.selectedOptions = this.selectedOptions.filter(v => v !== optionValue);
    } else {
      this.selectedOptions = [...this.selectedOptions, optionValue];
    }
    this.onChange(this.selectedOptions); // Angular informieren
    this.onTouched();
  }

  removeOption(value: string) {
    this.selectedOptions = this.selectedOptions.filter(opt => opt !== value);
    this.onChange(this.selectedOptions); // Angular informieren
    this.onTouched();
  }

  get selectedValuesText(): string[] {
    return this.selectedOptions
      .map(value => this.options.find(option => option.value === value)?.text || '')
      .filter(Boolean);
  }
}
