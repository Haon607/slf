import {Routes} from '@angular/router';
import {Home} from "./home/home";
import {Select} from './select/select';
import { T } from "./t/t";

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'select', component: Select},
    {path: '/ttt', component: T}
];
