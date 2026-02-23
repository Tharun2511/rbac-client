import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type RadarDataSeries = {
  name: string;
  color?: string;
  items: { axis: string; value: number }[];
};

interface Props {
  data: RadarDataSeries[];
  title?: string;
  height?: number;
}

export default function D3RadarChart({ data, title, height = 400 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = Math.min(containerWidth, height) - margin.left - margin.right;
    const radius = Math.min(width, width) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", containerWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${containerWidth / 2}, ${height / 2})`);

    const features = data[0].items.map((i) => i.axis);
    const angleSlice = (Math.PI * 2) / features.length;

    // Find max value across all series
    let maxVal = 0;
    data.forEach((s) =>
      s.items.forEach((i) => {
        if (i.value > maxVal) maxVal = i.value;
      }),
    );
    const maxValue = maxVal || 10;

    const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    // Draw circular grid and labels
    const axisGrid = g.append("g").attr("class", "axisWrapper");
    const levels = 4;
    for (let j = 0; j < levels; j++) {
      const levelFactor = radius * ((j + 1) / levels);
      axisGrid
        .append("circle")
        .attr("r", levelFactor)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", 0.05);

      axisGrid
        .append("text")
        .attr("y", -levelFactor)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(((maxValue * (j + 1)) / levels).toFixed(0));
    }

    // Draw axis lines and labels
    const axis = axisGrid
      .selectAll(".axis")
      .data(features)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr(
        "x2",
        (d, i) =>
          rScale(maxValue * 1.05) * Math.cos(angleSlice * i - Math.PI / 2),
      )
      .attr(
        "y2",
        (d, i) =>
          rScale(maxValue * 1.05) * Math.sin(angleSlice * i - Math.PI / 2),
      )
      .attr("class", "line")
      .style("stroke", "#e5e7eb")
      .style("stroke-width", "1px");

    axis
      .append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("fill", theme.palette.text.secondary)
      .attr("dy", "0.35em")
      .attr(
        "x",
        (d, i) =>
          rScale(maxValue * 1.2) * Math.cos(angleSlice * i - Math.PI / 2),
      )
      .attr(
        "y",
        (d, i) =>
          rScale(maxValue * 1.2) * Math.sin(angleSlice * i - Math.PI / 2),
      )
      .text((d) => d);

    const radarLine = d3
      .lineRadial<{ axis: string; value: number }>()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    // Draw radar areas
    const defaultColors = [
      theme.palette.primary.main,
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
    ];

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

    data.forEach((series, idx) => {
      const color = series.color || defaultColors[idx % defaultColors.length];

      const radarWrapper = g.append("g").attr("class", "radarWrapper");

      radarWrapper
        .append("path")
        .datum(series.items)
        .attr("class", "radarArea")
        .attr("d", radarLine)
        .style("fill", color)
        .style("fill-opacity", 0.3)
        .on("mouseover", function () {
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.1);
          d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
        })
        .on("mouseout", function () {
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.3);
        });

      radarWrapper
        .append("path")
        .datum(series.items)
        .attr("class", "radarStroke")
        .attr("d", radarLine)
        .style("stroke-width", 2)
        .style("stroke", color)
        .style("fill", "none");

      radarWrapper
        .selectAll(".radarCircle")
        .data(series.items)
        .enter()
        .append("circle")
        .attr("class", "radarCircle")
        .attr("r", 4)
        .attr(
          "cx",
          (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2),
        )
        .attr(
          "cy",
          (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2),
        )
        .style("fill", color)
        .style("fill-opacity", 0.8)
        .on("mouseover", function (event, d) {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html(`<strong>${series.name}</strong><br/>${d.axis}: ${d.value}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () =>
          tooltip.transition().duration(200).style("opacity", 0),
        );
    });

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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      <div
        ref={containerRef}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <svg ref={svgRef} />
      </div>
    </Card>
  );
}
