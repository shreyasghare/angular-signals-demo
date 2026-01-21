import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

interface UserInfo {
  name: string;
  age: number;
  isAdult: boolean;
}

interface ComparisonItem {
  title: string;
  rxjs: {
    label: string;
    badge: string;
    badgeClass: string;
    description: string;
    useCases?: string[];
  };
  signals: {
    label: string;
    badge: string;
    badgeClass: string;
    description: string;
    useCases?: string[];
  };
}

interface CodeExample {
  title: string;
  signalsCode: string;
  rxjsCode: string;
}

interface InteropExample {
  title: string;
  code: string;
}

interface DocLink {
  title: string;
  url: string;
}

@Component({
  selector: 'app-rxjs-vs-signals-concept',
  imports: [CommonModule, RouterLink],
  templateUrl: './rxjs-vs-signals-concept.component.html',
  styleUrl: './rxjs-vs-signals-concept.component.css'
})
export class RxjsVsSignalsConceptComponent {
  // ========== Content Data ==========
  header = {
    title: 'RxJS vs Signals',
    description: 'Understanding when to use RxJS Observables vs Angular Signals',
    videoUrl: 'https://www.youtube.com/watch?v=iA6iyoantuo',
    videoText: '📺 Reference Video: Angular Signals vs RxJS'
  };

  overview = 'Both <strong>RxJS</strong> and <strong>Angular Signals</strong> are reactive programming paradigms, but they serve different purposes and have distinct characteristics. Understanding their differences helps you choose the right tool for the job.';

  comparisonItems: ComparisonItem[] = [
    {
      title: 'Reactivity Model',
      rxjs: {
        label: 'RxJS:',
        badge: 'Push-based',
        badgeClass: 'badge-push',
        description: 'Data is pushed through pipelines to subscribers. Producers push values to consumers.'
      },
      signals: {
        label: 'Signals:',
        badge: 'Pull-based',
        badgeClass: 'badge-pull',
        description: 'Lazy evaluation - values are pulled when read. Angular automatically tracks dependencies.'
      }
    },
    {
      title: 'Complexity & Learning Curve',
      rxjs: {
        label: 'RxJS:',
        badge: 'Complex',
        badgeClass: 'badge-complex',
        description: 'Steeper learning curve with 100+ operators (map, switchMap, debounceTime, etc.). Requires understanding of streams and subscriptions.'
      },
      signals: {
        label: 'Signals:',
        badge: 'Simple',
        badgeClass: 'badge-simple',
        description: 'Cleaner API with just a few functions: signal(), computed(), effect(). More intuitive for developers.'
      }
    },
    {
      title: 'Change Detection',
      rxjs: {
        label: 'RxJS:',
        badge: 'Traditional',
        badgeClass: 'badge-traditional',
        description: 'Relies on Zone.js or async pipe for change detection. Updates entire component tree.'
      },
      signals: {
        label: 'Signals:',
        badge: 'Fine-grained',
        badgeClass: 'badge-fine',
        description: 'Enables fine-grained reactivity. Updates only specific DOM parts that changed. Enables zoneless apps.'
      }
    },
    {
      title: 'Subscription Management',
      rxjs: {
        label: 'RxJS:',
        badge: 'Manual',
        badgeClass: 'badge-manual',
        description: 'Requires manual subscription/unsubscription or async pipe. Risk of memory leaks if not handled properly.'
      },
      signals: {
        label: 'Signals:',
        badge: 'Automatic',
        badgeClass: 'badge-auto',
        description: 'No manual subscription management. Angular automatically tracks and cleans up dependencies.'
      }
    },
    {
      title: 'Use Cases',
      rxjs: {
        label: 'RxJS:',
        badge: '',
        badgeClass: '',
        description: '',
        useCases: [
          'HTTP requests & async operations',
          'WebSockets & real-time streams',
          'Complex event handling',
          'Advanced data orchestration',
          'Debouncing/throttling'
        ]
      },
      signals: {
        label: 'Signals:',
        badge: '',
        badgeClass: '',
        description: '',
        useCases: [
          'Component state management',
          'Form control values',
          'Derived/computed values',
          'UI toggles & flags',
          'Synchronous reactivity'
        ]
      }
    }
  ];

