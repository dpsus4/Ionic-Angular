import { Component, OnDestroy, OnInit } from "@angular/core";
import { IonItemSliding, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Booking } from "./booking.model";
import { BookingService } from "./booking.service";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  isLoading = false;
  private bookingSub: Subscription;
  private loadingCtrl: LoadingController;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
    // this.loadedBookings = this.bookingService.bookings;
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe();
    this.isLoading = false;
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: "Cancelling..." }).then((loadingEl) => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
}
