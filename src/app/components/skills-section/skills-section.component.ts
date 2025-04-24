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
        <!-- Skills Grid -->
        <div class="skills-grid" *ngIf="resumeService.resume()">
          <div 
            *ngFor="let skill of filteredSkills()" 
            class="skill-card"
            [class.expert]="skill.level === 'Expert'"
            [class.intermediate]="skill.level === 'Intermediate'"
          >
            <div class="skill-logo-container">
              <div class="skill-logo">
                <img 
                  [src]="getSkillLogo(skill)" 
                  [alt]="skill.name + ' logo'" 
                  class="logo-image"
                />
              </div>
              <h3>{{ skill.name }}</h3>
            </div>
          </div>
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
      padding: 10px;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .skill-card {
      padding: 20px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .skill-card:hover {
      transform: translateY(-10px);
    }
    
    .skill-card.expert .skill-logo {
      box-shadow: 0 0 20px 5px rgba(138, 43, 226, 0.3);
    }
    
    .skill-card.intermediate .skill-logo {
      box-shadow: 0 0 20px 5px rgba(75, 156, 211, 0.3);
    }
    
    .skill-logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    
    .skill-logo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.07);
      margin-bottom: 15px;
      transition: all 0.5s ease;
    }
    
    .skill-card:hover .skill-logo {
      transform: scale(1.1);
      background-color: rgba(255, 255, 255, 0.12);
    }
    
    .skill-card.expert:hover .skill-logo {
      box-shadow: 0 0 30px 10px rgba(138, 43, 226, 0.5), 0 0 0 2px rgba(138, 43, 226, 0.7);
    }
    
    .skill-card.intermediate:hover .skill-logo {
      box-shadow: 0 0 30px 10px rgba(75, 156, 211, 0.5), 0 0 0 2px rgba(75, 156, 211, 0.7);
    }
    
    .logo-image {
      max-width: 75%;
      max-height: 75%;
      object-fit: contain;
      filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
      transition: all 0.5s ease;
    }
    
    .skill-card:hover .logo-image {
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
      transform: scale(1.1);
    }
    
    .skill-card h3 {
      font-size: 18px;
      color: white;
      margin-top: 15px;
      font-weight: 500;
      text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
      transition: color 0.3s ease;
    }
    
    .skill-card:hover h3 {
      color: #fff;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    
    .skill-card.expert:hover h3 {
      color: #b78deb;
    }
    
    .skill-card.intermediate:hover h3 {
      color: #7db9e8;
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
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 30px;
      }
      
      .skill-logo {
        width: 80px;
        height: 80px;
      }
      
      .skill-card h3 {
        font-size: 16px;
      }
    }
  `]
})
export class SkillsSectionComponent {
  protected resumeService = inject(ResumeService);
  
  // Reactive signals
  private allSkills = signal<Skill[]>([]);
  protected filteredSkills = signal<Skill[]>([]);
  
  // List of skills to keep
  private allowedSkills = [
    'Angular', 
    'HTML', 
    'CSS', 
    'Bootstrap', 
    'Node.js', 
    'MongoDB', 
    'Tailwind', 
    'Git'
  ];
  
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
    
    // Filter skills to only keep the ones specified
    const filtered = skills.filter(skill => 
      this.allowedSkills.includes(skill.name)
    );
    
    this.filteredSkills.set(filtered);
  }
  
  protected getSkillLogo(skill: Skill): string {
    // Default path for images
    const basePath = '/assets/images/skills/';
    const defaultLogo = '/assets/images/skills/default-skill.svg';
    
    // Special case for Node.js
    if (skill.name === 'Node.js') {
      return `${basePath}node-js.svg`;
    }
    
    // Generate logo path based on skill name
    const skillName = skill.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
    const logoPath = `${basePath}${skillName}.svg`;
    
    return skill.logoPath || logoPath;
  }
}
