import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Memory} from '../service/memory.service';
import {MetaLetter} from '../service/letter';
import {NgStyle} from '@angular/common';

@Component({
    selector: 'app-select',
    imports: [
        NgStyle
    ],
    templateUrl: './select.html',
    styleUrl: './select.css',
    standalone: true
})
export class Select {
    protected letters: MetaLetter[] = [];

    constructor(
        private router: Router,
        private memory: Memory,
    ) {
        const nullLetters = memory.allLetters.get();
        if (!nullLetters) {
            this.router.navigateByUrl('/');
            return;
        }
        this.letters = nullLetters;
    }

    protected saveAndReturn() {
        this.memory.allLetters.set(this.letters);
        this.router.navigateByUrl('/');
    }
}
