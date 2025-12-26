import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  standalone: true,
  imports: [NgStyle]
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() initialTime: number = 60;
  @Input() warningThreshold: number = 10;
  @Input() progressBarColor: string = '#4CAF50';
  @Input() warningColor: string = '#FF0000';
  @Input() textColor: string = '#000';
  @Input() warningTextColor: string = '#FF0000';

  @Output() currentSecond = new EventEmitter<number>();
  @Output() timerEnded = new EventEmitter<void>();

  @ViewChild('timeText', { static: true }) timeText!: ElementRef;

  timeLeft!: number;
  intervalId: any;
  isRunning = false;
  isWarning = false;

  ngOnInit(): void {
    this.resetTimer();
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.animateScale();

    this.intervalId = setInterval(() => {
      this.timeLeft -= 1;
      this.currentSecond.emit(this.timeLeft);

      if (this.timeLeft <= this.warningThreshold || this.timeLeft % 10 === 0) {
        this.animateScale();
      }

      if (this.timeLeft <= this.warningThreshold) {
        this.isWarning = true;
        this.animateFlash();
        new Audio('sounds/time_out.wav').play();
      } else {
        this.isWarning = false;
        this.resetTextColor();
      }

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.timerEnded.emit();
      }
    }, 1000);
  }

  stopTimer() {
    this.isRunning = false;
    this.clearInterval();
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeft = this.initialTime;
    this.isWarning = false;
    this.resetTextColor();
  }

  modifyTimer(newTime: number) {
    this.timeLeft = newTime;
    if (this.isRunning && this.timeLeft > 0) {
      this.stopTimer();
      this.startTimer();
    }
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pipeTime(timeLeft: number) {
    const seconds = timeLeft % 60;
    const minutes = Math.floor(timeLeft / 60);
    return `${minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
  }

  /* =========================
     GSAP ANIMATIONS
     ========================= */

  private animateScale() {
    gsap.fromTo(
        this.timeText.nativeElement,
        { scale: 1 },
        {
          scale: 1.2,
          duration: 0.2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        }
    );
  }

  private animateFlash() {
    gsap.to(this.timeText.nativeElement, {
      color: this.warningTextColor,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    });
  }

  private resetTextColor() {
    gsap.set(this.timeText.nativeElement, {
      color: this.textColor
    });
  }
}
