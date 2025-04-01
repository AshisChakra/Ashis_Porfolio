import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-overlay" [class.active]="isActive()" (click)="closeSearch($event)">
      <div class="search-container" (click)="$event.stopPropagation()">
        <div class="search-header">
          <h2>Search Resume</h2>
          <button class="close-btn" (click)="closeSearch()">×</button>
        </div>
        
        <div class="search-input-container">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="performSearch()"
            placeholder="Search skills, experiences, projects..." 
            class="search-input"
            #searchInput
          />
          <button class="clear-btn" *ngIf="searchQuery" (click)="clearSearch()">×</button>
        </div>
        
        <div class="search-results" *ngIf="searchQuery && !isLoading()">
          <!-- Skills Results -->
          <div class="result-section" *ngIf="results().skills?.length">
            <h3>Skills ({{ results().skills.length }})</h3>
            <div class="result-items">
              <div class="result-item" *ngFor="let skill of results().skills">
                <h4>{{ skill.name }}</h4>
                <p>{{ skill.level }} • {{ skill.category }}</p>
              </div>
            </div>
          </div>
          
          <!-- Experiences Results -->
          <div class="result-section" *ngIf="results().experiences?.length">
            <h3>Experience ({{ results().experiences.length }})</h3>
            <div class="result-items">
              <div class="result-item" *ngFor="let exp of results().experiences">
                <h4>{{ exp.role }} - {{ exp.company }}</h4>
                <p class="result-meta">{{ exp.duration }}</p>
                <div class="result-tech-tags">
                  <span class="tech-tag" *ngFor="let tech of exp.technologies">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Projects Results -->
          <div class="result-section" *ngIf="results().projects?.length">
            <h3>Projects ({{ results().projects.length }})</h3>
            <div class="result-items">
              <div class="result-item" *ngFor="let project of results().projects">
                <h4>{{ project.title }}</h4>
                <p class="result-meta">{{ project.company }} • {{ project.duration }}</p>
                <p>{{ project.description }}</p>
                <div class="result-tech-tags">
                  <span class="tech-tag" *ngFor="let tech of project.technologies">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Results -->
          <div class="no-results" *ngIf="!hasResults() && searchQuery">
            <p>No results found for "{{ searchQuery }}"</p>
            <p>Try different keywords or check your spelling.</p>
          </div>
        </div>
        
        <!-- Loading State -->
        <div class="loading-state" *ngIf="isLoading()">
          <div class="spinner"></div>
          <p>Searching...</p>
        </div>
      </div>
    </div>
    
    <button class="search-trigger-btn" (click)="openSearch()" *ngIf="!isActive()">
      <span class="search-icon">🔍</span>
      <span class="search-text">Search Resume</span>
    </button>
  `,
  styles: [`
    .search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 80px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      overflow-y: auto;
    }
    
    .search-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    .search-container {
      width: 90%;
      max-width: 800px;
      background: rgba(34, 34, 34, 0.95);
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      transform: translateY(-20px);
      transition: transform 0.3s ease;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }
    
    .search-overlay.active .search-container {
      transform: translateY(0);
    }
    
    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .search-header h2 {
      margin: 0;
      color: white;
      font-size: 24px;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 28px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .close-btn:hover {
      color: #8a2be2;
      transform: scale(1.1);
    }
    
    .search-input-container {
      padding: 20px;
      position: relative;
    }
    
    .search-input {
      width: 100%;
      padding: 15px 40px 15px 15px;
      border: none;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 18px;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      box-shadow: 0 0 0 2px #8a2be2;
      background: rgba(255, 255, 255, 0.15);
    }
    
    .clear-btn {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .clear-btn:hover {
      color: #8a2be2;
    }
    
    .search-results {
      padding: 0 20px 20px;
      overflow-y: auto;
      flex: 1;
    }
    
    .result-section {
      margin-bottom: 30px;
    }
    
    .result-section h3 {
      color: #8a2be2;
      font-size: 20px;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(138, 43, 226, 0.3);
      padding-bottom: 5px;
    }
    
    .result-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
    }
    
    .result-item {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 15px;
      transition: all 0.3s ease;
    }
    
    .result-item:hover {
      background: rgba(138, 43, 226, 0.1);
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .result-item h4 {
      margin: 0 0 10px;
      color: white;
      font-size: 18px;
    }
    
    .result-item p {
      margin: 0 0 10px;
      color: #e0e0e0;
      font-size: 14px;
    }
    
    .result-meta {
      color: #8a8a8a !important;
      font-size: 12px !important;
    }
    
    .result-tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 10px;
    }
    
    .tech-tag {
      background: rgba(138, 43, 226, 0.2);
      color: #e0e0e0;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .no-results {
      text-align: center;
      padding: 30px;
      color: #e0e0e0;
    }
    
    .loading-state {
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
    
    .search-trigger-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: linear-gradient(45deg, #8a2be2, #6a1eb0);
      color: white;
      border: none;
      border-radius: 30px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      z-index: 100;
    }
    
    .search-trigger-btn:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
    
    .search-icon {
      font-size: 20px;
    }
    
    @media (max-width: 768px) {
      .search-overlay {
        padding-top: 60px;
      }
      
      .search-container {
        width: 95%;
      }
      
      .result-items {
        grid-template-columns: 1fr;
      }
      
      .search-text {
        display: none;
      }
      
      .search-trigger-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        justify-content: center;
        padding: 0;
      }
    }
  `]
})
export class SearchComponent {
  protected resumeService = inject(ResumeService);
  
  // Reactive signals
  protected isActive = signal<boolean>(false);
  protected isLoading = signal<boolean>(false);
  protected results = signal<any>({});
  
  // Form controls
  protected searchQuery: string = '';
  
  protected openSearch() {
    this.isActive.set(true);
    // Focus the search input after the component is rendered
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }
  
  protected closeSearch(event?: Event) {
    if (event && (event.target as HTMLElement).classList.contains('search-overlay')) {
      this.isActive.set(false);
    } else if (!event) {
      this.isActive.set(false);
    }
    
    // Clear search when closing
    this.clearSearch();
  }
  
  protected clearSearch() {
    this.searchQuery = '';
    this.results.set({});
  }
  
  protected performSearch() {
    if (!this.searchQuery.trim()) {
      this.results.set({});
      return;
    }
    
    this.isLoading.set(true);
    
    // Debounce search to avoid too many requests
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.resumeService.searchResume(this.searchQuery).subscribe(results => {
        this.results.set(results);
        this.isLoading.set(false);
      });
    }, 300);
  }
  
  protected hasResults(): boolean {
    const res = this.results();
    return !!(
      (res.skills && res.skills.length) || 
      (res.experiences && res.experiences.length) || 
      (res.projects && res.projects.length)
    );
  }
  
  private searchTimeout: any;
}
