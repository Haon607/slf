import { AfterViewInit, Component, ElementRef } from '@angular/core';
import gsap from "gsap";
import { Letter } from "../service/letter";

@Component({
    selector: 'app-background',
    templateUrl: './background.html',
    styleUrl: './background.css',
    imports: [],
    standalone: true
})
export class Background implements AfterViewInit {

    letters = [
        {symbol: 'A', index: 0},
        {symbol: 'B', index: 1},
        {symbol: 'C', index: 2},
        {symbol: 'D', index: 3},
        {symbol: 'E', index: 4},
        {symbol: 'F', index: 5},
        {symbol: 'G', index: 6},
        {symbol: 'H', index: 7},
        {symbol: 'I', index: 8},
        {symbol: 'J', index: 9},
        {symbol: 'K', index: 10},
        {symbol: 'L', index: 12},
        {symbol: 'M', index: 13},
        {symbol: 'N', index: 14},
        {symbol: 'O', index: 15},
        {symbol: 'P', index: 16},
        {symbol: 'Q', index: 17},
    ];

    constructor(private el: ElementRef) {
        this.letters = []
        for (let i = 0; i < 15; i++) {
            this.letters.push({symbol: (i % 10) + "", index: i})
        }
    }

    ngAfterViewInit(): void {
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

    private async positionLetters() {
        const container = this.el.nativeElement.querySelector('#letter-container');
        const rect = container.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        for (const letter of this.letters.sort((a, b) => a.index - b.index)) {
            this.positionLetter(letter, width, height);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

    }

    private positionLetter(letter: Letter, width: number, height: number): void {
        const SPACE_MODIFIER = 1.2;

        if (letter.index === undefined) throw new Error(`NO INDEX IN LETTER!\n` + letter.symbol);
        gsap.to(`#letter-${letter.index}`, {
            x: this.randomGaussian((width / SPACE_MODIFIER) * -1, width / SPACE_MODIFIER),
            y: this.randomGaussian((height / SPACE_MODIFIER) * -1, height / SPACE_MODIFIER),
            rotate: this.randomGaussian(-80, 80),
            color: "#888888AA",
            duration: 1,
            autoAlpha: 1,
            ease: "power2.out"
        });
    }
}
