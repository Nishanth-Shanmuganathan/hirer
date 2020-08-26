import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { throwIfEmpty } from 'rxjs/operators';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  admin: boolean;
  constructor(
    private authService: AuthService,
    private uiService: UIService
  ) { }

  ngOnInit(): void {
    this.admin = this.authService.admin;
  }

  logout() {
    this.authService.logout();
  }

  changePrespective() {
    this.authService.changePerspective()
      .subscribe(res => {
        this.admin = res.admin;
        this.logout();
      }, err => {
        this.uiService.message(err.error.message);
        this.logout();
      });
  }
}
