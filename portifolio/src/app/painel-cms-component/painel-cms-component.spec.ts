import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelCmsComponent } from './painel-cms-component';

describe('PainelCmsComponent', () => {
  let component: PainelCmsComponent;
  let fixture: ComponentFixture<PainelCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelCmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