  codeExamples: CodeExample[] = [
    {
      title: 'Example 1: Basic State Management',
      signalsCode: `// Create signals
firstName = signal('John');
lastName = signal('Doe');

// Computed signal
fullName = computed(() =>
  this.firstName() + ' ' + this.lastName()
);

// Update values
this.firstName.set('Jane');
this.lastName.update(name => name.toUpperCase());

// Read values (in template)
&#123;&#123; fullName() &#125;&#125;`,
      rxjsCode: `// Create subjects
private firstName$ = new BehaviorSubject('John');
private lastName$ = new BehaviorSubject('Doe');

// Computed observable
fullName$ = combineLatest([
  this.firstName$,
  this.lastName$
]).pipe(
  map(([first, last]) => first + ' ' + last)
);

// Update values
this.firstName$.next('Jane');
this.lastName$.next(
  this.lastName$.value.toUpperCase()
);

// Read values (in template)
&#123;&#123; fullName$ | async &#125;&#125;`
    },
    {
      title: 'Example 2: Counter with Derived Value',
      signalsCode: `counter = signal(0);

// Automatically updates when counter changes
doubleCounter = computed(() =>
  this.counter() * 2
);

increment() &#123;
  this.counter.update(c => c + 1);
&#125;`,
      rxjsCode: `private counter$ = new BehaviorSubject(0);

doubleCounter$ = this.counter$.pipe(
  map(count => count * 2)
);

increment() &#123;
  this.counter$.next(
    this.counter$.value + 1
  );
&#125;`
    },
    {
      title: 'Example 3: Debounced Search',
      signalsCode: `searchQuery = signal('');

// Requires toObservable for debouncing
import &#123; toObservable &#125; from '@angular/core/rxjs-interop';

searchQueryDebounced$ = toObservable(
  this.searchQuery
).pipe(
  debounceTime(300)
);`,
      rxjsCode: `private searchQuery$ = new BehaviorSubject('');

searchQueryDebounced$ = this.searchQuery$.pipe(
  debounceTime(300),
  distinctUntilChanged()
);

updateSearch(value: string) &#123;
  this.searchQuery$.next(value);
&#125;`
    },
    {
      title: 'Example 4: Toggle State',
      signalsCode: `isDarkMode = signal(false);

toggleTheme() &#123;
  this.isDarkMode.update(mode => !mode);
&#125;

// In template
&lt;button (click)="toggleTheme()"&gt;
  &#123;&#123; isDarkMode() ? 'Light' : 'Dark' &#125;&#125; Mode
&lt;/button&gt;`,
      rxjsCode: `private isDarkMode$ = new BehaviorSubject(false);

toggleTheme() &#123;
  this.isDarkMode$.next(!this.isDarkMode$.value);
&#125;

// In template
&lt;button (click)="toggleTheme()"&gt;
  &#123;&#123; (isDarkMode$ | async) ? 'Light' : 'Dark' &#125;&#125; Mode
&lt;/button&gt;`
    },
    {
      title: 'Example 5: Form Validation',
      signalsCode: `email = signal('');
password = signal('');

isEmailValid = computed(() =>
  this.email().includes('@') && this.email().length > 5
);

isPasswordValid = computed(() =>
  this.password().length >= 8
);

isFormValid = computed(() =>
  this.isEmailValid() && this.isPasswordValid()
);`,
      rxjsCode: `private email$ = new BehaviorSubject('');
private password$ = new BehaviorSubject('');

isEmailValid$ = this.email$.pipe(
  map(email => email.includes('@') && email.length > 5)
);

isPasswordValid$ = this.password$.pipe(
  map(password => password.length >= 8)
);

isFormValid$ = combineLatest([
  this.isEmailValid$,
  this.isPasswordValid$
]).pipe(
  map(([emailValid, passwordValid]) =>
    emailValid && passwordValid
  )
);`
    },
    {
      title: 'Example 6: Filtering a List',
      signalsCode: `items = signal(['Apple', 'Banana', 'Cherry', 'Date']);
filterText = signal('');

filteredItems = computed(() =>
  this.items().filter(item =>
    item.toLowerCase().includes(
      this.filterText().toLowerCase()
    )
  )
);`,
      rxjsCode: `private items$ = new BehaviorSubject([
  'Apple', 'Banana', 'Cherry', 'Date'
]);
private filterText$ = new BehaviorSubject('');

filteredItems$ = combineLatest([
  this.items$,
  this.filterText$
]).pipe(
  map(([items, filterText]) =>
    items.filter(item =>
      item.toLowerCase().includes(
        filterText.toLowerCase()
      )
    )
  )
);`
    }
  ];

