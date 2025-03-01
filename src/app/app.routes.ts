import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PolicyComponent } from './pages/policy/policy.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // ✅ Default landing page
  { path: 'policy/:vehicleNumber', component: PolicyComponent }, // ✅ Policy route
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect unknown routes
];
