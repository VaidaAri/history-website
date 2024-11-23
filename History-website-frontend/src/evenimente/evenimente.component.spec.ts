import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenimenteComponent } from './evenimente.component';

describe('EvenimenteComponent', () => {
  let component: EvenimenteComponent;
  let fixture: ComponentFixture<EvenimenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvenimenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvenimenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
