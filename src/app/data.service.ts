import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService  {

  public apiUrl = 'https://api.happywallet.at'; 
  public signUpPageLink = 'https://signup.happywallet.at/?loyaltyProgram=';
  public currentUser: any = null;
  public loyaltyPrograms: any;

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

  public createLoyaltyProgram(programData: any): Promise<any> {
    console.log(programData)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/api/loyalty-programs', { data: programData }).subscribe(
        (data: any) => {
          resolve(data);
        },
        (err: Error) => {
          console.error('Error creating loyalty program:', err);
          reject(err);
        }
      );
    });
  }

  public getLoyaltyProgams() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/api/loyalty-programs/').subscribe(
        (response: any) => {
          this.loyaltyPrograms = response.data;
          resolve(response.data);
        },
        (err: Error) => {
            console.error('Error creating loyalty program:', err);
            reject(err);
        }
      );
    });
  }

  public updateLoyaltyProgram(programData: any){
     return new Promise((resolve, reject) => {
        this.http.put(this.apiUrl + '/api/loyalty-programs/' + programData.id, { data: programData.attributes }).subscribe(
          (data: any) => {
            resolve(data);
          },
          (err: Error) => {
            console.error('Error creating loyalty program:', err);
            reject(err);
          }
        );
    });
  }

  public updateLoyaltyProgramWithoutId(programData: any){
    const program = this.loyaltyPrograms?.find(
      (p: any) => p.attributes.loyaltyProgramCode === programData.loyaltyProgramCode
    );

    return new Promise((resolve, reject) => {
        this.http.put(this.apiUrl + '/api/loyalty-programs/' + program.id, { data: programData }).subscribe(
          (data: any) => {
            resolve(data);
          },
          (err: Error) => {
            console.error('Error creating loyalty program:', err);
            reject(err);
          }
        );
    });
  }
}
