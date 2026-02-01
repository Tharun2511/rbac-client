import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type LineData = {
  date: Date;
  value: number;
};

interface Props {
  data: LineData[];
  title?: string;
  height?: number;
  width?: number;
  color?: string; // Hex or theme color for the line
}

export default function D3LineChart({
  data,
  title,
  height = 300,
  color,
}: Props) {
  // Use a container ref to get width dynamically
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  const chartColor = color || theme.palette.primary.main;

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    // Get reliable dimensions from container
    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Create main group
    const g = svg
      .attr("width", containerWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X Scale
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, chartWidth]);

    // Y Scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([chartHeight, 0]);

    // Add Gridlines
    const makeYGridlines = () => d3.axisLeft(y).ticks(5);
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        makeYGridlines()
          .tickSize(-chartWidth)
          .tickFormat(() => ""),
      );

    // Line Generator (Smoothed)
    const line = d3
      .line<LineData>()
      .curve(d3.curveCatmullRom) // Smooth curve
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    // Area Generator (for gradient fill under line)
    const area = d3
      .area<LineData>()
      .curve(d3.curveCatmullRom)
      .x((d) => x(d.date))
      .y0(chartHeight)
      .y1((d) => y(d.value));

    // Add Gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", chartColor)
      .attr("stop-opacity", 0.3);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", chartColor)
      .attr("stop-opacity", 0);

    // Draw Area
    g.append("path")
      .datum(data)
      .attr("fill", "url(#line-gradient)")
      .attr("d", area);

    // Draw Line
    const path = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", chartColor)
      .attr("stroke-width", 3)
      .attr("d", line);

    // Animate Line
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // Add Tooltip
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

    // Add Points Group
    const points = g
      .selectAll(".point-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "point-group");

    // Add Visual Dot
    points
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", theme.palette.background.paper)
      .attr("stroke", chartColor)
      .attr("stroke-width", 2)
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .attr("r", 5);

    // Add Interaction Overlay
    points
      .append("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 15) // Larger invisible target
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        // Select the .dot within this group
        d3.select(this.parentNode as Element)
          .select(".dot")
          .attr("r", 8)
          .attr("fill", chartColor)
          .attr("stroke", theme.palette.background.paper);

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(
          `<strong>${d3.timeFormat("%b %d")(d.date)}</strong><br/>
           Value: ${d.value}`,
        );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this.parentNode as Element)
          .select(".dot")
          .attr("r", 5)
          .attr("fill", theme.palette.background.paper)
          .attr("stroke", chartColor);
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add Axes
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat(d3.timeFormat("%b %d") as any),
      )
      .selectAll("text")
      .style("fill", theme.palette.text.secondary)
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary)
      .style("font-size", "12px");

    // Remove axis lines specifically if desired cleaner look
    g.selectAll(".domain").remove();

    return () => {
      tooltip.remove();
    };
  }, [data, height, theme, chartColor]); // Re-run if data/height/theme changes

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
