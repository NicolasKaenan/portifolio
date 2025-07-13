import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApresentacaoPortifolio } from './apresentacao-portifolio';

describe('ApresentacaoPortifolio', () => {
  let component: ApresentacaoPortifolio;
  let fixture: ComponentFixture<ApresentacaoPortifolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApresentacaoPortifolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApresentacaoPortifolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
