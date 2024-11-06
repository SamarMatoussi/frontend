import { Component, OnInit } from '@angular/core';
import { GestionEmployeService } from '../employe/list.service';
import { employe } from '../employe/list.model';
import { ActivatedRoute } from '@angular/router';
import { ActiviteService } from '../../adminList/activites/activite.service';
import { Activite } from '../../adminList/activites/activite.model';
import { KpiService } from '../../adminList/gestionKpi/kpi.service';
import { TableKpi } from '../../adminList/gestionKpi/kpi.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { EvaluerService } from './evaluer.service';
import { Note } from './note';
import * as XLSX from 'xlsx';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-noter',
  templateUrl: './evaluer.component.html',
  styleUrls: ['./evaluer.component.scss']
})


export class EvaluerComponent implements OnInit {

  selectValue: string[] = [];
  stateValue: string[] = [];
  employeId: number = -1 ; 
  activiteList:Activite[] = [] ;
  kpiList: TableKpi[] = [];
  selectedKpiId: number ;
  note : number ;
  appreciation : string ;
  typeKpi:string ;
  texte : string ;
  optionList:string[] = ["Licence en Informatique" , "Awi"]

  loadingOptions: boolean = false;
  selectedKpiIndex: number = 0; 
  noteObj:Note = new Note() ; 
  constructor( private route: ActivatedRoute,
                private  activiteService:ActiviteService ,
                  private kpiService: KpiService,
                private evaluerService: EvaluerService )
  { 
  }

  ngOnInit() {
    this.employeId = +this.route.snapshot.paramMap.get('idEmploye') || -1;

    this.getActivities();
    console.log('employeId' , this.employeId)

  }

  getNote(kpiId : number)
  {
    this.evaluerService.getNote(this.employeId , kpiId ).subscribe(res => {
      this.noteObj = res
    }  , error => {
      console.error(error)
    } , () => {
      this.appreciation = this.noteObj.appreciation ;
      this.note = this.noteObj.note ;
    }
  )
  }
  selectKpi(kpi: TableKpi , index: number) {
    this.selectedKpiIndex = index;
    this.selectedKpiId = kpi.id;
    console.log('selected kpi ' , this.selectedKpiId)
    this.typeKpi = kpi.type;
    this.getNote(this.selectedKpiId)
    //this.fillOptionList();
  }

  getActivities()
  {
    this.activiteService.getListeActivite().subscribe(
      res => {
        this.activiteList = res
      } , error => {
        console.error(error)
      }, () => {
        this.getKpiListByActivite(this.activiteList[0].id)
      }
    )
  }
  
  getKpiListByActivite(activiteId : number)
  {
    this.kpiList = [] ;
    this.activiteService.getKpisByActivite(activiteId).subscribe(
      res => {
        console.log('kpi list by activite ' , res)
        this.kpiList = res
      } , error => {
        console.error(error)
      } , () => {
        this.selectedKpiId = this.kpiList[0].id ;
        this.typeKpi = this.kpiList[0].type ;
        this.getNote(this.selectedKpiId)
      }
    )
  }

  getAppreciationByKpiIdAndNote()
  {
    this.kpiService.getAppreciationByKpiIdAndNote(this.selectedKpiId , this.note).subscribe(
      res => {
        this.appreciation = res
      } , error => {
        console.error(error)
      }
    )
  }

  
  fillOptionList() {
   /* if (this.selectedKpiId) {
      this.loadingOptions = true;
      this.kpiService.getOptionsByKpiId(this.selectedKpiId).subscribe(
        res => {
          this.optionList = res.length ? res : ["Aucune option disponible"];
          this.loadingOptions = false;
        },
        error => {
          console.error('Erreur lors du chargement des options', error);
          this.optionList = ["Erreur lors du chargement des options"];
          this.loadingOptions = false;
        }
      );
    }*/
  }
  

  getAppreciationByKpiIdAndTexte()
  { 
    this.appreciation = "" ;
    if(this.texte != "") {
      this.kpiService.getAppreciationByKpiIdAndTexte(this.selectedKpiId , this.texte).subscribe(
        res => {
          this.appreciation = res
        } , error => {
          console.error(error)
        }
      )
    }
    
   
  }

  saveNote()
  {
    this.noteObj.employeId = this.employeId ;
    this.noteObj.kpiId = this.selectedKpiId ; 
    this.noteObj.note = this.note ; 
    this.noteObj.appreciation = this.appreciation ; 
    this.evaluerService.ajouterNote(this.noteObj).subscribe(res => {
      console.log('res ' , res)
    } , error => {
      console.error((error))
    })
  }


 /* exportToExcel() {
    this.evaluerService.exportExcel().subscribe(res => {
      this.downloadFile(res, 'Evaluation list.xlsx','xlsx');
    } , error => {

    })
  }
  
  private downloadFile(data: Blob, filename: string, fileType: string) {
    // Map file types to corresponding MIME types
    const mimeTypes: { [key: string]: string } = {
      'csv': 'text/csv',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'pdf': 'application/pdf',
      // Add more file types as needed
    };
  
    // Determine the MIME type based on the file type
    const mimeType = mimeTypes[fileType] || 'application/octet-stream';
  
    // Create a blob with the appropriate MIME type
    const blob = new Blob([data], { type: mimeType });
  
    // Create a link element, set its href and download attributes, and trigger a click event
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
  
    // Append the link to the document and trigger a click event
    document.body.appendChild(link);
    link.click();
  
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
  */
  
  getNoteForKpi(employeId: number, kpiId: number): Observable<Note> {
    return this.evaluerService.getNote(employeId, kpiId).pipe(
      map((response: any) => {
        // Vérifie si la réponse est du JSON valide ou un texte brut
        if (typeof response === 'string') {
          // Si le texte contient "Note non trouvé", retourne une note par défaut
          if (response.includes('Note non trouvé')) {
            return { note: 'Non évalué', appreciation: '' } as unknown as Note;
          }
        }
        return response; // Si la réponse est valide, retourne-la
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération de la note', error);
        // Retourne une note par défaut en cas d'erreur
        return of({ note: 'Non évalué', appreciation: '' } as unknown as Note);
      })
    );
  }
  
  
  
  
  
  
}
