import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);
    // [
    //     {
    //         id: 'xyz',
    //         placeId: 'p1',
    //         placeTitle: 'Manhattan Mansion',
    //         guestNumber: 2,
    //         userId: 'abc'
    //     }
    // ];
    constructor(private authService: AuthService) {

    }

    get bookings() {
        // return [...this._bookings];
        return this._bookings.asObservable();
    }

    addBooking(placeId: string, placeTitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date) {
        const newBooking = new Booking(Math.random().toString(), placeId, this.authService.userId, placeTitle, firstName, lastName, guestNumber, dateFrom, dateTo);
    }

    cancelBooking(bookingId: string) {

    }
}
