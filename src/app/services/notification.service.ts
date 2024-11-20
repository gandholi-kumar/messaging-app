import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotifcationService {
  private notification$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  getNotification$ = this.notification$.asObservable();

 /**
 * Sets a notification message to be displayed.
 * The notification message is cleared after 1 second.
 * 
 * @param notifyText - The notification message to be set.
 */
  setNotification(notifyText: string) {
    this.notification$.next(notifyText);
    setTimeout(() => {
      this.notification$.next('');
    }, 3000);
  }
}