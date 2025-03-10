import { Component } from '@angular/core';
<<<<<<< HEAD
import { FormsModule } from '@angular/forms'; 
=======
import { FormsModule } from '@angular/forms';
>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service'; // ✅ Import VehicleService

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
<<<<<<< HEAD
  imports: [FormsModule, CommonModule] // ✅ Add FormsModule for two-way binding
=======
  imports: [FormsModule, CommonModule], // ✅ Import FormsModule for two-way binding
>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)
})
export class LandingComponent {
  vehicleNumber: string = ''; // ✅ Define vehicleNumber
  errorMessage: string = ''; // ✅ Error message state

  constructor(private vehicleService: VehicleService, private router: Router) {}

  searchVehicle() {
    const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
<<<<<<< HEAD
  
=======

>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)
    if (!this.vehicleNumber.trim()) {
      this.errorMessage = '❌ Please enter a vehicle number.';
      return;
    }
<<<<<<< HEAD
  
=======

>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)
    if (!vehicleRegex.test(this.vehicleNumber.toUpperCase())) {
      this.errorMessage = '❌ Invalid format. Use format: MH12AB1234';
      return;
    }
<<<<<<< HEAD
  
    this.errorMessage = ''; // Clear the error if valid
    
    // ✅ Store the JSON object dynamically in localStorage
    this.vehicleService.saveVehicleData(this.vehicleNumber);
  
    // ✅ Navigate to policy page with vehicle number
    this.router.navigate([`/policy/${this.vehicleNumber}`]);
  }
  
=======

    this.errorMessage = ''; // ✅ Clear error if valid

    const formattedVehicleNumber = this.vehicleNumber.toUpperCase(); // ✅ Ensure uppercase

    // ✅ Store the vehicle number in localStorage via VehicleService
    this.vehicleService.saveVehicleData(formattedVehicleNumber);

    // ✅ Navigate to policy page with vehicle number
    this.router.navigate([`/policy/${formattedVehicleNumber}`]);
  }

  // ✅ Function to determine if the vehicle is "Dangerous"
  isDanger(vehicle: string): boolean {
    return vehicle.toUpperCase() === 'MH12AB1234'; // 🚨 Danger case
  }
>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)
}
