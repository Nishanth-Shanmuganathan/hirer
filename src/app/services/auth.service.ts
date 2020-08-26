import { DataService } from 'src/app/services/data.service';
import { UIService } from './ui.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from './../../environments/environment';

interface RegisterDetails {
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginDetails {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string;
  admin: boolean;
  loggedIn = new Subject<string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private uiService: UIService,
    private dataService: DataService,
  ) { }

  registerUser(auth: RegisterDetails) {
    return this.http
      .post<{ token: string, admin: boolean }>(
        environment.server_url + 'authentication/register',
        auth
      )
      .pipe(
        tap((res) => {
          this.token = res.token;
          this.admin = res.admin;
          localStorage.setItem('token', this.token);
          localStorage.setItem('admin', this.admin.toString());
          this.loggedIn.next(this.token);
        })
      );
  }

  loginUser(auth: LoginDetails) {
    return this.http
      .post<{ token: string, admin: boolean }>(
        environment.server_url + 'authentication/login',
        auth
      )
      .pipe(
        tap((res) => {
          this.token = res.token;
          this.admin = res.admin;
          localStorage.setItem('token', this.token);
          localStorage.setItem('admin', this.admin.toString());
          this.loggedIn.next(this.token);
        })
      );
  }

  changePerspective() {
    return this.http.get<{ admin: boolean }>(environment.server_url + 'job/change')
      .pipe(tap(res => {
        localStorage.setItem('admin', res.admin.toString());
        this.admin = res.admin;
      }));

  }

  readToken() {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('admin');
    if (!token) { return; }
    this.token = token;
    this.admin = admin === 'true' ? true : false;
    this.loggedIn.next(token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.loggedIn.next();
    if (!this.token) {
      this.uiService.message('Logout successful...');
      this.router.navigate(['auth']);
    }
  }

}
