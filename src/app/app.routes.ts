import { Routes } from '@angular/router';
import { FirstpageComponent } from './components/firstpage/firstpage.component';
import { PostProductComponent } from './components/post-product/post-product.component';
import { GetAllProductsComponent } from './components/get-all-products/get-all-products.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { authGuard } from './guards/auth.guard';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddUComponent } from './components/add-u/add-u.component';
import { adminGuard } from './gadmin/guard.guard';
import { ShowProductsComponent } from './components/show-products/show-products.component';


export const routes: Routes = [
  {path:'first',component:FirstpageComponent},
  {path:'addproduct',component:PostProductComponent,canActivate:[authGuard,adminGuard]},
  {path:'products',component:GetAllProductsComponent,canActivate:[authGuard,adminGuard]},
  {path:"products/:id",component:UpdateProductComponent,canActivate:[authGuard,adminGuard]},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"main",component:MainComponent,canActivate:[authGuard]},
  {path:"user",component:UserComponent,canActivate:[authGuard,adminGuard]},
  {path:"admin",component:AdminComponent,canActivate:[authGuard,adminGuard]},
  {path:"adda",component:AddUComponent,canActivate:[authGuard,adminGuard]},
  {path:"sample",component:ShowProductsComponent,canActivate:[authGuard,adminGuard]},
  {path:'', redirectTo:'first',pathMatch:'full'},
];
