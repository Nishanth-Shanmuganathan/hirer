import { UIService } from './../../../services/ui.service';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface RegisterDetails {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  isLoading = false;
  helperPassword = false;
  helperConfirmPassword = false;

  @Output() changeMode = new EventEmitter();

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(10), this.confirmPassword.bind(this)]),
    });
  }

  confirmPassword(control: FormGroup) {
    if (this.registerForm) {
      if (control.value !== this.registerForm.value.password) {
        return { mismatch: true };
      }
      return null;
    }
  }

  register() {
    if (this.registerForm.invalid) { return; }
    this.isLoading = true;
    const registerCred: RegisterDetails = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword,
    };
    this.authService.registerUser(registerCred)
      .subscribe(res => {
        this.uiService.message('Registration successful');
        this.router.navigate(['/']);
      }, err => {
        this.uiService.message(err.error.message);
        this.isLoading = false;
      });
  }
}
