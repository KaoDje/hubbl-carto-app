import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartoDashboardComponent } from './components/carto-dashboard/carto-dashboard.component';
import { CartoComponent } from './components/carto/carto.component';
import { EarnLoginComponent } from './components/earn-login/earn-login.component';
import { EarnComponent } from './components/earn/earn.component';
import { HomeComponent } from './components/home/home.component';
import { PaperListComponent } from './components/paper-list/paper-list.component';
import { PaperModuleComponent } from './components/paper-module/paper-module.component';
import { PaperOverviewComponent } from './components/paper-overview/paper-overview.component';
import { PaperSubmoduleComponent } from './components/paper-submodule/paper-submodule.component';
import { PaperComponent } from './components/paper/paper.component';
import { ModuleTitleTransformerPipe } from './pipes/module-title-transformer.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PaperOverviewComponent,
    EarnLoginComponent,
    PaperListComponent,
    CartoComponent,
    CartoDashboardComponent,
    PaperComponent,
    EarnComponent,
    HomeComponent,
    PaperSubmoduleComponent,
    PaperModuleComponent,
    ModuleTitleTransformerPipe,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
