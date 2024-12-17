import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ProductService } from '../../service/product.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ButtonModule,
    FormsModule,
    AsyncPipe,
    ToolbarModule,
    RouterLink,
    CommonModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    CardModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  display: any;
  searchQuery: string = '';
  filteredUsers: any = [];
  users: any;
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

  filterUsers() {
    let tempUsers = [...this.users];
    if (this.searchQuery) {

      const query = this.searchQuery.toLowerCase();
      tempUsers = tempUsers.filter((user: { mfullname: string; memail: string }) =>
        user.mfullname.toLowerCase().includes(query) ||
        user.memail.toLowerCase().includes(query)
      );
    }

    const email = sessionStorage.getItem('email');
    // 3. อัพเดต filteredProducts
    this.filteredUsers = tempUsers
      .filter(user => user.mlevel === 'admin' && user.memail !== email) // Filter ข้อมูล
      .map((user, index) => ({
        ...user,
        index: index + 1 // เพิ่ม index หลังจาก Filter ข้อมูลแล้ว
      }));
      this.paginateData();
    // this.filteredUsers = tempUsers.filter(user => user.mlevel === 'admin'&& user.memail !== email);
  }
  getAllMusers() {
    this.service.gellAllMusers().subscribe((res) => {
      console.log(res);
      this.users = res;
      // this.extractUniqueCategories();
      this.filterUsers(); // เรียกใช้ filter หลังดึงข้อมูล
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

  trackByIndex(index: number, item: any): number {
    return index;  // Just return the index as the identifier for simplicity
  }
  // onDU(id:any) {
  //   const iscon = confirm('Are you sure yo delete this User?');
  //   if(iscon){
  //     this._homeService.deleteU(id).subscribe((res)=>{
  //       this._toastrService.error('User Deleted Succes','Deleted')
  //       this.getUList();
  //     })
  //   }
  // }
  private router = inject(Router)
  logout() {
    sessionStorage.clear();
    this.router.navigate(['first']);
  }
  onRowsPerPageChange() {
    this.currentPage = 1; // Reset หน้าเป็น 1 เมื่อเปลี่ยน rows per page
    this.paginateData();
  }

}
