import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { ResumeService } from '../../services/resume.service';
import { Skill } from '../../models/resume.model';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeaderComponent],
  template: `
    <section id="skills" class="section">
      <app-section-header title="Skills"></app-section-header>
      
      <div class="skills-container">
        <!-- Filter Controls -->
        <div class="filter-controls">
          <div class="search-box">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="filterSkills()"
              placeholder="Search skills..." 
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <div class="category-filters">
            <button 
              *ngFor="let category of categories()" 
              (click)="filterByCategory(category)"
              [class.active]="selectedCategory() === category"
              class="category-btn"
            >
              {{ category }}
            </button>
          </div>
        </div>
        
        <!-- Skills Grid -->
        <div class="skills-grid" *ngIf="resumeService.resume()">
          <div 
            *ngFor="let skill of filteredSkills()" 
            class="skill-card"
            [class.expert]="skill.level === 'Expert'"
            [class.intermediate]="skill.level === 'Intermediate'"
            [class.beginner]="skill.level === 'Beginner'"
          >
            <div class="card-glow"></div>
            <h3>{{ skill.name }}</h3>
            <div class="skill-level">
              <div class="level-indicator">
                <div 
                  class="level-bar" 
                  [style.width]="getSkillLevelWidth(skill.level)"
                ></div>
              </div>
              <span class="level-text">{{ skill.level }}</span>
            </div>
            <p class="skill-category">{{ skill.category }}</p>
          </div>
        </div>
        
        <!-- No Results Message -->
        <div *ngIf="filteredSkills().length === 0 && !resumeService.loading()" class="no-results">
          <p>No skills found matching your criteria.</p>
          <button (click)="resetFilters()" class="btn">Reset Filters</button>
        </div>
        
        <!-- Loading State -->
        <div *ngIf="resumeService.loading()" class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading skills...</p>
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
    .skills-container {
      position: relative;
    }
    
    .filter-controls {
      display: flex;
      flex-direction: column;
      gap: 15px;
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
    
    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .category-btn {
      padding: 8px 15px;
      border: none;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .category-btn:hover {
      background: rgba(138, 43, 226, 0.3);
    }
    
    .category-btn.active {
      background: #8a2be2;
      box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      perspective: 1000px;
    }
    
    .skill-card {
      background: rgba(34, 34, 34, 0.8);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      transform-style: preserve-3d;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border-left: 3px solid #8a2be2;
    }
    
    .skill-card.expert {
      border-left-color: #8a2be2;
    }
    
    .skill-card.intermediate {
      border-left-color: #4b9cd3;
    }
    
    .skill-card.beginner {
      border-left-color: #6ac045;
    }
    
    .skill-card:hover {
      transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(138, 43, 226, 0.3);
    }
    
    .skill-card:hover .card-glow {
      opacity: 1;
      animation: pulseGlow 3s ease-in-out infinite alternate;
    }
    
    .skill-card h3 {
      font-size: 20px;
      margin-bottom: 15px;
      color: white;
    }
    
    .skill-level {
      margin-bottom: 15px;
    }
    
    .level-indicator {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 5px;
    }
    
    .level-bar {
      height: 100%;
      background: linear-gradient(90deg, #8a2be2, #6a1eb0);
      border-radius: 3px;
      transition: width 0.5s ease;
    }
    
    .level-text {
      font-size: 14px;
      color: #e0e0e0;
    }
    
    .skill-category {
      font-size: 14px;
      color: #8a8a8a;
      margin-top: 10px;
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
      .skills-grid {
        grid-template-columns: 1fr;
      }
      
      .category-filters {
        justify-content: center;
      }
    }
  `]
})
export class SkillsSectionComponent {
  protected resumeService = inject(ResumeService);
  
  // Reactive signals
  private allSkills = signal<Skill[]>([]);
  protected filteredSkills = signal<Skill[]>([]);
  protected categories = signal<string[]>([]);
  protected selectedCategory = signal<string>('All');
  
  // Form controls
  protected searchQuery: string = '';
  
  ngOnInit() {
    // Initialize skills when resume data is loaded
    if (this.resumeService.resume()) {
      this.initializeSkills();
    }
  }
  
  ngDoCheck() {
    // Check if resume data has been loaded
    if (this.resumeService.resume() && this.allSkills().length === 0) {
      this.initializeSkills();
    }
  }
  
  private initializeSkills() {
    const skills = this.resumeService.resume()?.skills || [];
    this.allSkills.set(skills);
    this.filteredSkills.set(skills);
    
    // Extract unique categories
    const uniqueCategories = new Set<string>();
    skills.forEach(skill => uniqueCategories.add(skill.category));
    this.categories.set(['All', ...Array.from(uniqueCategories)]);
  }
  
  protected filterSkills() {
    let filtered = this.allSkills();
    
    // Apply category filter
    if (this.selectedCategory() !== 'All') {
      filtered = filtered.filter(skill => skill.category === this.selectedCategory());
    }
    
    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(skill => 
        skill.name.toLowerCase().includes(query) || 
        skill.category.toLowerCase().includes(query)
      );
    }
    
    this.filteredSkills.set(filtered);
  }
  
  protected filterByCategory(category: string) {
    this.selectedCategory.set(category);
    this.filterSkills();
  }
  
  protected resetFilters() {
    this.searchQuery = '';
    this.selectedCategory.set('All');
    this.filteredSkills.set(this.allSkills());
  }
  
  protected getSkillLevelWidth(level: string): string {
    switch (level) {
      case 'Expert': return '100%';
      case 'Intermediate': return '70%';
      case 'Beginner': return '40%';
      default: return '0%';
    }
  }
}
