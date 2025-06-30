import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTodoFormComponent } from './edit-todo-form.component';

describe('EditTodoFormComponent', () => {
  let component: EditTodoFormComponent;
  let fixture: ComponentFixture<EditTodoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTodoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
