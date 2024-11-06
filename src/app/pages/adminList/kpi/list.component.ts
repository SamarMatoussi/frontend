import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { GestionKpi } from './list.model';
import { GestionKpiService } from './list.service';
import { ActiviteService } from '../activites/activite.service';
import { Activite } from '../activites/activite.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [GestionKpiService]
})

export class GestionKpiComponent implements OnInit {
  agentForm: FormGroup;
  listeKpi!: GestionKpi[];
  gestionKpibyid: GestionKpi = {
    nameKpi: '',
    label: '',
    description: '',
   
  };
  gestionKpi!: Observable<GestionKpi[]>;
  submitted = false;
  selectedStatut = '';
  selectedRole = '';
  activites: Activite[] = [];


  @ViewChild('addContent') addContent: TemplateRef<any>;
  @ViewChild('updateContent') updateContent: TemplateRef<any>;
  @ViewChild('viewContent') viewContent: TemplateRef<any>;

  modalRef: BsModalRef<unknown>;
  total: Observable<number>;
    currentPage: number = 1;
    pageSize: number = 10;

  selectedAgent: GestionKpi | undefined;

  constructor(private router: Router ,private modalService: BsModalService,private activiteService: ActiviteService, public service: GestionKpiService, private formBuilder: FormBuilder) {
    this.total = service.total$;
    this.agentForm = this.formBuilder.group({
      id: [null],
      name: [''],
      label: [''],
      description: [''],
      activiteId: [null] 
    });
  }

  openViewModal(data: GestionKpi) {
    this.selectedAgent = data;
    this.modalRef = this.modalService.show(this.viewContent, { class: 'modal-md' });
  }

  openAddModal() {
    this.submitted = false;
    this.modalRef = this.modalService.show(this.addContent, { class: 'modal-md' });
  }

  openUpdateModal(data: GestionKpi) {
    this.submitted = false;
    this.agentForm.patchValue(data);
    this.modalRef = this.modalService.show(this.updateContent, { class: 'modal-md' });
  }

  ngOnInit(): void {
    this.getkpiliste();
    this.getActivites(); 
    this.total = this.service.total$;
  }
  close() {
    this.modalRef?.hide();
  }



getkpiliste() {
    this.service.getKpiliste(this.currentPage).subscribe({
        next: (data) => {
            this.listeKpi = data;
        },
        error: console.error
    });
}
getActivites() {
  this.activiteService.getListeActivite().subscribe({
    next: (data) => {
      this.activites = data;
    },
    error: console.error
  });
}
  deleteKpi(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteKpi(id)
          .subscribe(res => {
            this.getkpiliste();
          });
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your file is safe 🙂',
          'error'
        );
      }
    });
  }
  searchKpi(searchTerm: string): void {
    // Vérifiez d'abord si le terme de recherche est vide
    if (!searchTerm.trim()) {
      // Si le terme de recherche est vide, réinitialisez la liste avec la liste complète
      this.getkpiliste();
      return;
    }
  
    // Filtrer la liste des Kpi en fonction du terme de recherche
    this.listeKpi = this.listeKpi.filter(kpi =>
      kpi.nameKpi.toLowerCase().includes(searchTerm.toLowerCase()) 
      //||
     //kpi.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
     // kpi.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  addKpi(): void {
    if (!this.submitted) {
      console.log(this.agentForm.value); // Check if activiteId is present here
      this.service.addKpi(this.agentForm.value)
        .subscribe({
          next: (res) => {
            this.getkpiliste();
            this.modalRef.hide();
          },
          error: console.error
        });
    }
  }

  updateKpi(): void {
    const idToUpdate = this.agentForm.get('id')?.value;
    if (!this.submitted && idToUpdate) {
      console.log(this.agentForm.value); // Check if activiteId is present here
      this.service.updateKpi(idToUpdate, this.agentForm.value)
        .subscribe({
          next: (res) => {
            this.getkpiliste();
            this.modalRef.hide();
          },
          error: console.error
        });
    }
  }
  
  kpidetail(id: number): void {
    this.service.kpibyid(id)
      .subscribe({
        next: (data) => {
          this.gestionKpibyid = data;
          console.log("TESTTTT");
          console.log(data);
        },
        error: console.error
      });
  }
  
  navigateToParametrageKpi() {
    this.router.navigate(['/parametrageKpi']);
  }
  pageChanged(event: any) {
    this.currentPage = event.page;
  }
}
