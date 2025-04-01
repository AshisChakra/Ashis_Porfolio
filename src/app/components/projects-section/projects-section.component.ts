import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { ResumeService } from '../../services/resume.service';
import { Project } from '../../models/resume.model';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeaderComponent],
  template: `
    <section id="projects" class="section">
      <app-section-header title="Projects"></app-section-header>
      
      <div class="projects-container">
        <!-- Filter Controls -->
        <div class="filter-controls">
          <div class="search-box">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="filterProjects()"
              placeholder="Search projects or technologies..." 
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
        </div>
        
        <!-- Projects Grid -->
        <div class="projects-grid" *ngIf="resumeService.resume()">
          <div 
            *ngFor="let project of filteredProjects(); let i = index" 
            class="project-card"
            [class.expanded]="selectedProject() === i"
            (click)="toggleProject(i)"
          >
            <div class="card-glow"></div>
            
            <!-- Project Card Header -->
            <div class="project-header">
              <h3>{{ project.title }}</h3>
              <p class="project-company">{{ project.company }}</p>
              <p class="project-duration">{{ project.duration }}</p>
            </div>
            
            <!-- Project Card Content -->
            <div class="project-content">
              <p class="project-description">{{ project.description }}</p>
              
              <div class="project-meta">
                <div class="project-role">
                  <span class="meta-label">Role:</span> {{ project.role }}
                </div>
                
                <div class="project-tech">
                  <span class="meta-label">Tech Stack:</span>
                  <div class="tech-tags">
                    <span 
                      *ngFor="let tech of project.technologies" 
                      class="tech-tag"
                      (click)="filterByTechnology(tech, $event)"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="expand-indicator">
                <span>{{ selectedProject() === i ? 'Show Less' : 'Show Details' }}</span>
                <span class="material-icon">{{ selectedProject() === i ? '▲' : '▼' }}</span>
              </div>
            </div>
            
            <!-- Project Details (Expanded View) -->
            <div class="project-details" [class.visible]="selectedProject() === i">
              <div class="details-content">
                <h4>Project Details</h4>
                <ul class="details-list">
                  <li *ngFor="let detail of project.details">{{ detail }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Results Message -->
        <div *ngIf="filteredProjects().length === 0 && !resumeService.loading()" class="no-results">
          <p>No projects found matching your criteria.</p>
          <button (click)="resetFilters()" class="btn">Reset Filters</button>
        </div>
        
        <!-- Loading State -->
        <div *ngIf="resumeService.loading()" class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading projects...</p>
        </div>
        
        <!-- Error State -->
        <div *ngIf="resumeService.hasError()" class="error-message">
          <p>{{ resumeService.hasError() }}</p>
          <button (click)="resumeService.refreshResumeData()" class="btn">Retry</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-container {
      position: relative;
    }
    
    .filter-controls {
      margin-bottom: 30px;
      background: rgba(34, 34, 34, 0.8);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }
    
    .search-box {
      position: relative;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 40px 12px 15px;
      border: none;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      box-shadow: 0 0 0 2px #8a2be2;
      background: rgba(255, 255, 255, 0.15);
    }
    
    .search-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #8a2be2;
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
      perspective: 1000px;
    }
    
    .project-card {
      background: rgba(34, 34, 34, 0.8);
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      transform-style: preserve-3d;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      cursor: pointer;
    }
    
    .project-card:hover {
      transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(138, 43, 226, 0.3);
    }
    
    .project-card.expanded {
      grid-column: 1 / -1;
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(138, 43, 226, 0.4);
    }
    
    .project-card:hover .card-glow, .project-card.expanded .card-glow {
      opacity: 1;
      animation: pulseGlow 3s ease-in-out infinite alternate;
    }
    
    .project-header {
      padding: 20px 20px 10px;
    }
    
    .project-header h3 {
      font-size: 22px;
      color: #8a2be2;
      margin: 0 0 10px;
    }
    
    .project-company {
      font-size: 16px;
      color: #e0e0e0;
      margin: 0 0 5px;
    }
    
    .project-duration {
      font-size: 14px;
      color: #8a8a8a;
      margin: 0;
    }
    
    .project-content {
      padding: 0 20px 20px;
    }
    
    .project-description {
      color: #e0e0e0;
      line-height: 1.6;
      margin-bottom: 15px;
    }
    
    .project-meta {
      margin-bottom: 15px;
    }
    
    .project-role, .project-tech {
      margin-bottom: 10px;
    }
    
    .meta-label {
      font-weight: bold;
      color: white;
      margin-right: 5px;
    }
    
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 5px;
    }
    
    .tech-tag {
      background: rgba(138, 43, 226, 0.2);
      color: #e0e0e0;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .tech-tag:hover {
      background: rgba(138, 43, 226, 0.4);
      transform: translateY(-2px);
    }
    
    .expand-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      color: #8a2be2;
      font-size: 14px;
      margin-top: 15px;
      transition: all 0.3s ease;
    }
    
    .expand-indicator:hover {
      color: #6a1eb0;
    }
    
    .project-details {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      opacity: 0;
    }
    
    .project-details.visible {
      max-height: 1000px;
      opacity: 1;
    }
    
    .details-content {
      padding: 0 20px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 10px;
    }
    
    .details-content h4 {
      font-size: 18px;
      color: white;
      margin: 20px 0 15px;
    }
    
    .details-list {
      text-align: left;
      padding-left: 20px;
      margin: 0;
    }
    
    .details-list li {
      margin-bottom: 10px;
      color: #e0e0e0;
      line-height: 1.6;
    }
    
    .no-results {
      text-align: center;
      padding: 30px;
      background: rgba(34, 34, 34, 0.8);
      border-radius: 10px;
      margin-top: 20px;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #8a2be2;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 10px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .error-message {
      background: rgba(255, 0, 0, 0.1);
      border-left: 4px solid #ff0000;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectsSectionComponent {
  protected resumeService = inject(ResumeService);
  
  // Reactive signals
  private allProjects = signal<Project[]>([]);
  protected filteredProjects = signal<Project[]>([]);
  protected selectedProject = signal<number | null>(null);
  
  // Form controls
  protected searchQuery: string = '';
  
  ngOnInit() {
    // Initialize projects when resume data is loaded
    if (this.resumeService.resume()) {
      this.initializeProjects();
    }
  }
  
  ngDoCheck() {
    // Check if resume data has been loaded
    if (this.resumeService.resume() && this.allProjects().length === 0) {
      this.initializeProjects();
    }
  }
  
  private initializeProjects() {
    const projects = this.resumeService.resume()?.projects || [];
    this.allProjects.set(projects);
    this.filteredProjects.set(projects);
  }
  
  protected filterProjects() {
    if (!this.searchQuery.trim()) {
      this.filteredProjects.set(this.allProjects());
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    const filtered = this.allProjects().filter(project => 
      project.title.toLowerCase().includes(query) || 
      project.company.toLowerCase().includes(query) || 
      project.description.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query))
    );
    
    this.filteredProjects.set(filtered);
  }
  
  protected filterByTechnology(technology: string, event: Event) {
    event.stopPropagation(); // Prevent card expansion when clicking on a tech tag
    this.searchQuery = technology;
    this.filterProjects();
  }
  
  protected resetFilters() {
    this.searchQuery = '';
    this.filteredProjects.set(this.allProjects());
  }
  
  protected toggleProject(index: number) {
    if (this.selectedProject() === index) {
      this.selectedProject.set(null);
    } else {
      this.selectedProject.set(index);
    }
  }
}
