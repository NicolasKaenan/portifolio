import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPortifolio } from './menu-portifolio';

describe('MenuPortifolio', () => {
  let component: MenuPortifolio;
  let fixture: ComponentFixture<MenuPortifolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPortifolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPortifolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
