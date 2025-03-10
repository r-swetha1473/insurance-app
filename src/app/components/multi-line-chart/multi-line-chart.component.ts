import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isDangerous" class="danger-warning" style="text-align: center; font-size: 18px; font-weight: bold; color: red;">
      🚨 Warning: High G-Force detected! Unsafe driving patterns found.
    </div>
    <div *ngIf="!isDangerous" style="text-align: center; font-size: 18px; font-weight: bold; color: green;">
      ✅ This vehicle is operating within safe limits.
    </div>
    <div #chart></div>
    <div id="toggle-container" style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;"></div>
  `,
  styleUrls: ['./multi-line-chart.component.css']
})
export class MultiLineChartComponent implements AfterViewInit {
  @ViewChild('chart', { static: false }) chartContainer!: ElementRef;

  isDangerous = false;
  private dangerThreshold = 1.5;

  ngAfterViewInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      const response = await fetch('https://vin-tyn8.onrender.com/get-acceleration-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: "VIN1001" })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const jsonData = await response.json();
      if (jsonData && jsonData.data) {
        const formattedData = this.formatData(jsonData.data);
        this.isDangerous = formattedData.some(d => d.gForce >= this.dangerThreshold);
        this.createChart(formattedData);
      } else {
        console.error('Invalid JSON format', jsonData);
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  }

  private formatData(apiData: any[]) {
    return apiData
      .map(d => {
        const parsedDate = d3.timeParse('%Y-%m-%d')(d.date);
        return parsedDate ? { date: parsedDate, xAcc: +d['X-acc'], yAcc: +d['Y-acc'], gForce: +d['G-Force'] } : null;
      })
      .filter(d => d !== null);
  }

  private createChart(data: { date: Date; xAcc: number; yAcc: number; gForce: number }[]) {
    const width = 800, height = 500, margin = { top: 50, right: 50, bottom: 100, left: 60 };

    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();

    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(data, d => Math.min(d.xAcc, d.yAcc, d.gForce))! * 1.2,
        d3.max(data, d => Math.max(d.xAcc, d.yAcc, d.gForce))! * 1.2
      ])
      .range([height - margin.top - margin.bottom, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d: any) => d3.timeFormat('%b %d')(new Date(d))));


    svg.append('g')
      .call(d3.axisLeft(y));

    const colors = { xAcc: '#007bff', yAcc: '#ff4d4d', gForce: 'url(#gradient-gForce)' };

    // ✅ Define a gradient for gForce
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "gradient-gForce")
      .attr("x1", "0%").attr("x2", "0%")
      .attr("y1", "100%").attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "green");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "yellow");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "red");

    const linePaths: any = {};

    Object.entries(colors).forEach(([key, color]) => {
      linePaths[key] = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.8)
        .attr('d', d3.line<{ date: Date; xAcc: number; yAcc: number; gForce: number }>()
          .x(d => x(d.date))
          .y(d => y(d[key as keyof typeof d]))
          .curve(d3.curveMonotoneX)
        );
    });

    // ✅ Create toggle checkboxes
    const toggleContainer = d3.select("#toggle-container");
    Object.entries(colors).forEach(([key, color]) => {
      const toggleDiv = toggleContainer.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '5px');

      const checkbox = toggleDiv.append('input')
        .attr('type', 'checkbox')
        .attr('id', `checkbox-${key}`)
        .style('accent-color', key === 'gForce' ? 'red' : color)
        .property('checked', true)
        .on('change', function () {
          const isChecked = (this as HTMLInputElement).checked;
          linePaths[key].transition().duration(300).style('opacity', isChecked ? 1 : 0);
        });

      toggleDiv.append('label')
        .attr('for', `checkbox-${key}`)
        .text(key)
        .style('color', color)
        .style('font-weight', 'bold');
    });

    // ✅ Danger status message in the chart
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', this.isDangerous ? 'red' : 'green')
      .text(this.isDangerous ? "🚨 Unsafe driving detected!" : "✅ Safe driving detected.");
  }
}
