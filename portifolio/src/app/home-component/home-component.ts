import { Component } from '@angular/core';
import { ApresentacaoPortifolio } from '../apresentacao-portifolio/apresentacao-portifolio';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [ApresentacaoPortifolio],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {

}
