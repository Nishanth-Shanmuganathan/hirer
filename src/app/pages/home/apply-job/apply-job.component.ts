import { Application } from './../../../models/application.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent implements OnInit {

  applyForm: FormGroup;
  preview: string;
  fileError: string;
  today = new Date(Date.now() + 86400000);

  constructor(
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) { }

  ngOnInit(): void {
    this.applyForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      resume: new FormControl(null, [Validators.required]),
      date1: new FormControl(null, [Validators.required]),
      date2: new FormControl(null, [Validators.required]),
      note: new FormControl(null, [Validators.required, Validators.maxLength(500)])
    });

  }

  onImagePicked(event: Event) {
    this.fileError = null;
    const file = (event.target as HTMLInputElement).files[0];
    this.applyForm.patchValue({ resume: file });
    this.applyForm.get('resume').updateValueAndValidity();
  }

  applyJob() {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      this.fileError = 'required';
      return;
    }
    if (this.applyForm.invalid) { return; }
    const applyCreds = new Application(
      this.applyForm.value.name,
      this.applyForm.value.note,
      this.applyForm.value.resume,
      this.data.id,
      this.applyForm.value.date1,
      this.applyForm.value.date2
    );
    this.dataService.applyJob(applyCreds);
  }


}
