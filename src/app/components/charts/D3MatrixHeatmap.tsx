"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type MatrixHeatmapData = {
  day: string;
  hour: number;
  count: number;
};

interface Props {
  data: MatrixHeatmapData[];
  title?: string;
  height?: number;
}

export default function D3MatrixHeatmap({ data, title, height = 300 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 30, right: 30, bottom: 40, left: 60 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", containerWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X Axis: Hours (0-23)
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const x = d3
      .scaleBand()
      .range([0, chartWidth])
      .domain(hours.map(String))
      .padding(0.05);

    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x).tickValues(["0", "6", "12", "18", "23"]))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary);

    // Y Axis: Days
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const y = d3.scaleBand().range([0, chartHeight]).domain(days).padding(0.05);

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary);

    // Color Scale
    const maxCount = d3.max(data, (d) => d.count) || 1;
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateBlues)
      .domain([0, maxCount]);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", theme.palette.background.paper)
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.1)")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 1000)
      .style("font-family", theme.typography.fontFamily || "sans-serif")
      .style("font-size", "12px")
      .style("color", theme.palette.text.primary)
      .style("border", `1px solid ${theme.palette.divider}`);

    // Cells
    // We need to fill in missing gaps if data is sparse, or just draw available data points?
    // D3 Heatmap usually draws rects for data points.
    // If data is sparse, empty cells won't have rects (transparent).

    g.selectAll(".cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(String(d.hour))!)
      .attr("y", (d) => y(d.day)!)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("fill", theme.palette.action.selected) // Initial generic color
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke", theme.palette.primary.main)
          .attr("stroke-width", 2);

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(
          `<strong>${d.day} @ ${d.hour}:00</strong><br/>
           Activity: ${d.count}`,
        );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "none");
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(800)
      .attr("fill", (d) => colorScale(d.count));

    // Legend
    // Skipping legend for simplicity/space, or add small gradient bar potentially?
    // User requested legend. Let's add a simple text label for "Intensity" or gradient bar.

    // Removing Domain
    g.selectAll(".domain").remove();

    return () => {
      tooltip.remove();
    };
  }, [data, height, theme]);

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
