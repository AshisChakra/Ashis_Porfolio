import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Reactive signal for loading state, initialized to true
  private isLoading = signal<boolean>(true);
  
  // Expose read-only version of the signal
  public readonly loading = this.isLoading.asReadonly();
  
  constructor() {
    console.log('LoadingService initialized with loading state: true');
  }
  
  // Start loading with portfolio transition
  showLoading() {
    console.log('Loading started');
    this.isLoading.set(true);
  }
  
  // Hide loading animation
  hideLoading() {
    console.log('Loading complete');
    this.isLoading.set(false);
  }
  
  // Toggle loading state
  toggleLoading() {
    const newState = !this.isLoading();
    console.log(`Loading toggled to: ${newState}`);
    this.isLoading.set(newState);
  }
} 