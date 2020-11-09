import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Place } from "./place.model";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of New York City",
      "https://media.gettyimages.com/photos/aerial-view-of-lower-manhattan-new-york-picture-id946087016?k=6&m=946087016&s=612x612&w=0&h=FPq454ti8ZKPiMzyDPJ_A4BNQaN-2olcfg4TYgMFR1w=",
      149.99,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "abc"
    ),
    new Place(
      "p2",
      "L'Amour Toujours",
      "A romantic place in Paris!",
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
      189.99,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "abc"
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your avarage city trip!",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSdhpjgn2kgR2H77aKf6avPxVVA71Rxz8io-w&usqp=CAU",
      99.99,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "abc"
    ),
  ]);

  private _offers: Place[] = [
    new Place(
      "p1",
      "Manhattan Mansion Offer",
      "In the heart of New York City",
      "https://media.gettyimages.com/photos/aerial-view-of-lower-manhattan-new-york-picture-id946087016?k=6&m=946087016&s=612x612&w=0&h=FPq454ti8ZKPiMzyDPJ_A4BNQaN-2olcfg4TYgMFR1w=",
      99.99,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "abc"
    ),
    new Place(
      "p2",
      "L'Amour Toujours Offer",
      "A romantic place in Paris!",
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
      129.99,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "abc"
    ),
    new Place(
      "p3",
      "The Foggy Palace Offer",
      "Not your avarage city trip!",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSdhpjgn2kgR2H77aKf6avPxVVA71Rxz8io-w&usqp=CAU",
      59.99,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "abc"
    ),
  ];

  get places() {
    return this._places.asObservable();
  }

  get offers(): Place[] {
    return [...this._offers];
  }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://media.gettyimages.com/photos/aerial-view-of-lower-manhattan-new-york-picture-id946087016?k=6&m=946087016&s=612x612&w=0&h=FPq454ti8ZKPiMzyDPJ_A4BNQaN-2olcfg4TYgMFR1w=",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    return this.http
      .post<{ name: string }>(
        "https://ionic-angular-b73ed.firebaseio.com/offered-places.json",
        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
        // tap((resData) => {
        //   console.log(resData);
        // })
      );

    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }

  constructor(private authService: AuthService, private http: HttpClient) {}
}
