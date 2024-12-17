import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../service/product.service';
import { ToolbarModule } from 'primeng/toolbar';
import { AsyncPipe, CommonModule, NgStyle } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink,
    ToolbarModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    CardModule,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit  {
  display : any;
  users: any = [];
  filteredUsers: any = []; // Array สำหรับแสดงผล Filtered data
  searchQuery: string = '';
  currentPage: number = 1; // หน้าเริ่มต้น
  rowsPerPage: number = 5; // จำนวน rows ต่อหน้า
  paginatedUsers: any[] = [];
  pages: number[] = []; // เก็บหมายเลขหน้าทั้งหมด

  ngOnInit(): void {

    const email = sessionStorage.getItem('email');
    this.display = email;
    this.getAllMusers();
    // this.getUList();
  }
  constructor(private service: ProductService, private _toastrService: ToastrService) { }
  // getUList() {
  //   this._homeService.getU().subscribe((res) => {
  //     this.UList = res;
  //     this.filteredUsersL = res.filter(user => user.level !== 'admin');
  //   });
  // }
  filterUsers() {
    let tempUsers = [...this.users];

    // ค้นหาเฉพาะคำค้นหา
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      tempUsers = tempUsers.filter((user: { mfullname: string; memail: string }) =>
        user.mfullname.toLowerCase().includes(query) ||
        user.memail.toLowerCase().includes(query)
      );
    }

    // กรองเฉพาะ user ที่ไม่ใช่ 'admin' และ map index เข้าไป
    this.filteredUsers = tempUsers
      .filter(user => user.mlevel !== 'admin') // filter เฉพาะ non-admin users
      .map((user, index) => ({
        ...user,
        index: index + 1 // เพิ่ม index ให้แสดงตามลำดับ
      }));
      this.paginateData();
  }



  getAllMusers() {
    this.service.gellAllMusers().subscribe({
      next: (res) => {
        console.log(res);
        this.users = res;
        this.filterUsers();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  // Logic Pagination
  paginateData() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = this.currentPage * this.rowsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);

    // อัปเดตหมายเลขหน้า
    const totalPages = this.totalPages;
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.paginateData();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateData();
    }
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.rowsPerPage);
  }

  deleteMuser(id: number) {
    console.log(`Deleting User with id: ${id}`);
    this.service.deleteMuser(id).subscribe((res) => {
      console.log(res);
      this.getAllMusers(); // Refresh Data after deletion
    });
  }
  private router = inject(Router)
  logout() {
    sessionStorage.clear();
    this.router.navigate(['first']);
  }

  // trackByIndex(index: number, item: any): number {
  //   return index;  // Just return the index as the identifier for simplicity
  // }
  onRowsPerPageChange() {
    this.currentPage = 1; // Reset หน้าเป็น 1 เมื่อเปลี่ยน rows per page
    this.paginateData();
  }
}
