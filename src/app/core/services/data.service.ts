import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SystemConstants } from '../common/system.constants';
import { AuthenService } from './authen.service';
import { NotificationService } from './notification.service';
import { UtilityService } from './utility.service';
import { MessageConstants } from '../common/message.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headers: HttpHeaders;
  constructor(private _httpClient: HttpClient, private _router: Router, private _authenService: AuthenService, private _notificationService: NotificationService, private _utilityService: UtilityService) {
  }

  get(uri: string) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer" + this._authenService.getLoginUser().access_token);
    return this._httpClient.get(SystemConstants.BASE_API + uri, { headers: this.headers });
  }
  post(uri: string, data?: any) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer" + this._authenService.getLoginUser().access_token);
    return this._httpClient.post(SystemConstants.BASE_API + uri, data, { headers: this.headers });
  }
  put(uri: string, data?: any) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer" + this._authenService.getLoginUser().access_token);
    return this._httpClient.put(SystemConstants.BASE_API + uri, data, { headers: this.headers });
  }
  delete(uri: string, key: string, id: string) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer" + this._authenService.getLoginUser().access_token);
    return this._httpClient.delete(SystemConstants.BASE_API + uri + "/?" + key + "=" + id, { headers: this.headers });
  }
  postFile(uri: string, data?: any) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer" + this._authenService.getLoginUser().access_token);
    return this._httpClient.post(SystemConstants.BASE_API + uri, data, { headers: this.headers });
  }

  public handleError(error: any) {
    if (error.status == 401) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.printErrorMessage(MessageConstants.LOGIN_AGAIN_MSG);
      this._utilityService.navigateToLogin();
    }
    else {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Lỗi hệ thống';
      this._notificationService.printErrorMessage(errMsg);

      return Observable.throw(errMsg);
    }
  }
}
