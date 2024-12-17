import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-get-all-products',
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
  templateUrl: './get-all-products.component.html',
  styleUrls: ['./get-all-products.component.css']
})
export class GetAllProductsComponent {
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
  rowsPerPage: number = 5; // จำนวน rows ต่อหน้า
  paginatedProducts: any[] = [];
  excel: any[] = [];
  pages: number[] = []; // เก็บหมายเลขหน้าทั้งหมด
  level: any | undefined;

  selectedProductTypeSort: string = ''; // Filter Product Type
  uniqueProductTypes: string[] = []; // Unique Product Types
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

      this.extractUniqueProductTypes();
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
    if (this.selectedProductTypeSort) {
      tempProducts = tempProducts.filter(product =>
        product.productType === this.selectedProductTypeSort
      );
    }
    // 3. อัพเดต filteredProducts
    this.filteredProducts = tempProducts.map((product, index) => ({
      ...product,
      index: index + 1 // เพิ่ม index
    }));

    this.paginateData();
  }
  extractUniqueProductTypes() {
    const productTypesSet = new Set<string>();
    this.products.forEach((product: { productType: string; }) => {
      if (product.productType) productTypesSet.add(product.productType);
    });
    this.uniqueProductTypes = Array.from(productTypesSet);
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

    this.selectedProductTypeSort = '';
    this.filteredProducts = tempProducts.map((product, index) => ({
      ...product,
      index: index + 1 // เพิ่ม index
    }));
    // Update paginated data
    this.paginateData();
  }


  exportToExcel() {
    const chunkSize = 1000; // Adjust chunk size
    const chunks = [];
    for (let i = 0; i < this.products.length; i += chunkSize) {
      chunks.push(this.products.slice(i, i + chunkSize));
    }

    const workbook = XLSX.utils.book_new();

    // 1. Count the number of occurrences of each Category
    const categoryCounts = this.products.reduce((acc: Record<string, number>, product: any) => {
      acc[product.mcate] = (acc[product.mcate] || 0) + 1;
      return acc;
    }, {});

    const categorySummaryData = Object.entries(categoryCounts).map(([category, count]) => ({
      'Category': category,
      'Count': count,
    }));

    categorySummaryData.push({
      'Category': 'Total Categories',
      'Count': Object.keys(categoryCounts).length,
    });

    const categorySheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(categorySummaryData);
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Category Summary');

    // 2. Count the number of occurrences of each Genre
    const genreCounts = this.products.reduce((acc: Record<string, number>, product: any) => {
      if (product.selectedGenres) {
        product.selectedGenres.forEach((genre: string) => {
          acc[genre] = (acc[genre] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const genreSummaryData = Object.entries(genreCounts).map(([genre, count]) => ({
      'Genre': genre,
      'Count': count,
    }));

    genreSummaryData.push({
      'Genre': 'Total Genres',
      'Count': Object.values(genreCounts).length,
    });

    const genreSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(genreSummaryData);
    XLSX.utils.book_append_sheet(workbook, genreSheet, 'Genre Summary');
    //3................
    // 1. Count occurrences of each ProductType
    const productTypeCounts = this.products.reduce((acc: Record<string, number>, product: any) => {
      if (product.productType) {
        acc[product.productType] = (acc[product.productType] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert the count data to a format suitable for Excel
    const productTypeSummaryData = Object.entries(productTypeCounts).map(([type, count]) => ({
      'Type': type,
      'Count': count,
    }));
    productTypeSummaryData.push({
      'Type': 'Total Unique Product Types',
      'Count': Object.keys(productTypeCounts).length,
    });
    const productTypeSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(productTypeSummaryData);
    XLSX.utils.book_append_sheet(workbook, productTypeSheet, 'ProductType Summary');


    // 3. Handle product chunks for detailed data
    chunks.forEach((chunk, index) => {
      const worksheetData = chunk.map((product: any, idx: any) => ({
        '#': idx + 1,
        'Product Name': product.mpname,
        'Category': product.mcate,
        'Price': `$${this.formatNumberWithCommas(product.mprice)}`,

        'Date': product.mcal ? this.formatDate(product.mcal) : '',
        'Genres': product.selectedGenres && product.selectedGenres.length > 0
          ? product.selectedGenres.join(', ')
          : 'No Genres',
        'Type': product.productType,
      }));

      const totalProducts = chunk.length;

      worksheetData.push({
        'Product Name': 'Total Products',
        'Category': '',
        'Price': '',
        'Date': '',
        'Genres': '',
        'Type': totalProducts,
      });
      worksheetData.push({
        'Product Name': 'Total Categories',
        'Type': Object.keys(categoryCounts).length,
      });
      worksheetData.push({
        'Product Name': 'Total Genres',
        'Type': Object.values(genreCounts).length,
      });


      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Products_${index + 1}`);
    });

    // 4. Write and Save Excel File
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, 'products_excel.xlsx');
  }


  formatNumberWithCommas(value: number | string): string {
    const number = parseFloat(value as string);
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // แปลงให้เป็น 2 หลัก
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0
    const year = String(date.getFullYear()).slice(-4); // เก็บปีแค่ 2 หลัก
    return `${day}-${month}-${year}`;
  }


  onRowsPerPageChange() {
    this.currentPage = 1; // Reset หน้าเป็น 1 เมื่อเปลี่ยน rows per page
    this.paginateData();
  }
}

