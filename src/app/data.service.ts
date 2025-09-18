import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService  {

  public apiUrl = 'https://api.happywallet.at'; 
  public currentUser: any = null;

  constructor(private http: HttpClient) { }

  public signIn(username: string, password: string): void {
    this.http.post(this.apiUrl + '/api/auth/local', {
      identifier: username,
      password: password,
    }).subscribe(
      (data: any) => {
        // Store JWT and user info in localStorage
        localStorage.setItem('jwt_token', data.jwt);
        localStorage.setItem('jwt_user', data.user.username);
        localStorage.setItem('jwt_user_id', data.user.id);
        localStorage.setItem('jwt_user_description', data.user.description);
        localStorage.setItem('jwt_user_email', data.user.email);
        this.saveCurrentUser();
      },
      (err: Error) => {
        console.error('Error during sign-in:', err);
      }
    );
  }

  public saveCurrentUser(){
    // Fetch user data and update localStorage
    const userId = localStorage.getItem('jwt_user_id');
    if (!userId) {
      console.error('No user ID found in localStorage.');
      return;
    }

    this.http.get(this.apiUrl + '/api/users/' + userId + '?populate=shopLogo').subscribe(
      (data: any) => {
        this.currentUser = data;
      },
      (err: Error) => {
        console.error('Error fetching user data:', err);
      }
    );
  }

  public getCurrentUserPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Fetch user data and update localStorage
      const userId = localStorage.getItem('jwt_user_id');
      if (!userId) {
        console.error('No user ID found in localStorage.');
        return;
      }

      this.http.get(this.apiUrl + '/api/users/' + userId + '?populate=shopLogo').subscribe(
        (data: any) => {
          this.currentUser = data;
          resolve(data);
        },
        (err: Error) => {
          console.error('Error fetching user data:', err);
          reject(err);
        }
      );
    });   
  }

}
