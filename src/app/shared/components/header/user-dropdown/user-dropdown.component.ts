import { Component } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AvatarTextComponent } from '../../ui/avatar/avatar-text.component';
import { DataService } from '../../../../data.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemTwoComponent, AvatarTextComponent]
})
export class UserDropdownComponent {
  isOpen = false;

  constructor(public dataService: DataService, private router: Router) {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  signOut() {
    this.dataService.signOut().then(() => {
      this.closeDropdown();
      this.router.navigate(['/signin']);
    });
  }
}