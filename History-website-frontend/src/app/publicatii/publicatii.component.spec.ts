import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicatiiComponent } from './publicatii.component';

describe('PublicatiiComponent', () => {
  let component: PublicatiiComponent;
  let fixture: ComponentFixture<PublicatiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicatiiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicatiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
