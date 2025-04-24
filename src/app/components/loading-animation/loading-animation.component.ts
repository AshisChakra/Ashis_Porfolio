import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-loading-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="loading-overlay" 
      [class.slide-out]="isSlideOut" 
      [class.hide]="isHidden"
      [@slideAnimation]="animationState">
      <div class="loading-content">
        <h2 class="loading-text">Welcome to My Portfolio</h2>
        <div class="loading-progress">
          <div class="progress-bar" [style.width.%]="progress"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(20, 20, 20, 0.98);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    
    .loading-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-bottom: 50px;
    }
    
    .loading-text {
      color: white;
      font-size: 36px;
      font-weight: 300;
      letter-spacing: 2px;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.8s 0.2s forwards;
      text-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
    }
    
    .loading-progress {
      width: 350px;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 20px;
      opacity: 0;
      animation: fadeIn 0.5s 0.4s forwards;
      position: relative;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #8a2be2, #6a1eb0);
      width: 0%;
      transition: width 0.1s linear;
      box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
      position: relative;
      overflow: hidden;
    }
    
    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.3), 
        transparent);
      animation: progressGlow 1.5s linear infinite;
    }
    
    .slide-out {
      transform: translateX(-100%);
    }
    
    .hide {
      display: none;
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    @keyframes fadeInUp {
      0% { 
        opacity: 0;
        transform: translateY(20px);
      }
      100% { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes progressGlow {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .loading-text {
        font-size: 28px;
      }
      
      .loading-progress {
        width: 280px;
      }
    }
  `],
  animations: [
    trigger('slideAnimation', [
      state('visible', style({
        transform: 'translateX(0)'
      })),
      state('slideOut', style({
        transform: 'translateX(-100%)'
      })),
      transition('visible => slideOut', [
        animate('1s cubic-bezier(0.645, 0.045, 0.355, 1)')
      ])
    ])
  ]
})
export class LoadingAnimationComponent implements OnInit {
  progress: number = 0;
  isSlideOut: boolean = false;
  isHidden: boolean = false;
  animationState: string = 'visible';
  
  ngOnInit() {
    // Start animation immediately
    this.startLoadingAnimation();
    
    // Start slide out animation exactly at 5 seconds
    setTimeout(() => {
      this.startSlideOutAnimation();
    }, 5000);
  }
  
  startLoadingAnimation() {
    // Start with a quick initial progress to 20%
    this.progress = 20;
    
    // Calculate total animation time (4.8 seconds to leave buffer)
    const totalAnimationTime = 4800; // ms
    const totalProgressNeeded = 80; // from 20 to 100
    const interval = 50; // ms
    const incrementPerInterval = totalProgressNeeded / (totalAnimationTime / interval);
    
    // Animate progress bar
    const progressInterval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += incrementPerInterval;
        
        // Ensure we don't exceed 100
        if (this.progress > 100) {
          this.progress = 100;
        }
      } else {
        clearInterval(progressInterval);
      }
    }, interval);
  }
  
  startSlideOutAnimation() {
    // Start slide out animation
    this.animationState = 'slideOut';
    this.isSlideOut = true;
    
    // Hide completely after slide out animation finishes
    setTimeout(() => {
      this.isHidden = true;
    }, 1000); // 1 second for the slide out animation
  }
} 