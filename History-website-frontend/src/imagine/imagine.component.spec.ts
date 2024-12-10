import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagineComponent } from './imagine.component';

describe('ImagineComponent', () => {
  let component: ImagineComponent;
  let fixture: ComponentFixture<ImagineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
