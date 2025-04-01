import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { ResumeService } from '../../services/resume.service';
import { Experience } from '../../models/resume.model';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  template: `
    <section id="experience" class="section">
      <app-section-header title="Experience"></app-section-header>
      
      <div class="experience-container">
        <!-- Experience Timeline -->
        <div class="experience-timeline" *ngIf="resumeService.resume()">
          <div 
            *ngFor="let exp of resumeService.resume()?.experiences; let i = index" 
            class="experience-card"
            [class.expanded]="expandedIndex() === i"
            (click)="toggleExpand(i)"
          >
            <div class="card-glow"></div>
            <div class="experience-header">
              <h3>{{ exp.role }} - {{ exp.company }}</h3>
              <p class="experience-duration">{{ exp.duration }}</p>
              <div class="expand-indicator">
                <span class="material-icon">{{ expandedIndex() === i ? '▼' : '▶' }}</span>
              </div>
            </div>
            
            <div class="experience-details" [class.visible]="expandedIndex() === i">
              <div class="details-content">
                <ul class="responsibility-list">
                  <li *ngFor="let item of exp.description">{{ item }}</li>
                </ul>
                
                <div class="tech-stack">
                  <h4>Technologies Used:</h4>
                  <div class="tech-tags">
                    <span *ngFor="let tech of exp.technologies" class="tech-tag">{{ tech }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div *ngIf="resumeService.loading()" class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading experience data...</p>
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
    .experience-container {
      position: relative;
    }
    
    .experience-timeline {
      display: flex;
      flex-direction: column;
      gap: 30px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .experience-card {
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
    
    .experience-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(138, 43, 226, 0.3);
    }
    
    .experience-card.expanded {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(138, 43, 226, 0.4);
    }
    
    .experience-card:hover .card-glow, .experience-card.expanded .card-glow {
      opacity: 1;
      animation: pulseGlow 3s ease-in-out infinite alternate;
    }
    
    .experience-header {
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    
    .experience-header h3 {
      font-size: 22px;
      color: #8a2be2;
      margin: 0;
      flex: 1;
    }
    
    .experience-duration {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      margin: 0 20px 0 0;
    }
    
    .expand-indicator {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    
    .expanded .expand-indicator {
      transform: rotate(180deg);
    }
    
    .experience-details {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      opacity: 0;
    }
    
    .experience-details.visible {
      max-height: 1000px;
      opacity: 1;
    }
    
    .details-content {
      padding: 0 20px 20px;
    }
    
    .responsibility-list {
      text-align: left;
      padding-left: 20px;
      margin-bottom: 20px;
    }
    
    .responsibility-list li {
      margin-bottom: 8px;
      color: #e0e0e0;
      line-height: 1.5;
    }
    
    .tech-stack {
      text-align: left;
      margin-top: 15px;
    }
    
    .tech-stack h4 {
      font-size: 18px;
      margin-bottom: 10px;
      color: white;
    }
    
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
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
      .experience-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .experience-duration {
        margin: 5px 0 10px;
      }
      
      .expand-indicator {
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }
  `]
})
export class ExperienceSectionComponent {
  protected resumeService = inject(ResumeService);
  protected expandedIndex = signal<number | null>(null);
  
  protected toggleExpand(index: number) {
    if (this.expandedIndex() === index) {
      this.expandedIndex.set(null);
    } else {
      this.expandedIndex.set(index);
    }
  }
}
