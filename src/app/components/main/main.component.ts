import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { SpeedDialModule } from 'primeng/speeddial';
import { StepperModule } from 'primeng/stepper';
import { ScrollTopModule } from 'primeng/scrolltop';
@Component({
  selector: 'app-main',
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
    CardModule,
    SplitterModule,
    AccordionModule,
    TabViewModule,
    SpeedDialModule,
    StepperModule,
    ScrollTopModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  display : any;
  menu: MenuItem[]| undefined;
  items: MenuItem[] | any;

  messageService: any;
  ngOnInit(){
    this.menu =[
      {label:'Home',icon: PrimeIcons.HOME},


    ],
    this.items= [
      {
          icon: 'pi pi-pencil',
          command: () => {
              this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
          }
      },
      {
          icon: 'pi pi-refresh',
          command: () => {
              this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
          }
      },
      {
          icon: 'pi pi-trash',
          command: () => {
              this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
          }
      },
      {
          icon: 'pi pi-upload',
          routerLink: ['/fileupload']
      },
      {
          icon: 'pi pi-external-link',
          url: 'http://angular.io'

      }
  ];
    const email = sessionStorage.getItem('email');
    this.display = email;

  }

  private router = inject(Router)
  logout() {
    sessionStorage.clear();
    this.router.navigate(['first']);
  }
}
