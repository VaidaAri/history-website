import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostareComponent } from './postare.component';

describe('PostareComponent', () => {
  let component: PostareComponent;
  let fixture: ComponentFixture<PostareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
