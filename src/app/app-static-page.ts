import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-static-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container py-5 static-page custom-static-container">
  <div *ngIf="htmlContent" [innerHTML]="htmlContent"></div>
  <div *ngIf="!htmlContent">
    <p>Loading...</p>
  </div>
</div>

  `
})
export class StaticPageComponent implements OnInit {
  htmlContent: SafeHtml | null = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const page = this.route.snapshot.paramMap.get('page') || 'home';
    const filePath = `assets/pages/${page}.html`;

    this.http.get(filePath, { responseType: 'text' }).subscribe({
      next: (data) => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(data);
      },
      error: () => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(`
          <h2 class="text-danger">404 - Page not found</h2>
          <p>The requested page "<code>${page}</code>" could not be loaded.</p>
        `);
      }
    });
  }
}
