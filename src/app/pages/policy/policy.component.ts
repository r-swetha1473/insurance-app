import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { MultiLineChartComponent } from '../../components/multi-line-chart/multi-line-chart.component';
import { LineChartComponent } from '../../line-chart/line-chart.component';

@Component({
  selector: 'app-policy',
  standalone: true,
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css'],
  imports: [
    CommonModule, 
    MultiLineChartComponent,// ✅ Add Multi-Line Chart Component
    LineChartComponent,   // ✅ Must be standalone
    MultiLineChartComponent  // ✅ Must be standalone
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

  loadPolicyData() {
    this.policy = this.vehicleService.getVehicleData(this.vehicleNumber);
  }
  // ✅ Define isDanger method
  isDanger(vehicle: string): boolean {
    return vehicle?.toUpperCase() === 'MH12AB1234'; // 🚨 Danger case
  }
 goBack() {
    this.router.navigate(['/']);
  }
}
