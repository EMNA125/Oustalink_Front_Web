import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSignupComponent } from './choose-signup.component';

describe('ChooseSignupComponent', () => {
  let component: ChooseSignupComponent;
  let fixture: ComponentFixture<ChooseSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
