import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T } from './t';

describe('T', () => {
  let component: T;
  let fixture: ComponentFixture<T>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
