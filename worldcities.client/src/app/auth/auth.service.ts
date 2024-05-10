import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {LoginRequest} from "./login-request";
import {LoginResult} from "./login-result";
import {tap} from "rxjs/operators";


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(protected http: HttpClient) {
  }

  // key per salvare i dati nel localstorage
  public tokenKey: string = 'token';

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(item: LoginRequest): Observable<LoginResult> {
    var url = environment.baseUrl + 'api/Account/Login';
    return this.http.post<LoginResult>(url, item).pipe(
      tap(loginResult => {
        if (loginResult.success && loginResult.token) {
          localStorage.setItem(this.tokenKey, loginResult.token);
        }
      })
    );
  }
}
