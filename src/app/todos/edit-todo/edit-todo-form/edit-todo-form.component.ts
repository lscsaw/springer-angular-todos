import { Component, computed, inject, input, output } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { CreateTodoDto, TodoResponse, UpdateTodoDto } from '../../../backend';

@Component({
  selector: 'app-edit-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe],
  templateUrl: './edit-todo-form.component.html',
  styleUrl: './edit-todo-form.component.css',
})
export class EditTodoFormComponent {
  form = inject(NonNullableFormBuilder).group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
    ],
    description: [null as string | null],
  });

  formChanges = toSignal(this.form.valueChanges);

  todo = input.required({
    alias: 'todo',
    transform: (it: TodoResponse | undefined) => {
      this.form.reset();
      if (it) {
        this.form.setValue({
          name: it.name,
          description: it.description ?? null,
        });
      }
      return it;
    },
  });

  isCreating = computed(() => !this.todo());

  create = output<CreateTodoDto>();
  update = output<UpdateTodoDto>();

  submit(): void {
    const raw = this.form.getRawValue();
    if (this.isCreating()) {
      this.create.emit({
        ...raw,
        description: raw.description ?? undefined,
      });

      return;
    }

    this.update.emit({
      ...raw,
      description: raw.description ?? undefined,
      status: this.todo()!.status,
      id: this.todo()!.id,
    });
  }
}
