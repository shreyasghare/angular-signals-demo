import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, linkedSignal, model, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { UserSubmittedEvent } from '../user-form/user-form.component';

// Interface for Post data from API
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-signals-demo',
  imports: [RouterLink],
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
    preferences: { notifications: boolean; theme: string };
    sharedValue: string;
  } => {
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

  // LinkedSignal: writable signal derived from sharedValue but can be written to independently
  linkedDisplayValue = linkedSignal<string, string>({
    source: this.sharedValue,
    computation: (sourceValue: string, previous: { value: string } | undefined): string => {
      // Keep previous value if linked signal was written directly, otherwise use source value
      return previous && previous.value !== sourceValue ? previous.value : sourceValue;
    }
  });

  // LinkedSignal example: formatted full name that can be edited independently
  editableFullName = linkedSignal<string, string>({
    source: this.fullName,
    computation: (sourceValue: string, previous: { value: string } | undefined): string => {
      // Keep edited value if user modified it, otherwise use computed value
      return previous && previous.value !== sourceValue ? previous.value : sourceValue;
    }
  });

  // LinkedSignal for age with validation - keeps valid age, resets if invalid
  validatedAge = linkedSignal<number, number>({
    source: this.age,
    computation: (sourceValue: number, previous: { value: number } | undefined): number => {
      // Keep previous valid value if source is invalid (0 or negative)
      if (sourceValue <= 0 && previous && previous.value > 0) {
        return previous.value;
      }
      return sourceValue;
    }
  });

  constructor(private http: HttpClient) {
    // Effect to update document title based on full name
    effect(() => {
      const name = this.fullName();
      document.title = name ? `Signals Demo - ${name}` : 'Angular Signals Demo';
    });
  }

  // Update methods with proper event handling and type safety
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
    // Store the output signal value from child component
    this.outputData.set(event);
  }

  // Format timestamp for display in user-friendly format
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
  allPosts = computed((): Post[] => {
    const value = this.postsResource.value();
    return value ?? [];
  });

  // Computed signal for filtered posts based on search query
  filteredPosts = computed((): Post[] => {
    const query = this.searchQuery().toLowerCase().trim();
    const allPosts = this.allPosts();

    if (!query) {
      return allPosts.slice(0, 10);
    }

    // Filter posts by title, body, id, or userId matching the query
    const filtered = allPosts.filter((post: Post) =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.id.toString().includes(query) ||
      post.userId.toString().includes(query)
    );

    return filtered.slice(0, 10);
  });

  // Computed signal for total post count
  postCount = computed((): number => this.allPosts().length);
  
  // Computed signal for filtered post count
  filteredPostCount = computed((): number => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return Math.min(10, this.postCount());
    }
    const allPosts = this.allPosts();
    return allPosts.filter((post: Post) =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.id.toString().includes(query) ||
      post.userId.toString().includes(query)
    ).length;
  });

  // Computed signals for loading and error states from rxResource
  isLoading = computed((): boolean => this.postsResource.isLoading());
  error = computed((): string | null => {
    const resourceError = this.postsResource.error();
    return resourceError ? 'Failed to load posts. Please try again later.' : null;
  });

  // Update search query from input event
  updateSearchQuery(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchQuery.set(target.value);
    }
  }

  // Clear search query and reset filter
  clearSearch(): void {
    this.searchQuery.set('');
  }
}
