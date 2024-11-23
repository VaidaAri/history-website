import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurVirtualComponent } from './tur-virtual.component';

describe('TurVirtualComponent', () => {
  let component: TurVirtualComponent;
  let fixture: ComponentFixture<TurVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurVirtualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
