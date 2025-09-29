import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { UserMetaCardComponent } from '../../shared/components/user-profile/user-meta-card/user-meta-card.component';
import { UserInfoCardComponent } from '../../shared/components/user-profile/user-info-card/user-info-card.component';
import { UserAddressCardComponent } from '../../shared/components/user-profile/user-address-card/user-address-card.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CardComponent } from '../stepper/card/card.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    UserMetaCardComponent,
    ComponentCardComponent
  ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent {

}
