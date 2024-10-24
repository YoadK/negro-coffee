import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.module.scss']
})
export class AboutComponent {
    constructor() {
        console.log('About component initialized');
    }
}