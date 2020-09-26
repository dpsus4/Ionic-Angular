import { Component, OnInit } from "@angular/core";
import { Recipe } from "./recipe.model";
import { RecipesService } from "./recipes.service";

@Component({
  selector: "app-recipes",
  templateUrl: "./recipes.page.html",
  styleUrls: ["./recipes.page.scss"],
})
export class RecipesPage implements OnInit {
  recipes: Recipe[];
  // recipes: Recipe[] = [
  //   {
  //     id: "r1",
  //     title: "Schnitzel",
  //     imageUrl:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG/330px-Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG",
  //     ingredients: ["French Fries", "Pork Meat", "Salad"]
  //   },
  //   {
  //     id: "r2",
  //     title: "Spaghetti",
  //     imageUrl:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Spaghettoni.jpg/375px-Spaghettoni.jpg",
  //     ingredients: ["Spaghetti", "Meat", "Tomato"]
  //   }
  // ];

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.recipes = this.recipesService.getAllRecipes();
  }
}
