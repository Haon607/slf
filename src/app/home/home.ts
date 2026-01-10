import { Component, ViewChild } from '@angular/core';
import { Background } from "../background/background";
import { Memory } from "../service/memory.service";
import { shuffleArray, wait } from "../utils";
import { TimerComponent } from "../timer/timer.component";

@Component({
    selector: 'app-home',
    imports: [Background, TimerComponent],
    templateUrl: './home.html',
    styleUrl: './home.css',
    standalone: true
})
export class Home {
    @ViewChild(TimerComponent) timerComponent!: TimerComponent;
    protected time: number;
    protected countdownTimer: string = '0';
    protected timeRunningOut = new Audio('sounds/timers_up_countdown.mp3');
    private countdownsRunning: HTMLAudioElement[] = [];

    constructor(private storage: Memory) {
        this.time = storage.time.get() ?? 90;
    }

    async startTimer() {
        this.timerComponent.startTimer()
    }

    protected reset() {
        this.storage.alreadyPlayedLetters.remove();
        this.storage.selectedLetter.remove();
        this.timerComponent.stopTimer();
    }

    protected async setTime() {
        let input: string | null;
        do {
            input = prompt("Zeit in Sekunden", this.time + "");
        } while (!Number(input) || Number(input) < 16);

        this.time = Number(Number(input).toFixed(0));
        this.storage.time.set(this.time);
        this.timerComponent.modifyTimer(this.time);
    }

    protected async start() {
        await this.selectLetter();
        await this.startCountdown();
    }

    protected onTimerEnd() {
        // new Audio('sounds/time_up.wav').play();
    }

    protected onSecondChange(currentSecond: number) {
        if (currentSecond === 15) {
            this.timeRunningOut.currentTime = 0;
            this.timeRunningOut.play();
        }
    }

    private async selectLetter() {
        this.timerComponent.resetTimer();
        this.timeRunningOut.pause();

        this.countdownsRunning.forEach(countdown => countdown.pause());

        const alreadyPlayed = this.storage.alreadyPlayedLetters.get() ?? [];

        const selected = this.storage.selectedLetter.get();
        if (selected) {
            this.storage.alreadyPlayedLetters.set([...alreadyPlayed, {
                symbol: selected.symbol, index: alreadyPlayed.length
            }]);
        }

        const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        const possibleLetters = allLetters.filter(letter => !alreadyPlayed.some(played => played.symbol === letter));

        if (possibleLetters.length === 0) {
            console.warn('No letters left to play');
            alert("Keine Buchstaben übrig!");
            return;
        }

        await this.letterSelectAnimation(possibleLetters);

        this.storage.selectedLetter.set({
            symbol: shuffleArray(possibleLetters)[0],
        });
        new Audio("sounds/positive.mp3").play();
        await wait(500);
    }

    private async startCountdown() {
        const countdownAudio = new Audio('sounds/countdown.mp3');
        countdownAudio.play();

        this.countdownsRunning.push(countdownAudio);

        while (!countdownAudio.paused) {
            if (countdownAudio.currentTime > 3) {
                await this.startTimer();
                await wait(2000);
            }

            await wait(10);
        }
    }

    private async letterSelectAnimation(letters: string[]) {
        const scrambleAudio = new Audio('sounds/scramble.mp3');
        scrambleAudio.play();

        do await wait(100);
        while (scrambleAudio.currentTime < 3);
    }
}
