import { Component, ViewChild } from '@angular/core';
import { Background } from "../background/background";
import { Memory } from "../service/memory.service";
import { shuffleArray, wait } from "../utils";
import { TimerComponent } from "../timer/timer.component";

@Component({
    selector: 'app-home', imports: [Background, TimerComponent], templateUrl: './home.html', styleUrl: './home.css', standalone: true
})
export class Home {
    @ViewChild(TimerComponent) timerComponent!: TimerComponent;
    protected time: number;
    protected currentSecond: number = 0;
    protected countdownTimer: number = 0;

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
        var input: string | null;
        do {
            input = prompt("Zeit in Sekunden", this.time + "");
        } while (!Number(input) || Number(input) < 15);

        this.time = Number(input);
        this.storage.time.set(this.time);
        this.timerComponent.modifyTimer(this.time);
    }

    protected async start() {
        this.selectLetter();
        await this.startCountdown();
        await this.startTimer();

    }

    private selectLetter() {
        this.timerComponent.resetTimer();

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
            return;
        }

        this.storage.selectedLetter.set({
            symbol: shuffleArray(possibleLetters)[0]
        });
    }

    private async startCountdown() {
        countdownTimer = '3';
        await wait(1000);
        countdownTimer = '2';
        await wait(1000);
        countdownTimer = '1';
        await wait(1000);
        countdownTimer = '0';
        await wait(1000);

    }

    protected onTimerEnd() {

    }
}
