import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
// import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../service/product.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    NgStyle,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginMusersForm!: FormGroup;

  private router = inject(Router);
  // private authService = inject(AuthService);
  private messageService = inject(MessageService);
  constructor(private usersService: ProductService, private fb: FormBuilder) {

  }
  ngOnInit() {
    this.loginMusersForm = this.fb.group({

      memail: ['', Validators.required],
      mpassword: ['', Validators.required],

    })
  }
  getMuser() {
    if (this.loginMusersForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    const { memail, mpassword } = this.loginMusersForm.value; // ดึงค่าจากฟอร์ม

    this.usersService.getMuser(memail, mpassword).subscribe({
      next: (res) => {
        if (res.length != 0) {
          console.log('User Level:', res);
          console.log('User Level:', res.mlevel); // แสดง response ทั้งหมดใน console



          // ตรวจสอบ mlevel และนำทางไปยังหน้าเป้าหมาย
          if (res.mlevel === 'admin') {
            this.messageService.add({
              severity: 'success',
              summary: 'Login Admin Successfully',
              detail: 'Welcome Admin!',
            });
            // sessionStorage.setItem('role', res.mlevel);
            sessionStorage.setItem('email', memail);
            sessionStorage.setItem('level', res.mlevel);
            this.router.navigate(['products']); // หน้า admin
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Login Successfully',
              detail: 'Welcome User!',
            });
            sessionStorage.setItem('email', memail);
            sessionStorage.setItem('level', res.mlevel);
            this.router.navigate(['main']); // หน้า user
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid email or password',
          });
        }
      },
      error: (err) => {
        console.error('Error:', err); // แสดงข้อผิดพลาดใน console
        console.log(err);
          if (err.error?.error === "Invalid email or password") {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Invalid email or password',
            });
          }else{
            this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
          });
          }
      },
    });
  }



  get memail() {
    return this.loginMusersForm.controls['memail'];
  }
  get mpassword() {
    return this.loginMusersForm.controls['mpassword'];
  }

}
