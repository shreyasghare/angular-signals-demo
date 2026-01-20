import { JsonPipe } from '@angular/common';
import { Component, computed, model, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserFormComponent, UserSubmittedEvent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-registration-demo',
  imports: [JsonPipe, UserFormComponent, RouterLink],
  templateUrl: './user-registration-demo.component.html',
  styleUrl: './user-registration-demo.component.css'
})
export class UserRegistrationDemoComponent {
  // Basic signals
  firstName = signal<string>('');
  lastName = signal<string>('');
  age = signal<number>(0);
  email = signal<string>('');

  // Computed signals
  fullName = computed((): string => {
    const first = this.firstName().trim();
    const last = this.lastName().trim();
    return first && last ? `${first} ${last}` : '';
  });

  ageCategory = computed((): string => {
    const ageValue = this.age();
    if (ageValue === 0) return '';
    if (ageValue < 13) return 'Child';
    if (ageValue < 18) return 'Teenager';
    if (ageValue < 65) return 'Adult';
    return 'Senior';
  });

  isFormValid = computed((): boolean => {
    return !!(
      this.firstName().trim() &&
      this.lastName().trim() &&
      this.age() > 0 &&
      this.email().trim() &&
      this.email().includes('@')
    );
  });

  formSummary = computed((): {
    firstName: string;
    lastName: string;
    fullName: string;
    age: number;
    ageCategory: string;
    email: string;
    sharedValue: string;
  } => {
    return {
      firstName: this.firstName(),
      lastName: this.lastName(),
      fullName: this.fullName(),
      age: this.age(),
      ageCategory: this.ageCategory(),
      email: this.email(),
      sharedValue: this.sharedValue()
    };
  });

  // Model signal for two-way binding
  sharedValue = model<string>('');

  // Source selection for computed transformation
  computedSource = signal<'firstName' | 'lastName' | 'email' | 'sharedValue'>('firstName');

  // Get the selected source value based on computedSource signal
  selectedSourceValue = computed((): string => {
    const source = this.computedSource();
    switch (source) {
      case 'firstName': return this.firstName();
      case 'lastName': return this.lastName();
      case 'email': return this.email();
      case 'sharedValue': return this.sharedValue();
      default: return '';
    }
  });

  // Generic computation that transforms the source value based on selected source
  computedTransformation = computed((): string => {
    const source = this.computedSource();
    const value = this.selectedSourceValue();

    if (!value) return 'No value to transform';

    switch (source) {
      case 'firstName':
        return `Hello, ${value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}!`;
      case 'lastName':
        return `Family name: ${value.toUpperCase()}`;
      case 'email':
        const domain = value.includes('@') ? value.split('@')[1] : 'invalid';
        return `Email domain: ${domain}`;
      case 'sharedValue':
        return `[${value.length} chars] "${value}"`;
      default:
        return value;
    }
  });

  // Output signal handler for user form submission events
  outputData = signal<UserSubmittedEvent | null>(null);

  // Generic update method for string signals
  updateSignal(signalRef: WritableSignal<string>, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      signalRef.set(target.value);
    }
  }

  // Update method for age (number) with validation
  updateAge(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = parseInt(target.value, 10);
      this.age.set(isNaN(value) ? 0 : value);
    }
  }

  // Change computed source for transformation demonstration
  changeComputedSource(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.computedSource.set(target.value as 'firstName' | 'lastName' | 'email' | 'sharedValue');
    }
  }

  // Reset all form fields to initial state
  resetForm(): void {
    this.firstName.set('');
    this.lastName.set('');
    this.age.set(0);
    this.email.set('');
    this.sharedValue.set('');
  }

  // Handle user form submission event from child component
  onUserSubmitted(event: UserSubmittedEvent): void {
    this.outputData.set(event);
  }

  // Format timestamp for display in user-friendly format
  formatOutputTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}
