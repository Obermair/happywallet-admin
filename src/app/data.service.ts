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

  public getLoyaltyPrograms() {
    const userParams = '?filters[user][id][$eq]=' + localStorage.getItem('jwt_user_id') + '&populate=*';

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/api/loyalty-programs' + userParams).subscribe(
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

  public getCustomersByLoyaltyPrograms(loyaltyProgramIds: string[]) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!loyaltyProgramIds?.length) {
          resolve([]);
          return;
        }

        // 1️⃣ Alle Program-User holen, die zu den ausgewählten Loyalty-Programmen gehören
        const programUsersFilter = loyaltyProgramIds.map(id => `filters[loyalty_program][id][$eq]=${id}`).join('&');

        const programUsersResponse: any = await this.http
          .get(`${this.apiUrl}/api/program-users?${programUsersFilter}&populate=*`)
          .toPromise();

        const programUsers = programUsersResponse.data;

        // 2️⃣ Eindeutige Customer-IDs extrahieren
        const customerIds = Array.from(
          new Set(
            programUsers
              .map((pu: any) => pu.attributes.customer?.data?.id)
              .filter((id: any) => id != null)
          )
        );

        if (!customerIds.length) {
          resolve([]);
          return;
        }

        // 3️⃣ Alle Customer-Daten holen
        const customerFilter = customerIds.map(id => `filters[id][$eq]=${id}`).join('&');

        const customersResponse: any = await this.http
          .get(`${this.apiUrl}/api/customers?${customerFilter}&populate=*`)
          .toPromise();

        resolve(customersResponse.data);
      } catch (err) {
        console.error('Error fetching customers:', err);
        reject(err);
      }
    });
  }

  public getLoyaltyProgramsForCustomer(programUserIds: string[]) {
    return new Promise(async (resolve, reject) => {
      try {

        const loyaltyProgramsFilter = programUserIds.map(id => `filters[program_users][id][$eq]=${id}`).join('&');

        const loyaltyProgramsResponse: any = await this.http
          .get(`${this.apiUrl}/api/loyalty-programs?${loyaltyProgramsFilter}`)
          .toPromise();

        resolve(loyaltyProgramsResponse.data);
      } catch (err) {
        console.error('Error fetching loyalty programs:', err);
        reject(err);
      }
    });
  }

}
