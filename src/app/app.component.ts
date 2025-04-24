import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, AfterViewInit, HostListener, ViewChild, Renderer2, PLATFORM_ID, Inject, OnInit } from '@angular/core';

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
      }, 6000);
    }
  }
  
  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initParticleCanvas();
        this.setupIntersectionObserver();
        this.initParallaxEffect();
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
    // Reduce particle count significantly for better performance while keeping visual appeal
    const particleCount = Math.floor(canvas.width * canvas.height / 25000);
    
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      // Create particles with varying sizes to simulate stars at different distances
      const size = Math.random() < 0.05 ? 
        Math.random() * 2.5 + 1.5 : // Larger stars (5% of particles)
        Math.random() * 1.2 + 0.3;  // Smaller stars (95% of particles)
      
      // Even slower movement for better performance and more realistic starfield
      const speed = Math.random() * 0.15 + 0.02;
      
      this.particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        speed,
        this.getRandomColor(),
        size
      ));
    }
  }
  
  private getRandomColor(): string {
    // Create a starfield effect with different star colors
    const colors = [
      'rgba(255, 255, 255, 0.8)',  // Bright white stars
      'rgba(173, 216, 230, 0.7)',  // Light blue stars
      'rgba(255, 223, 186, 0.7)',  // Warm yellow stars
      'rgba(138, 43, 226, 0.7)',   // Purple stars
      'rgba(106, 30, 176, 0.5)'    // Dim purple stars
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
    
    // Reduce connection distance for better performance
    const maxDistance = 80;
    const maxDistanceSquared = maxDistance * maxDistance;
    
    // Optimize by checking fewer particles and skipping frames
    // Only connect particles every other frame to improve performance
    if (Math.random() > 0.5) return;
    
    // Only check a subset of particles to improve performance
    const checkFraction = 0.3; // Check only 30% of particles
    const checkLimit = Math.floor(this.particles.length * checkFraction);
    
    for (let i = 0; i < checkLimit; i++) {
      // Choose random indices to check
      const idx = Math.floor(Math.random() * this.particles.length);
      // Only check a small number of potential neighbors
      const neighborLimit = 5;
      
      for (let j = 0; j < neighborLimit; j++) {
        const neighborIdx = Math.floor(Math.random() * this.particles.length);
        if (neighborIdx === idx) continue;
        
        const dx = this.particles[idx].x - this.particles[neighborIdx].x;
        const dy = this.particles[idx].y - this.particles[neighborIdx].y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = 1 - (distance / maxDistance);
          this.ctx.strokeStyle = `rgba(138, 43, 226, ${opacity * 0.3})`;
          this.ctx.lineWidth = 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[idx].x, this.particles[idx].y);
          this.ctx.lineTo(this.particles[neighborIdx].x, this.particles[neighborIdx].y);
          this.ctx.stroke();
        }
      }
    }
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
    public size: number = Math.random() * 3 + 1
  ) {
    // Set random velocities based on direction
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    // Set transparency for twinkling effect
    this.originalAlpha = 0.1 + Math.random() * 0.7;
    this.alpha = this.originalAlpha;
  }
  
  update() {
    // Update position based on velocity
    this.x += this.vx;
    this.y += this.vy;
    
    // Create subtle twinkling effect
    if (Math.random() > 0.99) { // Only 1% chance to change per frame
      this.alpha = Math.random() > 0.5 ? 
        Math.min(this.originalAlpha * 1.5, 1) : // Brighter
        this.originalAlpha * 0.5; // Dimmer
    } else if (Math.random() > 0.9) { // 10% chance to revert to original
      this.alpha = this.originalAlpha;
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    // Extract color components for custom alpha
    const baseColor = this.color.replace(/[^,]+(?=\))/, this.alpha.toString());
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = baseColor;
    
    // Use different rendering for larger particles (stars)
    if (this.size > 1.5) {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
    }
    
    ctx.fill();
  }
}
