import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {GestionParametrageKpi} from './list.model';
import {DecimalPipe} from '@angular/common';
import {catchError, debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './list-sortable.directive';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface SearchResult {
  gestionParametrageKpi: GestionParametrageKpi[];
  total: number;
  }
  
  interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: string;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  type: string;
  date: string;
  }
@Injectable({providedIn: 'root'})
export class GestionParametrageKpiService {
  state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
    status: '',
    type: '',
    date: '',
  };



  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private gestionParametrageKpi$ = new BehaviorSubject<GestionParametrageKpi[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  content?: any;
  products?: any;
  private baseUrl=environment.baseUrl+"/parametragekpi"
  jobList$: Observable<GestionParametrageKpi[]>;
  total$: Observable<number>;
  constructor(private router:Router,private http:HttpClient) { }
  getParametrageKpiliste(): Observable<GestionParametrageKpi[]> {
    return this.http.get<GestionParametrageKpi[]>(`${this.baseUrl}/liste`)
    .pipe(
      map((response:any) => response as GestionParametrageKpi[])
    );
  }
  addParametrageKpi(gestionParametrageKpi:GestionParametrageKpi):Observable<GestionParametrageKpi> {
    return this.http.post<GestionParametrageKpi>(`${this.baseUrl}/addparametrageKpi`,gestionParametrageKpi)
    .pipe(
      map((response:any) => response as GestionParametrageKpi)
    );  
  }

parametrageKpibyid(id: number):Observable<GestionParametrageKpi> {
  return this.http.get<GestionParametrageKpi>(`${this.baseUrl}/parametrageKpi/${id}`)
  .pipe(
    map((response:any) => response as GestionParametrageKpi)
  );  
 }

 updateParametrageKpi(id: number, gestionParametrageKpi: GestionParametrageKpi): Observable<GestionParametrageKpi> {
   return this.http.put<GestionParametrageKpi>(`${this.baseUrl}/updateParametrageKpi/${id}`, gestionParametrageKpi)
     .pipe(
       map((response: any) => response as GestionParametrageKpi)
     );  
 }
 



 deleteParametrageKpi(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/delete/${id}`);
}

set page(page: number) {
  this._set({ page });
}

set pageSize(pageSize: number) {
  this._set({ pageSize });
}

set searchTerm(searchTerm: string) {
  this._set({ searchTerm });
}

set sortColumn(sortColumn: string) {
  this._set({ sortColumn });
}

set sortDirection(sortDirection: string) {
  this._set({ sortDirection });
}

set startIndex(startIndex: number) {
  this._set({ startIndex });
}

set endIndex(endIndex: number) {
  this._set({ endIndex });
}

set totalRecords(totalRecords: number) {
  this._set({ totalRecords });
}

set status(status: string) {
  this._set({ status });
}

set type(type: string) {
  this._set({ type });
}

set date(date: string) {
  this._set({ date });
}

private _set(patch: Partial<State>) {
  Object.assign(this.state, patch);
  this._search$.next();
}

private _search(): Observable<SearchResult> {
  const { sortColumn, sortDirection, pageSize, page, searchTerm, status, type, date } = this.state;

  // Construire la requête HTTP en fonction de l'état actuel (_state)
  // Utiliser this.http.get, this.http.post, this.http.put, etc. pour interagir avec le backend

  // Retourner les données filtrées et paginées
  return of({ gestionParametrageKpi: [], total: 0 }); // Remplacer [] et 0 par les données réelles obtenues du backend
}
}


