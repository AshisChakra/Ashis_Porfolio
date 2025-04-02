import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeaderComponent],
  template: `
    <section id="contact" class="section">
      <app-section-header title="Contact Me"></app-section-header>
      
      <div class="contact-container">
        <div class="contact-content" *ngIf="resumeService.resume()">
          <!-- Contact Info -->
          <div class="contact-info">
            <div class="contact-item" (click)="copyToClipboard(getPhone())">
              <div class="contact-icon">📱</div>
              <div class="contact-text">
                <p>{{ getPhone() }}</p>
                <span class="copy-hint">Click to copy</span>
              </div>
              <div class="copy-feedback" [class.visible]="copiedItem() === 'phone'">Copied!</div>
            </div>
            
            <div class="contact-item" (click)="copyToClipboard(getEmail())">
              <div class="contact-icon">✉️</div>
              <div class="contact-text">
                <p>{{ getEmail() }}</p>
                <span class="copy-hint">Click to copy</span>
              </div>
              <div class="copy-feedback" [class.visible]="copiedItem() === 'email'">Copied!</div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">👨‍💼</div>
              <div class="contact-text">
                <a [href]="getLinkedin()" target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div class="contact-form-container">
            <h3>Send Me a Message</h3>
            <form class="contact-form" (submit)="submitForm($event)">
              <div class="form-group">
                <label for="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  [(ngModel)]="contactForm.name" 
                  name="name" 
                  required
                  placeholder="Your name"
                >
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  [(ngModel)]="contactForm.email" 
                  name="email" 
                  required
                  placeholder="Your email address"
                >
              </div>
              
              <div class="form-group">
                <label for="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  [(ngModel)]="contactForm.subject" 
                  name="subject" 
                  required
                  placeholder="Message subject"
                >
              </div>
              
              <div class="form-group">
                <label for="message">Message</label>
                <textarea 
                  id="message" 
                  [(ngModel)]="contactForm.message" 
                  name="message" 
                  required
                  placeholder="Your message"
                  rows="5"
                ></textarea>
              </div>
              
              <button type="submit" class="submit-btn" [disabled]="isSubmitting()">
                <span *ngIf="!isSubmitting()">Send Message</span>
                <span *ngIf="isSubmitting()">Sending...</span>
              </button>
            </form>
            
            <!-- Form Submission Feedback -->
            <div class="form-feedback success" *ngIf="formStatus() === 'success'">
              <p>Your message has been sent successfully! I'll get back to you soon.</p>
            </div>
            
            <div class="form-feedback error" *ngIf="formStatus() === 'error'">
              <p>There was an error sending your message. Please try again later.</p>
            </div>
          </div>
        </div>
        
        <!-- Resume Download button removed as requested -->
        
        <!-- Loading State -->
        <div *ngIf="resumeService.loading()" class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading contact information...</p>
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
    .contact-container {
      position: relative;
    }
    
    .contact-content {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .contact-info {
      flex: 1;
      min-width: 300px;
      background: rgba(34, 34, 34, 0.8);
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }
    
    .contact-info:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(138, 43, 226, 0.3);
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
      cursor: pointer;
    }
    
    .contact-item:hover {
      background: rgba(138, 43, 226, 0.1);
      transform: translateX(5px);
    }
    
    .contact-icon {
      font-size: 24px;
      margin-right: 15px;
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(138, 43, 226, 0.2);
      border-radius: 50%;
    }
    
    .contact-text {
      flex: 1;
    }
    
    .contact-text p {
      margin: 0 0 5px;
      color: #e0e0e0;
    }
    
    .contact-text a {
      color: #8a2be2;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .contact-text a:hover {
      color: #6a1eb0;
      text-decoration: underline;
    }
    
    .copy-hint {
      font-size: 12px;
      color: #8a8a8a;
      display: block;
    }
    
    .copy-feedback {
      position: absolute;
      right: 15px;
      background: rgba(138, 43, 226, 0.9);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      pointer-events: none;
    }
    
    .copy-feedback.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .contact-form-container {
      flex: 1;
      min-width: 300px;
      background: rgba(34, 34, 34, 0.8);
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }
    
    .contact-form-container:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(138, 43, 226, 0.3);
    }
    
    .contact-form-container h3 {
      font-size: 24px;
      margin-bottom: 20px;
      color: white;
      text-align: center;
    }
    
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .form-group label {
      font-size: 14px;
      color: #e0e0e0;
    }
    
    .form-group input, .form-group textarea {
      padding: 12px 15px;
      border: none;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 16px;
      transition: all 0.3s ease;
      font-family: inherit;
    }
    
    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      box-shadow: 0 0 0 2px #8a2be2;
      background: rgba(255, 255, 255, 0.15);
    }
    
    .submit-btn {
      padding: 12px 25px;
      background: linear-gradient(45deg, #8a2be2, #6a1eb0);
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 10px;
      position: relative;
      overflow: hidden;
    }
    
    .submit-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: all 0.5s ease;
    }
    
    .submit-btn:hover {
      background: linear-gradient(45deg, #6a1eb0, #8a2be2);
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }
    
    .submit-btn:hover::before {
      left: 100%;
    }
    
    .submit-btn:disabled {
      background: #666;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .form-feedback {
      margin-top: 20px;
      padding: 15px;
      border-radius: 5px;
      text-align: center;
    }
    
    .form-feedback.success {
      background: rgba(0, 128, 0, 0.1);
      border-left: 4px solid green;
    }
    
    .form-feedback.error {
      background: rgba(255, 0, 0, 0.1);
      border-left: 4px solid red;
    }
    
    /* Resume Download button styles removed */
    
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
      .contact-content {
        flex-direction: column;
      }
    }
  `]
})
export class ContactSectionComponent {
  protected resumeService = inject(ResumeService);
  
  // Reactive signals
  protected copiedItem = signal<string | null>(null);
  protected isSubmitting = signal<boolean>(false);
  protected formStatus = signal<'idle' | 'success' | 'error'>('idle');
  
  // Form data
  protected contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
  // Helper methods to safely access contact information
  protected getPhone(): string {
    return this.resumeService.resume()?.contact?.phone || '+91 8777673738';
  }
  
  protected getEmail(): string {
    return this.resumeService.resume()?.contact?.email || 'achakraborty169@gmail.com';
  }
  
  protected getLinkedin(): string {
    return this.resumeService.resume()?.contact?.linkedin || 'https://www.linkedin.com/in/ashis-chakraborty-68718b188';
  }
  
  protected copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Determine which item was copied
      if (text === this.getPhone()) {
        this.copiedItem.set('phone');
      } else if (text === this.getEmail()) {
        this.copiedItem.set('email');
      }
      
      // Reset the copied item after 2 seconds
      setTimeout(() => {
        this.copiedItem.set(null);
      }, 2000);
    });
  }
  
  protected submitForm(event: Event) {
    event.preventDefault();
    
    // Validate form
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.subject || !this.contactForm.message) {
      return;
    }
    
    this.isSubmitting.set(true);
    this.formStatus.set('idle');
    
    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.formStatus.set('success');
      
      // Reset form
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        this.formStatus.set('idle');
      }, 5000);
    }, 1500);
  }
}
