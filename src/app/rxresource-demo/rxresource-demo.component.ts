import { HttpClient } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-rxresource-demo',
  imports: [RouterLink],
  templateUrl: './rxresource-demo.component.html',
  styleUrl: './rxresource-demo.component.css'
})
export class RxresourceDemoComponent {
  searchQuery = signal<string>('');
  postLimit = signal<number>(10);

  constructor(private http: HttpClient) {}

  // Reactive resource that fetches posts when searchQuery or postLimit changes
  postsResource = rxResource({
    request: () => ({
      searchQuery: this.searchQuery(),
      limit: this.postLimit()
    }),
    loader: ({ request }: { request: { searchQuery: string; limit: number } }) => {
      const { searchQuery, limit } = request;
      let url = 'https://jsonplaceholder.typicode.com/posts';
      const params: string[] = [];

      // Add limit parameter (_limit is supported by JSONPlaceholder)
      if (limit) {
        params.push(`_limit=${limit}`);
      }

      // Add search parameter (title_like for partial match in title)
      if (searchQuery && searchQuery.trim()) {
        params.push(`title_like=${encodeURIComponent(searchQuery.trim())}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      return this.http.get<Post[]>(url);
    }
  });

  // Computed signal to get all posts from resource
  allPosts = computed((): Post[] => this.postsResource.value() ?? []);

  // Filter and limit posts based on search query and limit
  filteredPosts = computed((): Post[] => {
    const query = this.searchQuery().toLowerCase().trim();
    const limit = this.postLimit();
    const allPosts = this.allPosts();

    if (!query) {
      return allPosts.slice(0, limit);
    }

    // Filter posts by title, body, id, or userId matching the query
    const filtered = allPosts.filter((post: Post) =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.id.toString().includes(query) ||
      post.userId.toString().includes(query)
    );

    return filtered.slice(0, limit);
  });

  // Computed signal for total post count
  postCount = computed((): number => this.allPosts().length);

  // Computed signal for filtered post count
  filteredPostCount = computed((): number => {
    const query = this.searchQuery().toLowerCase().trim();
    const limit = this.postLimit();

    if (!query) {
      return Math.min(limit, this.postCount());
    }

    const allPosts = this.allPosts();
    return allPosts.filter((post: Post) =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.id.toString().includes(query) ||
      post.userId.toString().includes(query)
    ).length;
  });

  // Computed signal for loading state
  isLoading = computed((): boolean => this.postsResource.isLoading());

  // Computed signal for error state
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

  // Update post limit from select event
  updatePostLimit(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const value = parseInt(target.value, 10);
      this.postLimit.set(isNaN(value) ? 10 : value);
    }
  }
}
