import { Routes } from '@angular/router';
import { Home } from "./home/home";
import { T } from "./t/t";

export const routes: Routes = [
    {path: '', component: Home},
    {path: '/ttt', component: T}
];
