import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProductService } from '../../service/product.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';


@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    NgStyle,
    DropdownModule,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'] // แก้ไขตรงนี้
})
export class UpdateProductComponent implements OnInit {
  private messageService = inject(MessageService);
  private router = inject(Router);
  updateMproductForm!:FormGroup;
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
  id: number = 0; // ตั้งค่าเริ่มต้นให้ `id`

  constructor(
    private act: ActivatedRoute,
    private service: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // ใช้ `ngOnInit` เพื่อดึงค่า `id` จาก route parameters
    this.id = this.act.snapshot.params['id'];
    this.getMproductbyId();
    this.updateMproductForm = this.fb.group({
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
    this.getMproductbyId();
  }

  // getMproductbyId(){
  //   this.service.getMproductById(this.id).subscribe((res)=>{
  //     console.log(res)
  //     this.updateMproductForm.patchValue(res);
  //   })
  // }
  getMproductbyId() {
    this.service.getMproductById(this.id).subscribe((res) => {
      console.log(res);

      // Map checkbox values
      const genreCheckboxes = {
        drama: res.selectedGenres?.includes('Drama') || false,
        comedy: res.selectedGenres?.includes('Comedy') || false,
        scifi: res.selectedGenres?.includes('Scifi') || false,
        fantasy: res.selectedGenres?.includes('Fantasy') || false,
        adventure: res.selectedGenres?.includes('Adventure') || false,
      };

      // Update form values including mapping checkbox states
      this.updateMproductForm.patchValue({
        ...res,
        ...genreCheckboxes,
      });
      if (res.mimage) {
        this.updateMproductForm.patchValue({
          mimage: res.mimage,
        });
      }
    });
  }
  onCheckboxChange(event: any, genre: string) {
    const checked = event.target.checked;

    const selectedGenres = this.updateMproductForm.value.selectedGenres || [];
    if (checked) {
      selectedGenres.push(genre);
    } else {
      const index = selectedGenres.indexOf(genre);
      if (index > -1) selectedGenres.splice(index, 1);
    }

    this.updateMproductForm.patchValue({
      selectedGenres,
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      console.log('File converted to Base64:', base64String);

      this.updateMproductForm.patchValue({
        mimage: base64String,
      });
    };
  }
  // updateMproduct(){
  //   this.service.updateMproduct(this.id, this.updateMproductForm.value).subscribe({next:(res)=>{
  //     console.log(res)
  //     this.updateMproductForm.patchValue(res);
  //     this.messageService.add({
  //       severity:'success',
  //       summary:'Success',
  //       detail:'Add Product successfully',
  //     });
  //     this.router.navigate(['products']);
  //   },
  //   error:(err)=>{
  //     console.log(err);
  //     this.messageService.add({
  //       severity:'error',
  //       summary:'Error',
  //       detail:'Something went wrong',
  //     })
  //   },
  //   })


  updateMproduct() {
    if (this.updateMproductForm.valid) {
      const formValue = { ...this.updateMproductForm.value };
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




      this.service.updateMproduct(this.id,payload).subscribe({
        next: (res) => {
          console.log('Update successful', res);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product updated successfully'
          });
          this.router.navigate(['products']);
        },
        error: (error) => {
          console.error('Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product'
          });
        }
      });
    }
  }




  get mpname(){
    return this.updateMproductForm.controls['mpname'];
  }
  get mcate(){
    return this.updateMproductForm.controls['mcate'];
  }
  get mprice(){
    return this.updateMproductForm.controls['mprice'];
  }
  get mcal(){
    return this.updateMproductForm.controls['mcal'];
  }
}
