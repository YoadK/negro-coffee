import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
// import { Store } from '@ngrx/store';
import { HeaderComponent } from '../../HeaderArea/header/header.component';
import { FooterComponent } from '../../FooterArea/footer/footer.component';




@Component({
    selector: 'app-layout',
    standalone: true,
    imports: 
    //  [RouterLink, RouterModule, CommonModule, HeaderComponent, FooterComponent ],
    //   [RouterLink, RouterModule, CommonModule ],
    [HeaderComponent,FooterComponent,RouterModule,CommonModule],
        // [],  
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.module.scss']
})

export class LayoutComponent implements OnInit {
    isAuthenticated: boolean = false;
    user: UserModel | null = null;

    constructor(private authService: AuthService,private router: Router) { }

    ngOnInit(): void {
        this.authService.isAuthenticated().subscribe(status => {
            this.isAuthenticated = status;
            this.user = this.authService.getCurrentUser();
            console.log('Auth status:', status); // Debug log
            console.log('Current user:', this.user); // Debug log
            
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}



