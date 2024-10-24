import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-testimonials-area',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './testimonials-area.component.html',
    styleUrls: ['./testimonials-area.component.module.scss']
})
export class TestimonialsAreaComponent {
    testimonials = [
        {
            id: 1,
            name: "יעל כהן",
            role: "בעלת בית קפה",
            quote: "הקפה שלכם הוא פשוט מדהים! הלקוחות שלי מתלהבים מהטעם העשיר והארומה המיוחדת. השירות המקצועי והאדיב שלכם הופך את העבודה איתכם לחוויה נפלאה.",
            image: "assets/testimonials-avatars/user5.png"
        },
        {
            id: 2,
            name: "דוד לוי",
            role: "חובב קפה",
            quote: "מאז שגיליתי את פולי הקפה שלכם, הבקרים שלי השתנו לחלוטין. האיכות והטריות מורגשות בכל לגימה. תודה על השירות המעולה והמקצועיות.",
            image: "assets/testimonials-avatars/user3.png"
        },
        {
            id: 3,
            name: "מיכל אברהם",
            role: "באריסטה מקצועית",
            quote: "כבאריסטה, אני מעריכה מאוד את האיכות העקבית והמגוון הרחב של פולי הקפה. התמיכה המקצועית והידע שאתם חולקים הם פשוט יוצאי דופן.",
            image: "assets/testimonials-avatars/user2.png"
        },
        {
            id: 4,
            name: "אורי שמש",
            role: "שף ובעל מסעדה",
            quote: "הקפה שלכם משלים בצורה מושלמת את חווית הארוחה במסעדה שלנו. הלקוחות תמיד מציינים לטובה את האיכות והטעם המיוחד.",
            image: "assets/testimonials-avatars/user4.png"
        }
    ];

    currentIndex = 0;

    constructor() {
        console.log('Testimonials component initialized');
    }

    nextTestimonial(): void {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        console.log('Next testimonial:', this.currentIndex);
    }

    previousTestimonial(): void {
        this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        console.log('Previous testimonial:', this.currentIndex);
    }

    goToTestimonial(index: number): void {
        this.currentIndex = index;
        console.log('Going to testimonial:', index);
    }
}