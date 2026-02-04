import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoIDComponent } from './projeto-idcomponent';

describe('ProjetoIDComponent', () => {
  let component: ProjetoIDComponent;
  let fixture: ComponentFixture<ProjetoIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoIDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetoIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
