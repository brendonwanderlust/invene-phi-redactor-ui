import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhiSanitizationService {
  private readonly apiUrl = 'http://localhost:5165/phi';

  constructor(private readonly http: HttpClient) {}

  sanitize(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file); // Ensure 'files' matches the backend parameter name
    });

    return this.http.post(`${this.apiUrl}/sanitize`, formData, {
      responseType: 'blob',
    });
  }
}
