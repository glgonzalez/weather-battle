import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.css']
})
export class ResultDialogComponent {
  public displayedColumns: string[] = ['name', 'temp', 'rain', 'humidity'];
  public dataSource = [this.data.winner, this.data.loser];
  constructor(
    public dialogRef: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
