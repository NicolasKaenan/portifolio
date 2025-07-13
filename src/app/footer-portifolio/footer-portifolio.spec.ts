import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPortifolio } from './footer-portifolio';

describe('FooterPortifolio', () => {
  let component: FooterPortifolio;
  let fixture: ComponentFixture<FooterPortifolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterPortifolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterPortifolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
