import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../auth/login/login.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./faq.component.scss'],
  templateUrl: './faq.component.html',
})
export class FaqComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  isAdmin = false;

  ngOnInit(): void {
    const user = this.loginService.getCurrentUser();

    if (user.get('role') === 'admin') {
      this.isAdmin = true;
    }
  }
}
