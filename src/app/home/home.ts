import { Component } from '@angular/core';
import { Background } from "../background/background";
import { Memory } from "../service/memory.service";
import { shuffleArray } from "../utils";

@Component({
    selector: 'app-home', imports: [Background], templateUrl: './home.html', styleUrl: './home.css', standalone: true
})
export class Home {
    protected time: number;

    constructor(private storage: Memory) {
        this.time = storage.time.get() ?? 90;
    }

    protected reset() {
        this.storage.alreadyPlayedLetters.remove();
        this.storage.selectedLetter.remove();

    }

    protected setTime() {
        var input: string | null;
        do {
            input = prompt("Zeit in Sekunden", this.time + "");
        } while (!Number(input) || Number(input) < 15);

        this.time = Number(input);
        this.storage.time.set(this.time);

    }

    protected start() {
        const alreadyPlayed = this.storage.alreadyPlayedLetters.get() ?? [];

        const selected = this.storage.selectedLetter.get();
        if (selected) {
            this.storage.alreadyPlayedLetters.set([
                ...alreadyPlayed,
                {
                    symbol: selected.symbol,
                    index: alreadyPlayed.length
                }
            ]);
        }

        console.log(this.storage.alreadyPlayedLetters.get());

        const allLetters = [
            'A','B','C','D','E','F','G','H','I','J','K','L','M',
            'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
        ];

        const possibleLetters = allLetters.filter(
            letter => !alreadyPlayed.some(played => played.symbol === letter)
        );

        if (possibleLetters.length === 0) {
            console.warn('No letters left to play');
            return;
        }

        this.storage.selectedLetter.set({
            symbol: shuffleArray(possibleLetters)[0]
        });
    }
}
