import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resume, Project } from '../models/resume.model';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private resumeData = signal<Resume | null>(null);
  private resumeUrl = 'assets/data/resume.json';
  private isLoading = signal<boolean>(false);
  private error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.loadResumeData();
  }

  get resume(): Signal<Resume | null> {
    return this.resumeData.asReadonly();
  }

  get loading(): Signal<boolean> {
    return this.isLoading.asReadonly();
  }

  get hasError(): Signal<string | null> {
    return this.error.asReadonly();
  }

  loadResumeData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<Resume>(this.resumeUrl)
      .pipe(
        tap(() => this.isLoading.set(false)),
        catchError(err => {
          this.isLoading.set(false);
          this.error.set('Failed to load resume data. Please try again later.');
          console.error('Error loading resume data:', err);
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.resumeData.set(data);
        }
      });
  }

  // Method to filter projects by technology
  filterProjectsByTechnology(technology: string): Observable<Project[]> {
    return this.http.get<Resume>(this.resumeUrl).pipe(
      map(data => data.projects.filter(project => 
        project.technologies.some(tech => 
          tech.toLowerCase().includes(technology.toLowerCase())
        )
      ))
    );
  }

  // Method to search across all resume data
  searchResume(query: string): Observable<any> {
    if (!query.trim()) {
      return of({});
    }

    const lowercaseQuery = query.toLowerCase();
    
    return this.http.get<Resume>(this.resumeUrl).pipe(
      map(data => {
        return {
          skills: data.skills.filter(skill => 
            skill.name.toLowerCase().includes(lowercaseQuery) || 
            skill.category.toLowerCase().includes(lowercaseQuery)
          ),
          experiences: data.experiences.filter(exp => 
            exp.company.toLowerCase().includes(lowercaseQuery) || 
            exp.role.toLowerCase().includes(lowercaseQuery) || 
            exp.description.some(desc => desc.toLowerCase().includes(lowercaseQuery)) ||
            exp.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
          ),
          projects: data.projects.filter(project => 
            project.title.toLowerCase().includes(lowercaseQuery) || 
            project.company.toLowerCase().includes(lowercaseQuery) || 
            project.description.toLowerCase().includes(lowercaseQuery) ||
            project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
          )
        };
      })
    );
  }

  // Refresh resume data (useful for real-time updates)
  refreshResumeData(): void {
    this.loadResumeData();
  }
}
