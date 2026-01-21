import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  imports: [CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.css'
})
export class ScrollToTopComponent {
  // Show button when user scrolls down more than 300px
  showButton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.showButton = window.scrollY > 300;
  }

  // Smooth scroll to top of page
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
