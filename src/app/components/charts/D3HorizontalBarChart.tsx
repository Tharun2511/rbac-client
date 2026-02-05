"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type HorizontalBarData = {
  label: string;
  value: number;
};

interface Props {
  data: HorizontalBarData[];
  title?: string;
  height?: number;
  color?: string;
}

export default function D3HorizontalBarChart({
  data,
  title,
  height = 300,
  color,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  const barColor = color || theme.palette.info.main;

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 20, right: 60, bottom: 20, left: 140 }; // Increased margins for labels
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", containerWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Y Scale
    const y = d3
      .scaleBand()
      .range([0, chartHeight])
      .domain(data.map((d) => d.label))
      .padding(0.3);

    // X Scale
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([0, chartWidth]);

    // Bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => y(d.label)!)
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", barColor)
      .attr("rx", 4)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("width", (d) => x(d.value));

    // Value Labels inside/outside bars
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d) => y(d.label)! + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text((d) => `${d.value.toFixed(1)} days`)
      .style("font-size", "12px")
      .style("fill", theme.palette.text.secondary)
      .attr("opacity", 0)
      .transition()
      .delay(800)
      .duration(500)
      .attr("opacity", 1);

    // Axes
    g.append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .style("font-size", "13px")
      .style("font-weight", "500")
      .style("fill", theme.palette.text.primary);

    // Gridlines
    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickSize(-chartHeight)
          .tickFormat(() => ""),
      )
      .attr("opacity", 0.1);

    g.selectAll(".domain").remove();
  }, [data, height, theme, barColor]);

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600 }}
          color="text.primary"
        >
          {title}
        </Typography>
      )}
      <div ref={containerRef} style={{ width: "100%" }}>
        <svg ref={svgRef} />
      </div>
    </Card>
  );
}
