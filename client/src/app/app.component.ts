import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface QuestionsResponse {
  questions: string[];
  error?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  jobTitle: string = '';
  questions: string[] = [];
  isLoading: boolean = false;
  error: string = '';
  submitted: boolean = false;

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    // Clear previous state
    this.error = '';
    this.questions = [];

    // Validate input
    if (!this.jobTitle.trim()) {
      this.error = 'Please enter a job title';
      return;
    }

    this.isLoading = true;
    this.submitted = true;

    const payload = { jobTitle: this.jobTitle.trim() };

    this.http.post<QuestionsResponse>('http://localhost:3000/api/questions', payload)
      .subscribe({
        next: (response) => {
          this.questions = response.questions;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error:', err);
          this.error = err.error?.error || 'Failed to generate questions. Please try again.';
          this.isLoading = false;
        }
      });
  }

  reset(): void {
    this.jobTitle = '';
    this.questions = [];
    this.error = '';
    this.submitted = false;
  }
}
