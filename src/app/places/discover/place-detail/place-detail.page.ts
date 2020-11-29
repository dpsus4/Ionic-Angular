import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { Subscription } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { AuthService } from "src/app/auth/auth.service";
import { BookingService } from "src/app/bookings/booking.service";
import { CreateBookingComponent } from "src/app/bookings/create-booking/create-booking.component";
import { MapModalComponent } from "src/app/shared/map-modal/map-modal.component";
import { Place } from "../../place.model";
import { PlacesService } from "../../places.service";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabs/discover");
        return;
      }

      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId.pipe(switchMap(userId => {
        if(!userId) {
          throw new Error("Found no user!");
        }

        fetchedUserId = userId;

        return this.placesService.getPlace(paramMap.get("placeId"));
      }))
      // this.place = this.placesService.getPlace(paramMap.get("placeId"));
      
        .subscribe(
          (place) => {
            this.place = place;
            this.isBookable = place.userId !== fetchedUserId;
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: "An error occurred",
                message: "Could not load place.",
                buttons: [
                  {
                    text: "Okay",
                    handler: () => {
                      this.router.navigate(["/places/tabs/discover"]);
                    },
                  },
                ],
              })
              .then((alertEl) => alertEl.present());
          }
        );
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack("/places/tabs/discover");
    this.actionSheetCtrl
      .create({
        header: "Choose an action",
        buttons: [
          {
            text: "Select date",
            handler: () => {
              this.openBookinModal("select");
            },
          },
          {
            text: "Random date",
            handler: () => {
              this.openBookinModal("random");
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookinModal(mode: "select" | "random") {
    console.log(mode);

    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === "confirm") {
          this.loadingController
            .create({ message: "Booking place..." })
            .then((loadingEl) => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
          console.log(resultData.data, resultData.role);
        }
      });
  }

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.place.location.lat,
            lng: this.place.location.lng,
          },
          selectable: false,
          closeButtonText: "Close",
          title: this.place.location.address
        },
      })
      .then((modalEl) => modalEl.present());
  }
}
