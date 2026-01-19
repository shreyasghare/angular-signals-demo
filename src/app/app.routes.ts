import { Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';

export const routes: Routes = [
  {
    path: 'user-form',
    component: UserFormComponent
  },
  {
    path: 'signals-demo',
    component: SignalsDemoComponent
  },
  {
    path: '',
    redirectTo: '/user-form',
    pathMatch: 'full'
  }
];
