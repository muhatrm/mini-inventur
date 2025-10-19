import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { LanguageService } from '../../services/language/language.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ToastContainerComponent } from '../shared/toast-container/toast-container.component';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  qty: number;
  minStock: number;
  location: string;
  lastUpdated: string;
  price: number;
  category: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface DemoUser {
  email: string;
  role: string;
  loginTime: string;
  firstName?: string;
  lastName?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastContainerComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private languageService = inject(LanguageService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // Demo user data
  currentUser: DemoUser | null = null;

  // Inventory data (same as before)
  inventory: InventoryItem[] = [
    // ... your existing inventory data
  ];

  // UI state
  filteredInventory: InventoryItem[] = [...this.inventory];
  searchText = '';
  locationFilter = 'All';
  categoryFilter = 'All';
  statusFilter = 'All';

  // Quick add form model
  newItem: Partial<InventoryItem> = {
    name: '',
    sku: '',
    qty: 1,
    location: '',
    minStock: 5,
    price: 0,
    category: ''
  };

  nextId = 7;
  showAddModal = false;
  isLoading = false;

  // Categories for demo
  categories = ['Electronics', 'Furniture', 'Office Supplies', 'Cables', 'Appliances', 'Tools', 'Cleaning'];

  ngOnInit(): void {
    // 1) Bestehende User-Daten etc.
    this.loadUserData();

    // 2) Demo-Bestand aus localStorage laden oder seeden
    const saved = localStorage.getItem('demoInventory');
    if (saved) {
      this.inventory = JSON.parse(saved);
    } else {
      // Seed nur beim ersten Start
      this.inventory = [
        { id: 1, name: 'Laptop - Dell Latitude', sku: 'LT-1001', qty: 5, minStock: 3, location: 'Warehouse A', lastUpdated: '2025-10-01', price: 899.99, category: 'Electronics', status: 'In Stock' },
        { id: 2, name: 'Ethernet Cable (2m)',    sku: 'CB-2002', qty: 25, minStock: 10, location: 'Warehouse B', lastUpdated: '2025-09-28', price: 12.50,  category: 'Cables',      status: 'In Stock' },
        { id: 3, name: 'Office Chair',           sku: 'CH-3003', qty: 2, minStock: 5,  location: 'Warehouse A', lastUpdated: '2025-10-10', price: 149.99, category: 'Furniture',   status: 'Low Stock' },
        { id: 4, name: 'Wireless Mouse',         sku: 'MS-4004', qty: 0, minStock: 8,  location: 'Warehouse C', lastUpdated: '2025-10-05', price: 29.99,  category: 'Electronics', status: 'Out of Stock' },
        { id: 5, name: 'A4 Paper (500 sheets)',  sku: 'PP-5005', qty: 15, minStock: 5, location: 'Storage Room', lastUpdated: '2025-10-12', price: 4.99,   category: 'Office Supplies', status: 'In Stock' },
        { id: 6, name: 'Coffee Machine',         sku: 'CM-6006', qty: 1, minStock: 2,  location: 'Kitchen',     lastUpdated: '2025-10-08', price: 299.99, category: 'Appliances', status: 'Low Stock' }
      ];
      localStorage.setItem('demoInventory', JSON.stringify(this.inventory));
    }

    // 3) Ableitungen und Status aktualisieren
    this.updateItemStatuses();
    this.filteredInventory = [...this.inventory];
    this.nextId = Math.max(0, ...this.inventory.map(i => i.id)) + 1;
    this.applyFilters();
  }


  // LanguageService service methods - PUBLIC für Template-Zugriff
  public t(key: string): string {
    return this.languageService.t(key);
  }

  public get currentLanguage(): string {
    return this.languageService.currentLanguage();
  }

  public switchLanguage(lang: 'de' | 'en'): void {
    this.languageService.setLanguage(lang);
    const message = this.t('language.switch.success') || `Language switched to ${lang === 'de' ? 'German' : 'English'}`;
    this.notificationService.success(
      this.t('notifications.success'),
      message,
      2000
    );
  }

  private loadUserData(): void {
    const demoUser = sessionStorage.getItem('demoUser');
    if (demoUser) {
      this.currentUser = JSON.parse(demoUser);
    } else {
      // Fallback demo user
      this.currentUser = {
        email: 'demo@demo.com',
        role: 'Demo User',
        loginTime: new Date().toISOString(),
        firstName: 'Demo',
        lastName: 'User'
      };
    }
  }

  private updateItemStatuses(): void {
    this.inventory.forEach(item => {
      if (item.qty === 0) {
        item.status = 'Out of Stock';
      } else if (item.qty <= item.minStock) {
        item.status = 'Low Stock';
      } else {
        item.status = 'In Stock';
      }
    });
  }

  // Summary getters (same as before)
  get totalItems(): number {
    return this.inventory.length;
  }

  get totalQuantity(): number {
    return this.inventory.reduce((sum, item) => sum + item.qty, 0);
  }

  get uniqueLocations(): number {
    return new Set(this.inventory.map(i => i.location)).size;
  }

  get lowStockCount(): number {
    return this.inventory.filter(i => i.status === 'Low Stock').length;
  }

  get outOfStockCount(): number {
    return this.inventory.filter(i => i.status === 'Out of Stock').length;
  }

  get totalValue(): number {
    return this.inventory.reduce((sum, item) => sum + (item.qty * item.price), 0);
  }

  get recentActivity(): number {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.inventory.filter(item => {
      const itemDate = new Date(item.lastUpdated);
      return itemDate >= sevenDaysAgo;
    }).length;
  }

  // Search / filter (same as before)
  applyFilters(): void {
    const q = this.searchText?.toLowerCase().trim();
    this.filteredInventory = this.inventory.filter(item => {
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
      const matchesLocation = this.locationFilter === 'All' ||
        item.location === this.locationFilter;
      const matchesCategory = this.categoryFilter === 'All' ||
        item.category === this.categoryFilter;
      const matchesStatus = this.statusFilter === 'All' ||
        item.status === this.statusFilter;
      return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.locationFilter = 'All';
    this.categoryFilter = 'All';
    this.statusFilter = 'All';
    this.applyFilters();
  }

  // Get list of locations for filter dropdown
  getLocations(): string[] {
    const locs = Array.from(new Set(this.inventory.map(i => i.location)));
    return ['All', ...locs.sort()];
  }

  // Quick add/edit functionality
  toggleAddModal(): void {
    this.showAddModal = !this.showAddModal;
    if (!this.showAddModal) {
      this.resetNewItem();
    }
  }

  addItem(): void {
    if (!this.newItem.name || !this.newItem.sku) {
      this.notificationService.error(
        this.t('notifications.error'),
        this.t('dashboard.addItem.missingFields')
      );
      return;
    }

    // Check for duplicate SKU
    if (this.inventory.some(item => item.sku === this.newItem.sku)) {
      this.notificationService.error(
        this.t('notifications.error'),
        this.t('dashboard.addItem.duplicateSku')
      );
      return;
    }

    const created: InventoryItem = {
      id: this.nextId++,
      name: this.newItem.name.trim(),
      sku: this.newItem.sku.trim(),
      qty: Number(this.newItem.qty) || 0,
      minStock: Number(this.newItem.minStock) || 5,
      location: this.newItem.location?.trim() || 'Unspecified',
      lastUpdated: new Date().toISOString().slice(0, 10),
      price: Number(this.newItem.price) || 0,
      category: this.newItem.category || 'Other',
      status: 'In Stock'
    };

    // Update status
    if (created.qty === 0) {
      created.status = 'Out of Stock';
    } else if (created.qty <= created.minStock) {
      created.status = 'Low Stock';
    }

    this.inventory.unshift(created);
    this.resetNewItem();
    this.applyFilters();
    this.toggleAddModal();

    // Show success notification
    this.notificationService.success(
      this.t('notifications.success'),
      this.t('dashboard.addItem.success')
    );
  }

  resetNewItem(): void {
    this.newItem = {
      name: '',
      sku: '',
      qty: 1,
      location: '',
      minStock: 5,
      price: 0,
      category: ''
    };
  }

  // Update quantity with + / - buttons
  updateQuantity(item: InventoryItem, change: number): void {
    const newQty = Math.max(0, item.qty + change);
    const oldQty = item.qty;
    item.qty = newQty;
    item.lastUpdated = new Date().toISOString().slice(0, 10);

    // Update status
    if (item.qty === 0) {
      item.status = 'Out of Stock';
    } else if (item.qty <= item.minStock) {
      item.status = 'Low Stock';
    } else {
      item.status = 'In Stock';
    }

    this.applyFilters();

    // Show info notification
    const changeText = change > 0 ? '+' + change : change.toString();
    this.notificationService.info(
      this.t('notifications.info'),
      `${item.name}: ${oldQty} → ${newQty} (${changeText})`,
      2000
    );
  }

  // Remove item
  removeItem(id: number): void {
    const item = this.inventory.find(i => i.id === id);
    if (!item) return;

    const confirmMessage = this.t('dashboard.removeItem.confirm');
    const ok = confirm(confirmMessage);
    if (!ok) return;

    const idx = this.inventory.findIndex(i => i.id === id);
    this.inventory.splice(idx, 1);
    this.applyFilters();

    // Show success notification
    this.notificationService.success(
      this.t('notifications.success'),
      this.t('dashboard.removeItem.success')
    );
  }

  // Edit item placeholder
  editItem(item: InventoryItem): void {
    this.notificationService.info(
      this.t('notifications.info'),
      `${this.t('dashboard.editItem.placeholder')} ${item.name}`
    );
  }

  // Refresh data
  refreshData(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.updateItemStatuses();
      this.applyFilters();
      this.isLoading = false;

      // Show success notification
      this.notificationService.success(
        this.t('notifications.success'),
        this.t('dashboard.refresh.success')
      );
    }, 1000);
  }

  // Export data (demo)
  exportData(): void {
    const dataStr = JSON.stringify(this.inventory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory-demo-export.json';
    link.click();
    URL.revokeObjectURL(url);

    // Show success notification
    this.notificationService.success(
      this.t('notifications.success'),
      this.t('dashboard.export.success')
    );
  }

  // Safe status helpers (same as before)
  getStatusKey(status?: string): string {
    if (!status) return 'unknown';
    return status.toLowerCase().replace(/\s+/g, '');
  }

  getStatusDisplayText(status?: string): string {
    if (!status) return this.t('dashboard.status.unknown') || 'Unknown';
    const statusKey = this.getStatusKey(status);
    const translatedText = this.t(`dashboard.status.${statusKey}`);
    return translatedText && translatedText !== `dashboard.status.${statusKey}`
      ? translatedText
      : status;
  }

  // Get status badge class (same as before)
  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'In Stock': return 'status-success';
      case 'Low Stock': return 'status-warning';
      case 'Out of Stock': return 'status-danger';
      default: return 'status-secondary';
    }
  }

  // Get status icon (same as before)
  getStatusIcon(status?: string): string {
    switch (status) {
      case 'In Stock': return 'fas fa-check-circle';
      case 'Low Stock': return 'fas fa-exclamation-triangle';
      case 'Out of Stock': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  }

  // Track by function for ngFor
  trackById(index: number, item: InventoryItem): number {
    return item.id;
  }

  // Navigation helpers - PUBLIC für Template-Zugriff
  public navigateToReports(): void {
    this.notificationService.info(
      this.t('notifications.info'),
      this.t('dashboard.nav.reports')
    );
  }

  public navigateToSettings(): void {
    this.notificationService.info(
      this.t('notifications.info'),
      this.t('dashboard.nav.settings')
    );
  }

  // Logout - PUBLIC für Template-Zugriff
  public logout(): void {
    const confirmMessage = this.t('dashboard.logout.confirm');
    if (confirm(confirmMessage)) {
      sessionStorage.removeItem('demoUser');
      this.notificationService.success(
        this.t('notifications.success'),
        this.t('dashboard.logout.success')
      );
      // In a real app: this.router.navigate(['/login']);
    }
  }

}
