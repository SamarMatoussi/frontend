import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { max, min, Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { GestionParametrageKpi } from './list.model';
import { GestionParametrageKpiService } from './list.service';
import { GestionKpiService } from '../kpi/list.service';
import { GestionKpi } from '../kpi/list.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [GestionParametrageKpiService]
})

export class GestionParametrageKpiComponent implements OnInit {
  agentForm: FormGroup;
  listeParametrageKpi!: GestionParametrageKpi[];
  gestionParametrageKpibyid: GestionParametrageKpi = {
    name: '',
    description: '',
    min: 0,
    max: 0,
    appreciation: '',
  };
  gestionParametrageKpi!: Observable<GestionParametrageKpi[]>;
  total: Observable<number>;
  submitted = false;
  selectedStatut = '';
  selectedRole = '';
  appreciationOptions: string[] = ['Mavais', 'Passable', 'Bien', 'Excellent'];
  kpis: GestionKpi[] = [];


  @ViewChild('addContent') addContent: TemplateRef<any>;
  @ViewChild('updateContent') updateContent: TemplateRef<any>;
  @ViewChild('viewContent') viewContent: TemplateRef<any>;

  modalRef: BsModalRef<unknown>;
  currentPage: any;
  selectedAgent: GestionParametrageKpi | undefined;

  constructor(private modalService: BsModalService, public serviceKpi: GestionKpiService,public service: GestionParametrageKpiService, private formBuilder: FormBuilder) {
    this.total = service.total$;
    this.agentForm = this.formBuilder.group({
      id: [null],
      name: [''],
      description: [''],
      min: [''],
      max: [''],
      appreciation: [''],
      kpiId: [null]

    });

  }
  ngOnInit(): void {
    this.getParametrageKpiliste();
    this.getkpis();

  }
  getkpis() {
    this.serviceKpi.getKpiliste(this.currentPage).subscribe({
        next: (data) => {
            this.kpis = data;
        },
        error: console.error
    });
}
  openViewModal(data: GestionParametrageKpi) {
    this.selectedAgent = data;
    this.modalRef = this.modalService.show(this.viewContent, { class: 'modal-md' });
  }

  openAddModal() {
    this.submitted = false;
    this.modalRef = this.modalService.show(this.addContent, { class: 'modal-md' });
  }

  openUpdateModal(data: GestionParametrageKpi) {
    this.submitted = false;
    this.agentForm.patchValue(data);
    this.modalRef = this.modalService.show(this.updateContent, { class: 'modal-md' });
  }

 
  close() {
    this.modalRef?.hide();
  }

  getParametrageKpiliste() {
    this.service.getParametrageKpiliste().subscribe({
      next: (data) => {
        this.listeParametrageKpi = data;
      },
      error: console.error
    });
  }

  deleteParametrageKpi(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteParametrageKpi(id)
          .subscribe(res => {
            this.getParametrageKpiliste();
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

  searchParametrageKpi(searchTerm: string): void {
    // Vérifiez d'abord si le terme de recherche est vide
    if (!searchTerm.trim()) {
      // Si le terme de recherche est vide, réinitialisez la liste avec la liste complète
      this.getParametrageKpiliste();
      return;
    }
  
    // Filtrer la liste des ParametrageKpi en fonction du terme de recherche
    this.listeParametrageKpi = this.listeParametrageKpi.filter(parametrageKpi =>
      parametrageKpi.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  

  addParametrageKpi(): void {
    if (!this.submitted) {
      this.service.addParametrageKpi(this.agentForm.value)
        .subscribe({
          next: (res) => {
            this.getParametrageKpiliste();
            this.modalRef.hide();
          }
        });
    }
  }

  updateParametrageKpi(): void {
    const idToUpdate = this.agentForm.get('id')?.value;
    if (!this.submitted && idToUpdate) {
      this.service.updateParametrageKpi(idToUpdate, this.agentForm.value)
        .subscribe({
          next: (res) => {
            this.getParametrageKpiliste();
            this.modalRef.hide();
          }
        });
    }
  }
  parametrageKpidetail(id: number): void {
    this.service.parametrageKpibyid(id)
      .subscribe({
        next: (data) => {
          this.gestionParametrageKpibyid = data;
          console.log("TESTTTT");
          console.log(data);
        },
        error: console.error
      });
  }
  

  pageChanged(event: any) {
    this.currentPage = event.page;
  }
}
