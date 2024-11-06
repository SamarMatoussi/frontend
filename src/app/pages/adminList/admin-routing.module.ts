import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionUtilisateurComponent} from "./gestionUtilisateur/list.component"; 
import { GestionAgenceComponent } from './agence/agence.component';
import { ActiviteComponent } from './activites/activite.component';
import { GestionKpiComponent } from './kpi/list.component';
import { GestionParametrageKpiComponent } from './parametrageKpi/list.component';
import { UploadsComponent } from './uploads/uploads.component';
import { KpiComponent } from './gestionKpi/kpi.component';
import { PosteComponent } from './poste/poste.component';


const routes: Routes = [
   {
    path:"gestionAgent",
    component:GestionUtilisateurComponent
   },
   {
    path:"listAgence",
    component:GestionAgenceComponent
   },
   {
    path:"activites",
    component:ActiviteComponent
   },
   {
    path:"UploadsComponent",
    component:UploadsComponent
   },
   {
    path:"kpis/:activiteId",
    component:KpiComponent
   },
  
   /*{
    path:"kpis/:activiteId/:kpiId",
    component:KpiComponent
   },*/
   {
    path:"poste",
    component:PosteComponent
   },
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}
