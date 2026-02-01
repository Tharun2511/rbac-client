"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme, Box } from "@mui/material";

export type DualLineData = {
  date: Date;
  value1: number; // Line 1
  value2: number; // Line 2
};

interface Props {
  data: DualLineData[];
  title?: string;
  height?: number;
  label1?: string;
  label2?: string;
  color1?: string;
  color2?: string;
}

export default function D3DualLineChart({
  data,
  title,
  height = 300,
  label1 = "Series 1",
  label2 = "Series 2",
  color1,
  color2,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  const c1 = color1 || theme.palette.primary.main;
  const c2 = color2 || theme.palette.secondary.main;

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

    // Scale
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, chartWidth]);

    const maxValue = d3.max(data, (d) => Math.max(d.value1, d.value2)) || 0;
    const y = d3.scaleLinear().domain([0, maxValue]).range([chartHeight, 0]);

    // Line Generators
    const line1 = d3
      .line<DualLineData>()
      .curve(d3.curveMonotoneX)
      .x((d) => x(d.date))
      .y((d) => y(d.value1));

    const line2 = d3
      .line<DualLineData>()
      .curve(d3.curveMonotoneX)
      .x((d) => x(d.date))
      .y((d) => y(d.value2));

    // Axes
    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat(d3.timeFormat("%b %d") as any),
      )
      .selectAll("text")
      .style("fill", theme.palette.text.secondary);

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary);

    // Gridlines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(y)
          .tickSize(-chartWidth)
          .tickFormat(() => ""),
      );

    // Draw Lines
    const path1 = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", c1)
      .attr("stroke-width", 3)
      .attr("d", line1);

    const path2 = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", c2)
      .attr("stroke-width", 3)
      .attr("d", line2);

    // Animation
    const l1 = path1.node()?.getTotalLength() || 0;
    path1
      .attr("stroke-dasharray", l1 + " " + l1)
      .attr("stroke-dashoffset", l1)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    const l2 = path2.node()?.getTotalLength() || 0;
    path2
      .attr("stroke-dasharray", l2 + " " + l2)
      .attr("stroke-dashoffset", l2)
      .transition()
      .duration(1500)
      .delay(200)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

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
      .style("color", theme.palette.text.primary)
      .style("border", `1px solid ${theme.palette.divider}`);

    // Interaction Overlay (Points)
    // We'll draw dots for both lines
    [
      { key: "value1", color: c1, label: label1 },
      { key: "value2", color: c2, label: label2 },
    ].forEach((meta) => {
      g.selectAll(`.dot-${meta.key}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y((d as any)[meta.key]))
        .attr("r", 4)
        .attr("fill", theme.palette.background.paper)
        .attr("stroke", meta.color)
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
          d3.select(this).attr("r", 6).attr("fill", meta.color);
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(
            `<strong>${d3.timeFormat("%b %d")(d.date)}</strong><br/>
                     ${meta.label}: ${(d as any)[meta.key]}`,
          );
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          d3.select(this)
            .attr("r", 4)
            .attr("fill", theme.palette.background.paper);
          tooltip.transition().duration(500).style("opacity", 0);
        });
    });

    g.selectAll(".domain").remove();
    return () => {
      tooltip.remove();
    };
  }, [data, height, theme, c1, c2, label1, label2]);

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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        {title && (
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {title}
          </Typography>
        )}
        {/* Legend */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: `2px solid ${c1}`,
              }}
            />
            <Typography variant="caption">{label1}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: `2px solid ${c2}`,
              }}
            />
            <Typography variant="caption">{label2}</Typography>
          </Box>
        </Box>
      </Box>

      <div ref={containerRef} style={{ width: "100%" }}>
        <svg ref={svgRef} />
      </div>
    </Card>
  );
}
