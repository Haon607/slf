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

    /** Used to cancel countdowns */
    private roundToken = 0;

    /** Sounds */
    private preSound = new Audio('sounds/countdown.wav');
    private goSound = new Audio('sounds/go.wav');

    constructor(private storage: Memory) {
        this.time = storage.time.get() ?? 90;
    }

    /* =======================
       PUBLIC CONTROLS
    ======================== */

    protected async start() {
        // Cancel anything currently running
        this.stopAll();

        // New round token
        const token = ++this.roundToken;

        this.selectLetter();

        const completed = await this.startCountdown(token);
        if (!completed) return;

        this.goSound.currentTime = 0;
        this.goSound.play();

        this.timerComponent.startTimer();
    }

    protected reset() {
        this.stopAll();
        this.storage.alreadyPlayedLetters.remove();
        this.storage.selectedLetter.remove();
    }

    protected async setTime() {
        let input: string | null;
        do {
            input = prompt("Zeit in Sekunden", this.time + "");
        } while (!Number(input) || Number(input) < 15);

        this.time = Number(input);
        this.storage.time.set(this.time);
        this.timerComponent.modifyTimer(this.time);
    }

    protected onTimerEnd() {
        new Audio('sounds/time_up.wav').play();
    }

    /* =======================
       INTERNAL LOGIC
    ======================== */

    private stopAll() {
        // Invalidate running countdown
        this.roundToken++;
        this.countdownTimer = '0';

        // Stop timer immediately
        if (this.timerComponent) {
            this.timerComponent.stopTimer();
            this.timerComponent.resetTimer();
        }
    }

    private selectLetter() {
        const alreadyPlayed = this.storage.alreadyPlayedLetters.get() ?? [];
        const selected = this.storage.selectedLetter.get();

        if (selected) {
            this.storage.alreadyPlayedLetters.set([
                ...alreadyPlayed,
                { symbol: selected.symbol, index: alreadyPlayed.length }
            ]);
        }

        const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const possibleLetters = allLetters.filter(
            l => !alreadyPlayed.some(p => p.symbol === l)
        );

        if (possibleLetters.length === 0) {
            alert("Keine Buchstaben übrig!");
            return;
        }

        this.storage.selectedLetter.set({
            symbol: shuffleArray(possibleLetters)[0]
        });
    }

    private async startCountdown(token: number): Promise<boolean> {
        for (const value of ['3', '2', '1']) {
            if (token !== this.roundToken) return false;

            this.countdownTimer = value;
            this.preSound.currentTime = 0;
            this.preSound.play();

            await wait(1000);
        }

        if (token !== this.roundToken) return false;

        this.countdownTimer = 'GO';
        await wait(300);

        this.countdownTimer = '0';
        return true;
    }
}
