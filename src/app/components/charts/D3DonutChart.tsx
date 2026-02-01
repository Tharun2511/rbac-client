"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Box, Typography, useTheme } from "@mui/material";

export type DonutData = {
  label: string;
  value: number;
  color: string;
};

interface Props {
  data: DonutData[];
  title?: string;
  height?: number;
  width?: number;
}

export default function D3DonutChart({
  data,
  title,
  height = 300,
  width = 300,
}: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<DonutData>()
      .value((d) => d.value)
      .sort(null);
    const data_ready = pie(data);

    // Arc generator
    const arc = d3
      .arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(radius * 0.6) // This creates the donut hole
      .outerRadius(radius);

    // Hover arc generator (slightly larger)
    const arcHover = d3
      .arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 1.05);

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

    // Total Value
    const total = d3.sum(data, (d) => d.value);

    // Center Text Group
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", theme.palette.text.primary)
      .text(total);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .style("font-size", "14px")
      .style("fill", theme.palette.text.secondary)
      .text("Total");

    // Draw arcs
    g.selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", theme.palette.background.paper)
      .style("stroke-width", "2px")
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", (t) => arcHover(t as d3.PieArcDatum<DonutData>));

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(
          `<div style="display: flex; align-items: center; gap: 8px;">
             <span style="width: 8px; height: 8px; border-radius: 50%; background: ${d.data.color};"></span>
             <strong>${d.data.label}</strong>
             <span>${d.data.value}</span>
           </div>`,
        );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", (t) => arc(t as d3.PieArcDatum<DonutData>));
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, [data, height, width, theme]);

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{ width: "100%", mb: 2, fontWeight: 600 }}
          color="text.primary"
        >
          {title}
        </Typography>
      )}
      <Box sx={{ position: "relative" }}>
        <svg
          ref={ref}
          width={width}
          height={height}
          style={{ overflow: "visible" }}
        />
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          mt: 3,
        }}
      >
        {data.map((item) => (
          <Box
            key={item.label}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: item.color,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {item.label} (
              {Math.round((item.value / d3.sum(data, (d) => d.value)) * 100)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
