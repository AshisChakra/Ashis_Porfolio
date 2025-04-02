import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, AfterViewInit, HostListener, ViewChild, Renderer2, PLATFORM_ID, Inject } from '@angular/core';

import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
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
    ContactSectionComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'Ashis_Portfolio';
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('parallaxBg') parallaxBg!: ElementRef;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrameId: number = 0;
  private lastScrollPosition: number = 0;
  private currentSection: string = 'hero';
  private isBrowser: boolean;
  private _lastMouseMoveTime: number = 0;
  
  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
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
    // Reduce particle count for better performance
    const particleCount = Math.floor(canvas.width * canvas.height / 15000);
    
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      // Create particles with varying sizes to simulate stars at different distances
      const size = Math.random() < 0.1 ? 
        Math.random() * 3 + 2 : // Larger stars (10% of particles)
        Math.random() * 1.5 + 0.5; // Smaller stars (90% of particles)
      
      // Slower movement for a more realistic starfield
      const speed = Math.random() * 0.3 + 0.05;
      
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
    
    const maxDistance = 120;
    const maxDistanceSquared = maxDistance * maxDistance;
    
    // Optimize by using squared distance and limiting connections
    for (let i = 0; i < this.particles.length; i++) {
      // Only check a limited number of neighbors to improve performance
      const checkLimit = Math.min(15, this.particles.length - i - 1);
      
      for (let j = i + 1; j <= i + checkLimit; j++) {
        if (j >= this.particles.length) break;
        
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = 1 - (distance / maxDistance);
          this.ctx.strokeStyle = `rgba(138, 43, 226, ${opacity * 0.4})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
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
  
  constructor(
    public x: number,
    public y: number,
    public speed: number,
    public color: string,
    public size: number = Math.random() * 3 + 1
  ) {
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
