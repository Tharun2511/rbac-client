"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type BarData = {
  label: string;
  value: number;
};

interface Props {
  data: BarData[];
  title?: string;
  height?: number;
  color?: string;
}

export default function D3BarChart({
  data,
  title,
  height = 300,
  color,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  const barColor = color || theme.palette.primary.main;

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", containerWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X Scale
    const x = d3
      .scaleBand()
      .range([0, chartWidth])
      .domain(data.map((d) => d.label))
      .padding(0.4);

    // Y Scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([chartHeight, 0]);

    // Bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label)!)
      .attr("y", chartHeight) // Start from bottom
      .attr("width", x.bandwidth())
      .attr("height", 0) // Start with 0 height
      .attr("fill", barColor)
      .attr("rx", 4) // Rounded top corners
      .attr("ry", 4)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => chartHeight - y(d.value));

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

    // Interactivity
    g.selectAll(".bar-overlay")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label)!)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => chartHeight - y(d.value))
      .attr("fill", "transparent")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "rgba(255, 255, 255, 0.1)");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(
          `<strong>${d.label}</strong><br/>
                 Count: ${d.value}`,
        );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "transparent");
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary)
      .style("font-size", "12px");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary)
      .style("font-size", "12px");

    // Gridlines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-chartWidth)
          .tickFormat(() => ""),
      )
      .attr("opacity", 0.1);

    g.selectAll(".domain").remove();

    return () => {
      tooltip.remove();
    };
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