  useCases = {
    signals: {
      title: '✅ Use Signals When:',
      items: [
        'Managing component state (local variables, form values)',
        'Creating derived/computed values from other signals',
        'Handling synchronous reactivity',
        'Working with UI toggles and flags',
        'You want fine-grained change detection',
        'You need simpler, more readable code',
        'Building zoneless Angular applications'
      ]
    },
    rxjs: {
      title: '✅ Use RxJS When:',
      items: [
        'Handling HTTP requests and async operations',
        'Working with WebSockets and real-time streams',
        'Need complex event handling (debouncing, throttling)',
        'Combining multiple data sources',
        'Working with Angular Router events',
        'Need advanced operators (switchMap, mergeMap, etc.)',
        'Integrating with existing Observable-based APIs'
      ]
    }
  };

  interoperability = {
    description: 'Signals and RxJS can work together! Use <code>@angular/core/rxjs-interop</code> to bridge between them:',
    examples: [
      {
        title: 'Convert Signal to Observable',
        code: `import &#123; toObservable &#125; from '@angular/core/rxjs-interop';

// Convert Signal to Observable
const searchQuery = signal('');
const searchQuery$ = toObservable(searchQuery);

// Use RxJS operators
const debounced$ = searchQuery$.pipe(
  debounceTime(300)
);`
      },
      {
        title: 'Convert Observable to Signal',
        code: `import &#123; toSignal &#125; from '@angular/core/rxjs-interop';

// Convert Observable to Signal
const data$ = this.http.get('/api/data');
const dataSignal = toSignal(data$);

// Use in template
&#123;&#123; dataSignal() &#125;&#125;`
      }
    ]
  };

  summary = {
    paragraphs: [
      '<strong>Signals</strong> are Angular\'s new reactive primitive designed for simpler, more performant state management. They excel at component-level reactivity and enable fine-grained updates.',
      '<strong>RxJS</strong> remains essential for complex asynchronous operations, event streams, and advanced data orchestration. It\'s the go-to solution for HTTP, WebSockets, and complex event handling.',
      '<strong>Best Practice:</strong> Use Signals for component state and UI reactivity. Use RxJS for async operations and complex streams. They complement each other and can be used together via interoperability utilities.'
    ]
  };

  docLinks: DocLink[] = [
    {
      title: 'Angular Signals Documentation →',
      url: 'https://angular.dev/guide/signals'
    },
    {
      title: 'RxJS Documentation →',
      url: 'https://rxjs.dev'
    },
    {
      title: 'RxJS Interop Guide →',
      url: 'https://angular.dev/guide/signals/rxjs-interop'
    }
  ];

  interactiveDemo = {
    title: 'Interactive Comparison',
    description: 'Try the examples below to see both approaches in action:',
    userFormTitle: 'User Information Form',
    counterTitle: 'Counter with Derived Value',
    searchTitle: 'Search & Filter List',
    toggleTitle: 'Toggle State Example',
    validationTitle: 'Form Validation'
  };

  // ========== Signals Example ==========
  firstNameSignal = signal<string>('John');
  lastNameSignal = signal<string>('Doe');
  ageSignal = signal<number>(25);

  fullNameSignal = computed<string>(() => {
    return `${this.firstNameSignal()} ${this.lastNameSignal()}`;
  });

  userInfoSignal = computed<UserInfo>(() => {
    return {
      name: this.fullNameSignal(),
      age: this.ageSignal(),
      isAdult: this.ageSignal() >= 18
    };
  });

