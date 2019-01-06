import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemConstants } from '../common/system.constants';
import { LoggedinUser } from '../domain/loggedin.user';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string) {
    let body = "userName" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password) + "&grant_type=password";
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.httpClient.post<LoggedinUser>(SystemConstants.BASE_API + '/api/oauth/token', body, { headers }).subscribe(data => {
      let user: LoggedinUser = data;
      if (user && user.access_token) {
        localStorage.removeItem(SystemConstants.CURRENT_USER);
        localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
      }
    });
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
  }
  isUserAuthenticated(): boolean {
    let user = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  getLoginUser(): any {
    let user: LoggedinUser;
    if (this.isUserAuthenticated) {
      var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      user = new LoggedinUser(userData.access_token, userData.username, userData.fullName, userData.email, userData.avatar);
    } else {
      user = null;
    }
    return user;
  }
}
