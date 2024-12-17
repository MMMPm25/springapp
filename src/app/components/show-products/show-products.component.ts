import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-show-products',
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
  templateUrl: './show-products.component.html',
  styleUrl: './show-products.component.css'
})
export class ShowProductsComponent {
  display: any;
  products: any;
  index: number | undefined;
  filteredProducts: any = []; // Array สำหรับแสดงผล Filtered data
  searchQuery: string = ''; // ตัวแปรสำหรับเก็บค่าการค้นหา
  selectedPriceRange: string = ''; // ค่าที่เลือกจาก dropdown
  uniqueCategories: string[] = [];
  selectedCategorySort: string = '';
  numbers: number[] | undefined;
  currentPage: number = 1; // หน้าเริ่มต้น
  rowsPerPage: number = 8; // จำนวน rows ต่อหน้า
  paginatedProducts: any[] = [];
  excel: any[] = [];
  pages: number[] = []; // เก็บหมายเลขหน้าทั้งหมด
  level: any;
  constructor(private service: ProductService) { }

  ngOnInit() {

    const email = sessionStorage.getItem('email');
    const level = sessionStorage.getItem('level');
    this.display = email;
    this.level = level;
    console.log(this.filteredProducts);
    this.getAllMproducts();
  }

  // ดึงข้อมูลสินค้า
  getAllMproducts() {
    this.service.gellAllMproducts().subscribe((res) => {
      console.log(res);
      this.products = res;


      this.extractUniqueCategories();
      this.filterProducts(); // เรียกใช้ filter หลังดึงข้อมูล
    });
  }
  // Fetch products from the server
getProducts() {
  this.service.getProducts().subscribe({
    next: (response) => {
      this.paginatedProducts = response.map(product => ({
        ...product,
        selectedGenres: product.selectedGenres || [] // Map genres from the response
      }));
    },
    error: (error) => {
      console.error('Error fetching products:', error);
    }
  });
}


  // Filter ข้อมูลตามคำค้นหา
  filterProducts() {
    let tempProducts = [...this.products];


    // 1. ค้นหาตาม searchQuery
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      tempProducts = tempProducts.filter((product: { mpname: string }) =>
        product.mpname.toLowerCase().includes(query)

      );

    }

    // 2. คัดกรองตาม selectedPriceRange
    if (this.selectedPriceRange === 'less100') {
      tempProducts = tempProducts.filter(product => product.mprice < 100);
    } else if (this.selectedPriceRange === 'less500') {
      tempProducts = tempProducts.filter(product => product.mprice < 500);
    } else if (this.selectedPriceRange === 'less1000') {
      tempProducts = tempProducts.filter(product => product.mprice < 1000);
    } else if (this.selectedPriceRange === '1000up') {
      tempProducts = tempProducts.filter(product => product.mprice >= 1000);
    }

    // คัดกรองตาม selectedCategorySort
    if (this.selectedCategorySort) {
      tempProducts = tempProducts.filter(product => product.mcate === this.selectedCategorySort);
    }
    // 3. อัพเดต filteredProducts
    this.filteredProducts = tempProducts.map((product, index) => ({
      ...product,
      index: index + 1 // เพิ่ม index
    }));
    this.paginateData();
  }

  extractUniqueCategories() {
    const categoriesSet = new Set<string>();
    this.products.forEach((product: { mcate: string; }) => {
      if (product.mcate) categoriesSet.add(product.mcate);
    });
    this.uniqueCategories = Array.from(categoriesSet);
  }
  // Logic สำหรับการ Paginate
  paginateData() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = this.currentPage * this.rowsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.excel = this.filteredProducts
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
    return Math.ceil(this.filteredProducts.length / this.rowsPerPage);
  }
  // Delete Product
  deleteMproduct(id: number) {
    console.log(`Deleting Product with id: ${id}`);
    this.service.deleteMproduct(id).subscribe((res) => {
      console.log(res);
      this.getAllMproducts(); // Refresh Data after deletion
    });
  }

  private router = inject(Router)
  logout() {
    sessionStorage.clear();
    this.router.navigate(['first']);
  }


  resetFilters() {
    let tempProducts = [...this.products];
    // Clear search query
    this.searchQuery = '';
    // Clear selected price range filter
    this.selectedPriceRange = '';
    // Clear selected category filter
    this.selectedCategorySort = '';
    // Reset filtered products
    this.filteredProducts = [...this.products];

    this.filteredProducts = tempProducts.map((product, index) => ({
      ...product,
      index: index + 1 // เพิ่ม index
    }));
    // Update paginated data
    this.paginateData();
  }
  // Method สำหรับ Export ข้อมูลเป็น Excel
  // exportToExcel() {
  //   // Map ข้อมูลเพื่อแปลงเป็น JSON สำหรับ Excel
  //   const worksheetData = this.paginatedProducts.map((product, index) => ({
  //     '#': index + 1,
  //     'Product Name': product.mpname,
  //     'Category': product.mcate,
  //     'Price': product.mprice,
  //     'Date': product.mcal,
  //     'Image': product.mimage,
  //   }));

  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  //   saveAs(data, 'products.xlsx');
  // }


}
