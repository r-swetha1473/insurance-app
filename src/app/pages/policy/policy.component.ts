import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';
import { MultiLineChartComponent } from '../../components/multi-line-chart/multi-line-chart.component'; // ✅ Import Multi-Line Chart Component

@Component({
  selector: 'app-policy',
  standalone: true,
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css'],
  imports: [
    CommonModule, 
   
    MultiLineChartComponent // ✅ Add Multi-Line Chart Component
  ]
})
export class PolicyComponent implements OnInit {
  policy: any = null;
  vehicleNumber: string = '';
  activeTab: string = 'overview'; // ✅ Default tab

  constructor(private route: ActivatedRoute, private router: Router, private vehicleService: VehicleService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleNumber = params['vehicleNumber'];
      this.loadPolicyData();
    });
  }

  // ✅ Load Policy Data from VehicleService
  loadPolicyData() {
    this.policy = this.vehicleService.getVehicleData(this.vehicleNumber);
  }

  // ✅ Back to home
  goBack() {
    this.router.navigate(['/']);
  }
}
