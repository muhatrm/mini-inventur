import {Component} from '@angular/core';
import {InventoryList} from './components/inventory-list/inventory-list';
import {HeaderComponent} from './components/header/header.component';
import {LoginComponent} from './components/login/login.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [InventoryList, HeaderComponent, LoginComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
