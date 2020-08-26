import { UIService } from './../../../services/ui.service';
import { DataService } from './../../../services/data.service';
import { Job } from './../../../models/job.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  addForm: FormGroup;
  @ViewChild('skill') skill: ElementRef;


  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      designation: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      skills: new FormArray([], [Validators.required]),
      experience: new FormControl(0, [Validators.required, Validators.min(0)]),
      postedBy: new FormControl(null, [Validators.required]),
      time1: new FormControl(null, [Validators.required]),
      time2: new FormControl(null, [Validators.required]),
    });
  }

  onAddSkill(skill) {
    if (!skill) { return; }
    (this.addForm.get('skills') as FormArray).push(
      new FormControl(skill, Validators.required)
    );
    this.skill.nativeElement.value = null;
  }


  postJob() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    const jobCreds = new Job(
      this.addForm.value.designation,
      this.addForm.value.description,
      this.addForm.value.skills,
      this.addForm.value.experience,
      this.addForm.value.postedBy,
      this.addForm.value.time1,
      this.addForm.value.time2,
    );

    this.dataService.createJob(jobCreds);

  }
}
