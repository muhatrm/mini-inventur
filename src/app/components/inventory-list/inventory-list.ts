import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss'
})
export class InventoryList {
  public languageService = inject(LanguageService);

  //Getter für elegantere Syntax
  public get t() {
    return this.languageService.t.bind(this.languageService);
  }

  // Beispiel-Daten für die Liste
  public items = [
    { name: 'Laptop', quantity: 3 },
    { name: 'Buch', quantity: 1 }
  ];
}
