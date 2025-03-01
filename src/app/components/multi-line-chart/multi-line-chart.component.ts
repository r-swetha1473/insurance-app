import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div #chart></div>`,
  styleUrls: ['./multi-line-chart.component.css']
})
export class MultiLineChartComponent implements AfterViewInit {
  @ViewChild('chart', { static: false }) chartContainer!: ElementRef;

  ngAfterViewInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      const response = await fetch('../output.json');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const jsonData = await response.json();
      if (jsonData && jsonData.data) {
        const formattedData = this.formatData(jsonData.data);
        this.createChart(formattedData);
      } else {
        console.error('Invalid JSON format', jsonData);
      }
    } catch (error) {
      console.error('Error loading JSON file:', error);
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
    const width = 600, height = 500, margin = { top: 50, right: 50, bottom: 80, left: 50 };

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

    const colors = { xAcc: '#007bff', yAcc: '#ff4d4d', gForce: '#28a745' };

    const line = (key: keyof typeof colors) => d3.line<{ date: Date; xAcc: number; yAcc: number; gForce: number }>()
      .x(d => x(d.date))
      .y(d => y(d[key]))
      .curve(d3.curveMonotoneX);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d) => d3.timeFormat('%b %d')(d as Date)));

    svg.append('g')
      .call(d3.axisLeft(y));

    Object.keys(colors).forEach(key => {
      svg.append('path')
        .datum(data)
        .attr('class', `line line-${key}`)
        .attr('fill', 'none')
        .attr('stroke', colors[key as keyof typeof colors])
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.7)
        .attr('d', line(key as keyof typeof colors));
    });

    const tooltip = d3.select(this.chartContainer.nativeElement)
      .append('div')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('display', 'none');

    Object.keys(colors).forEach(key => {
      svg.selectAll(`.dot-${key}`)
        .data(data.filter((_, i) => i % 10 === 0))
        .enter()
        .append('circle')
        .attr('class', `dot dot-${key}`)
        .attr('cx', d => x(d.date))
        .attr('cy', d => isNaN(d[key as keyof typeof colors]) ? null : y(d[key as keyof typeof colors]))
        .attr('r', 4)
        .attr('fill', colors[key as keyof typeof colors])
        .on('mouseover', function (event, d) {
          let tooltipContent = `Date: ${d3.timeFormat('%Y-%m-%d')(d.date)}<br>`;
          if (!isNaN(d.xAcc)) tooltipContent += `X-acc: ${d.xAcc}<br>`;
          if (!isNaN(d.yAcc)) tooltipContent += `Y-acc: ${d.yAcc}<br>`;
          if (!isNaN(d.gForce)) tooltipContent += `G-Force: ${d.gForce}`;

          tooltip.style('display', 'block')
            .html(tooltipContent)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY + 10}px`);

          svg.selectAll('path')
            .transition().duration(200)
            .style('opacity', 0.2);

          svg.select(`.line-${key}`)
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on('mouseout', function () {
          tooltip.style('display', 'none');

          svg.selectAll('path')
            .transition().duration(200)
            .style('opacity', 1.7);
        });
    });
  }
}
