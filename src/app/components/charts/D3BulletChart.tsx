import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type BulletData = {
  title: string;
  subtitle: string;
  ranges: number[]; // e.g. [bad, satisfactory, good]
  measures: number[]; // e.g. [actual value]
  markers: number[]; // e.g. [target or average value]
};

interface Props {
  data: BulletData[];
  title?: string;
  height?: number;
}

export default function D3BulletChart({ data, title, height = 150 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 20, right: 30, bottom: 40, left: 120 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight =
      Math.max(height, data.length * 60) - margin.top - margin.bottom;
    const totalHeight = chartHeight + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", containerWidth)
      .attr("height", totalHeight)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create a group for each bullet item
    const rowHeight = chartHeight / data.length;

    const bulletGroup = g
      .selectAll(".bullet")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * rowHeight})`);

    // Draw text (title and subtitle)
    bulletGroup
      .append("text")
      .attr("class", "title")
      .attr("text-anchor", "end")
      .attr("x", -15)
      .attr("y", rowHeight / 3)
      .style("font-size", "14px")
      .style("font-weight", 600)
      .style("fill", theme.palette.text.primary)
      .text((d) => d.title);

    bulletGroup
      .append("text")
      .attr("class", "subtitle")
      .attr("text-anchor", "end")
      .attr("x", -15)
      .attr("y", rowHeight / 3 + 15)
      .style("font-size", "12px")
      .style("fill", theme.palette.text.secondary)
      .text((d) => d.subtitle);

    bulletGroup.each(function (d) {
      const gItem = d3.select(this);
      const maxVal =
        Math.max(d.ranges[d.ranges.length - 1], d.measures[0], d.markers[0]) ||
        1;

      const x = d3.scaleLinear().domain([0, maxVal]).range([0, chartWidth]);

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
        .style("font-size", "12px");

      // Background ranges (Good, Satisfactory, Bad)
      const rangeColors =
        theme.palette.mode === "dark"
          ? ["#334155", "#475569", "#64748b"]
          : ["#cbd5e1", "#e2e8f0", "#f1f5f9"];
      const sortedRanges = [...d.ranges].sort((a, b) => b - a); // Draw largest first

      sortedRanges.forEach((r, i) => {
        gItem
          .append("rect")
          .attr("class", "range")
          .attr("width", x(r))
          .attr("height", rowHeight * 0.6)
          .attr("y", 0)
          .style("fill", rangeColors[i % rangeColors.length]);
      });

      // Measures (Actual value)
      gItem
        .append("rect")
        .attr("class", "measure")
        .attr("width", 0)
        .attr("height", rowHeight * 0.2)
        .attr("y", rowHeight * 0.2)
        .style("fill", theme.palette.primary.main)
        .on("mouseover", function (event) {
          tooltip.transition().style("opacity", 1);
          tooltip
            .html(`<strong>Actual:</strong> ${d.measures[0]}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", () => tooltip.transition().style("opacity", 0))
        .transition()
        .duration(1000)
        .attr("width", x(d.measures[0]));

      // Markers (Target/Average)
      gItem
        .append("line")
        .attr("class", "marker")
        .attr("x1", x(d.markers[0]))
        .attr("x2", x(d.markers[0]))
        .attr("y1", rowHeight * 0.1)
        .attr("y2", rowHeight * 0.5)
        .style("stroke", theme.palette.error.main)
        .style("stroke-width", "3px")
        .on("mouseover", function (event) {
          tooltip.transition().style("opacity", 1);
          tooltip
            .html(`<strong>Target/Avg:</strong> ${d.markers[0]}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", () => tooltip.transition().style("opacity", 0));

      // Draw Axis for this bullet
      const xAxis = gItem
        .append("g")
        .attr("transform", `translate(0, ${rowHeight * 0.6})`)
        .call(d3.axisBottom(x).ticks(5))
        .selectAll("text")
        .style("fill", theme.palette.text.secondary);
      gItem.selectAll(".domain").remove();
    });
  }, [data, height, theme]);

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        pt: 4,
        height: "100%",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {title && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      <div ref={containerRef} style={{ width: "100%" }}>
        <svg ref={svgRef} />
      </div>
    </Card>
  );
}
