import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Certificate } from '../models/certificate.model';

@Injectable({ providedIn: 'root' })
export class CertificatesService {
  private readonly apiUrl = 'https://api.kaenan.dev/api/v1/certificates';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  create(payload: Omit<Certificate, 'id'>) {
    return this.http.post<Certificate>(this.apiUrl, payload);
  }

  update(id: number, payload: Omit<Certificate, 'id'>) {
    return this.http.put<Certificate>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
