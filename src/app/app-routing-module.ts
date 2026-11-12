import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { 
    path: '', redirectTo: 'entrada/login', pathMatch: 'full' 
  },

  {
     path: 'inicio', loadChildren: () => import('./inicio/inicio-module').then(m => m.InicioModule) 
    },
    
  {
    path: 'entrada',
    loadChildren: () => import('./entrada/entrada-module').then(m => m.EntradaModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
