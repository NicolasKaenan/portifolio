import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCmsComponent } from './login-cms-component';

describe('LoginCmsComponent', () => {
  let component: LoginCmsComponent;
  let fixture: ComponentFixture<LoginCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
