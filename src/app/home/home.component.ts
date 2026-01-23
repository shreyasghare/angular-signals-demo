import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Home component displaying navigation to all demo pages
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
