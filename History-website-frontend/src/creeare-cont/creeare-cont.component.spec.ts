import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreeareContComponent } from './creeare-cont.component';

describe('CreeareContComponent', () => {
  let component: CreeareContComponent;
  let fixture: ComponentFixture<CreeareContComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreeareContComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreeareContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
