import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/core/models/authentication-request';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authRequest: AuthenticationRequest = new AuthenticationRequest();
  error: string = '';
  loginForm: UntypedFormGroup;
  submitted: boolean = false;
  year: number = new Date().getFullYear();
  showPassword = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false] // valeur par défaut false
    });
  }

  // Accès facile aux contrôles de formulaire
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop si le formulaire est invalide
    if (this.loginForm.invalid) {
      return;
    }

    // Attribution des valeurs du formulaire à authRequest
    this.authRequest.email = this.f.email.value;
    this.authRequest.password = this.f.password.value;

    this.authService.login(this.authRequest).subscribe(
      res => {
        this.authService.setUserToken(res.accessToken);
        localStorage.setItem('role', res.role);

        // Vérifiez si "Remember me" est coché et stockez l'état
        if (this.f.remember.value) {
          localStorage.setItem('remember', 'true');
        } else {
          localStorage.removeItem('remember');
        }

        this.router.navigate(['/dashboard']);
      },
      error => {
        this.error = 'Email ou mot de passe incorrect';
      }
    );
  }
}
