import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TranslatePipe } from '../core/i18n/translate.pipe';

@Component({
  selector: 'app-login-cms-component',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './login-cms-component.html',
  styleUrl: './login-cms-component.css'
})
export class LoginCmsComponent {
  username = '';
  password = '';
  loading = signal(false);
  error = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit(): Promise<void> {
    if (!this.username || !this.password) return;

    this.loading.set(true);
    this.error.set(false);

    const ok = await this.auth.login(this.username, this.password);

    this.loading.set(false);

    if (ok) {
      this.router.navigate(['/control/painel']);
    } else {
      this.error.set(true);
    }
  }
}
