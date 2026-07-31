import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const STORAGE_KEY = 'cms_auth';
const API_BASE = 'https://api.kaenan.dev/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isBrowser: boolean;

  /** Header "Basic base64(user:pass)" já pronto para uso, ou null se deslogado. */
  authHeader = signal<string | null>(null);

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) this.authHeader.set(stored);
    }
  }

  isLoggedIn(): boolean {
    return this.authHeader() !== null;
  }

  /**
   * Tenta autenticar contra /api/v1/auth/me usando HTTP Basic.
   * Só guarda as credenciais se o backend confirmar que são válidas.
   */
  async login(username: string, password: string): Promise<boolean> {
    const token = btoa(`${username}:${password}`);
    const header = `Basic ${token}`;

    try {
      await firstValueFrom(
        this.http.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: header },
        })
      );
      this.authHeader.set(header);
      if (this.isBrowser) sessionStorage.setItem(STORAGE_KEY, header);
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.authHeader.set(null);
    if (this.isBrowser) sessionStorage.removeItem(STORAGE_KEY);
  }
}
