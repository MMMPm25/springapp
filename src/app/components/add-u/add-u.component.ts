import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

import { passwordMismatchValidator } from '../shared/password-mismatch.directive';
import { NgStyle } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-add-u',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    NgStyle
  ],
  templateUrl: './add-u.component.html',
  styleUrl: './add-u.component.css'
})
export class AddUComponent {
  // private registerService = inject(AuthService);
  postMusersForm!: FormGroup;
  private messageService = inject(MessageService);
  private router = inject(Router);
  // addForm = new FormGroup({
  //   fullname:new FormControl('',[Validators.required]),
  //   email:new FormControl('',[
  //     Validators.required,
  //     Validators.pattern(/[a-z0-9\._%\+\-]+@[a-z0-9\.\-]+\.[a-z]{2,}$/),
  //   ]),
  //   password:new FormControl('',[Validators.required]),
  //   confirmPassword:new FormControl('',[Validators.required]),
  //   level: new FormControl('admin', [Validators.required]),
  // },{
  //   validators:passwordMismatchValidator
  // });
  constructor(private usersService: ProductService, private fb: FormBuilder) { }
  ngOnInit() {
    this.postMusersForm = this.fb.group({
      mfullname: [null, Validators.required],
      memail: [null, [Validators.required, Validators.email]],
      mpassword: [null, [Validators.required]], // ตรวจสอบรหัสผ่านอย่างน้อย 6 ตัว
      confirmPassword: [null, Validators.required],
      mlevel: new FormControl('admin', [Validators.required]),
    }, {
      validators: passwordMismatchValidator
    });
  }
  // postMuser() {
  //   if (this.postMusersForm.invalid) {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Validation Error',
  //       detail: 'Please ensure all fields are filled correctly.',
  //     });
  //     return;
  //   }

  //   this.usersService.postMuser(this.postMusersForm.value).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Register successfully',
  //       });

  //       this.router.navigate(['admin']);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Something went wrong',
  //       });
  //     },
  //   });
  // }
  postMuser() {
    if (this.postMusersForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please ensure all fields are filled correctly.',
      });
      return;
    }
    const formData = {
      ...this.postMusersForm.value,
      mlevel: 'admin',
    };
    this.usersService.postMuser(formData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registered successfully',
        });
        this.router.navigate(['admin']);
      },
      error: (err) => {
        console.error('Error response:', err);

        // จัดการข้อความ Error จาก Back-End
        if (err.error?.error === "Password must be at least 6 characters long") {
          this.messageService.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Password must be at least 6 characters long',
          });
        } else if (err.error?.error === "Email already exists!") {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email already exists!',
          });
        } else if (err.error?.error === "Full name already exists!") {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Full name already exists!',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
          });
        }
      },
    });
  }



  get fullname() {
    return this.postMusersForm.controls['mfullname'];
  }
  get email() {
    return this.postMusersForm.controls['memail'];
  }
  get password() {
    return this.postMusersForm.controls['mpassword'];
  }
  get confirmPassword() {
    return this.postMusersForm.controls['confirmPassword'];
  }
}
