import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  
  private smallScreenBound = 576; // in pixels
  private mediumScreenBound = 768;

  constructor() {
  }

  public isDesktopResolution(): boolean {
    return window.innerWidth > this.mediumScreenBound;
  }

  public isSmallScreen(): boolean  {
    return window.innerWidth < this.smallScreenBound;
  }

  public getChartClassForScreenSize(): string {

    if(window.innerWidth > this.mediumScreenBound) {
      return 'chart-large-screen';
    } else if (window.innerWidth > this.smallScreenBound && window.innerWidth < this.mediumScreenBound) {
      return 'chart-medium-screen';
    } else {
      return 'chart-small-screen';
    }
  }

  scrollIfNeccessary(condition: boolean, position: number): void {

    if (condition) { 
      setTimeout(() => { // scroll to bottom
        window.scrollTo({ left: 0, top: document.body.scrollHeight/position, behavior: "smooth" });
      }, 100);
    }

  }
 
}
