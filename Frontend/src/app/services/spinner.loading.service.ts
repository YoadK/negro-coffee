import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
  })
  export class SpinnerLoadingService {
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoadingSubject.asObservable();
  
    setLoading(isLoading: boolean) {
        console.log(`SpinnerLoadingService: Setting loading to ${isLoading}`);

      this.isLoadingSubject.next(isLoading);
    }
  }
  