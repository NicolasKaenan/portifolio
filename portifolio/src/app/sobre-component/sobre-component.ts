import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sobre-component',
  imports: [RouterLink],
  templateUrl: './sobre-component.html',
  styleUrl: './sobre-component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SobreComponent {

}
