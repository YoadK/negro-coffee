import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.module.scss'
})
export class MyAccountComponent {
    selectedTab: string = 'orders';

    selectTab(tab: string) {
      this.selectedTab = tab;
    }
}
