import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Component demonstrating Angular resource and rxResource concepts for async data fetching
@Component({
  selector: 'app-resource-concept',
  imports: [RouterLink],
  templateUrl: './resource-concept.component.html',
  styleUrl: './resource-concept.component.css'
})
export class ResourceConceptComponent {
  // Example 1: Using resource() with fetch API
  resourceExample = `import { resource, signal } from '@angular/core';

// Simple resource() example
const userId = signal('123');

const userResource = resource({
  params: () => ({ id: userId() }),
  loader: async ({ params }) => {
    const response = await fetch(\`https://api.example.com/users/\${params.id}\`);
    return response.json();
  }
});

// Access values
userResource.value();      // Get the data
userResource.isLoading();   // Check loading state
userResource.error();       // Check for errors`;

  // Example 2: Using rxResource() with HttpClient
  rxResourceExample = `import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

// Simple rxResource() example with params
const postId = signal(1);

const postResource = rxResource({
  request: () => ({ id: postId() }),
  loader: ({ request }) => {
    return this.http.get(\`https://api.example.com/posts/\${request.id}\`);
  }
});

// Access values
postResource.value();      // Get the data
postResource.isLoading();  // Check loading state
postResource.error();      // Check for errors`;
}
