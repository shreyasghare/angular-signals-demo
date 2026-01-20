import { Component, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

// Interface for Post data from API
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
  // Post Search API functionality with rxResource
  searchQuery = signal<string>('');

  constructor(private http: HttpClient) {}

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
