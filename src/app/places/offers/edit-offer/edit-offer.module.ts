import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOfferPageRoutingModule } from './edit-offer-routing.module';

import { EditOfferPage } from './edit-offer.page';
import { RouterModule, Routes } from '@angular/router';
// import { Route } from '@angular/compiler/src/core';

const routes: Routes = [
  {
    path: '',
    component: EditOfferPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    IonicModule,
    ReactiveFormsModule,
    // EditOfferPageRoutingModule
    RouterModule.forChild(routes)
  ],
  declarations: [EditOfferPage]
})
export class EditOfferPageModule {}
