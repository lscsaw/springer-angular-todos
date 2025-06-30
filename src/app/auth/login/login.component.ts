import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: [''],
  });

  formChanges = toSignal(this.form.valueChanges);

  loginError = signal<string | undefined>(undefined);

  submit(): void {
    this.authService
      .login({
        email: this.form.controls.email.getRawValue(),
        password: this.form.controls.password.getRawValue(),
      })
      .subscribe({
        next: () => {
          this.loginError.set(undefined);
          void this.router.navigate(['/']);
        },
        error: () => {
          this.loginError.set('Benutzername oder Passwort falsch.');
        },
      });
  }
}
