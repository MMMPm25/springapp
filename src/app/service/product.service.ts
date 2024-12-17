import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

const BASIC_URL = ["http://localhost:8099/"]
const BASIC2_URL = ["http://localhost:8090/"]
@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private http: HttpClient) { }

  postMproduct(product: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/mproduct", product);
  }

  gellAllMproducts(): Observable<any> {
    return this.http.get(BASIC_URL + "api/mproducts");
  }
   getProducts() {
    return this.http.get<any[]>(BASIC_URL + "api/mproducts");
  }
  deleteMproduct(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + "api/mproduct/" + id)
  }

  getMproductById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + "api/mproduct/" + id)
  }

  updateMproduct(id: number, mproduct: any): Observable<any> {
    return this.http.put(BASIC_URL + "api/mproduct/" + id, mproduct)
  }


  ////////////////



  // postMuser(muser: any): Observable<any> {
  //   return this.http.post(BASIC2_URL + "api/muser", muser);
  // }
  postMuser(muser: any): Observable<any> {
    return this.http.post(`${BASIC2_URL}api/muser`, muser).pipe(
      catchError((error) => {
        throw error; // ส่ง error response ขึ้นมาให้ component
      })
    );
  }
  gellAllMusers(): Observable<any> {
    return this.http.get(BASIC2_URL + "api/musers");
  }

  deleteMuser(id: number): Observable<any> {
    return this.http.delete(BASIC2_URL + "api/muser/" + id)
  }
  getMuser(memail: string, mpassword: string): Observable<any> {
    const body = { memail, mpassword }; // Create POST body payload
    return this.http.post(BASIC2_URL + "api/users/login", body); // POST Request
  }
}

