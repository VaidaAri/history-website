import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RezervariComponent } from './rezervari.component';

describe('RezervariComponent', () => {
  let component: RezervariComponent;
  let fixture: ComponentFixture<RezervariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RezervariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RezervariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
