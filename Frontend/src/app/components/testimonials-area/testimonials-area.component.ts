import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-testimonials-area',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './testimonials-area.component.html',
  styleUrl: './testimonials-area.component.module.scss'
})
export class TestimonialsAreaComponent implements OnInit, OnDestroy {
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
  isAnimating = false;
  private intervalId: any;

  ngOnInit() {
    // Start auto-rotation
    this.startAutoRotation();
  }

  ngOnDestroy() {
    // Clean up the interval when component is destroyed
    this.stopAutoRotation();
  }

  private startAutoRotation() {
    this.intervalId = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  private stopAutoRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private resetAutoRotation() {
    this.stopAutoRotation();
    this.startAutoRotation();
  }

  previousTestimonial() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.currentIndex = this.currentIndex === 0 ? 
        this.testimonials.length - 1 : 
        this.currentIndex - 1;
      
      setTimeout(() => this.isAnimating = false, 500);
      this.resetAutoRotation();
    }
  }

  nextTestimonial() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.currentIndex = this.currentIndex === this.testimonials.length - 1 ? 
        0 : 
        this.currentIndex + 1;
      
      setTimeout(() => this.isAnimating = false, 500);
      this.resetAutoRotation();
    }
  }

  goToTestimonial(index: number) {
    if (!this.isAnimating && this.currentIndex !== index) {
      this.isAnimating = true;
      this.currentIndex = index;
      setTimeout(() => this.isAnimating = false, 500);
      this.resetAutoRotation();
    }
  }
}