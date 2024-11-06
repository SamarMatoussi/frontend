import { Component, OnInit, ViewChildren, QueryList, ViewChild, TemplateRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Table } from './advanced.model';
import { AdvancedService } from './advanced.service';
import { AdvancedSortableDirective, SortEvent } from './advanced-sortable.directive';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-advancedtable',
  templateUrl: './advancedtable.component.html',
  styleUrls: ['./advancedtable.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class AdvancedtableComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  modalRef: BsModalRef<unknown>;
  submitted = false;
  hideme: boolean[] = [];
  tables$: Observable<Table[]>;
  total$: Observable<number>;
  public selected: any;
  public isCollapsed = true;

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;
  @ViewChild('addContent') addContent: TemplateRef<any>;

  constructor(public service: AdvancedService,private modalService: BsModalService,) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }
  openAddModal() {
    this.submitted = false;
    this.modalRef = this.modalService.show(this.addContent, { class: 'modal-md' });
  }
  ngOnInit() {
    // Trigger initial data fetch
  }

  changeValue(i: number) {
    this.hideme[i] = !this.hideme[i];
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}