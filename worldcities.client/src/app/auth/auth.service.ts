import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap, BehaviorSubject} from "rxjs";
import {environment} from "../../environments/environment";
import {LoginRequest} from "./login-request";
import {LoginResult} from "./login-result";


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(protected http: HttpClient) {
  }

  // key per salvare i dati nel localstorage
  private tokenKey: string = 'token';
  private userKey: string = 'user';
  private _authStatus = new BehaviorSubject<boolean>(false);// valore iniziale
  public authStatus = this._authStatus.asObservable();


  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserLogin(): string | null {
    // prendo userName dallo localStorage per usarlo in nav-bar
    return localStorage.getItem(this.userKey);
  }

  login(item: LoginRequest): Observable<LoginResult> {
    var url = environment.baseUrl + 'api/Account/Login';
    return this.http.post<LoginResult>(url, item)
      .pipe(
        tap(loginResult => {
          if (loginResult.success && loginResult.token) {
            localStorage.setItem(this.tokenKey, loginResult.token);
            // salvo lo userName nel localStorage per usarlo in nav-bar
            localStorage.setItem(this.userKey, <string>loginResult.userName);
            this.setAuthStatus(true);
          }
        })
      );
  }

  logout() {
    // rimuovo il token da localStorage
    localStorage.removeItem(this.tokenKey);
    // rimuovo lo username da localstorage
    localStorage.removeItem(this.userKey);
    this.setAuthStatus(false);
  }


  init(): void {
    if (this.isAuthenticated()) {
      this.setAuthStatus(true);
    }
  }

  private setAuthStatus(isAuthenticated: boolean) {
    this._authStatus.next(isAuthenticated);
  }
}
