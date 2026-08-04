import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPortifolioComponent } from './menu-portifolio';


describe('MenuPortifolio', () => {
  let component: MenuPortifolioComponent;
  let fixture: ComponentFixture<MenuPortifolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPortifolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPortifolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
