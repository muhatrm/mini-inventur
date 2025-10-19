import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  registrationMessage = '';
  registrationSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZäöüÄÖÜß\s]*$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZäöüÄÖÜß\s]*$/)]],
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      department: ['', [Validators.required]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });

    this.setupAutoTrim();
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  // Department options for dropdown
  getDepartments(): string[] {
    return [
      'Warehouse Management',
      'Logistics',
      'Procurement',
      'Sales',
      'Administration',
      'IT Support',
      'Quality Control',
      'Other'
    ];
  }

  // Role options for dropdown
  getRoles(): string[] {
    return [
      'Inventory Manager',
      'Warehouse Staff',
      'Procurement Officer',
      'Sales Representative',
      'Administrator',
      'IT Administrator',
      'Quality Inspector',
      'General User'
    ];
  }

  // Custom email domain validator
  emailDomainValidator(control: AbstractControl): {[key: string]: any} | null {
    if (!control.value) {
      return null;
    }

    const email = control.value.toLowerCase();

    // Block obvious temporary emails for demo
    const blockedDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
    const domain = email.split('@')[1];
    if (blockedDomains.includes(domain)) {
      return { blockedDomain: true };
    }

    return null;
  }

  // Enhanced password validator
  passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*\-_.()+=\[\]{}|\\:";'<>?,./~`]/.test(value);
    const minLength = value.length >= 8;
    const maxLength = value.length <= 128;

    const errors: any = {};

    if (!minLength) errors.minLength = true;
    if (!maxLength) errors.maxLength = true;
    if (!hasNumber) errors.requiresNumber = true;
    if (!hasUpper) errors.requiresUppercase = true;
    if (!hasLower) errors.requiresLowercase = true;
    if (!hasSpecial) errors.requiresSpecial = true;

    const valid = hasNumber && hasUpper && hasLower && hasSpecial && minLength && maxLength;

    if (!valid) {
      return { passwordStrength: errors };
    }

    return null;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: AbstractControl): {[key: string]: any} | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // Setup auto-trim functionality
  private setupAutoTrim(): void {
    const fieldsToTrim = ['firstName', 'lastName', 'email'];

    fieldsToTrim.forEach(fieldName => {
      const control = this.registerForm.get(fieldName);
      if (control) {
        control.valueChanges.subscribe(value => {
          if (value && typeof value === 'string' && value !== value.trim()) {
            control.setValue(value.trim(), { emitEvent: false });
          }
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Fill demo data
  fillDemoData(): void {
    this.registerForm.patchValue({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@demo.com',
      department: 'IT Support',
      role: 'IT Administrator',
      password: 'DemoPass123!',
      confirmPassword: 'DemoPass123!',
      acceptTerms: true
    });
  }

  // Validate form step by step
  private validateFormStep(): boolean {
    const requiredFields = ['firstName', 'lastName', 'email', 'department', 'role', 'password', 'confirmPassword', 'acceptTerms'];

    for (const field of requiredFields) {
      const control = this.f[field];
      if (!control.value || (field === 'acceptTerms' && !control.value)) {
        control.markAsTouched();
        return false;
      }
    }

    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return false;
    }

    return true;
  }

  onSubmit(): void {
    this.submitted = true;
    this.registrationMessage = '';

    if (!this.validateFormStep()) {
      this.scrollToFirstError();
      return;
    }

    this.loading = true;

    // Prepare demo registration data
    const registrationData = {
      firstName: this.f['firstName'].value.trim(),
      lastName: this.f['lastName'].value.trim(),
      email: this.f['email'].value.toLowerCase().trim(),
      department: this.f['department'].value,
      role: this.f['role'].value,
      acceptTerms: this.f['acceptTerms'].value,
      registrationDate: new Date().toISOString(),
      source: 'demo_inventory_system',
      userAgent: navigator.userAgent
    };

    console.log('Demo registration data:', {
      ...registrationData,
      password: '[REDACTED]'
    });

    // Simulate API call with realistic delay
    setTimeout(() => {
      this.loading = false;

        // Show success details
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
      });
    }, 2000);
  }

  // Scroll to first validation error
  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.is-invalid');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  // Reset form to initial state
  private resetForm(): void {
    this.registerForm.reset();
    this.submitted = false;
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.registrationMessage = '';
    this.registrationSuccess = false;

    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.setErrors(null);
      this.registerForm.get(key)?.markAsUntouched();
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  hasFieldError(fieldName: string, errorType: string): boolean {
    const field = this.f[fieldName];
    return field.errors?.[errorType] && (field.dirty || field.touched || this.submitted);
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.f[fieldName];

    if (!field.errors || (!field.dirty && !field.touched && !this.submitted)) {
      return '';
    }

    const errors = field.errors;

    if (fieldName === 'email') {
      if (errors['required']) return 'Email is required';
      if (errors['email']) return 'Please enter a valid email address';
      if (errors['blockedDomain']) return 'Temporary email addresses are not allowed';
    }

    if (fieldName === 'department') {
      if (errors['required']) return 'Please select your department';
    }

    if (fieldName === 'role') {
      if (errors['required']) return 'Please select your role';
    }

    if (fieldName === 'password') {
      if (errors['required']) return 'Password is required';
      if (errors['minlength']) return 'Password must be at least 8 characters';
      if (errors['passwordStrength']) {
        const strengthErrors = errors['passwordStrength'];
        if (strengthErrors.requiresNumber) return 'Password must contain at least one number';
        if (strengthErrors.requiresUppercase) return 'Password must contain at least one uppercase letter';
        if (strengthErrors.requiresLowercase) return 'Password must contain at least one lowercase letter';
        if (strengthErrors.requiresSpecial) return 'Password must contain at least one special character';
        return 'Password does not meet security requirements';
      }
    }

    if (fieldName === 'firstName' || fieldName === 'lastName') {
      if (errors['required']) return `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
      if (errors['minlength']) return `${fieldName === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
      if (errors['pattern']) return 'Please enter a valid name';
    }

    if (fieldName === 'confirmPassword') {
      if (errors['required']) return 'Please confirm your password';
    }

    if (fieldName === 'acceptTerms') {
      if (errors['required']) return 'You must accept the terms and conditions';
    }

    if (this.registerForm.errors?.['passwordMismatch'] && fieldName === 'confirmPassword') {
      return 'Passwords do not match';
    }

    return 'Please correct this field';
  }
}
