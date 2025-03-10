import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="safety-message" style="text-align: center; font-size: 18px; font-weight: bold;"></div>
    <div #chart></div>
  `,
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('chart', { static: false }) chartContainer!: ElementRef;
  private csvDataUrl = '/assets/train_motion_data.csv';

  ngAfterViewInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      const response = await fetch(this.csvDataUrl);
      const text = await response.text();
      const parsedData = d3.csvParse(text, d => ({
        date: new Date(+d['Timestamp']),
        xAcc: +d['AccX'],
        yAcc: +d['AccY'],
        zAcc: +d['AccZ'],
        class: d['Class']
      }));

      const safeData = parsedData.filter(d => d.class === 'NORMAL');
      this.checkSafeDriving(safeData);
      this.createChart(safeData);
    } catch (error) {
      console.error('Error loading CSV data:', error);
    }
  }

  private checkSafeDriving(data: { xAcc: number; yAcc: number; zAcc: number }[]) {
    const threshold = 5; // Adjust threshold for safe driving
    const unsafe = data.some(d => Math.abs(d.xAcc) > threshold || Math.abs(d.yAcc) > threshold || Math.abs(d.zAcc) > threshold);
    
    const messageDiv = d3.select('#safety-message');
    if (unsafe) {
      messageDiv.style('color', 'red').text('⚠️ Warning: Unsafe driving detected!');
    } else {
      messageDiv.style('color', 'green').text('✅ This vehicle is operating within safe limits.');
    }
  }

  private createChart(data: { date: Date; xAcc: number; yAcc: number; zAcc: number }[]) {
    const width = 800, height = 500, margin = { top: 50, right: 50, bottom: 100, left: 60 };

    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(data, d => Math.min(d.xAcc, d.yAcc, d.zAcc))! * 1.2,
        d3.max(data, d => Math.max(d.xAcc, d.yAcc, d.zAcc))! * 1.2
      ])
      .range([height - margin.top - margin.bottom, 0]);

    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // **Gradient for Hue Effect**
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "lineGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "green");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "blue");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "orange");

    // **X-Axis**
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d: any) => d3.timeFormat('%H:%M:%S')(new Date(d))));

    // **Y-Axis**
    svg.append('g').call(d3.axisLeft(y));

    // **Tooltip**
    const tooltip = d3.select(this.chartContainer.nativeElement)
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("display", "none")
      .style("pointer-events", "none");

    // **Line Plot**
    const line = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', "url(#lineGradient)")
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0.9)
      .attr('d', d3.line<{ date: Date; xAcc: number; yAcc: number; zAcc: number }>()
        .x(d => x(d.date))
        .y(d => y((d.xAcc + d.yAcc + d.zAcc) / 3))
        .curve(d3.curveMonotoneX)
      );

    // **Add Circles for Hover Effect**
    svg.selectAll("circle")
      .data(data)
      
      .attr("cx", d => x(d.date))
      .attr("cy", d => y((d.xAcc + d.yAcc + d.zAcc) / 3))
      .attr("r", 4)
     
      .style("opacity", 0.7)
    
  }
}
