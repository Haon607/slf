import { Injectable } from '@angular/core';
import { Letter } from "./letter";
import { Subject } from "rxjs";

class Store<T> {
    public changeSubject: Subject<T | undefined>;

    constructor(private identifier: string) {
        this.changeSubject = new Subject<T | undefined>();
    }

    public set(toSet: T) {
        localStorage[this.identifier] = JSON.stringify(toSet);
        this.changeSubject.next(toSet)
    }

    public get(): T | undefined {
        try {
            return JSON.parse(localStorage[this.identifier]);
        } catch (e) {
            return undefined;
        }
    }

    public remove() {
        localStorage.removeItem(this.identifier);
        this.changeSubject.next(undefined)
    }
}

@Injectable({
    providedIn: 'root',
})
export class Memory {
    alreadyPlayedLetters = new Store<Letter[]>('alreadyplayedletters');
    selectedLetter = new Store<Letter>('selectedletter');
    time = new Store<number>('time');
    // excludedLetters = new Store<Letter[]>('excludedletters');
}
