import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.module.scss']
})
export class ContactUsComponent {
    // Contact information
    whatsappNumber = '0545446906';
    emailAddress = 'support@my-coffeeshop.com';  // Replace with your actual email

    constructor() {
        console.log('Contact component initialized');
    }

    // Method to open WhatsApp
    openWhatsApp(): void {
        const message = 'היי, אשמח לקבל עזרה בנוגע ל';
        const whatsappUrl = `https://wa.me/972${this.whatsappNumber.substring(1)}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        console.log('Opening WhatsApp');
    }

    // Method to open email client
    openEmail(): void {
        const subject = 'פנייה בנוגע לחנות הקפה';
        const mailtoUrl = `mailto:${this.emailAddress}?subject=${encodeURIComponent(subject)}`;
        window.location.href = mailtoUrl;
        console.log('Opening email client');
    }
}