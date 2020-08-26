import { ApplyJobComponent } from './../pages/home/apply-job/apply-job.component';
import { AddJobComponent } from './../pages/home/add-job/add-job.component';
import { NotificationComponent } from './../shared/notification/notification.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})

export class UIService {

  constructor(
    private dialog: MatDialog,
  ) { }

  message(val: string = 'An unknown error occurred.') {

    const dialog = this.dialog.open(NotificationComponent,
      {
        width: 'fit-content',
        minWidth: '250px',
        height: 'fit-content',
        hasBackdrop: false,
        position: { top: '10px', right: '10px' },
        data: val,
      });

    setTimeout(() => {
      dialog.close();
    }, 3000);
  }

  closeModals() {
    this.dialog.closeAll();
  }

  openAddJob() {
    this.dialog.open(AddJobComponent,
      {
        width: '50vw',
        minWidth: '300px',
        maxWidth: '500px',
        height: 'fit-content',
        hasBackdrop: true,
        disableClose: true,
      });
  }

  openApplyDialog(id: string) {
    this.dialog.open(ApplyJobComponent,
      {
        width: 'fit-content',
        minWidth: '500px',
        height: 'fit-content',
        hasBackdrop: true,
        disableClose: true,
        data: {
          id
        }
      });
  }

}
