import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../shared/components/ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../shared/components/form/input/checkbox.component';
import { MultiSelectComponent } from '../../shared/components/form/multi-select/multi-select.component';
import { DataService } from '../../data.service';
import { FormsModule } from '@angular/forms';

interface MultiOption {
  value: string;
  text: string;
  selected: boolean;
}

@Component({
  selector: 'app-customers',
  imports: [CommonModule,
      PageBreadcrumbComponent,
      BadgeComponent,
      AvatarTextComponent,
      CheckboxComponent,
      MultiSelectComponent,
      FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers: any[] = [];

  selectedRows: string[] = [];
  selectAll: boolean = false;

  options = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'template', label: 'Template' },
    { value: 'development', label: 'Development' },
  ];

  selectedValue = '';
  selectedValues: string[] = [];

  multiOptions: MultiOption[] = [];


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
      
      this.reloadCustomers
    });

  }

  handleSelectAll(){
  }

  reloadCustomers(){
    this.dataService.getCustomersByLoyaltyPrograms(this.selectedValues).then((customers: any) => {
      this.customers = customers;

      // Fetch loyalty programs for each customer
      this.customers.forEach(customer => {
        this.getLoyaltyProgramsForCustomer(customer);
      });
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
}
