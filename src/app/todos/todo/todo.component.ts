import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TodoResponse } from '../../backend';

@Component({
  template: `
    @if (todo(); as todo) {
      <article
        [class.done]="todo.status === 'DONE'"
        [class.todo]="todo.status === 'TODO'"
        [style.font-weight]="todo.status === 'TODO' ? '600' : '500'"
      >
        <h3>
          <a [routerLink]="todo.id.toString()">
            {{ todo.name }} - {{ todo.creator.name }} ({{
              todo.createdAt | date: 'HH:mm:ss dd.MM.YYYY'
            }})
          </a>
          <div class="btn-list">
            @if (todo.status === 'TODO') {
              <button (click)="updateStatus.emit('DONE')">
                {{ 'todos.done' | transloco }}
              </button>
            } @else {
              <button (click)="updateStatus.emit('TODO')">
                {{ 'todos.restore' | transloco }}
              </button>
            }
            <button (click)="removeTodo.emit()">
              {{ 'todos.delete' | transloco }}
            </button>
          </div>
        </h3>
        @if (todo.description) {
          <div style="border: 0px black solid; padding: 5px">
            {{ todo.description }}
          </div>
        } @else {
          <span>{{ 'todos.noDescription' | transloco }}</span>
        }
      </article>
    }
  `,
  selector: 'app-todo',
  standalone: true,
  imports: [DatePipe, RouterLink, TranslocoPipe],
  styleUrl: './todo.component.css',
})
export class TodoComponent {
  todo = input.required<TodoResponse>();

  updateStatus = output<TodoResponse['status']>();
  removeTodo = output();
}
