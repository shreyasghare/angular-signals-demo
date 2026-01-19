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

  // Method to handle input event and update model signal
  onModelInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.sharedModel.set(target.value);
    }
  }

  // Method to emit output signal with proper data structure
  onSubmit(): void {
    if (!this.canSubmit()) {
      return;
    }

    const eventData: UserSubmittedEvent = {
      userName: this.userName(),
      sharedModel: this.sharedModel(),
      timestamp: Date.now()
    };

    // Update internal state
    this.submissionCount.update(count => count + 1);
    this.lastSubmission.set(eventData);

    // Emit output signal
    this.userSubmitted.emit(eventData);
  }

  // Check if form can be submitted
  canSubmit(): boolean {
    return !!this.userName();
  }

  // Format timestamp for display
  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}
