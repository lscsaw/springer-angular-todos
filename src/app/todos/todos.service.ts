import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateTodoDto, TodoResponse, UpdateTodoDto } from '../backend';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private httpClient = inject(HttpClient);

  private triggerGet = new BehaviorSubject(true);

  getAll$() {
    return this.triggerGet.pipe(
      switchMap(() =>
        this.httpClient.get<TodoResponse[]>(
          `${environment.apiUrl}/v1/app/todo`,
        ),
      ),
    );
  }

  getTodo$(id: number) {
    return this.triggerGet.pipe(
      switchMap(() =>
        this.httpClient.get<TodoResponse>(
          `${environment.apiUrl}/v1/app/todo/${id}`,
        ),
      ),
      catchError(() => of(undefined)),
    );
  }

  createTodo(todo: CreateTodoDto) {
    return this.httpClient
      .post<TodoResponse>(`${environment.apiUrl}/v1/app/todo`, todo)
      .pipe(tap(() => this.triggerGet.next(true)));
  }

  updateTodo(todo: UpdateTodoDto) {
    return this.httpClient
      .put<TodoResponse>(`${environment.apiUrl}/v1/app/todo`, todo)
      .pipe(tap(() => this.triggerGet.next(true)));
  }

  updateStatus(todo: TodoResponse, status: TodoResponse['status']) {
    return this.updateTodo({ ...todo, status: status });
  }

  removeTodo(id: number) {
    return this.httpClient.delete(`${environment.apiUrl}/v1/app/todo/${id}`);
  }
}
