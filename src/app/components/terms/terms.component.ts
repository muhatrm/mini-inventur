import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
  imports: [CommonModule]
})
export class TermsComponent implements OnInit {

  showContent = false;
  bombExploded = false;

  ngOnInit(): void {
    // Bomb explosion sequence
    setTimeout(() => {
      this.bombExploded = true;
    }, 1500);

    // Show main content after animation
    setTimeout(() => {
      this.showContent = true;
    }, 2500);
  }
}
