import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerOverlayModule } from './components/spinner-overlay/spinner-overlay.module';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';



@NgModule({
  declarations: [
    EmptyRouteComponent
  ],
  imports: [
    CommonModule,
    SpinnerOverlayModule
  ]
})
export class SharedModule { }
