import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  // ✅ Save vehicle data to LocalStorage (Used in LandingComponent)
  saveVehicleData(vehicleNumber: string) {
    const mockVehicleData = {
      vehicleNumber: vehicleNumber,
      planType: "Comprehensive Insurance",
      make: "Honda",
      model: "CBR 150",
      owner: "John Doe",
      fuelType: "Petrol",
      registrationYear: 2019,
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      coverage: ["Third Party Cover", "Own Damage Cover", "Personal Accident Cover"]
    };

    localStorage.setItem('selectedVehicle', JSON.stringify(mockVehicleData));
  }

  // ✅ Fetch vehicle data from LocalStorage or return Mock Data (Used in PolicyComponent)
  getVehicleData(vehicleNumber: string): any {
    try {
      const vehicleData = localStorage.getItem('selectedVehicle');
      if (vehicleData) {
        return JSON.parse(vehicleData);
      } else {
        return this.getMockPolicyData(vehicleNumber);
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      return this.getMockPolicyData(vehicleNumber);
    }
  }

  // ✅ Mock Data (Used when no JSON data available)
  private getMockPolicyData(vehicleNumber: string) {
    return {
      vehicleNumber: vehicleNumber,
      planType: "Comprehensive Insurance",
      make: "Honda",
      model: "CBR 150",
      owner: "John Doe",
      fuelType: "Petrol",
      registrationYear: 2019,
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      coverage: ["Third Party Cover", "Own Damage Cover", "Personal Accident Cover"]
    };
  }
}
