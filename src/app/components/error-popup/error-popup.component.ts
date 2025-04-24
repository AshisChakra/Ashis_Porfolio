import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-error-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="popup-overlay" (click)="closeModal()" *ngIf="isVisible" @fadeIn>
      <div class="popup-content" (click)="$event.stopPropagation()" @slideIn>
        <div class="popup-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <button class="close-btn" (click)="closeModal()">Got it</button>
      </div>
    </div>
  `,
  styles: [`
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .popup-content {
      background: rgba(20, 20, 20, 0.95);
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(138, 43, 226, 0.4);
      padding: 30px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      border: 2px solid rgba(138, 43, 226, 0.5);
      position: relative;
      margin: auto;
      transform: scale(1);
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    @keyframes popIn {
      0% { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .popup-icon {
      color: #ff4757;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      animation: pulse 2s infinite;
    }
    
    h2 {
      color: white;
      margin: 0 0 15px;
      font-size: 24px;
      text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
    }
    
    p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 25px;
      line-height: 1.5;
    }
    
    .close-btn {
      padding: 12px 25px;
      background: linear-gradient(45deg, #8a2be2, #6a1eb0);
      color: white;
      border: none;
      border-radius: 30px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .close-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      background: linear-gradient(45deg, #6a1eb0, #8a2be2);
    }
    
    .close-btn:active {
      transform: translateY(0);
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter', [
        animate('300ms ease-out', style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({
          opacity: 0
        }))
      ])
    ]),
    trigger('slideIn', [
      state('void', style({
        transform: 'translateY(30px)',
        opacity: 0
      })),
      transition(':enter', [
        animate('400ms 150ms ease-out', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({
          transform: 'translateY(-30px)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class ErrorPopupComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Error';
  @Input() message: string = 'Something went wrong. Please try again later.';
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
} 