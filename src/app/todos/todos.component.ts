import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TodoComponent } from './todo/todo.component';
import { TodosService } from './todos.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [TodoComponent, TranslocoPipe],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent {
  todosService = inject(TodosService);
  todos = toSignal(this.todosService.getAll$(), {
    initialValue: [],
  });

  todoTodos = computed(() => this.todos().filter((it) => it.status === 'TODO'));
  doneTodos = computed(() => this.todos().filter((it) => it.status === 'DONE'));
}
