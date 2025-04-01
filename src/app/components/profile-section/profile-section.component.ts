import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-profile-section',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  template: `
    <section id="about" class="section">
      <app-section-header title="About Me"></app-section-header>
      
      <div class="about-container">
        <div class="profile-content" *ngIf="resumeService.resume()">
          <div class="profile-highlight">
            <div class="highlight-icon">
              <i class="fas fa-code"></i>
            </div>
            <div class="highlight-text">
              <h3>Frontend Developer</h3>
              <p>4+ years of MEAN stack experience</p>
            </div>
          </div>
          
          <div class="about-cards">
            <div class="about-card" *ngFor="let paragraph of resumeService.resume()?.summary; let i = index">
              <div class="card-icon" [ngClass]="'icon-' + (i + 1)">
                <i [class]="getIconForIndex(i)"></i>
              </div>
              <p>{{ paragraph }}</p>
            </div>
          </div>
        </div>
        
        <div *ngIf="resumeService.loading()" class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading profile information...</p>
        </div>
        
        <div *ngIf="resumeService.hasError()" class="error-message">
          <p>{{ resumeService.hasError() }}</p>
          <button (click)="resumeService.refreshResumeData()" class="btn">Retry</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-container {
      position: relative;
      padding: 20px;
    }
    
    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .profile-highlight {
      display: flex;
      align-items: center;
      gap: 20px;
      background: rgba(138, 43, 226, 0.15);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      border-left: 3px solid rgba(138, 43, 226, 0.8);
      margin-bottom: 20px;
      transform: translateZ(10px);
      transition: all 0.3s ease;
    }
    
    .profile-highlight:hover {
      transform: translateZ(20px) scale(1.02);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(138, 43, 226, 0.3);
    }
    
    .highlight-icon {
      background: rgba(138, 43, 226, 0.9);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      box-shadow: 0 4px 10px rgba(138, 43, 226, 0.5);
    }
    
    .highlight-text h3 {
      font-size: 24px;
      margin: 0 0 5px 0;
      color: #8a2be2;
    }
    
    .highlight-text p {
      font-size: 16px;
      margin: 0;
      color: #e0e0e0;
    }
    
    .about-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .about-card {
      background: rgba(28, 28, 36, 0.8);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 15px;
      transition: all 0.3s ease;
      border-left: 3px solid rgba(138, 43, 226, 0.5);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transform: translateZ(0);
    }
    
    .about-card:hover {
      transform: translateY(-5px) translateZ(10px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(138, 43, 226, 0.2);
    }
    
    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
      margin-bottom: 10px;
    }
    
    .icon-1 {
      background: linear-gradient(135deg, #8a2be2, #6a1eb0);
    }
    
    .icon-2 {
      background: linear-gradient(135deg, #4a90e2, #5637d9);
    }
    
    .icon-3 {
      background: linear-gradient(135deg, #9c27b0, #673ab7);
    }
    
    .icon-4 {
      background: linear-gradient(135deg, #00bcd4, #2196f3);
    }
    
    .icon-5 {
      background: linear-gradient(135deg, #ff9800, #ff5722);
    }
    
    .about-card p {
      font-size: 16px;
      line-height: 1.6;
      color: #e0e0e0;
      margin: 0;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
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
      .about-cards {
        grid-template-columns: 1fr;
      }
      
      .profile-highlight {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ProfileSectionComponent {
  protected resumeService = inject(ResumeService);
  
  getIconForIndex(index: number): string {
    const icons = [
      'fas fa-laptop-code',
      'fas fa-users-cog',
      'fas fa-lightbulb',
      'fas fa-cogs',
      'fas fa-sync-alt'
    ];
    
    return icons[index % icons.length];
  }
}
