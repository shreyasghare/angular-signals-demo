import { Component, input, model, output, signal } from '@angular/core';

// Interface for output signal data
export interface UserSubmittedEvent {
  userName: string;
  sharedModel: string;
  timestamp: number;
}

@Component({
  selector: 'app-user-form',
  imports: [],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  // Input signal
  userName = input<string>('');

  // Model signal for two-way binding
  sharedModel = model<string>('');

  // Output event with proper typing
  userSubmitted = output<UserSubmittedEvent>();

  // Track submission count and last submission
  submissionCount = signal<number>(0);
  lastSubmission = signal<UserSubmittedEvent | null>(null);

  // Handle input event and update model signal for two-way binding
  onModelInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.sharedModel.set(target.value);
    }
  }

  // Emit output signal with proper data structure when form is submitted
  onSubmit(): void {
    if (!this.canSubmit()) {
      return;
    }

    const eventData: UserSubmittedEvent = {
      userName: this.userName(),
      sharedModel: this.sharedModel(),
      timestamp: Date.now()
    };

    // Update internal state and emit output signal
    this.submissionCount.update((count: number) => count + 1);
    this.lastSubmission.set(eventData);
    this.userSubmitted.emit(eventData);
  }

  // Check if form can be submitted based on userName input
  canSubmit(): boolean {
    return !!this.userName();
  }

  // Format timestamp for display in user-friendly format
  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}
