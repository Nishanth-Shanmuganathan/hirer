import { Application } from './../models/application.model';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Job } from '../models/job.model';
import { UIService } from './ui.service';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  jobSub = new Subject<Job[]>();
  jobs: Job[];

  constructor(
    private http: HttpClient,
    private uiService: UIService,

  ) { }

  createJob(cred: Job) {
    this.http.post<{ job: Job }>(environment.server_url + 'job', cred)
      .subscribe(res => {
        this.jobs.push(res.job);
        this.jobSub.next(this.jobs);
        this.uiService.closeModals();
        this.uiService.message('New job added');
      }, err => {
        this.uiService.message(err.error.message);
      });
  }

  getJobs() {
    return this.http.get<{ jobs: Job[] }>(environment.server_url + 'job')
      .pipe(tap(res => {
        this.jobs = res.jobs;
        this.jobSub.next(this.jobs);
      }));
  }

  applyJob(applyCreds: Application) {
    const postData = new FormData();
    postData.append('name', applyCreds.name);
    postData.append('note', applyCreds.note);
    postData.append('jobId', applyCreds.jobId);
    postData.append('date1', applyCreds.date1);
    postData.append('date2', applyCreds.date2);
    postData.append('resume', applyCreds.resume);

    this.http.post<{ job: Job }>(environment.server_url + 'job/apply', postData)
      .subscribe(res => {

        for (let i = 0; i < this.jobs.length; i++) {
          if (this.jobs[i]._id === applyCreds.jobId) {
            this.jobs.splice(i, 1);
            break;
          }
        }
        this.uiService.closeModals();
        this.uiService.message('Applied successfully');
      }, err => {
        this.uiService.message('Invalid file type');
      });
  }

}
