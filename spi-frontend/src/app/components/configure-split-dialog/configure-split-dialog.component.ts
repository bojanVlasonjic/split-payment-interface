import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentSplit } from 'src/app/data/payment-split';
import { PaymentSplitService } from 'src/app/services/payment-split.service';
import { MatSnackBar } from '@angular/material';
import { SplitDialogData } from 'src/app/data/split-dialog-data';

@Component({
  selector: 'app-configure-split-dialog',
  templateUrl: './configure-split-dialog.component.html',
  styleUrls: ['./configure-split-dialog.component.css']
})
export class ConfigureSplitDialogComponent implements OnInit {

  @Output() updateClicked = new EventEmitter<SplitDialogData>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfigureSplitDialogComponent>,
    private paymentSplitService: PaymentSplitService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    console.log(this.data);
  }

  updatePaymentSplit(split: PaymentSplit) {
    this.data.paymentSplit = split;
    this.updateClicked.emit(this.data.dialogData);
  }

}
