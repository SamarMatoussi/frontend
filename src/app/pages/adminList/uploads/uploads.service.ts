import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private baseUrl = `${environment.baseUrl}/pointage`;
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<HttpEvent<any>>(`${this.baseUrl}/upload`, formData, {
      observe: 'events',
      reportProgress: true,
    }).pipe(
      catchError(this.handleError)
    );
  }

  getPresenceAbsenceByMonthForAllPersons(): Observable<Map<number, Map<string, Map<string, number>>>> {
    return this.http.get<Map<number, Map<string, Map<string, number>>>>(`${this.baseUrl}/presence-absence-by-month`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      if (error.status === 200 && error.error instanceof ProgressEvent) {
        errorMessage = 'File uploaded, but received non-JSON response.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}
