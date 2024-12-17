
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import "primeicons/primeicons.css";
import { NgStyle } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-firstpage',
  standalone: true,
  imports: [
    RippleModule,
    ToastModule,
    ProgressBarModule,
    InplaceModule,
    NgStyle,
    RouterLink,
    MenubarModule,
    ButtonModule,
    SplitButtonModule,
    ImageModule],
  templateUrl: './firstpage.component.html',
  styleUrl: './firstpage.component.css'
})
export class FirstpageComponent implements OnInit{
  menu: MenuItem[]| undefined;
  ngOnInit(){
    this.menu =[
      {label:'Home',routerLink:['/'],icon: PrimeIcons.HOME},
      {label:'About Us',routerLink:['/aboutus'],icon: PrimeIcons.INFO_CIRCLE}

    ]
  }
}
