import { Injectable } from "@angular/core";
import { Place } from "./place.model";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of New York City",
      "https://media.gettyimages.com/photos/aerial-view-of-lower-manhattan-new-york-picture-id946087016?k=6&m=946087016&s=612x612&w=0&h=FPq454ti8ZKPiMzyDPJ_A4BNQaN-2olcfg4TYgMFR1w=",
      149.99
    ),
    new Place(
      "p2",
      "L'Amour Toujours",
      "A romantic place in Paris!",
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
      189.99
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your avarage city trip!",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSdhpjgn2kgR2H77aKf6avPxVVA71Rxz8io-w&usqp=CAU",
      99.99
    ),
  ];

  get places(): Place[] {
    return [...this._places];
  }

  constructor() {}
}
