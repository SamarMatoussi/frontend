import { Component, OnInit } from '@angular/core';
import { UploadService } from './uploads.service';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {
  files: File[] = [];
  fileName: string | null = null;
  uploadMessage: string | null = null;
  presenceAbsenceData: Map<number, Map<string, Map<string, number>>> | null = null;

  constructor(private uploadService: UploadService) {}

  ngOnInit() {}

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    let file: File = event.addedFiles[0];
    this.fileName = file.name;
  }

  onRemove() {
    this.fileName = null;
    this.files = [];
  }

  onUpload() {
    if (this.files.length === 0) {
      return;
    }

    this.uploadService.uploadFile(this.files[0]).subscribe(
      (response) => {
        this.uploadMessage = 'File successfully uploaded!';
        // Fetch presence/absence data after successful upload
        this.fetchPresenceAbsenceData();
      },
      (error) => {
        this.uploadMessage = `Upload failed: ${error}`;
      }
    );
  }
  
  fetchPresenceAbsenceData() {
    this.uploadService.getPresenceAbsenceByMonthForAllPersons().subscribe(
      (data) => {
        console.log('Fetched presence/absence data:', data);
        this.presenceAbsenceData = data;
      },
      (error) => {
        console.error('Error fetching presence/absence data', error);
      }
    );
  }

  
}
