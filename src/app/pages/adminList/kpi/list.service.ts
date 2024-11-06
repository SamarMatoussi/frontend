import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {GestionKpi} from './list.model';
import {DecimalPipe} from '@angular/common';
import {catchError, debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './list-sortable.directive';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface SearchResult {
  gestionKpi: GestionKpi[];
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
export class GestionKpiService {
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
  private gestionKpi$ = new BehaviorSubject<GestionKpi[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  content?: any;
  products?: any;
  private baseUrl=environment.baseUrl+"/kpi"
  jobList$: Observable<GestionKpi[]>;
  total$: Observable<number>;
  constructor(private router:Router,private http:HttpClient) { }
  
  getKpiliste(page: number): Observable<GestionKpi[]> {
    const startIndex = (page - 1) * this.state.pageSize;
    const endIndex = startIndex + this.state.pageSize;
    return this.http.get<GestionKpi[]>(`${this.baseUrl}/liste?page=${page}&pageSize=${this.state.pageSize}`)
        .pipe(
            map((response: any) => response as GestionKpi[]),
            tap(() => {
                this.state.startIndex = startIndex;
                this.state.endIndex = endIndex;
            })
        );
  }

  addKpi(gestionKpi:GestionKpi):Observable<GestionKpi> {
    return this.http.post<GestionKpi>(`${this.baseUrl}/addkpi`,gestionKpi)
    .pipe(
      map((response:any) => response as GestionKpi)
    );  
}

 kpibyid(id: number):Observable<GestionKpi> {
  return this.http.get<GestionKpi>(`${this.baseUrl}/kpi/${id}`)
  .pipe(
    map((response:any) => response as GestionKpi)
  );  
 }

 updateKpi(id: number, gestionKpi: GestionKpi): Observable<GestionKpi> {
   return this.http.put<GestionKpi>(`${this.baseUrl}/updatekpi/${id}`, gestionKpi)
     .pipe(
       map((response: any) => response as GestionKpi)
     );  
 }


 deleteKpi(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/delete/${id}`);
}
}