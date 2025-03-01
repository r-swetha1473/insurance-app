import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service'; // ✅ Import VehicleService

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  imports: [FormsModule, CommonModule] // ✅ Add FormsModule for two-way binding
})
export class LandingComponent {
  vehicleNumber: string = ''; // ✅ Define vehicleNumber
  errorMessage: string = ''; // ✅ Error message state

  constructor(private vehicleService: VehicleService, private router: Router) {}

  searchVehicle() {
    const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
  
    if (!this.vehicleNumber.trim()) {
      this.errorMessage = '❌ Please enter a vehicle number.';
      return;
    }
  
    if (!vehicleRegex.test(this.vehicleNumber.toUpperCase())) {
      this.errorMessage = '❌ Invalid format. Use format: MH12AB1234';
      return;
    }
  
    this.errorMessage = ''; // Clear the error if valid
    
    // ✅ Store the JSON object dynamically in localStorage
    this.vehicleService.saveVehicleData(this.vehicleNumber);
  
    // ✅ Navigate to policy page with vehicle number
    this.router.navigate([`/policy/${this.vehicleNumber}`]);
  }
  
}
