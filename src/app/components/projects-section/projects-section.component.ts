import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { ResumeService } from '../../services/resume.service';
import { Project } from '../../models/resume.model';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeaderComponent],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ],
  template: `
    <section id="projects" class="section">
      <app-section-header title="Projects"></app-section-header>
      
      <div class="projects-container">
        <!-- Filter Controls -->
        <div class="filter-controls">
          <div class="search-container">
            <div class="search-box">
              <span class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (input)="filterProjects()"
                placeholder="Search projects or technologies..." 
                class="search-input"
              />
              <button 
                *ngIf="searchQuery" 
                class="clear-btn" 
                (click)="resetFilters(); $event.stopPropagation()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="search-tag-count" *ngIf="filteredProjects().length !== allProjects().length">
              <span>{{ filteredProjects().length }} results</span>
              <button class="reset-btn" (click)="resetFilters()">Clear</button>
            </div>
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
            <div 
              class="project-details" 
              [@expandCollapse]="selectedProject() === i ? 'expanded' : 'collapsed'"
            >
              <div class="expanded-layout">
                <div class="left-column">
                  <div class="project-overview">
                    <h4>Project Overview</h4>
                    <p>{{ project.description }}</p>
                    <div class="project-meta">
                      <div class="project-meta-item">
                        <span class="meta-label">Company:</span> {{ project.company }}
                      </div>
                      <div class="project-meta-item">
                        <span class="meta-label">Role:</span> {{ project.role }}
                      </div>
                      <div class="project-meta-item">
                        <span class="meta-label">Duration:</span> {{ project.duration }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="right-column">
                  <div class="details-content">
                    <h4>Project Highlights</h4>
                    <ul class="details-list">
                      <li *ngFor="let detail of project.details">{{ detail }}</li>
                    </ul>
                  </div>
                  
                  <div class="tech-stack">
                    <h4>Technologies Used</h4>
                    <div class="tech-tags expanded">
                      <span 
                        *ngFor="let tech of project.technologies" 
                        class="tech-tag large"
                        (click)="filterByTechnology(tech, $event)"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="expanded-footer">
                <button class="close-expanded" (click)="toggleProject(i); $event.stopPropagation()">Close Details</button>
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
      padding: 25px;
      border-radius: 15px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(138, 43, 226, 0.1);
      border-left: 3px solid rgba(138, 43, 226, 0.5);
      transition: all 0.3s ease;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .filter-controls:hover {
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(138, 43, 226, 0.2);
      transform: translateY(-3px);
    }
    
    .search-container {
      position: relative;
    }
    
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      border-radius: 10px;
      background: rgba(50, 50, 60, 0.3);
      transition: all 0.3s ease;
      box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .search-box:focus-within {
      background: rgba(60, 60, 70, 0.4);
      box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(138, 43, 226, 0.3);
    }
    
    .search-icon {
      padding: 0 15px;
      color: #8a2be2;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
    }
    
    .search-box:focus-within .search-icon {
      color: #b870ff;
    }
    
    .search-input {
      width: 100%;
      padding: 15px 45px 15px 5px;
      border: none;
      background: transparent;
      color: white;
      font-size: 16px;
      transition: all 0.3s ease;
      font-weight: 300;
      letter-spacing: 0.5px;
    }
    
    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
      opacity: 0.7;
    }
    
    .search-input:focus {
      outline: none;
    }
    
    .search-input:focus::placeholder {
      opacity: 0.4;
      transform: translateX(5px);
    }
    
    .clear-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border-radius: 50%;
    }
    
    .clear-btn:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .search-tag-count {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12px;
      padding: 0 5px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      animation: fadeIn 0.3s ease-out;
    }
    
    .reset-btn {
      background: none;
      border: none;
      color: #8a2be2;
      font-size: 14px;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 15px;
      transition: all 0.3s ease;
    }
    
    .reset-btn:hover {
      background: rgba(138, 43, 226, 0.1);
      color: #b870ff;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 30px;
      perspective: 1000px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
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
      height: 100%;
      display: flex;
      flex-direction: column;
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
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .project-description {
      color: #e0e0e0;
      line-height: 1.6;
      margin-bottom: 15px;
      flex: 1;
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
      opacity: 1;
    }
    
    .project-details.visible {
      opacity: 1;
    }
    
    .expanded-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      padding: 20px;
    }
    
    .left-column, .right-column {
      display: flex;
      flex-direction: column;
    }
    
    .project-overview {
      text-align: left;
    }
    
    .project-overview h4 {
      font-size: 18px;
      color: white;
      margin: 0 0 15px;
    }
    
    .project-meta {
      margin-bottom: 15px;
    }
    
    .project-meta-item {
      margin-bottom: 8px;
    }
    
    .details-content {
      padding: 0;
      margin-top: 0;
      text-align: left;
    }
    
    .details-content h4 {
      font-size: 18px;
      color: white;
      margin: 0 0 15px;
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
    
    .tech-stack {
      margin-top: 20px;
      text-align: left;
    }
    
    .tech-stack h4 {
      font-size: 18px;
      color: white;
      margin: 0 0 15px;
    }
    
    .expanded-footer {
      display: flex;
      justify-content: center;
      padding: 15px 0 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .close-expanded {
      background: rgba(138, 43, 226, 0.2);
      color: white;
      border: 1px solid rgba(138, 43, 226, 0.5);
      border-radius: 20px;
      padding: 10px 25px;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .close-expanded:hover {
      background: rgba(138, 43, 226, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
    }
    
    .close-expanded:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
      
      .expanded-layout {
        grid-template-columns: 1fr;
      }
      
      .right-column {
        margin-top: 20px;
      }
    }
  `]
})
export class ProjectsSectionComponent {
  protected resumeService = inject(ResumeService);
  
  // Reactive signals
  protected allProjects = signal<Project[]>([]);
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
      // Scroll to the top of the projects section when closing project details
      setTimeout(() => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Delay to allow animation to complete
    } else {
      this.selectedProject.set(index);
    }
  }
}
