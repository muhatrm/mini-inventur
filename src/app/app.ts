import {Component} from '@angular/core';
import {InventoryList} from './components/inventory-list/inventory-list';
import {Header} from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [InventoryList, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
