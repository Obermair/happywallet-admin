import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService  {
  public apiUrl = 'https://api.happywallet.at'; 
  public signUpPageLink = 'https://signup.happywallet.at/?loyaltyProgram=';
  public currentUser: any = null;
  public loyaltyPrograms: any;

  public downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>`
  public trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
  public excelIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><line x1="7" y1="3" x2="7" y2="8"></line><line x1="11" y1="3" x2="11" y2="8"></line><line x1="3" y1="17" x2="21" y2="17"></line></svg>`;
  public csvIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><line x1="7" y1="3" x2="7" y2="8"></line><line x1="11" y1="3" x2="11" y2="8"></line><line x1="3" y1="19" x2="21" y2="19"></line></svg>`;
  public editIcon = `<svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" > <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" /> </svg>`
  

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

  resetLocalStorage(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_user');
    localStorage.removeItem('jwt_user_id');
    localStorage.removeItem('jwt_user_description');
    localStorage.removeItem('jwt_user_email');
    this.currentUser = null;
  }

  public renewLocalStorage(userData: any): void {
    localStorage.setItem('jwt_user', userData.username);
    localStorage.setItem('jwt_user_description', userData.description);
    localStorage.setItem('jwt_user_email', userData.email);
    this.saveCurrentUser();
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
        this.renewLocalStorage(data);
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
          this.renewLocalStorage(data);
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

  public deleteCustomer(customer: any): Promise<any> {
    // delete customer by id and all associated program-users --> delete in strapi only works with id, not with filters
    const programUser = customer.attributes.program_users.data.map((pu: any) => pu.id);

    return new Promise((resolve, reject) => {
      // First delete all associated program-users
      const deleteProgramUsers = programUser.map((id: string) => this.http.delete(this.apiUrl + '/api/program-users/' + id).toPromise());

      Promise.all(deleteProgramUsers).then(() => {
        // Then delete the customer
        this.http.delete(this.apiUrl + '/api/customers/' + customer.id).subscribe(
          (data: any) => {
            resolve(data);
          },
          (err: Error) => {
            reject(err);
          }
        );
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public updateUser(userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(this.apiUrl + '/api/users/' + this.currentUser.id, userData).subscribe(
        (data: any) => {
          resolve(data);
        },
        (err: Error) => {
          console.error('Error updating user:', err);
          reject(err);
        }
      );
    });
  }

  public uploadShopLogo(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('files', file);
    
    formData.append('ref', 'plugin::users-permissions.user');
    formData.append('refId', this.currentUser.id);
    formData.append('field', 'shopLogo');

    // delete previous logo if exists
    if(this.currentUser.shopLogo?.id){
      this.deleteShopLogo(this.currentUser.shopLogo.id);
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/api/upload', formData).subscribe(
        (data: any) => {
          // Refresh current user data to get the new logo
          resolve(data);
        },
        (err: Error) => {
          console.error('Error uploading shop logo:', err);
          reject(err);
        }
      );
    });
  }
  
  public deleteShopLogo(fileId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl + '/api/upload/files/' + fileId).subscribe(
        (data: any) => {
          // Refresh current user data to remove the logo
          resolve(data);
        },
        (err: Error) => {
          console.error('Error deleting shop logo:', err);
          reject(err);
        }
      );
    });
  }

  public changePassword(currentPassword: string, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/api/auth/change-password', {
        currentPassword: currentPassword,
        password: newPassword,
        passwordConfirmation: newPassword
      }).subscribe(
        (data: any) => {
          // replace jwt token in localStorage
          localStorage.setItem('jwt_token', data.jwt);
          resolve(data);
        },
        (err: Error) => {
          console.error('Error changing password:', err);
          reject(err);
        }
      );
    });
  } 

  public getCurrentCustomersCount() {
    /*
    return the number of customer of the current user 
    how you can get the customers:
    - get all customers where the program-users loyalty-program user id is in the current user's loyalty programs    
    */
    return new Promise((resolve, reject) => {
      this.getLoyaltyPrograms().then((programs: any) => {
        const programIds = programs.map((p: any) => p.id);
        if (programIds.length === 0) {
          resolve(0);
          return;
        }

        const filter = programIds.map((id: string) => `filters[loyalty_program][id][$eq]=${id}`).join('&');

        this.http.get<any>(`${this.apiUrl}/api/program-users?${filter}&populate=customer`).subscribe(
          (response) => {
            const customerIds = Array.from(new Set(response.data.map((pu: any) => pu.attributes.customer?.data?.id).filter((id: any) => id != null)));
            
            resolve(customerIds.length);
          }
          , (err) => {
            console.error('Error fetching customers count:', err);
            reject(err);
          }
        );
      }).catch((err) => {
        console.error('Error fetching loyalty programs:', err);
        reject(err);
      });
    }
    );
  }

  public async getCurrentProgramUsersCount(userId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${this.apiUrl}/api/program-users?filters[loyalty_program][user][id][$eq]=${userId}`).subscribe(
        (response) => {
          resolve(response.meta.pagination.total);
        },
        (err) => {
          console.error('Error fetching program users count:', err);
          reject(err);
        }
      );
    });
  }

  public getCurrentLoyaltyProgramsCount(userId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${this.apiUrl}/api/loyalty-programs?filters[user][id][$eq]=${userId}`).subscribe(
        (response) => {
          resolve(response.meta.pagination.total);
        },
        (err) => {
          console.error('Error fetching loyalty programs count:', err);
          reject(err);
        }
      );
    });
  }

  public async getCompletedStampCardsStats(userId: string): Promise<{ 
    total: number, 
    completed: number, 
    percentage: number 
  }> {
    return new Promise((resolve, reject) => {
      // Hole alle Program-Users vom aktuellen Restaurant inkl. zugehörigem LoyaltyProgram
      this.http.get<any>(`${this.apiUrl}/api/program-users?filters[loyalty_program][user][id][$eq]=${userId}&populate=loyalty_program`)
        .subscribe(
          (response) => {
            const programUsers = response.data;

            const total = programUsers.length;
            if (total === 0) {
              resolve({ total: 0, completed: 0, percentage: 0 });
              return;
            }

            // Completed = currentPoints >= maxPoints
            const completed = programUsers.filter((pu: any) => {
              const currentPoints = pu.attributes.currentPoints;
              const maxPoints = pu.attributes.loyalty_program?.data?.attributes?.maxPoints;
              return currentPoints >= maxPoints;
            }).length;

            const percentage = Math.round((completed / total) * 100);

            resolve({ total, completed, percentage });
          },
          (err) => {
            console.error('Error fetching completed stamp cards:', err);
            reject(err);
          }
        );
    });
  }

  public async getProgramUsersByMonth(userId: string): Promise<{ 
    categories: string[], 
    counts: number[] 
  }> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(
        `${this.apiUrl}/api/program-users?filters[loyalty_program][user][id][$eq]=${userId}`
      ).subscribe(
        (response) => {
          const programUsers = response.data;

          // Monatsnamen
          const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];

          // Init Counter für alle Monate
          const counts = new Array(12).fill(0);

          // Alle createdAt -> Monat extrahieren
          programUsers.forEach((pu: any) => {
            const createdAt = new Date(pu.attributes.createdAt);
            const monthIndex = createdAt.getMonth(); // 0 = Jan, 11 = Dec
            counts[monthIndex]++;
          });

          // Aktuellen Monat bestimmen
          const now = new Date();
          const currentMonthIndex = now.getMonth();

          // Array so rotieren, dass aktueller Monat am Ende steht
          const categories = [
            ...monthNames.slice(0, currentMonthIndex + 1),
            ...monthNames.slice(currentMonthIndex + 1)
          ];
          const rotatedCounts = [
            ...counts.slice(0, currentMonthIndex + 1),
            ...counts.slice(currentMonthIndex + 1)
          ];

          resolve({ categories, counts: rotatedCounts });
        },
        (err) => {
          console.error('Error fetching program users by month:', err);
          reject(err);
        }
      );
    });
  }

  public async getLastFiveCustomers(userId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(
        `${this.apiUrl}/api/program-users?` +
        `filters[loyalty_program][user][id][$eq]=${userId}&` +
        `populate=customer,loyalty_program&` +
        `sort=createdAt:desc&pagination[limit]=5`
      ).subscribe(
        (response) => {
          const result = response.data.map((pu: any) => {
            const customer = pu.attributes.customer?.data?.attributes;
            const program = pu.attributes.loyalty_program?.data?.attributes;

            return {
              customerName: customer?.name || 'Unknown',
              customerEmail: customer?.email || 'Unknown',
              programName: program?.programName || 'Unknown Program',
              currentPoints: pu.attributes.currentPoints,
              maxPoints: program?.maxPoints || 0,
              createdAt: pu.attributes.createdAt,
              updatedAt: pu.attributes.updatedAt
            };
          });

          resolve(result);
        },
        (err) => {
          console.error('Error fetching last 5 customers:', err);
          reject(err);
        }
      );
    });
  }

}
