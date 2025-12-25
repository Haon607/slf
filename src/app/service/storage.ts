import { Injectable } from '@angular/core';
import { Letter } from "./letter";

class Store<T> {
    constructor(private identifier: string) {
    }

    public set(toSet: T) {
        localStorage[this.identifier] = JSON.stringify(toSet);
    }

    public get(): T | undefined {
        try {
            return JSON.parse(localStorage[this.identifier]);
        } catch (e) {
            return undefined;
        }
    }

    public remove() {
        localStorage[this.identifier] = undefined;
    }
}

@Injectable({
    providedIn: 'root',
})
export class Storage {
    alreadyPlayedLetters = new Store<Letter[]>('alreadyplayedletters');
    excludedLetters = new Store<Letter[]>('excludedletters');
}
