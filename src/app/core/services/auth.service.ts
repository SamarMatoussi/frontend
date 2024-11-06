import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AuthenticationRequest } from "../models/authentication-request";
import { Observable } from "rxjs";
import { AuthenticationResponse } from "../models/authentication-response";
import { RegisterRequest } from "../models/register-request";

@Injectable({
    providedIn: 'root'
  })
  export class AuthenticationService {
    private baseUrl=environment.baseUrl+"/auth"
    constructor(private router:Router,private http:HttpClient) { }
    isUserAuthenticated():boolean{
      if (localStorage.getItem ("accesstoken")){
        return true;
      }
      this.router.navigate(["/login"])
  return false;
    }
    login(authenticationRequest : AuthenticationRequest):Observable<AuthenticationResponse>{
      const url=this.baseUrl+"/authenticate"
      return this.http.post<AuthenticationResponse>(url,authenticationRequest)
    }
    register(registerRequest: RegisterRequest):Observable<AuthenticationResponse>{
      const url=this.baseUrl+"/registerClient"
      return this.http.post<AuthenticationResponse>(url,registerRequest)
    }
    setUserToken (token: string){
      localStorage.setItem("accesstoken",token)
  
    }
    logout(): void {
      localStorage.removeItem("accesstoken");
      this.router.navigate(["/login"]);
    }
  
  }
/*
import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;

    constructor() {
    }

     // Returns the current user
     
    public currentUser(): User {
        return getFirebaseBackend().getAuthenticatedUser();
    }

   
    login(email: string, password: string) {
        return getFirebaseBackend().loginUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    register(email: string, password: string) {
        return getFirebaseBackend().registerUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    
     // Logout the user
     
    logout() {
        // logout the user
        getFirebaseBackend().logout();
    }
}
*/
