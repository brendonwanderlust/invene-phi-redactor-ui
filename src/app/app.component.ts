import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PhiSanitizationService } from './services/phi-sanitization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  providers: [PhiSanitizationService, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'invene-phi-redactor-ui';
  selectedFiles: File[] = [];

  constructor(
    private readonly phiSanitizationService: PhiSanitizationService
  ) {}

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onButtonClick() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);

      this.phiSanitizationService.sanitize(this.selectedFiles).subscribe({
        next: (data: Blob) => {
          this.downloadFile(data);
          alert('Files sanitized. Please check your downloads directory');
          this.resetFileInput();
        },
        error: (error) => {
          console.error('Error sanitizing files:', error);
          alert(
            'An error occurred while sanitizing the files. Please try again.'
          );
          this.selectedFiles = [];
          this.resetFileInput();
        },
      });
    }
  }

  private resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private downloadFile(data: Blob): void {
    const blob = new Blob([data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'sanitized_files.zip';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
