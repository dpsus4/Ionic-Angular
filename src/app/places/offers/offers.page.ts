import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IonItemSliding } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Place } from "../place.model";
import { PlacesService } from "../places.service";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSub: Subscription;
  isLoading: boolean = false;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    // this.offers = this.placesService.offers;
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    console.log("Editing item", offerId);
    slidingItem.close();
    this.router.navigate(["/", "places", "tabs", "offers", "edit", offerId]);
  }
}
