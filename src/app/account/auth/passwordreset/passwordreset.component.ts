import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { PasswordresetService } from 'src/app/core/services/passworedrest.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

export class PasswordresetComponent implements OnInit, AfterViewInit {

  resetForm: UntypedFormGroup;
  submitted: boolean = false;
  error: string = '';
  success: string = '';
  loading: boolean = false;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private passwordresetService: PasswordresetService 
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngAfterViewInit() {}

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
    this.success = '';
    this.error = '';

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.loading = true;

    // Appel du service pour envoyer l'email de réinitialisation de mot de passe
    this.passwordresetService.verifyEmail(this.f.email.value)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.success = 'Instructions have been sent to your email!';
          this.error = '';
          this.loading = false;
        },
        error: (error) => {
          // Gestion de l'erreur selon le code de réponse
          if (error.status === 404) {
            this.error = 'Email address not found. Please check and try again.';
          } else if (error.status === 403) {
            this.error = 'Access forbidden. You might not have permission to perform this action.';
          } else {
            this.error = 'Failed to send reset instructions. Please try again.';
          }
          this.success = '';
          this.loading = false;
        }
      });
  }
}
