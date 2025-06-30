import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>
      <span>{{ 'todos.title' | transloco }}</span>
      <div>
        <a routerLink="/todos/create">{{ 'todos.new' | transloco }}</a>
        <a routerLink="/todos">{{ 'todos.all' | transloco }}</a>
        @if (authService.isLoggedIn()) {
          <a href="#logout" (click)="authService.logout()">
            {{ 'Abmelden' | transloco }}
          </a>
        } @else {
          <a routerLink="/login">
            {{ 'Login' | transloco }}
          </a>
        }
      </div>
    </h1>
    <router-outlet />
  `,
  styles: `
    h1 {
      display: flex;
      justify-content: space-between;

      div {
        display: flex;
        gap: 1.5rem;
      }
    }
  `,
})
export class AppComponent {
  authService = inject(AuthService);
}
