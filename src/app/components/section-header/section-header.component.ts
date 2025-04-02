import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-transition"></div>
    <div class="title-container">
      <div class="title-icon" [ngClass]="getIconClass()">
        <i [class]="getIconForTitle()"></i>
      </div>
      <h2 class="section-title" [class.title-morph]="animate">
        <span class="title-text">{{ title }}</span>
        <!-- Fallback solid color version for browsers that don't support background-clip -->
        <span class="title-text-fallback">{{ title }}</span>
      </h2>
    </div>
    <div class="title-decoration">
      <div class="decoration-line"></div>
      <div class="decoration-dot"></div>
      <div class="decoration-line"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 40px;
      position: relative;
    }
    
    .title-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 10px;
      position: relative;
      z-index: 2;
      padding: 15px 0;
    }
    
    .title-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: white;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
      background-size: 200% 200%;
      animation: gradientAnimation 5s ease infinite;
    }
    
    .title-icon::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: rgba(255, 255, 255, 0.1);
      transform: rotate(45deg);
      animation: shimmer 3s linear infinite;
    }
    
    .icon-about {
      background: linear-gradient(135deg, #8a2be2, #6a1eb0);
    }
    
    .icon-skills {
      background: linear-gradient(135deg, #4a90e2, #5637d9);
    }
    
    .icon-experience {
      background: linear-gradient(135deg, #9c27b0, #673ab7);
    }
    
    .icon-projects {
      background: linear-gradient(135deg, #00bcd4, #2196f3);
    }
    
    .icon-contact {
      background: linear-gradient(135deg, #ff9800, #ff5722);
    }
    
    .section-title {
      font-size: 42px;
      font-weight: 700;
      margin: 0;
      position: relative;
      display: inline-block;
      color: #ffffff;
      letter-spacing: 2px;
      transform-style: preserve-3d;
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      text-shadow: 0 0 10px rgba(138, 43, 226, 0.8), 0 0 5px rgba(255, 255, 255, 0.8);
    }
    
    .section-title:hover {
      transform: translateZ(15px) scale(1.08);
      text-shadow: 0 0 25px rgba(138, 43, 226, 1), 0 0 35px rgba(255, 255, 255, 0.7);
    }
    
    .title-text {
      position: relative;
      z-index: 2;
      color: #ffffff;
      filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.9));
      text-shadow: 0 0 5px #8a2be2;
      transition: all 0.3s ease;
    }
    
    .section-title:hover .title-text {
      background: linear-gradient(90deg, #ff00cc, #8a2be2, #3333ff, #8a2be2, #ff00cc);
      background-size: 400% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 3s linear infinite;
      filter: none;
    }
    
    .title-text-fallback {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      color: #ffffff;
      text-shadow: 0 0 10px rgba(138, 43, 226, 1);
      opacity: 1;
    }
    
    .title-decoration {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 5px;
    }
    
    .decoration-line {
      height: 2px;
      width: 80px;
      background: linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.8), rgba(255, 255, 255, 0.8), rgba(138, 43, 226, 0.8), transparent);
      background-size: 200% 100%;
      border-radius: 2px;
      animation: lineFlow 3s linear infinite;
    }
    
    .decoration-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #8a2be2;
      box-shadow: 0 0 10px rgba(138, 43, 226, 0.8);
      animation: pulseDot 2s ease-in-out infinite;
    }
    
    @keyframes shimmer {
      0% {
        transform: rotate(45deg) translateX(-100%);
      }
      100% {
        transform: rotate(45deg) translateX(100%);
      }
    }
    
    @keyframes pulseDot {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.7;
      }
    }
    
    @keyframes gradientAnimation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    
    @keyframes lineFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
  `]
})
export class SectionHeaderComponent {
  @Input() title: string = '';
  @Input() animate: boolean = true;
  
  getIconForTitle(): string {
    const titleLower = this.title.toLowerCase();
    
    if (titleLower.includes('about')) {
      return 'fas fa-user';
    } else if (titleLower.includes('skills')) {
      return 'fas fa-code';
    } else if (titleLower.includes('experience')) {
      return 'fas fa-briefcase';
    } else if (titleLower.includes('projects')) {
      return 'fas fa-project-diagram';
    } else if (titleLower.includes('contact')) {
      return 'fas fa-envelope';
    }
    
    return 'fas fa-star';
  }
  
  getIconClass(): string {
    const titleLower = this.title.toLowerCase();
    
    if (titleLower.includes('about')) {
      return 'icon-about';
    } else if (titleLower.includes('skills')) {
      return 'icon-skills';
    } else if (titleLower.includes('experience')) {
      return 'icon-experience';
    } else if (titleLower.includes('projects')) {
      return 'icon-projects';
    } else if (titleLower.includes('contact')) {
      return 'icon-contact';
    }
    
    return 'icon-about';
  }
}
