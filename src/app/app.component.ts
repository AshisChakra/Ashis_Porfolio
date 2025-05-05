import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, AfterViewInit, HostListener, ViewChild, Renderer2, PLATFORM_ID, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';

import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { LoadingAnimationComponent } from './components/loading-animation/loading-animation.component';
import { LoadingService } from './services/loading.service';
// Search component removed as requested

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ProfileSectionComponent,
    SkillsSectionComponent,
    ExperienceSectionComponent,
    ProjectsSectionComponent,
    ContactSectionComponent,
    LoadingAnimationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'Ashis_Portfolio';
  @ViewChild('parallaxBg') parallaxBg!: ElementRef;
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChildren('.reveal-item') revealItems!: QueryList<ElementRef>;
  
  private lastScrollPosition: number = 0;
  protected currentSection: string = 'hero';
  private isBrowser: boolean;
  private _lastMouseMoveTime: number = 0;
  private appLoaded: boolean = false;
  
  // Add navigation related properties
  protected hasScrolled: boolean = false;
  protected isMobileMenuOpen: boolean = false;
  
  // Navigation items
  protected navItems = [
    { id: 'about', text: 'About', link: '#about' },
    { id: 'skills', text: 'Skills', link: '#skills' },
    { id: 'experience', text: 'Experience', link: '#experience' },
    { id: 'projects', text: 'Projects', link: '#projects' },
    { id: 'contact', text: 'Contact', link: '#contact' }
  ];
  
  // Skills to type
  skills = [
    'Generative AI',
    'Prompt Engineering',
    'No-Code Automation',
    'UI/UX Optimization',
    'Angular & TypeScript',
    'Modern Web Technologies'
  ];
  currentSkillIndex = 0;
  typingSpeed = 250; // milliseconds per character (increased for slower typing)
  deletingSpeed = 150; // milliseconds per character (increased for slower deleting)
  pauseTime = 2500; // pause time between typing and deleting (increased for longer pause)
  
  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object,
    public loadingService: LoadingService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      // Loading animation is shown automatically since LoadingService initializes with loading=true
      
      // Hide loading after 6 seconds (5 seconds display + 1 second for slide-out)
      setTimeout(() => {
        this.loadingService.hideLoading();
        
        // Add fade-in animation to content
        const contentContainer = document.querySelector('.content-container');
        if (contentContainer) {
          this.renderer.addClass(contentContainer, 'fade-in');
        }
        
        // Initialize typing animations with a slight delay
        setTimeout(() => {
          this.initTypingAnimations();
        }, 1000);
      }, 6000);
      
      // Reveal hero items on load
      setTimeout(() => {
        const revealItems = document.querySelectorAll('.reveal-item');
        revealItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, 300 * index);
        });
      }, 500);
    }
  }
  
  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
      }, 0);
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isBrowser) {
      // Handle responsive design adjustments if needed
    }
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.isBrowser) {
      const scrollPosition = window.scrollY;
      
      // Update navbar state based on scroll position
      this.hasScrolled = scrollPosition > 10;
      
      this.lastScrollPosition = scrollPosition;
    }
  }
  
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isBrowser) {
      // Throttle mouse move event
      const now = Date.now();
      if (now - this._lastMouseMoveTime > 50) {
        this._lastMouseMoveTime = now;
      }
    }
  }
  
  // Toggle mobile menu
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent scrolling when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // Close mobile menu when clicking a link
  closeMenu(event: Event) {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
  
  // Smooth scroll to section
  scrollToSection(sectionId: string) {
    if (!this.isBrowser) return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  ngOnDestroy() {
    if (this.isBrowser) {
      // Clean up resources
    }
  }
  
  // Type animation for skills
  typeNextSkill(): void {
    // Type skills one after another
    const currentSkill = this.skills[this.currentSkillIndex];
    let currentIndex = 0;
    let isTyping = true;
    
    // Get typing speed with some randomness
    const getTypeSpeed = () => this.typingSpeed + Math.random() * 100; // Increased randomness
    const getDeleteSpeed = () => this.deletingSpeed + Math.random() * 80; // Increased randomness
    
    // Function to type out one character at a time
    const typeChar = () => {
      if (isTyping) {
        // Typing the skill
        if (currentIndex < currentSkill.length) {
          currentIndex++;
          setTimeout(typeChar, getTypeSpeed());
        } else {
          // Finished typing, pause before deleting
          isTyping = false;
          setTimeout(typeChar, this.pauseTime);
        }
      } else {
        // Deleting the skill
        if (currentIndex > 0) {
          currentIndex--;
          setTimeout(typeChar, getDeleteSpeed());
        } else {
          // Finished deleting, move to next skill
          isTyping = true;
          this.currentSkillIndex = (this.currentSkillIndex + 1) % this.skills.length;
          setTimeout(() => this.typeNextSkill(), 1500); // Increased from 500ms to 1500ms
        }
      }
    };
    
    // Start typing
    typeChar();
  }
  
  // Setup scroll animations
  setupScrollAnimations(): void {
    if (!this.isBrowser) return;
    
    // Create scroll-triggered animations
    const fadeInElements = document.querySelectorAll('.fade-in-element');
    fadeInElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, 300 * index);
    });
  }
  
  // Initialize typing animations
  private initTypingAnimations() {
    if (!this.isBrowser) return;
    
    // Find all elements with typing-container class and their data-text attributes
    const textContainers = document.querySelectorAll('.typing-container');
    
    // Get text content and prepare for synchronized animation
    const textData: {element: HTMLElement, text: string}[] = [];
    
    textContainers.forEach(container => {
      const text = container.getAttribute('data-text') || '';
      textData.push({
        element: container as HTMLElement,
        text
      });
    });
    
    // Run typing animations with a slight delay between containers
    this.runSynchronizedAnimations(textData);
  }
  
  private runSynchronizedAnimations(textData: {element: HTMLElement, text: string}[]) {
    if (!this.isBrowser || textData.length === 0) return;
    
    // Create indices and direction flags for each text element
    const indices = textData.map(() => 0);
    const isTyping = textData.map(() => true);
    const isPaused = textData.map(() => false);
    const pauseTimers = textData.map(() => 0);
    
    // Animation states
    let phase = 'typing'; // typing, pause1, deleting, pause2
    
    // Pre-set all container content to empty
    textData.forEach(item => {
      item.element.textContent = '';
    });
    
    // Animation step function
    const animationStep = () => {
      let allComplete = true;
      
      // Process based on current phase
      switch(phase) {
        case 'typing':
          // Type all elements
          allComplete = true;
          
          textData.forEach((item, idx) => {
            if (indices[idx] < item.text.length) {
              indices[idx]++;
              item.element.textContent = item.text.substring(0, indices[idx]);
              allComplete = false;
            }
          });
          
          if (allComplete) {
            // All typing finished, switch to pause phase
            phase = 'pause1';
            setTimeout(animationStep, this.pauseTime); // Pause before deletion
            return;
          }
          
          setTimeout(animationStep, Math.random() * 50 + 200); // Typing speed
          break;
          
        case 'pause1':
          // Pause after typing complete, then switch to deleting
          phase = 'deleting';
          animationStep();
          break;
          
        case 'deleting':
          // Delete all elements
          allComplete = true;
          
          textData.forEach((item, idx) => {
            if (indices[idx] > 0) {
              indices[idx]--;
              item.element.textContent = item.text.substring(0, indices[idx]);
              allComplete = false;
            }
          });
          
          if (allComplete) {
            // All deletion finished, switch to pause phase
            phase = 'pause2';
            setTimeout(animationStep, 1500); // Pause before retyping
            return;
          }
          
          setTimeout(animationStep, Math.random() * 30 + 120); // Deletion speed
          break;
          
        case 'pause2':
          // Pause after deletion complete, then restart cycle
          phase = 'typing';
          setTimeout(animationStep, 500); // Short pause before restart
          break;
      }
    };
    
    // Start animation process
    animationStep();
  }
  
  private setupIntersectionObserver() {
    if (!this.isBrowser) return;
    
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          
          // Update current section for navigation highlight
          const id = entry.target.getAttribute('id');
          if (id) {
            this.currentSection = id;
          }
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
  }
}
