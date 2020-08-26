import { Job } from './../../models/job.model';
import { UIService } from './../../services/ui.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

const ELEMENT_DATA = [
  { no: 1, 'applicant name': 'Hydrogen', 'applicant mail': 1.0079, resume: 'H' },
  { no: 2, 'applicant name': 'Helium', 'applicant mail': 4.0026, resume: 'He' },
  { no: 3, 'applicant name': 'Lithium', 'applicant mail': 6.941, resume: 'Li' },
  { no: 4, 'applicant name': 'Beryllium', 'applicant mail': 9.0122, resume: 'Be' },
  { no: 5, 'applicant name': 'Boron', 'applicant mail': 10.811, resume: 'B' },
  { no: 6, 'applicant name': 'Carbon', 'applicant mail': 12.0107, resume: 'C' },
  { no: 7, 'applicant name': 'Nitrogen', 'applicant mail': 14.0067, resume: 'N' },
  { no: 8, 'applicant name': 'Oxygen', 'applicant mail': 15.9994, resume: 'O' },
  { no: 9, 'applicant name': 'Fluorine', 'applicant mail': 18.9984, resume: 'F' },
  { no: 10, 'applicant name': 'Neon', 'applicant mail': 20.1797, resume: 'Ne' },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoading = true;
  admin: boolean;
  jobs: Job[] = [];
  displayedColumns: string[] = ['name', 'email', 'timing', 'status', 'link'];

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.admin = this.authService.admin;
    this.dataService.jobSub.subscribe(res => {
      this.jobs = res;
    });

    this.dataService.getJobs().subscribe(res => {
      this.isLoading = false;
      this.jobs = res.jobs;
    });
  }

  openDialog() {
    this.uiService.openAddJob();
  }

  openApplyDialog(id) {
    this.uiService.openApplyDialog(id);
  }
}
