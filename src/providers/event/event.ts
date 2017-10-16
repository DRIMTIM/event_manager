import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import ThenableReference = firebase.database.ThenableReference;

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {

  public eventListRef: firebase.database.Reference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.eventListRef = firebase
            .database()
            .ref(`/userProfile/${user.uid}/eventList`);
      }
    });
  }

  createEvent(
      eventName: string,
      eventDate: string,
      eventPrice: number,
      eventCost: number
  ): ThenableReference {
    return this.eventListRef.push({
      name: eventName,
      date: eventDate,
      price: eventPrice,
      cost: eventCost,
      revenue: eventCost * -1
    });
  }

  getEventList():firebase.database.Reference {
    return this.eventListRef;
  }

  addGuest(guestName: string, eventId: string, eventPrice: number): PromiseLike<any> {
    return this.eventListRef
        .child(`${eventId}/guestList`)
        .push({guestName})
        .then(newGuest => {
          this.eventListRef.child(eventId)
              .transaction(event => {
                event.revenue += eventPrice;
                return event;
              });
        });
  }

  getEventDetail(eventId:string):firebase.database.Reference {
    return this.eventListRef.child(eventId);
  }

}
