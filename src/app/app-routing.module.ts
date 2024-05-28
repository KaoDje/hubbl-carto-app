import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartoComponent } from './components/carto/carto.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [{ path: '', component: CartoComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
