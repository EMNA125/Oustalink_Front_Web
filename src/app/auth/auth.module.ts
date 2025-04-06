import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { HomeRoutingModule } from '../home/home-routing.module';
import { SharedRoutingModule } from '../shared/shared-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HomeRoutingModule,
    SharedRoutingModule
  ]
})
export class AuthModule { }
