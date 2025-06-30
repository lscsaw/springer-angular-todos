import { Routes } from '@angular/router';
import { isAuthenticated } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todos',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'todos',
    canActivate: [isAuthenticated],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./todos/todos.component').then((c) => c.TodosComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./todos/edit-todo/edit-todo.component').then(
            (c) => c.EditTodoComponent,
          ),
      },
    ],
  },
];
