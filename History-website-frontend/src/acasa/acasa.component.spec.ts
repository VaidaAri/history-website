import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcasaComponent } from './acasa.component';

describe('AcasaComponent', () => {
  let component: AcasaComponent;
  let fixture: ComponentFixture<AcasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcasaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
