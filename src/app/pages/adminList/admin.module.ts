import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UIModule } from '../../shared/ui/ui.module';
import { GestionUtilisateurComponent } from './gestionUtilisateur/list.component';
import { GestionAgenceComponent } from './agence/agence.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ActiviteComponent } from './activites/activite.component';
import { GestionKpiComponent } from './kpi/list.component';
import { GestionParametrageKpiComponent } from './parametrageKpi/list.component';
import { UploadsComponent } from './uploads/uploads.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';
import { KpiComponent } from './gestionKpi/kpi.component';
import { PosteComponent } from './poste/poste.component';

@NgModule({
  declarations: [
    GestionUtilisateurComponent,
    GestionAgenceComponent,
    ActiviteComponent,
    GestionKpiComponent,
    GestionParametrageKpiComponent,
    UploadsComponent,
    KpiComponent,
    PosteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    NgxDropzoneModule,
    HttpClientModule, 
    AdminRoutingModule,
  ]
})
export class AdminModule { }
