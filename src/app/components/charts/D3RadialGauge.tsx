"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme, Box } from "@mui/material";

interface Props {
  value: number; // 0 to 100
  title?: string;
  height?: number;
  width?: number;
}

export default function D3RadialGauge({
  value,
  title,
  height = 300,
  width = 300,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    const margin = 10;
    const r = Math.min(width, height) / 2 - margin;
    const centerX = width / 2;
    const centerY = height / 2; // Center completely? Or bottom? Radial gauge is usually top-half circle or full.
    // User requested "Radial gauge", 0->100. Let's do a 180 degree gauge (half circle) or roughly 240 deg.
    // Let's do a standard storage-style gauge (-90 to +90 degrees) or maybe -135 to +135.

    // Let's do -120 to +120 degrees for a nice arc.
    const startAngle = -Math.PI * 0.75;
    const endAngle = Math.PI * 0.75;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr(
        "transform",
        `translate(${centerX}, ${typeof height === "number" ? height * 0.6 : centerY})`,
      ); // Push down slightly

    // Create Gradient for arc (Red -> Yellow -> Green)
    const defs = svg.append("defs");
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "gauge-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", theme.palette.error.main);
    linearGradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", theme.palette.warning.main);
    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", theme.palette.success.main);

    // Background Arc
    const arc = d3
      .arc()
      .innerRadius(r - 20)
      .outerRadius(r)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(10);

    g.append("path")
      .attr("d", arc as any)
      .attr("fill", theme.palette.grey[200]);

    // Value Arc
    // Map value (0-100) to angle (-0.75PI to 0.75PI)
    const valueScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([startAngle, endAngle]);

    // Instead of simple arc, let's use the gradient stroke on the path?
    // Or just fill multiple colored arcs?
    // Let's use the gradient fill on the arc itself?
    // Actually, SVG gradients on arcs are tricky (they are linear relative to bounding box).
    // Premium feel: Segments? Or just use the gradient def we made but it will be linear L-R.
    // For a gauge, L-R gradient Red-Yel-Green works well visually.

    const fgArc = d3
      .arc()
      .innerRadius(r - 20)
      .outerRadius(r)
      .startAngle(startAngle)
      .cornerRadius(10);

    const path = g
      .append("path")
      .datum({ endAngle: startAngle })
      .attr("d", fgArc as any)
      .attr("fill", "url(#gauge-gradient)");

    // Animate Arc
    path
      .transition()
      .duration(1500)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(
          startAngle,
          valueScale(Math.min(value, 100)),
        );
        return function (t) {
          d.endAngle = interpolate(t);
          return fgArc(d as any) || "";
        };
      });

    // Needle
    const needleLen = r - 30;
    const needleG = g
      .append("g")
      .attr("transform", `rotate(${(startAngle * 180) / Math.PI})`); // Start at 0 pos

    needleG
      .append("path")
      .attr("d", `M0 -5 L${needleLen} 0 L0 5 Z`)
      .attr("fill", theme.palette.text.primary);

    needleG
      .append("circle")
      .attr("r", 8)
      .attr("fill", theme.palette.text.primary);

    // Animate Needle
    const targetRot = (valueScale(Math.min(value, 100)) * 180) / Math.PI;
    needleG
      .transition()
      .duration(1500)
      .ease(d3.easeElasticOut)
      .attr("transform", `rotate(${targetRot - 90})`); // Adjust for SVG coordinates (0 is up usually, here we rely on rotation group)
    // Wait, standard rotation: 0 is x-axis (Right).
    // Our arc starts at -135deg (Top Left).
    // Angle from scale is in Radians relative to vertical up? No, D3 arc standard: 0 is Up (12 oclock).
    // Actually d3.arc 0 is 12 oclock.
    // startAngle -0.75PI is roughly -135 deg (Left-Bottom).

    // Needle rotation:
    // We want needle to point to the angle.
    // transform rotate works in degrees clockwise from X-axis? No, usually coordinate system matches.
    // Let's simply recalculate rotation.
    // 0 degrees in rotate() is 3 o'clock.
    // d3.arc 0 is 12 o'clock.
    // So offset is -90 deg.

    needleG
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attrTween("transform", function () {
        const i = d3.interpolate(
          (startAngle * 180) / Math.PI,
          (valueScale(Math.min(value, 100)) * 180) / Math.PI,
        );
        return function (t) {
          return `rotate(${i(t)})`;
        };
      });

    // Text Label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "30px")
      .style("font-size", "2rem")
      .style("font-weight", "bold")
      .style("fill", theme.palette.text.primary)
      .text(0)
      .transition()
      .duration(1500)
      .tween("text", function () {
        const i = d3.interpolateRound(0, value);
        return function (t) {
          this.textContent = i(t) + "%";
        };
      });

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "50px")
      .style("font-size", "0.875rem")
      .style("fill", theme.palette.text.secondary)
      .text("Productivity Score");
  }, [value, width, height, theme]);

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
          sx={{ mb: 2, fontWeight: 600, width: "100%" }}
          color="text.primary"
        >
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
