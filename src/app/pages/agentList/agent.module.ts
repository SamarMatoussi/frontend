import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { UIModule } from '../../shared/ui/ui.module';
import { GestionEmployeComponent } from './employe/list.component';
import { AgentRoutingModule } from './agent-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSliderModule } from 'ngx-slider-v2';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { HttpClientModule } from '@angular/common/http';
import { EvaluerComponent } from './Evaluer/evaluer.component';
import { GestionEmployeNoteComponent } from './employeNote/list.component';




@NgModule({
  declarations: [
    GestionEmployeComponent,
    EvaluerComponent,
    GestionEmployeNoteComponent
   
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    NgxDropzoneModule,
    UIModule,
    WidgetModule,
    NgxSliderModule,
    NgSelectModule,
    AgentRoutingModule,
    HttpClientModule
    
  ] , providers :[ DecimalPipe]
})

export class AgentModule { }
