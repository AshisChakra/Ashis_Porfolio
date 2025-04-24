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
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('parallaxBg') parallaxBg!: ElementRef;
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChildren('.reveal-item') revealItems!: QueryList<ElementRef>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrameId: number = 0;
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
  typingSpeed = 100; // milliseconds per character
  deletingSpeed = 50; // milliseconds per character
  pauseTime = 1500; // pause time between typing and deleting
  
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
        this.initParticleCanvas();
        this.setupIntersectionObserver();
        this.initParallaxEffect();
        this.setupScrollAnimations();
      }, 0);
    }
  }
  
  private initParticleCanvas() {
    if (!this.isBrowser || !this.particleCanvas) return;
    
    const canvas = this.particleCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    if (!this.ctx) return;
    
    // Set canvas to full window size
    this.resizeCanvas();
    
    // Create particles
    this.createParticles();
    
    // Start animation
    this.animate();
  }
  
  private resizeCanvas() {
    if (!this.isBrowser || !this.particleCanvas) return;
    
    const canvas = this.particleCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  private createParticles() {
    if (!this.isBrowser || !this.particleCanvas) return;
    
    const canvas = this.particleCanvas.nativeElement;
    
    // Create particles with varying densities based on screen size
    const baseCount = 80;
    const areaFactor = (canvas.width * canvas.height) / (1920 * 1080);
    const particleCount = Math.floor(baseCount * areaFactor);
    
    this.particles = [];
    
    // Create main cosmic dust particles
    for (let i = 0; i < particleCount; i++) {
      // Create particles with varying sizes for more realistic starfield
      let sizeCategory = Math.random();
      let size, speed, alphaBase;
      
      if (sizeCategory < 0.7) {
        // 70% small dust particles
        size = Math.random() * 1.0 + 0.2;
        speed = Math.random() * 0.08 + 0.01;
        alphaBase = 0.1 + Math.random() * 0.4;
      } else if (sizeCategory < 0.95) {
        // 25% medium stars
        size = Math.random() * 1.5 + 1.0;
        speed = Math.random() * 0.05 + 0.005;
        alphaBase = 0.3 + Math.random() * 0.5;
      } else {
        // 5% large bright stars
        size = Math.random() * 2.5 + 1.5;
        speed = Math.random() * 0.03 + 0.002;
        alphaBase = 0.5 + Math.random() * 0.5;
      }
      
      this.particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        speed,
        this.getRandomColor(),
        size,
        alphaBase
      ));
    }
    
    // Add a few special flare particles
    for (let i = 0; i < 5; i++) {
      const size = Math.random() * 3 + 2;
      this.particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 0.02 + 0.001,
        'rgba(255, 255, 255, 0.9)',
        size,
        0.9,
        true // special flare
      ));
    }
  }
  
  private getRandomColor(): string {
    // Create an enhanced starfield effect with significantly brighter star colors
    const colors = [
      'rgba(255, 255, 255, 0.95)',  // Bright white stars
      'rgba(210, 235, 255, 0.85)',  // Light blue stars
      'rgba(255, 240, 210, 0.8)',   // Warm yellow stars
      'rgba(190, 190, 255, 0.85)',  // Blue stars
      'rgba(220, 160, 255, 0.8)',   // Pink stars
      'rgba(180, 110, 240, 0.75)',  // Purple stars
      'rgba(150, 90, 220, 0.7)',    // Dim purple stars
      'rgba(80, 220, 255, 0.75)'    // Bright sky blue stars
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  private animate() {
    if (!this.isBrowser || !this.ctx) return;
    
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    const canvas = this.particleCanvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      particle.update();
      particle.draw(this.ctx);
      
      // Reset particle position if it goes off screen
      if (particle.x < 0 || particle.x > canvas.width || 
          particle.y < 0 || particle.y > canvas.height) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
      }
    });
    
    // Connect nearby particles with lines
    this.connectParticles();
  }
  
  private connectParticles() {
    if (!this.isBrowser || !this.ctx) return;
    
    // Enhanced connection parameters for cosmic web effect
    const maxDistance = 100;
    const maxDistanceSquared = maxDistance * maxDistance;
    
    // Only connect particles every other frame to improve performance
    if (Math.random() > 0.6) return;
    
    // Create several connection types with different properties
    const connectionTypes = [
      { 
        limit: Math.floor(this.particles.length * 0.3), // 30% of particles
        connectionCount: 3, 
        color: 'rgba(180, 110, 240, %o)',
        width: 0.3,
        alphaMultiplier: 0.35
      },
      { 
        limit: Math.floor(this.particles.length * 0.1), // 10% of particles
        connectionCount: 2, 
        color: 'rgba(220, 160, 255, %o)',
        width: 0.4,
        alphaMultiplier: 0.4
      },
      { 
        limit: 5, // Small number of stronger connections
        connectionCount: 3, 
        color: 'rgba(255, 255, 255, %o)',
        width: 0.5,
        alphaMultiplier: 0.45
      }
    ];
    
    // Process each connection type
    connectionTypes.forEach(connType => {
      for (let i = 0; i < connType.limit; i++) {
        // Choose random indices to check
        const idx = Math.floor(Math.random() * this.particles.length);
        const particle = this.particles[idx];
        
        // Connect only to specific number of neighbors
        for (let j = 0; j < connType.connectionCount; j++) {
          const neighborIdx = Math.floor(Math.random() * this.particles.length);
          if (neighborIdx === idx) continue;
          
          const neighbor = this.particles[neighborIdx];
          const dx = particle.x - neighbor.x;
          const dy = particle.y - neighbor.y;
          const distanceSquared = dx * dx + dy * dy;
          
          if (distanceSquared < maxDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);
            const opacity = 1 - (distance / maxDistance);
            
            // Special effect for flare particles
            if (particle.isFlare || neighbor.isFlare) {
              this.ctx.beginPath();
              
              // Create gradient line for flare connections
              const gradient = this.ctx.createLinearGradient(
                particle.x, particle.y, neighbor.x, neighbor.y
              );
              
              gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.7})`);
              gradient.addColorStop(0.5, `rgba(220, 180, 255, ${opacity * 0.6})`);
              gradient.addColorStop(1, `rgba(170, 120, 255, ${opacity * 0.5})`);
              
              this.ctx.strokeStyle = gradient;
              this.ctx.lineWidth = 0.7;
              this.ctx.moveTo(particle.x, particle.y);
              this.ctx.lineTo(neighbor.x, neighbor.y);
              this.ctx.stroke();
            } else {
              // Regular connections
              this.ctx.strokeStyle = connType.color.replace('%o', (opacity * connType.alphaMultiplier).toString());
              this.ctx.lineWidth = connType.width;
              this.ctx.beginPath();
              this.ctx.moveTo(particle.x, particle.y);
              this.ctx.lineTo(neighbor.x, neighbor.y);
              this.ctx.stroke();
            }
          }
        }
      }
    });
  }
  
  private setupIntersectionObserver() {
    if (!this.isBrowser) return;
    
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          this.currentSection = section.id || 'hero';
          
          // Add animation class when section comes into view
          this.renderer.addClass(section, 'section-visible');
          
          // Animate section title with morphing effect
          const titleElement = section.querySelector('h2');
          if (titleElement) {
            this.renderer.addClass(titleElement, 'title-morph');
          }
        }
      });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
  }
  
  private initParallaxEffect() {
    if (!this.isBrowser || !this.parallaxBg) return;
    
    window.addEventListener('scroll', () => this.handleParallaxScroll());
  }
  
  private handleParallaxScroll() {
    if (!this.isBrowser) return;
    
    const scrollY = window.scrollY;
    
    // Remove the translateY effect on the background to keep it fixed
    // while scrolling
    
    // Determine scroll direction
    const scrollDirection = scrollY > this.lastScrollPosition ? 'down' : 'up';
    this.lastScrollPosition = scrollY;
    
    // Apply very subtle effects to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (inView) {
        const scrollProgress = 1 - (rect.top / window.innerHeight);
        
        // Apply an extremely subtle transform - barely noticeable but adds depth
        if (scrollDirection === 'down') {
          this.renderer.setStyle(section, 'transform', `scale(${0.995 + scrollProgress * 0.005})`);
        } else {
          this.renderer.setStyle(section, 'transform', `scale(${1 - scrollProgress * 0.002})`);
        }
        
        // Add a subtle opacity effect for smoother transitions
        const opacity = 0.98 + (scrollProgress * 0.02);
        this.renderer.setStyle(section, 'opacity', opacity);
      }
    });
  }
  
  @HostListener('window:resize')
  onResize() {
    if (!this.isBrowser) return;
    
    this.resizeCanvas();
    this.createParticles();
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (!this.isBrowser) return;
    
    // Update last scroll position for other methods
    this.lastScrollPosition = window.scrollY;
    
    // Update scroll state for navbar effects
    this.hasScrolled = window.scrollY > 50;
    
    // No particle movement updates based on scroll
    // This keeps the animation independent of scrolling
  }
  
  // Interactive background effect on mouse movement
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser || !this.parallaxBg) return;
    
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    
    // Throttle particle updates for better performance
    if (!this._lastMouseMoveTime || Date.now() - this._lastMouseMoveTime > 50) {
      this._lastMouseMoveTime = Date.now();
      
      // Create subtle movement effect on particles (only update a subset for performance)
      const updateCount = Math.min(20, this.particles.length);
      for (let i = 0; i < updateCount; i++) {
        const idx = Math.floor(Math.random() * this.particles.length);
        // Apply very subtle force toward mouse position
        this.particles[idx].vx += (x - 0.5) * 0.01;
        this.particles[idx].vy += (y - 0.5) * 0.01;
      }
    }
    
    // Add subtle background position shift for mesh gradient effect
    this.renderer.setStyle(
      this.parallaxBg.nativeElement, 
      'background-position', 
      `${x * 5}% ${y * 5}%`
    );
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
  
  ngOnDestroy() {
    if (this.isBrowser && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  
  // Type animation for skills
  typeNextSkill(): void {
    if (!this.isBrowser) return;
    
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const currentSkill = this.skills[this.currentSkillIndex];
    let charIndex = 0;
    let isDeleting = false;
    let text = '';
    
    const typeChar = () => {
      if (!this.isBrowser || !typingElement) return;
      
      if (!isDeleting && charIndex <= currentSkill.length) {
        // Typing
        text = currentSkill.substring(0, charIndex);
        typingElement.textContent = text;
        charIndex++;
        
        if (charIndex > currentSkill.length) {
          // Finished typing, pause before deleting
          isDeleting = true;
          setTimeout(typeChar, this.pauseTime);
          return;
        }
        
        setTimeout(typeChar, this.typingSpeed);
      } else if (isDeleting && charIndex >= 0) {
        // Deleting
        text = currentSkill.substring(0, charIndex);
        typingElement.textContent = text;
        charIndex--;
        
        if (charIndex < 0) {
          // Finished deleting, move to next skill
          isDeleting = false;
          this.currentSkillIndex = (this.currentSkillIndex + 1) % this.skills.length;
          setTimeout(typeChar, this.typingSpeed);
          return;
        }
        
        setTimeout(typeChar, this.deletingSpeed);
      }
    };
    
    // Start typing
    typeChar();
  }
  
  // Setup scroll animations
  setupScrollAnimations(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);
    
    // Observe all reveal items
    document.querySelectorAll('.reveal-item').forEach(item => {
      observer.observe(item);
    });
  }
  
  // Initialize typing animations
  private initTypingAnimations() {
    if (!this.isBrowser) return;
    
    const typingContainers = document.querySelectorAll('.typing-container');
    const textData: {element: HTMLElement, text: string}[] = [];
    
    // First, collect all containers and their text
    typingContainers.forEach((container) => {
      const typingElement = container as HTMLElement;
      const fullText = typingElement.getAttribute('data-text') || '';
      textData.push({element: typingElement, text: fullText});
      
      // Initialize the elements with empty content
      typingElement.textContent = '';
    });
    
    // Start synchronized animation in 1 second
    setTimeout(() => {
      this.runSynchronizedAnimations(textData);
    }, 1000);
  }
  
  // Run synchronized typing animations for all elements
  private runSynchronizedAnimations(textData: {element: HTMLElement, text: string}[]) {
    const typingSpeed = 150;  // milliseconds per character
    const deletingSpeed = 100; // milliseconds per character
    const pauseBeforeDeleting = 3000; // pause time before starting to delete
    const pauseBeforeRetyping = 2000;  // pause time before retyping
    const minKeepTextLength = 3;  // minimum characters to keep before retyping
    
    let isTyping = true;       // Start in typing phase
    let isDeleting = false;    // Not in deleting phase yet
    let isPaused = false;      // Not in pause phase
    
    // Store current state for each element
    const states = textData.map(data => ({
      currentText: '',
      charIndex: 0,
      done: false  // Track if this element has completed current phase
    }));
    
    // Animation step function
    const animationStep = () => {
      // Reset all done flags when starting a new phase
      if (states.every(state => state.done)) {
        states.forEach(state => state.done = false);
        
        // Transition to next animation phase
        if (isTyping) {
          isTyping = false;
          isPaused = true;
          
          // Pause before deleting
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            animationStep();
          }, pauseBeforeDeleting);
          return;
        } else if (isDeleting) {
          isDeleting = false;
          isPaused = true;
          
          // Pause before retyping
          setTimeout(() => {
            isPaused = false;
            isTyping = true;
            animationStep();
          }, pauseBeforeRetyping);
          return;
        }
      }
      
      // Skip if in pause state
      if (isPaused) return;
      
      // Process each element in current phase
      let allDone = true;
      
      // Process all elements concurrently
      states.forEach((state, idx) => {
        // Skip if this element is already done with current phase
        if (state.done) return;
        
        const data = textData[idx];
        
        if (isTyping) {
          // Typing phase
          if (state.charIndex < data.text.length) {
            state.currentText += data.text.charAt(state.charIndex);
            state.charIndex++;
            data.element.textContent = state.currentText;
            allDone = false;
          } else {
            state.done = true;
          }
        } else if (isDeleting) {
          // Deleting phase
          if (state.charIndex > minKeepTextLength) {
            state.charIndex--;
            state.currentText = data.text.substring(0, state.charIndex);
            data.element.textContent = state.currentText;
            allDone = false;
          } else {
            state.done = true;
          }
        }
      });
      
      // Schedule next animation frame at appropriate speed
      setTimeout(
        animationStep, 
        isTyping ? typingSpeed : deletingSpeed
      );
    };
    
    // Start the animation
    animationStep();
  }
}

// Particle class for background animation
class Particle {
  vx: number;
  vy: number;
  originalAlpha: number;
  alpha: number;
  
  constructor(
    public x: number,
    public y: number,
    public speed: number,
    public color: string,
    public size: number = Math.random() * 3 + 1,
    public alphaBase: number = 0.5,
    public isFlare: boolean = false
  ) {
    // Set random velocities based on direction
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    // Set transparency for twinkling effect
    this.originalAlpha = this.alphaBase;
    this.alpha = this.originalAlpha;
  }
  
  update() {
    // Update position based on velocity
    this.x += this.vx;
    this.y += this.vy;
    
    // Create more dynamic twinkling effect
    if (this.isFlare) {
      // Flares pulse more dramatically
      this.alpha = this.originalAlpha * (0.7 + Math.sin(Date.now() * 0.001) * 0.3);
    } else if (this.size > 1.5) {
      // Larger stars twinkle slowly
      if (Math.random() > 0.98) {
        this.alpha = this.originalAlpha * (0.7 + Math.random() * 0.5);
      }
    } else {
      // Smaller stars twinkle more frequently
      if (Math.random() > 0.97) {
        this.alpha = Math.random() > 0.7 ?
          Math.min(this.originalAlpha * 1.5, 1) : // Brighter
          this.originalAlpha * 0.3; // Dimmer
      } else if (Math.random() > 0.95) {
        this.alpha = this.originalAlpha;
      }
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    // Extract color components for custom alpha
    const baseColor = this.color.replace(/[^,]+(?=\))/, this.alpha.toString());
    
    if (this.isFlare) {
      // Draw lens flare effect
      const flareSize = this.size * (0.8 + Math.sin(Date.now() * 0.001) * 0.2);
      
      // Create outer glow
      const outerGlow = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, flareSize * 5
      );
      outerGlow.addColorStop(0, 'rgba(255, 255, 255, ' + (this.alpha * 0.5) + ')');
      outerGlow.addColorStop(0.5, 'rgba(180, 120, 255, ' + (this.alpha * 0.2) + ')');
      outerGlow.addColorStop(1, 'rgba(100, 50, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, flareSize * 5, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();
      
      // Create center bright spot
      ctx.beginPath();
      ctx.arc(this.x, this.y, flareSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')';
      ctx.fill();
      
      // Add horizontal and vertical light rays
      ctx.beginPath();
      ctx.moveTo(this.x - flareSize * 3, this.y);
      ctx.lineTo(this.x + flareSize * 3, this.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, ' + (this.alpha * 0.3) + ')';
      ctx.lineWidth = flareSize * 0.5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - flareSize * 3);
      ctx.lineTo(this.x, this.y + flareSize * 3);
      ctx.strokeStyle = 'rgba(255, 255, 255, ' + (this.alpha * 0.3) + ')';
      ctx.lineWidth = flareSize * 0.5;
      ctx.stroke();
      
    } else if (this.size > 1.5) {
      // Larger stars with glow effect
      const starSize = this.size * (0.9 + Math.sin(Date.now() * 0.002 + this.x) * 0.1);
      
      // Draw outer glow
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, starSize * 2
      );
      
      // Extract base color components to create matching glow
      let colorBase = this.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      let glowColor = colorBase ? `rgba(${colorBase[1]}, ${colorBase[2]}, ${colorBase[3]}` : 'rgba(255, 255, 255';
      
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(0.6, glowColor + ', ' + (this.alpha * 0.3) + ')');
      gradient.addColorStop(1, glowColor + ', 0)');
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, starSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw center
      ctx.beginPath();
      ctx.arc(this.x, this.y, starSize, 0, Math.PI * 2);
      ctx.fillStyle = baseColor;
      ctx.fill();
      
    } else {
      // Smaller particles as simple dots
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = baseColor;
      ctx.fill();
    }
  }
}
