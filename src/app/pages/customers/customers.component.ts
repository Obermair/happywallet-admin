import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../shared/components/ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../shared/components/form/input/checkbox.component';
import { MultiSelectComponent } from '../../shared/components/form/multi-select/multi-select.component';
import { DataService } from '../../data.service';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../../shared/components/form/select/select.component';
import { Label } from '@amcharts/amcharts5';
import { LabelComponent } from '../../shared/components/form/label/label.component';

interface MultiOption {
  value: string;
  text: string;
  selected: boolean;
}

export interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-customers',
  imports: [CommonModule,
      PageBreadcrumbComponent,
      BadgeComponent,
      AvatarTextComponent,
      CheckboxComponent,
      MultiSelectComponent,
      FormsModule,
      SelectComponent,
      LabelComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers: any[] = [];

  selectedRows: string[] = [];
  selectAll: boolean = false;

  selectedValue = '';
  selectedValues: string[] = [];

  lastInteractionOptions: Option[] = [
             { value: 'all', label: 'Alle' },
             { value: 'today', label: 'Heute' },
             { value: 'yesterday', label: 'Gestern' },
            { value: '7days', label: 'Mehr als 7 Tage' },
            { value: '30days', label: 'Mehr als 30 Tage' },
            { value: '90days', label: 'Mehr als 90 Tage' },
            { value: '180days', label: 'Mehr als 180 Tage' },
            { value: '365days', label: 'Mehr als 365 Tage' },
            { value: 'more365days', label: 'Mehr als 1 Jahr' },
           ];

  multiOptions: MultiOption[] = [];

  selectedLastInteraction: string = '';

  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.dataService.getLoyaltyPrograms().then(() => {
      // transform to multiOptions
      this.multiOptions = this.dataService.loyaltyPrograms.map((program: any) => ({
        value: program.id,
        text: program.attributes.programName,
        selected: this.selectedValues.includes(program.id),
      }));

      // initially select all options
      this.handleSelectAllPrograms();
      this.handleSelectLastInteraction('all');
      
      this.reloadCustomers();
    });

  }

  handleSelectAll(){
  }

  reloadCustomers(){
    this.dataService.getCustomersByLoyaltyPrograms(this.selectedValues).then((customers: any) => {
      this.customers = customers;

      this.filterByLastInteraction(this.customers);

      // Fetch loyalty programs for each customer
      this.customers.forEach(customer => {
        this.getLoyaltyProgramsForCustomer(customer);
      });
    });
  }

  filterByLastInteraction(customers: any[]){
    if(this.selectedLastInteraction === 'all' || this.selectedLastInteraction === ''){
      return;
    }

    const now = new Date();

    this.customers = customers.filter(customer => {
      let latestDate: Date | undefined;

      customer.attributes.program_users.data.forEach((pu: any) => {
        const updatedAt = new Date(pu.attributes.updatedAt);
        if (!latestDate || updatedAt > latestDate) {
          latestDate = updatedAt;
        }
      });

      if (!latestDate) return false;

      const diffTime = now.getTime() - latestDate!.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      switch(this.selectedLastInteraction) {
        case 'today':
          return diffDays === 0;
        case 'yesterday':
          return diffDays === 1;
        case '7days':
          return diffDays > 7;
        case '30days':
          return diffDays > 30;
        case '90days':
          return diffDays > 90;
        case '180days':
          return diffDays > 180;
        case '365days':
          return diffDays > 365;
        case 'more365days':
          return diffDays > 365;
        default:
          return true;
      }
    });
  }

  handleSelectAllPrograms() {
    this.selectedValues = this.multiOptions.map(option => option.value);
    this.reloadCustomers();
  }
  
  handleMultiSelectChange(values: string[]) {
    this.selectedValues = values;
    this.reloadCustomers();
  }

  handleSelectLastInteraction(value: string) {
    //only one value allowed
    this.selectedLastInteraction = value;
    this.reloadCustomers();
  }


  handleRowSelect(id: string) {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
  }

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
    if (type === 'Complete') return 'success';
    if (type === 'Pending') return 'warning';
    return 'error';
  }


  getLoyaltyProgramsForCustomer(customer: any) {
    // get program ids from customer in [1, 2, 3] format
    const programUserIds = customer.attributes.program_users.data.map((pu: any) => pu.id);

    this.dataService.getLoyaltyProgramsForCustomer(programUserIds).then((programs: any) => {
      customer.loyaltyPrograms = programs;
    });
  }

    getLastInteraction(customer: any) {
      let latestDate: Date | undefined;

      customer.attributes.program_users.data.forEach((pu: any) => {
        const updatedAt = new Date(pu.attributes.updatedAt);
        if (!latestDate || updatedAt > latestDate) {
          latestDate = updatedAt;
        }
      });

      if (!latestDate) return '-';

      const now = new Date();
      const diffTime = now.getTime() - latestDate!.getTime();

      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Heute';
      if (diffDays === 1) return 'Gestern';
      return `Vor ${diffDays} Tagen`;
    }

    getColorForLastInteraction(customer: any){
      const lastInteraction = this.getLastInteraction(customer);
      // success if within 7 days, light if less then 30 days, warning if within  3 months, error if more than 3 months    primary: 'bg-brand-500 text-white dark:text-white',
      if (lastInteraction === 'Heute' || lastInteraction === 'Gestern') return 'success';
      if (lastInteraction.includes('Tagen')) {
        const days = parseInt(lastInteraction.split(' ')[1]);
        if (days <= 7) return 'success';
        if (days <= 30) return 'light';
        if (days <= 90) return 'warning';
        return 'error';
      }
      return 'error';
    }

}
