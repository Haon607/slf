import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Memory} from './service/memory.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Prevent context menu everywhere
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: Event) {
    event.preventDefault();
  }

  // Prevent long-press from triggering it on touch devices
  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) return; // allow pinch zoom
    event.preventDefault();
  }

  constructor(private memory: Memory) {
      if (memory.allLetters.get() != undefined) return;
      memory.allLetters.set([
          {symbol: 'A', enabled: true, alreadyPlayed: false},
          {symbol: 'B', enabled: true, alreadyPlayed: false},
          {symbol: 'C', enabled: true, alreadyPlayed: false},
          {symbol: 'D', enabled: true, alreadyPlayed: false},
          {symbol: 'E', enabled: true, alreadyPlayed: false},
          {symbol: 'F', enabled: true, alreadyPlayed: false},
          {symbol: 'G', enabled: true, alreadyPlayed: false},
          {symbol: 'H', enabled: true, alreadyPlayed: false},
          {symbol: 'I', enabled: true, alreadyPlayed: false},
          {symbol: 'J', enabled: true, alreadyPlayed: false},
          {symbol: 'K', enabled: true, alreadyPlayed: false},
          {symbol: 'L', enabled: true, alreadyPlayed: false},
          {symbol: 'M', enabled: true, alreadyPlayed: false},
          {symbol: 'N', enabled: true, alreadyPlayed: false},
          {symbol: 'O', enabled: true, alreadyPlayed: false},
          {symbol: 'P', enabled: true, alreadyPlayed: false},
          {symbol: 'Q', enabled: true, alreadyPlayed: false},
          {symbol: 'R', enabled: true, alreadyPlayed: false},
          {symbol: 'S', enabled: true, alreadyPlayed: false},
          {symbol: 'T', enabled: true, alreadyPlayed: false},
          {symbol: 'U', enabled: true, alreadyPlayed: false},
          {symbol: 'V', enabled: true, alreadyPlayed: false},
          {symbol: 'W', enabled: true, alreadyPlayed: false},
          {symbol: 'X', enabled: true, alreadyPlayed: false},
          {symbol: 'Y', enabled: true, alreadyPlayed: false},
          {symbol: 'Z', enabled: true, alreadyPlayed: false},
      ])
  }
}
