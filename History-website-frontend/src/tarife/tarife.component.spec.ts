import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifeComponent } from './tarife.component';

describe('TarifeComponent', () => {
  let component: TarifeComponent;
  let fixture: ComponentFixture<TarifeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