  // ========== RxJS Example ==========
  private firstNameSubject = new BehaviorSubject<string>('John');
  private lastNameSubject = new BehaviorSubject<string>('Doe');
  private ageSubject = new BehaviorSubject<number>(25);

  firstName$: Observable<string> = this.firstNameSubject.asObservable();
  lastName$: Observable<string> = this.lastNameSubject.asObservable();
  age$: Observable<number> = this.ageSubject.asObservable();

  fullName$: Observable<string> = combineLatest([
    this.firstName$,
    this.lastName$
  ]).pipe(
    map(([firstName, lastName]) => `${firstName} ${lastName}`)
  );

  userInfo$: Observable<UserInfo> = combineLatest([
    this.fullName$,
    this.age$
  ]).pipe(
    map(([name, age]): UserInfo => ({
      name,
      age,
      isAdult: age >= 18
    }))
  );

  // ========== Debounced Search Example ==========
  searchQuerySignal = signal<string>('');

  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQueryDebounced$: Observable<string> = this.searchQuerySubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  // ========== Counter Example ==========
  counterSignal = signal<number>(0);
  doubleCounterSignal = computed<number>(() => this.counterSignal() * 2);

  private counterSubject = new BehaviorSubject<number>(0);
  counter$: Observable<number> = this.counterSubject.asObservable();
  doubleCounter$: Observable<number> = this.counter$.pipe(
    map((count: number): number => count * 2)
  );

  // ========== Methods for Signals ==========
  updateFirstNameSignal(value: string): void {
    this.firstNameSignal.set(value);
  }

  updateLastNameSignal(value: string): void {
    this.lastNameSignal.set(value);
  }

  updateAgeSignal(value: number): void {
    this.ageSignal.set(value);
  }

  incrementCounterSignal(): void {
    this.counterSignal.update((count: number): number => count + 1);
  }

  decrementCounterSignal(): void {
    this.counterSignal.update((count: number): number => count - 1);
  }

  updateSearchSignal(value: string): void {
    this.searchQuerySignal.set(value);
  }

  onFirstNameSignalInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateFirstNameSignal(target.value);
    }
  }

  onLastNameSignalInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateLastNameSignal(target.value);
    }
  }

  onAgeSignalInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = Number.parseInt(target.value, 10);
      if (!Number.isNaN(value)) {
        this.updateAgeSignal(value);
      }
    }
  }

  // ========== Methods for RxJS ==========
  updateFirstNameRxJS(value: string): void {
    this.firstNameSubject.next(value);
  }

  updateLastNameRxJS(value: string): void {
    this.lastNameSubject.next(value);
  }

  updateAgeRxJS(value: number): void {
    this.ageSubject.next(value);
  }

  incrementCounterRxJS(): void {
    const currentValue = this.counterSubject.value;
    this.counterSubject.next(currentValue + 1);
  }

  decrementCounterRxJS(): void {
    const currentValue = this.counterSubject.value;
    this.counterSubject.next(currentValue - 1);
  }

  updateSearchRxJS(value: string): void {
    this.searchQuerySubject.next(value);
  }

  onFirstNameRxJSInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateFirstNameRxJS(target.value);
    }
  }

  onLastNameRxJSInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateLastNameRxJS(target.value);
    }
  }

  onAgeRxJSInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = Number.parseInt(target.value, 10);
      if (!Number.isNaN(value)) {
        this.updateAgeRxJS(value);
      }
    }
  }

  // Getters for RxJS current values (for display)
  get firstNameRxJSValue(): string {
    return this.firstNameSubject.value;
  }

  get lastNameRxJSValue(): string {
    return this.lastNameSubject.value;
  }

  get ageRxJSValue(): number {
    return this.ageSubject.value;
  }

  get counterRxJSValue(): number {
    return this.counterSubject.value;
  }

  get searchQueryRxJSValue(): string {
    return this.searchQuerySubject.value;
  }

  // ========== Additional Examples for Interactive Demos ==========

  // Search/Filter Example - Signals
  itemsSignal = signal<string[]>(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']);
  filterTextSignal = signal<string>('');

  filteredItemsSignal = computed<string[]>(() => {
    const filter = this.filterTextSignal().toLowerCase();
    if (!filter) return this.itemsSignal();
    return this.itemsSignal().filter(item =>
      item.toLowerCase().includes(filter)
    );
  });

  onFilterTextSignalInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.filterTextSignal.set(target.value);
    }
  }

  // Search/Filter Example - RxJS
  private itemsSubject = new BehaviorSubject<string[]>(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']);
  private filterTextSubject = new BehaviorSubject<string>('');

  items$: Observable<string[]> = this.itemsSubject.asObservable();
  filterText$: Observable<string> = this.filterTextSubject.asObservable();

  filteredItems$: Observable<string[]> = combineLatest([
    this.items$,
    this.filterText$
  ]).pipe(
    map(([items, filterText]) => {
      const filter = filterText.toLowerCase();
      if (!filter) return items;
      return items.filter(item =>
        item.toLowerCase().includes(filter)
      );
    })
  );

  get filterTextRxJSValue(): string {
    return this.filterTextSubject.value;
  }

  get filteredItemsRxJSValue(): string[] {
    const filter = this.filterTextSubject.value.toLowerCase();
    if (!filter) return this.itemsSubject.value;
    return this.itemsSubject.value.filter(item =>
      item.toLowerCase().includes(filter)
    );
  }

  onFilterTextRxJSInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.filterTextSubject.next(target.value);
    }
  }

  // Toggle Example - Signals
  isDarkModeSignal = signal<boolean>(false);

  toggleDarkModeSignal(): void {
    this.isDarkModeSignal.update(mode => !mode);
  }

  // Toggle Example - RxJS
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  get isDarkModeRxJSValue(): boolean {
    return this.isDarkModeSubject.value;
  }

  toggleDarkModeRxJS(): void {
    this.isDarkModeSubject.next(!this.isDarkModeSubject.value);
  }

  // Form Validation Example - Signals
  emailSignal = signal<string>('');
  passwordSignal = signal<string>('');

  isEmailValidSignal = computed<boolean>(() => {
    const email = this.emailSignal();
    return email.includes('@') && email.length > 5;
  });

  isPasswordValidSignal = computed<boolean>(() => {
    return this.passwordSignal().length >= 8;
  });

  isFormValidSignal = computed<boolean>(() => {
    return this.isEmailValidSignal() && this.isPasswordValidSignal();
  });

  onEmailSignalInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.emailSignal.set(target.value);
    }
  }

  onPasswordSignalInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.passwordSignal.set(target.value);
    }
  }

  // Form Validation Example - RxJS
  private emailSubject = new BehaviorSubject<string>('');
  private passwordSubject = new BehaviorSubject<string>('');

  email$: Observable<string> = this.emailSubject.asObservable();
  password$: Observable<string> = this.passwordSubject.asObservable();

  isEmailValid$: Observable<boolean> = this.email$.pipe(
    map(email => email.includes('@') && email.length > 5)
  );

  isPasswordValid$: Observable<boolean> = this.password$.pipe(
    map(password => password.length >= 8)
  );

  isFormValid$: Observable<boolean> = combineLatest([
    this.isEmailValid$,
    this.isPasswordValid$
  ]).pipe(
    map(([emailValid, passwordValid]) => emailValid && passwordValid)
  );

  get emailRxJSValue(): string {
    return this.emailSubject.value;
  }

  get passwordRxJSValue(): string {
    return this.passwordSubject.value;
  }

  get isEmailValidRxJSValue(): boolean {
    const email = this.emailSubject.value;
    return email.includes('@') && email.length > 5;
  }

  get isPasswordValidRxJSValue(): boolean {
    return this.passwordSubject.value.length >= 8;
  }

  get isFormValidRxJSValue(): boolean {
    return this.isEmailValidRxJSValue && this.isPasswordValidRxJSValue;
  }

  onEmailRxJSInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.emailSubject.next(target.value);
    }
  }

  onPasswordRxJSInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.passwordSubject.next(target.value);
    }
  }
}
