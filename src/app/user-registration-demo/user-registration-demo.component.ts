import { JsonPipe } from '@angular/common';
import { Component, computed, effect, linkedSignal, model, signal } from '@angular/core';
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
  fullName = computed(() => {
    const first = this.firstName().trim();
    const last = this.lastName().trim();
    return first && last ? `${first} ${last}` : '';
  });

  ageCategory = computed(() => {
    const ageValue = this.age();
    if (ageValue === 0) return '';
    if (ageValue < 13) return 'Child';
    if (ageValue < 18) return 'Teenager';
    if (ageValue < 65) return 'Adult';
    return 'Senior';
  });

  isFormValid = computed(() => {
    return !!(
      this.firstName().trim() &&
      this.lastName().trim() &&
      this.age() > 0 &&
      this.email().trim() &&
      this.email().includes('@')
    );
  });

  formSummary = computed(() => {
    return {
      firstName: this.firstName(),
      lastName: this.lastName(),
      fullName: this.fullName(),
      age: this.age(),
      ageCategory: this.ageCategory(),
      email: this.email(),
      preferences: this.userPreferences(),
      sharedValue: this.sharedValue()
    };
  });

  // Signal with object (using update())
  userPreferences = signal<{ notifications: boolean; theme: string }>({
    notifications: false,
    theme: 'light'
  });

  // Model signal for two-way binding
  sharedValue = model<string>('');

  // LinkedSignal: A writable signal that is derived from sharedValue but can be written to independently
  linkedDisplayValue = linkedSignal<string, string>({
    source: this.sharedValue,
    computation: (sourceValue, previous) => {
      return previous && previous.value !== sourceValue ? previous.value as string : sourceValue;
    }
  });

  // Another LinkedSignal example: Formatted full name that can be edited
  editableFullName = linkedSignal<string, string>({
    source: this.fullName,
    computation: (sourceValue, previous) => {
      return previous && previous.value !== sourceValue ? previous.value as string : sourceValue;
    }
  });

  // LinkedSignal for age with validation - keeps valid age, resets if invalid
  validatedAge = linkedSignal<number, number>({
    source: this.age,
    computation: (sourceValue, previous) => {
      if (sourceValue <= 0 && previous && (previous.value as number) > 0) {
        return previous.value as number;
      }
      return sourceValue;
    }
  });

  constructor() {
    // Effect to log form changes
    effect(() => {
      const summary = this.formSummary();
      console.log('Form changed:', summary);
    });

    // Effect to update document title
    effect(() => {
      const name = this.fullName();
      if (name) {
        document.title = `User Registration - ${name}`;
      } else {
        document.title = 'User Registration Demo';
      }
    });
  }

  // Update methods with proper event handling
  updateFirstName(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.firstName.set(target.value);
    }
  }

  updateLastName(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.lastName.set(target.value);
    }
  }

  updateAge(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = parseInt(target.value, 10);
      this.age.set(isNaN(value) ? 0 : value);
    }
  }

  updateEmail(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.email.set(target.value);
    }
  }

  updateSharedValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.sharedValue.set(target.value);
    }
  }

  // Update methods for LinkedSignal
  updateLinkedDisplayValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.linkedDisplayValue.set(target.value);
    }
  }

  updateEditableFullName(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.editableFullName.set(target.value);
    }
  }

  toggleNotifications(): void {
    this.userPreferences.update(prefs => ({
      ...prefs,
      notifications: !prefs.notifications
    }));
  }

  updateTheme(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.userPreferences.update(prefs => ({
        ...prefs,
        theme: target.value
      }));
    }
  }

  resetForm(): void {
    this.firstName.set('');
    this.lastName.set('');
    this.age.set(0);
    this.email.set('');
    this.userPreferences.set({
      notifications: false,
      theme: 'light'
    });
    this.sharedValue.set('');
  }

  // Output signal handler
  outputData = signal<UserSubmittedEvent | null>(null);

  onUserSubmitted(event: UserSubmittedEvent): void {
    console.log('User submitted from child component:', event);
    this.outputData.set(event);
  }

  // Format timestamp for display
  formatOutputTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}
