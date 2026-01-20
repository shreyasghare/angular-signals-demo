import { Routes } from '@angular/router';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';
import { HomeComponent } from './home/home.component';
import { SignalConceptComponent } from './concepts/signal-concept/signal-concept.component';
import { ComputedConceptComponent } from './concepts/computed-concept/computed-concept.component';
import { EffectConceptComponent } from './concepts/effect-concept/effect-concept.component';
import { ModelConceptComponent } from './concepts/model-concept/model-concept.component';
import { InputConceptComponent } from './concepts/input-concept/input-concept.component';
import { OutputConceptComponent } from './concepts/output-concept/output-concept.component';
import { LinkedSignalConceptComponent } from './concepts/linked-signal-concept/linked-signal-concept.component';
import { ResourceConceptComponent } from './concepts/resource-concept/resource-concept.component';
import { UserRegistrationDemoComponent } from './user-registration-demo/user-registration-demo.component';
import { RxresourceDemoComponent } from './rxresource-demo/rxresource-demo.component';

// Application routes configuration
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'signals-demo',
    component: SignalsDemoComponent
  },
  {
    path: 'user-registration-demo',
    component: UserRegistrationDemoComponent
  },
  {
    path: 'rxresource-demo',
    component: RxresourceDemoComponent
  },
  {
    path: 'concepts/signal',
    component: SignalConceptComponent
  },
  {
    path: 'concepts/computed',
    component: ComputedConceptComponent
  },
  {
    path: 'concepts/effect',
    component: EffectConceptComponent
  },
  {
    path: 'concepts/model',
    component: ModelConceptComponent
  },
  {
    path: 'concepts/input',
    component: InputConceptComponent
  },
  {
    path: 'concepts/output',
    component: OutputConceptComponent
  },
  {
    path: 'concepts/linked-signal',
    component: LinkedSignalConceptComponent
  },
  {
    path: 'concepts/resource',
    component: ResourceConceptComponent
  }
];
