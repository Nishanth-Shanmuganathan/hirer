import { UIService } from './../../../services/ui.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

interface LoginDetails {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  helperPassword = false;
  isLoading = false;

  @Output() changeMode = new EventEmitter();

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(10)])
    });
  }

  login() {
    if (this.loginForm.invalid) { return; }
    this.isLoading = true;
    const loginCred: LoginDetails = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.loginUser(loginCred)
      .subscribe(res => {
        this.uiService.message('Login successful');
        this.router.navigate(['/']);
      }, err => {
        this.uiService.message(err.error.message);
        this.isLoading = false;
      });
  }
}
