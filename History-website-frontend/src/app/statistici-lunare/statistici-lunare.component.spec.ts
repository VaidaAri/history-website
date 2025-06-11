import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticiLunareComponent } from './statistici-lunare.component';

describe('StatisticiLunareComponent', () => {
  let component: StatisticiLunareComponent;
  let fixture: ComponentFixture<StatisticiLunareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticiLunareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticiLunareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
