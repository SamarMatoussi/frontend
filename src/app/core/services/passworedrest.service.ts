import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PasswordresetService {
    private baseUrl = environment.baseUrl + "/users";

    constructor(private router: Router, private http: HttpClient) { }

    // Méthode pour appeler l'API de changement de mot de passe
    changePassword(email: string, changePasswordRequest: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/changePassword/${email}`, changePasswordRequest)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Méthode pour vérifier l'email
    verifyEmail(email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/verifyMail/${email}`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Méthode pour vérifier l'OTP
    verifyOtp(otp: number, email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/verifyOtp/${otp}/${email}`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Méthode de gestion des erreurs
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Erreur côté serveur
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
