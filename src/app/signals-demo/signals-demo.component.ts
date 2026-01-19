import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, linkedSignal, model, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserFormComponent, UserSubmittedEvent } from '../user-form/user-form.component';

// Interface for Post data from API
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-signals-demo',
  imports: [JsonPipe, UserFormComponent],
  templateUrl: './signals-demo.component.html',
  styleUrl: './signals-demo.component.css'
})
export class SignalsDemoComponent {
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
  // This demonstrates LinkedSignal - it reacts to sharedValue changes but can also be set directly
  linkedDisplayValue = linkedSignal<string, string>({
    source: this.sharedValue,
    computation: (sourceValue, previous) => {
      // If source changed, use source value
      // If linked signal was written to directly, keep the previous value if it's different from source
      return previous && previous.value !== sourceValue ? previous.value as string : sourceValue;
    }
  });

  // Another LinkedSignal example: Formatted full name that can be edited
  // This creates a linked signal that formats the full name but can be overridden
  editableFullName = linkedSignal<string, string>({
    source: this.fullName,
    computation: (sourceValue, previous) => {
      // If user hasn't edited it, use computed value
      // If user edited it, keep the edited value
      return previous && previous.value !== sourceValue ? previous.value as string : sourceValue;
    }
  });

  // LinkedSignal for age with validation - keeps valid age, resets if invalid
  validatedAge = linkedSignal<number, number>({
    source: this.age,
    computation: (sourceValue, previous) => {
      // Keep previous value if source is invalid (0 or negative)
      // Otherwise use source value
      if (sourceValue <= 0 && previous && (previous.value as number) > 0) {
        return previous.value as number;
      }
      return sourceValue;
    }
  });

  constructor(private http: HttpClient) {
    // Effect to log form changes
    effect(() => {
      const summary = this.formSummary();
      console.log('Form changed:', summary);
    });

    // Effect to update document title
    effect(() => {
      const name = this.fullName();
      if (name) {
        document.title = `Signals Demo - ${name}`;
      } else {
        document.title = 'Angular Signals Demo';
      }
    });

    // Posts are automatically loaded via rxResource
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

  // Output signal handler with proper typing
  outputData = signal<UserSubmittedEvent | null>(null);

  onUserSubmitted(event: UserSubmittedEvent): void {
    console.log('User submitted from child component:', event);
    // Store the output signal value
    this.outputData.set(event);
  }

  // Format timestamp for display
  formatOutputTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  // Post Search API functionality with rxResource
  searchQuery = signal<string>('');

  // rxResource for fetching posts from API
  postsResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
    }
  });

  // Computed signal to get posts from resource
  allPosts = computed(() => {
    const value = this.postsResource.value();
    return value ?? [];
  });

  // Computed signal for filtered posts based on search query
  filteredPosts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allPosts = this.allPosts();

    if (!query) {
      // Return first 10 posts when no search query
      return allPosts.slice(0, 10);
    }

    const filtered = allPosts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.id.toString().includes(query) ||
      post.userId.toString().includes(query)
    );

    // Limit to 10 posts maximum
    return filtered.slice(0, 10);
  });

  // Computed signal for post count
  postCount = computed(() => this.allPosts().length);
  filteredPostCount = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return Math.min(10, this.postCount());
    }
    const allPosts = this.allPosts();
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.id.toString().includes(query) ||
      post.userId.toString().includes(query)
    ).length;
  });

  // Computed signals for loading and error states from rxResource
  isLoading = computed(() => this.postsResource.isLoading());
  error = computed(() => {
    const error = this.postsResource.error();
    return error ? 'Failed to load posts. Please try again later.' : null;
  });

  // Method to update search query
  updateSearchQuery(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchQuery.set(target.value);
    }
  }

  // Method to clear search
  clearSearch(): void {
    this.searchQuery.set('');
  }
}
