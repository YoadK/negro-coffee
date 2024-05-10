import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    email: string = '';
    password: string = '';
    confirmPassword: string = '';

    onSubmit() {
        // Handle form submission
        try {
            console.log('Email:', this.email);
            console.log('Password:', this.password);
            console.log('Confirm Password:', this.confirmPassword);
        }
        catch (err: any) {
            alert(err.message)
        }


    }
}
