<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';
import { MultiLineChartComponent } from '../../components/multi-line-chart/multi-line-chart.component'; // ✅ Import Multi-Line Chart Component
=======
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { MultiLineChartComponent } from '../../components/multi-line-chart/multi-line-chart.component';
import { LineChartComponent } from '../../line-chart/line-chart.component';
>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)

@Component({
  selector: 'app-policy',
  standalone: true,
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css'],
  imports: [
    CommonModule, 
<<<<<<< HEAD
   
    MultiLineChartComponent // ✅ Add Multi-Line Chart Component
=======
    LineChartComponent,   // ✅ Must be standalone
    MultiLineChartComponent  // ✅ Must be standalone
>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)
  ]
})
export class PolicyComponent implements OnInit {
  policy: any = null;
  vehicleNumber: string = '';
<<<<<<< HEAD
  activeTab: string = 'overview'; // ✅ Default tab
=======
  activeTab: string = 'overview';
>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)

  constructor(private route: ActivatedRoute, private router: Router, private vehicleService: VehicleService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleNumber = params['vehicleNumber'];
      this.loadPolicyData();
    });
  }

<<<<<<< HEAD
  // ✅ Load Policy Data from VehicleService
  loadPolicyData() {
    this.policy = this.vehicleService.getVehicleData(this.vehicleNumber);
  }

  // ✅ Back to home
=======
  loadPolicyData() {
    this.policy = this.vehicleService.getVehicleData(this.vehicleNumber);
  }
  // ✅ Define isDanger method
  isDanger(vehicle: string): boolean {
    return vehicle?.toUpperCase() === 'MH12AB1234'; // 🚨 Danger case
  }
>>>>>>> 839b472 (Fixed isDanger function in PolicyComponent & improved validation)
  goBack() {
    this.router.navigate(['/']);
  }
}
