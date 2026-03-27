import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Background} from "../background/background";
import {Memory} from "../service/memory.service";
import { randomGaussian, shuffleArray, wait } from "../utils";
import {TimerComponent} from "../timer/timer.component";
import {Router} from '@angular/router';
import {Letter} from '../service/letter';
import gsap from "gsap";


@Component({
    selector: 'app-home',
    imports: [Background, TimerComponent],
    templateUrl: './home.html',
    styleUrl: './home.css',
    standalone: true
})
export class Home {
    @ViewChild(TimerComponent) timerComponent!: TimerComponent;
    protected countdownTimer: string = '0'; /*TODO*/
    protected disable = false;
    protected time: number;
    protected timeRunningOut = new Audio('sounds/timers_up_countdown.mp3');
    private countdownsRunning: HTMLAudioElement[] = [];
    protected possibleLetters: Letter[] = [];

    constructor(
        private storage: Memory,
        private cdr: ChangeDetectorRef,
        private router: Router,
    ) {
        this.time = storage.time.get() ?? 90;
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
        this.disable = true;
        await this.selectLetter();
        this.disable = false;
        this.cdr.detectChanges();
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
        this.countdownsRunning = [];

        let alreadyPlayed = this.storage.alreadyPlayedLetters.get() ?? [];

        const selected = this.storage.selectedLetter.get();
        if (selected) {
            alreadyPlayed = [...alreadyPlayed, {
                symbol: selected.symbol, index: alreadyPlayed.length
            }]
            this.storage.alreadyPlayedLetters.set(alreadyPlayed);

        }

        const allLetters =
            this.storage.allLetters.get()!
                .filter(letter => letter.enabled)

        const possibleLetters =
            allLetters
                .filter(letter => !alreadyPlayed
                    .some(played => played.symbol === letter.symbol));

        if (possibleLetters.length === 0) {
            console.warn('No letters left to play');
            alert("Keine Buchstaben übrig!");
            return;
        }

        shuffleArray(possibleLetters);

        await this.letterSelectAnimation([...possibleLetters]);

        this.storage.selectedLetter.set({
            symbol: possibleLetters[0].symbol
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
                this.timerComponent.startTimer();
                await wait(2000);
            }
            await wait(10);
        }
    }


    private async letterSelectAnimation(letters: Letter[]) {
        gsap.to('#select-letter-container', {autoAlpha: 1})

        letters.reverse();

        let i = 0;
        for (const letter of letters) {
            letter.index = i;
            i++;
        }

        const selectLetterAnimation = async (letters: Letter[]) => {
            const tl = gsap.timeline();

            const totalTime = 3.5;
            const count = letters.length;

            if (count === 0) return tl;

            const duration = totalTime * 0.5;

            const maxStartTime = totalTime - duration;
            const stagger = count > 1 ? maxStartTime / (count - 1) : 0;

            letters.forEach((letter, index) => {
                const el = document.getElementById('possible-letter-' + letter.index);
                if (!el) return;

                const rect = el.getBoundingClientRect();

                tl.to(el, {
                    x: randomGaussian(-250, 250) * (letters.length - 1 === letter.index ? 0 : 1),
                    y: (window.innerHeight - rect.bottom + rect.height) * (letters.length - 1 === letter.index ? 0.5 : 1),
                    rotate: randomGaussian(-250, 250) * (letters.length - 1 === letter.index ? 0 : 1),
                    duration: duration,
                    autoAlpha: (letters.length - 1 === letter.index ? 0.5 : 0),
                    ease: "power2.inOut"
                }, index * stagger);
            });

            return tl;
        };

        this.possibleLetters = letters;
        this.cdr.detectChanges();

        const scrambleAudio = new Audio('sounds/scramble.mp3');
        scrambleAudio.play();
        await wait(100);

        await selectLetterAnimation(letters);

        do await wait(100);
        while (scrambleAudio.currentTime < 3);

        gsap.to('#select-letter-container', {autoAlpha: 0})
    }

    protected setLetters() {
        this.router.navigateByUrl('select');
    }
}
