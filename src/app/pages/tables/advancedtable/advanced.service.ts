import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap, catchError } from 'rxjs/operators';
import { Table, SearchResult } from './advanced.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SortDirection } from './advanced-sortable.directive';

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
    startIndex: number;
    endIndex: number;
    totalRecords: number;
}

const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(tables: Table[], column: string, direction: string): Table[] {
    if (direction === '' || column === '') {
        return tables;
    } else {
        return [...tables].sort((a, b) => {
            const res = compare(`${a[column]}`, `${b[column]}`);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(tables: Table, term: string, pipe: PipeTransform) {
    return tables.name.toLowerCase().includes(term.toLowerCase())
        || tables.label.toLowerCase().includes(term)
        || tables.description.toLowerCase().includes(term);
}

@Injectable({
    providedIn: 'root'
})
export class AdvancedService {

    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _tables$ = new BehaviorSubject<Table[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
        startIndex: 0,
        endIndex: 9,
        totalRecords: 0
    };

    constructor(private pipe: DecimalPipe, private http: HttpClient) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._tables$.next(result.tables);
            this._total$.next(result.total);
        });
        this._search$.next();
    }

    // Fetch KPI Data
    getKpiData(): Observable<Table[]> {
        return this.http.get<Table[]>(`${environment.baseUrl}/kpi/liste`);
    }

    // Fetch Parametrage KPI Data
    getParametrageKpiData(): Observable<Table[]> {
        return this.http.get<Table[]>(`${environment.baseUrl}/parametragekpi/liste`);
    }

    get tables$() { return this._tables$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }
    get startIndex() { return this._state.startIndex; }
    get endIndex() { return this._state.endIndex; }
    get totalRecords() { return this._state.totalRecords; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set startIndex(startIndex: number) { this._set({ startIndex }); }
    set endIndex(endIndex: number) { this._set({ endIndex }); }
    set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        // Fetch data from both endpoints
        return this.getKpiData().pipe(
            switchMap(kpiData => this.getParametrageKpiData().pipe(
                switchMap(parametrageData => {
                    // Combine the two data sources
                    let tables = [...kpiData, ...parametrageData];
                    
                    // Apply sorting
                    tables = sort(tables, sortColumn, sortDirection);

                    // Apply filtering
                    tables = tables.filter(table => matches(table, searchTerm, this.pipe));
                    const total = tables.length;

                    // Apply pagination
                    this.totalRecords = tables.length;
                    this._state.startIndex = (page - 1) * this.pageSize;
                    this._state.endIndex = Math.min(this._state.startIndex + this.pageSize, this.totalRecords);
                    tables = tables.slice(this._state.startIndex, this._state.endIndex);

                    return of({ tables, total });
                }),
                catchError(error => {
                    console.error('Data fetching error:', error);
                    return of({ tables: [], total: 0 });
                })
            ))
        );
    }
}
