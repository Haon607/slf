import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Memory} from '../service/memory.service';

@Component({
    selector: 'app-select',
    imports: [],
    templateUrl: './select.html',
    styleUrl: './select.css',
})
export class Select {
    constructor(
        private router: Router,
        private memory: Memory,
    ) {
        memory.excludedLetters.get()
    }
}
