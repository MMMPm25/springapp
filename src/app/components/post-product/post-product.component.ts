import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {DropdownModule} from 'primeng/dropdown';

import { MessageService } from 'primeng/api';
import { NgStyle } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';

import { ProductService } from '../../service/product.service';
import { BrowserModule } from '@angular/platform-browser';
import { CheckboxModule } from 'primeng/checkbox';

import {CalendarModule} from 'primeng/calendar';

@Component({
  selector: 'app-post-product',
  standalone: true,
  imports: [

    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    FormsModule,
    NgStyle,
    DropdownModule,
    CalendarModule,
    FormsModule,
    CheckboxModule

  ],
  templateUrl: './post-product.component.html',
  styleUrl: './post-product.component.css'
})
export class PostProductComponent implements OnInit{

  private messageService = inject(MessageService);
  private router = inject(Router);
  postMproductForm!:FormGroup;
  http: any;
  value: Date | undefined;

  categories = [
    { label: 'Shooting', value: 'shooting' },
    { label: 'MMORPG', value: 'mmorpg' },
    { label: 'Strategy', value: 'strategy' },
    { label: 'Rhythm game', value: 'rhythmgame' },
    { label: 'RPG', value: 'rpg' },
    { label: 'Action', value: 'action' },
    { label: 'Horror', value: 'horror' }
  ];
  options = { optionA: false, optionB: false, optionC: false };
  selectedCategory: any = null;
  selectedOptionType = ''; // Default selected type




  constructor(private productService : ProductService, private fb: FormBuilder){

  }
  ngOnInit(){
    this.postMproductForm = this.fb.group({
      mpname:[null, Validators.required],
      mcate:[null, Validators.required],
      mprice:[null, Validators.required],
      mimage: [null, Validators.required],
      mcal: [null, Validators.required], // Bind calendar to this field
      drama: [false], // Default value for Drama
      comedy: [false],
      scifi: [false] ,
      fantasy: [false] ,
      adventure: [false]  ,// Default value for Comedy
      productType: ['', Validators.required] // <-- ฟิลด์ RadioButton
    })

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      this.postMproductForm.patchValue({ mimage: base64String });
    };
  }

  // postMproduct() {
  //   if (this.postMproductForm.valid) {
  //     const formValue = { ...this.postMproductForm.value };
  //     if (formValue.mcal) {
  //       // แปลงวันที่ให้เป็น UTC ก่อนส่งไปยัง Backend
  //       formValue.mcal = new Date(formValue.mcal).toISOString();
  //     }
  //     this.productService.postMproduct(formValue).subscribe({
  //       next: (res) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: 'Product added successfully',
  //         });
  //         this.router.navigate(['products']);
  //       },
  //       error: (error) => {

  //         console.log(error);
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Failed to save product',
  //         });
  //       },
  //     });
  //   }
  // }

  postMproduct() {
    if (this.postMproductForm.valid) {
      const formValue = { ...this.postMproductForm.value };

      const selectedGenres = [];
      if (formValue.drama) selectedGenres.push('Drama');
      if (formValue.comedy) selectedGenres.push('Comedy');
      if (formValue.scifi) selectedGenres.push('Scifi');
      if (formValue.fantasy) selectedGenres.push('Fantasy');
      if (formValue.adventure) selectedGenres.push('Adventure');


      const payload = {
        mpname: formValue.mpname,
        mcate: formValue.mcate,
        mprice: formValue.mprice,
        mimage: formValue.mimage,
        mcal: new Date(formValue.mcal).toISOString(),
        selectedGenres, // Include checkbox data
        productType: formValue.productType,
      };

      console.log('Payload:', payload);

      this.productService.postMproduct(payload).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product added successfully',
          });
          this.router.navigate(['products']);
        },
        error: (err) => {
          console.log(err);
          if (err.error?.error === "Product Name already exists!") {
            this.messageService.add({
              severity: 'error',
              summary: 'Validation Error',
              detail: 'Product Name already exists!',
            });
          }else{
            this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save product',
          });
          }
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: 'Failed to save product',
          // });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form Error',
        detail: 'Please fill out all required fields',
      });
    }
  }

  get mpname(){
    return this.postMproductForm.controls['mpname'];
  }
  get mcate(){
    return this.postMproductForm.controls['mcate'];
  }
  get mprice(){
    return this.postMproductForm.controls['mprice'];
  }
  get mcal(){
    return this.postMproductForm.controls['mcal'];
  }


}
