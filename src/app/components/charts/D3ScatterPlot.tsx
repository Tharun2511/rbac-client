import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type ScatterData = {
  id: string;
  label: string;
  x: number; // e.g. Avg Resolution Time
  y: number; // e.g. Volume/Tickets
  z: number; // e.g. Agents (Bubble size)
};

interface Props {
  data: ScatterData[];
  title?: string;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}

export default function D3ScatterPlot({
  data,
  title,
  height = 400,
  xLabel = "X-Axis",
  yLabel = "Y-Axis",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
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
    const xMax = d3.max(data, (d) => d.x) || 10;
    const x = d3
      .scaleLinear()
      .domain([0, xMax * 1.1])
      .range([0, chartWidth]);

    // Y Scale
    const yMax = d3.max(data, (d) => d.y) || 10;
    const y = d3
      .scaleLinear()
      .domain([0, yMax * 1.1])
      .range([chartHeight, 0]);

    // Z Scale (Bubble Size)
    const zMax = d3.max(data, (d) => d.z) || 10;
    const z = d3.scaleLinear().domain([0, zMax]).range([4, 25]);

    // Color Scale
    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

    // Gridlines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.05)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-chartWidth)
          .tickFormat(() => ""),
      );
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.05)
      .attr("transform", `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickSize(-chartHeight)
          .tickFormat(() => ""),
      );

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
      .style("font-size", "12px")
      .style("border", `1px solid ${theme.palette.divider}`);

    // Bubbles
    g.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 0)
      .style("fill", (d, i) => colorScale(i.toString()))
      .style("opacity", 0.8)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .style("opacity", 1)
          .attr("stroke", theme.palette.primary.main);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(
          `<strong>${d.label}</strong><br/>${xLabel}: ${d.x}<br/>${yLabel}: ${d.y}<br/>Agents: ${d.z}`,
        );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.8).attr("stroke", "white");
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr("r", (d) => z(d.z));

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary);
    g.append("text")
      .attr("text-anchor", "end")
      .attr("x", chartWidth)
      .attr("y", chartHeight + 40)
      .text(xLabel)
      .style("fill", theme.palette.text.secondary)
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary);
    g.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", 0)
      .text(yLabel)
      .style("fill", theme.palette.text.secondary)
      .style("font-size", "12px");

    g.selectAll(".domain").remove();

    return () => {
      tooltip.remove();
    };
  }, [data, height, theme, xLabel, yLabel]);

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
