import { Injectable } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Place } from "./place.model";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { PlaceLocation } from "./location.model";

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  // get offers(): Place[] {
  //   return [...this];
  // }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-course.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
        // tap((resData) => {
        //   console.log(resData);
        // })
      );
    // this.places.pipe(
    //   take(1),
    //   map((places) => {
    //     return { ...places.find((p) => p.id === id) };
    //   })
    // );
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        "https://ionic-angular-b73ed.firebaseio.com/offered-places.json"
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }

          return places;
          //return [];
          // console.log(resData);
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();

    uploadData.append("image", image);

    return this.http.post<{ imageUrl: string; imagePath: string }>(
      "",
      uploadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error("No user found!");
        }

        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          "https://media.gettyimages.com/photos/aerial-view-of-lower-manhattan-new-york-picture-id946087016?k=6&m=946087016&s=612x612&w=0&h=FPq454ti8ZKPiMzyDPJ_A4BNQaN-2olcfg4TYgMFR1w=",
          price,
          dateFrom,
          dateTo,
          userId,
          location
        );

        return this.http.post<{ name: string }>(
          "https://ionic-angular-b73ed.firebaseio.com/offered-places.json",
          {
            ...newPlace,
            id: null,
          }
        );
      }),

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
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }

        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://ionic-angular-course.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }

  constructor(private authService: AuthService, private http: HttpClient) {}
}
