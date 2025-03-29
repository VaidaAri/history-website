import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadranComponent } from './cadran.component';

describe('CadranComponent', () => {
  let component: CadranComponent;
  let fixture: ComponentFixture<CadranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
