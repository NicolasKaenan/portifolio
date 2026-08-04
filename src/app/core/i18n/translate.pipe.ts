import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from './language.service';
import { translate } from './translations';

@Pipe({
  name: 't',
  standalone: true,
  pure: false, // precisa reavaliar quando o idioma muda, não só quando a chave muda
})
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(key: string): string {
    return translate(key, this.languageService.lang());
  }
}
