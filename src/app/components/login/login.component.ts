import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {ToastComponent} from '../shared/toast/toast.component';
import {ToastContainerComponent} from '../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ToastComponent, ToastContainerComponent]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  loginMessage = '';
  loginSuccess = false;

  // Demo user credentials
  private demoUsers = [
    { email: 'admin@demo.com', password: 'Admin123!', role: 'Administrator' },
    { email: 'user@demo.com', password: 'User123!', role: 'General User' },
    { email: 'manager@demo.com', password: 'Manager123!', role: 'Inventory Manager' },
    { email: 'demo@demo.com', password: 'Demo123!', role: 'Demo User' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginMessage = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const email = this.f['email'].value.toLowerCase();
    const password = this.f['password'].value;

    console.log('Demo Login attempt:', { email, password });

    // Simulate API call with realistic delay
    setTimeout(() => {
      this.loading = false;

      // Check demo credentials
      const user = this.demoUsers.find(u =>
        u.email.toLowerCase() === email && u.password === password
      );

      if (user) {
        // Successful login
        this.loginSuccess = true;
        this.loginMessage = `✅ Welcome back, ${user.role}!`;

        // Store demo session
        sessionStorage.setItem('demoUser', JSON.stringify({
          email: user.email,
          role: user.role,
          loginTime: new Date().toISOString()
        }));

        console.log('Demo login successful:', user);

        // Simulate redirect after success message
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);

      } else {
        // Failed login
        this.loginSuccess = false;
        this.loginMessage = '❌ Invalid credentials. Try demo credentials!';

        // Show demo hint after failed attempt
        setTimeout(() => {
          this.showDemoHint();
        }, 2000);
      }
    }, 1500);
  }

  protected showDemoHint(): void {
    const hint = `
🔑 Demo Credentials:

Administrator:
• Email: admin@demo.com
• Password: Admin123!

General User:
• Email: user@demo.com
• Password: User123!

Manager:
• Email: manager@demo.com
• Password: Manager123!

Quick Demo:
• Email: demo@demo.com
• Password: Demo123!
    `;

    console.log('Demo Credentials:', this.demoUsers);
    alert(hint);
  }

  // Method to fill demo credentials
  fillDemoCredentials(userType: 'admin' | 'user' | 'manager' | 'demo' = 'demo'): void {
    const demoUser = this.demoUsers.find(u => u.email.includes(userType));
    if (demoUser) {
      this.loginForm.patchValue({
        email: demoUser.email,
        password: demoUser.password
      });
    }
  }

  // Clear any existing demo session
  clearDemoSession(): void {
    sessionStorage.removeItem('demoUser');
    this.loginMessage = '';
    this.loginSuccess = false;
  }
}
