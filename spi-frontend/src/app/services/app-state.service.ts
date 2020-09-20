import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private _isMobileResolution: boolean;
  
  private smallScreenBound = 576; // in pixels
  private mediumScreenBound = 768;

  constructor() {
    if (window.innerWidth < 768) {
      this._isMobileResolution = true;
    } else {
      this._isMobileResolution = false;
    }
  }

  public isMobileResolution(): boolean {
    return this._isMobileResolution;
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
}
