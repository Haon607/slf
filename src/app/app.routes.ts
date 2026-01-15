import {Routes} from '@angular/router';
import {Home} from "./home/home";
import {Select} from './select/select';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'select', component: Select},
];
