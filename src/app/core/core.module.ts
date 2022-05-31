import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenService } from './services/token.service';
import { FilterService } from './services/filter.service';
import { LoaderService } from './services/loader.service';
import { GitProjectService } from './services/git-project.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { AuthService } from './services/auth.service';
import { ActivityService } from './services/activity.service';

export function getIdToken() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getIdToken
      },
    }),
    OverlayModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    TokenService,
    ActivityService,
    FilterService,
    LoaderService,
    GitProjectService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
})
export class CoreModule { }
