import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LanguageSwitcher} from '../language-switcher/language-switcher';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LanguageSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  // Leer! Nur das Logo und Language Switch
}
