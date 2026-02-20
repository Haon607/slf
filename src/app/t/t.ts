import { Component } from '@angular/core';

@Component({
  selector: 'app-t',
  imports: [],
  templateUrl: './t.html',
  styleUrl: './t.css',
  standalone: true
})
export class T {
  x() {
    const ws = new WebSocket('ws://ws.voidlesity.dev:80');
    ws.addEventListener("open", () => {
        ws.send(JSON.stringify({
          event: 'trigger_mouse'
        }));
    })
  }
}
