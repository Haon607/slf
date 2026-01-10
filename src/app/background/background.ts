import { AfterViewInit, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import gsap from "gsap";
import { Letter } from "../service/letter";
import { Memory } from "../service/memory.service";

@Component({
    selector: 'app-background',
    templateUrl: './background.html',
    styleUrl: './background.css',
    imports: [],
    standalone: true
})
export class Background implements AfterViewInit {

    protected letters: Letter[] = [];
    protected letter: string = '';

    constructor(private el: ElementRef, private storage: Memory, private cdr: ChangeDetectorRef) {
        this.letter = storage.selectedLetter.get()?.symbol ?? '';
        this.letters = storage.alreadyPlayedLetters.get() ?? [];

        storage.alreadyPlayedLetters.changeSubject.subscribe(value => {
            if (value && value.length - this.letters.length === 1) {
                this.letters = value ?? [];
                this.positionLetter(value[value.length - 1]);
                gsap.to('#latest-letter', {autoAlpha: 0})
            } else
                this.letters = value ?? []

        });
        storage.selectedLetter.changeSubject.subscribe(value => {
            if (!value) this.letter = '';
            else {
                if (value.symbol === '') {
                    this.letter = '';
                    gsap.to('#latest-letter', {autoAlpha: 0});
                    return;
                }
                this.letter = value.symbol;
                this.cdr.detectChanges();
                gsap.to('#latest-letter', {autoAlpha: 1})
            }
        });
    }

    async ngAfterViewInit() {
        this.positionLetters();
    }

    private randomGaussian(min: number, max: number): number {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();

        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5;

        if (num < 0 || num > 1) {
            return this.randomGaussian(min, max);
        }

        return min + num * (max - min);
    }

    private positionLetters() {
        console.log(this.letters)
        for (const letter of this.letters.sort((a, b) => a.index! - b.index!)) {
            this.positionLetter(letter);
        }
    }

    private async positionLetter(letter: Letter) {
        const container = this.el.nativeElement.querySelector('#letter-container');
        const rect = container.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const SPACE_MODIFIER = 1.2;

        if (letter.index === undefined) throw new Error(`NO INDEX IN LETTER!\n` + letter.symbol);

        await new Promise(resolve => setTimeout(resolve, 100));

        gsap.to(`#letter-${letter.index}`, {
            x: this.randomGaussian((width / SPACE_MODIFIER) * -1, width / SPACE_MODIFIER),
            y: this.randomGaussian((height / SPACE_MODIFIER) * -1, height / SPACE_MODIFIER),
            rotate: this.randomGaussian(-80, 80),
            color: "#888888AA",
            duration: 1,
            autoAlpha: 1,
            scale: 0.5,
            filter: "blur(50px)",
            ease: "power2.out"
        });
    }
}
