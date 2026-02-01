"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type HeatmapData = {
  range: string;
  count: number;
};

interface Props {
  data: HeatmapData[];
  title?: string;
  height?: number;
  baseColor?: string; // e.g. "red" or "blue" or hex
}

export default function D3Heatmap({
  data,
  title,
  height = 300,
  baseColor = "red",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", containerWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // We can interpret the data basically as 3 buckets
    // For visual appeal, maybe we make them blocks?

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.range))
      .range([0, chartWidth])
      .padding(0.05);

    const maxCount = d3.max(data, (d) => d.count) || 1;

    // Pick interpolator
    let interpolator = d3.interpolateReds;
    if (baseColor === "blue") interpolator = d3.interpolateBlues;
    if (baseColor === "green") interpolator = d3.interpolateGreens;

    // Color scale for heat
    const colorScale = d3
      .scaleSequential()
      .interpolator(interpolator)
      .domain([0, maxCount]);

    // Draw Blocks
    g.selectAll(".block")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.range)!)
      .attr("y", 0)
      .attr("width", x.bandwidth())
      .attr("height", chartHeight)
      .attr("rx", 8)
      .attr("fill", (d) => theme.palette.error.light) // Start light
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .delay((_, i) => i * 200)
      .attr("opacity", 1)
      .attr("fill", (d) => colorScale(d.count));

    // Labels
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.range)! + x.bandwidth() / 2)
      .attr("y", chartHeight / 2)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-weight", "bold")
      .style("font-size", "16px")
      .style("text-shadow", "0 2px 4px rgba(0,0,0,0.3)")
      .text((d) => d.count);

    g.selectAll(".sub-label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.range)! + x.bandwidth() / 2)
      .attr("y", chartHeight + 20)
      .attr("text-anchor", "middle")
      .style("fill", theme.palette.text.primary)
      .style("font-size", "14px")
      .text((d) => d.range);
  }, [data, height, theme, baseColor]);

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
