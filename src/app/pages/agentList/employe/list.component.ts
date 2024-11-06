import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { employe } from './list.model';
import { GestionEmployeService } from './list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [GestionEmployeService]
})
export class GestionEmployeComponent implements OnInit {
  agentForm: FormGroup;
  listegestionEmploye!: employe[];
  gestionEmployebyid: employe = {
    firstname: '',
    lastname: '',
    phone: '',
    cin: 0,
    email: '',
    password: '',
    role: '',
    type: undefined,
    type_color: undefined,
    status_color: undefined,
    status: 'success'
  };
  gestionEmploye!: Observable<employe[]>;
  total: Observable<number>;
  submitted = false;
  selectedStatut = '';
  selectedRole = '';
  @ViewChild('addContent') addContent: TemplateRef<any>;
  @ViewChild('updateContent') updateContent: TemplateRef<any>;
  @ViewChild('viewContent') viewContent: TemplateRef<any>;

  modalRef: BsModalRef<unknown>;
  currentPage: any;
  selectedAgent: employe | undefined;

  constructor(
    private modalService: BsModalService,
    public serviceEmp: GestionEmployeService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.total = serviceEmp.total$;
    this.agentForm = this.formBuilder.group({
      id: [null],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Doit être exactement 8 chiffres
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],       email: ['', [Validators.required, Validators.email]], // Validation pour l'email
      password: ['', [Validators.required, Validators.minLength(6)]], // Validation pour le mot de passe
          });
  }
  private handleError(field: string) { 
    const errorMessages: { [key: string]: string } = {
        firstname: 'Le prénom est requis.',
        lastname: 'Le nom est requis.',
        phone: 'Veuillez entrer un numéro de téléphone valide.',
        email: 'Veuillez entrer une adresse email valide.',
        password: 'Le mot de passe doit contenir au moins 6 caractères.',
        cin: 'Le numéro CIN est requis.'
    };
    return errorMessages[field] || 'Erreur de validation.';
}

  ngOnInit(): void {
    this.getemployeliste();
  }

  openViewModal(data: employe) {
    this.selectedAgent = data;
    this.modalRef = this.modalService.show(this.viewContent, { class: 'modal-md' });
  }

  openAddModal() {
    this.submitted = false;
    this.agentForm.reset(); // Reset le formulaire
    this.modalRef = this.modalService.show(this.addContent, { class: 'modal-md' });
  }

  openUpdateModal(data: employe) {
    this.submitted = false;
    this.agentForm.patchValue(data);
    this.modalRef = this.modalService.show(this.updateContent, { class: 'modal-md' });
  }

  close() {
    this.modalRef?.hide();
  }

  getemployeliste() {
    this.serviceEmp.getEmployeliste().subscribe({
      next: (data) => {
        this.listegestionEmploye = data;
      },
      error: (err) => this.showError('Erreur lors du chargement de la liste des employés.')
    });
  }

  searchEmploye(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.getemployeliste();
      return;
    }

    this.listegestionEmploye = this.listegestionEmploye.filter(user =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cin.toString().includes(searchTerm.toLowerCase())
    );
  }

  deleteEmploye(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet employé ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceEmp.deleteEmploye(id).subscribe(
          () => {
            this.listegestionEmploye = this.listegestionEmploye.filter(emp => emp.id !== id);
            Swal.fire('Supprimé!', 'L\'employé a été supprimé avec succès.', 'success');
          },
          error => {
            console.error('Erreur lors de la suppression :', error);
            Swal.fire('Erreur!', 'Erreur lors de la suppression de l\'employé.', 'error');
          }
        );
      } else {
        Swal.fire('Annulé', 'L\'employé n\'a pas été supprimé.', 'error');
      }
    });
  }
  

  addemploye(): void {
    if (this.agentForm.invalid) {
        this.submitted = true;
        return;
    }

    this.serviceEmp.addEmploye(this.agentForm.value).subscribe({
        next: () => {
            this.getemployeliste();
            this.modalRef.hide();
            Swal.fire('Ajouté!', 'L\'employé a été ajouté avec succès.', 'success');
        },
        error: (err) => {
            if (err.error && err.error.includes('CIN déjà utilisé')) {
                Swal.fire('Erreur!', 'Le numéro de CIN est déjà utilisé.', 'error');
            } else if (err.error && err.error.includes('Email déjà utilisé')) {
                Swal.fire('Erreur!', 'L\'email est déjà utilisé.', 'error');
            } else {
                this.showError('Erreur lors de l\'ajout de l\'employé.');
            }
        }
    });
}



  updateemploye(): void {
    const idToUpdate = this.agentForm.get('cin')?.value;
    if (this.agentForm.invalid || !idToUpdate) {
      this.submitted = true;
      return;
    }

    this.serviceEmp.updateEmploye(idToUpdate, this.agentForm.value).subscribe({
      next: () => {
        this.getemployeliste();
        this.modalRef.hide();
        Swal.fire('Mis à jour!', 'L\'employé a été mis à jour avec succès.', 'success');
      },
      error: () => this.showError('Erreur lors de la mise à jour de l\'employé.')
    });
  }

  employedetail(id: number): void {
    this.serviceEmp.employebyid(id).subscribe({
      next: (data) => {
        this.gestionEmployebyid = data;
      },
      error: () => this.showError('Erreur lors de la récupération des détails de l\'employé.')
    });
  }

  toggleAccount(cin: number, activate: boolean) {
    const action = activate ? 'activer' : 'désactiver';
    
    Swal.fire({
      title: `Êtes-vous sûr de vouloir ${action} ce compte ?`,
      text: 'Cette action peut être réversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Oui, ${action} !`,
      cancelButtonText: 'Non, garder'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceEmp.revokeAccount(cin, activate).subscribe(
          response => {
            const userIndex = this.listegestionEmploye.findIndex(user => user.cin === cin);
            if (userIndex !== -1) {
              this.listegestionEmploye[userIndex].isEnabled = activate;
              Swal.fire('Succès!', `Le compte a été ${activate ? 'activé' : 'désactivé'}.`, 'success');
            }
          },
          error => {
            console.error('Erreur lors de la révocation du compte :', error);
            this.showError('Erreur lors de la révocation du compte.');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Annulé', 'Aucune action effectuée 🙂', 'error');
      }
    });
  }
  

  pageChanged(event: any) {
    this.currentPage = event.page;
  }

  private showError(message: string) {
    Swal.fire('Erreur!', message, 'error');
  }
}
