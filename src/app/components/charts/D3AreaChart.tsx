import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type AreaData = {
  date: Date;
  value: number;
};

interface Props {
  data: AreaData[];
  title?: string;
  height?: number;
  color?: string;
}

export default function D3AreaChart({
  data,
  title,
  height = 300,
  color,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  const chartColor = color || theme.palette.primary.main;

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

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, chartWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([chartHeight, 0]);

    // Gridlines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-chartWidth)
          .tickFormat(() => ""),
      );

    // Area Generator
    const area = d3
      .area<AreaData>()
      .curve(d3.curveMonotoneX)
      .x((d) => x(d.date))
      .y0(chartHeight)
      .y1((d) => y(d.value));

    const line = d3
      .line<AreaData>()
      .curve(d3.curveMonotoneX)
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", chartColor)
      .attr("stop-opacity", 0.6);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", chartColor)
      .attr("stop-opacity", 0.05);

    // Draw Area with transition
    const pathArea = g
      .append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr(
        "d",
        d3
          .area<AreaData>()
          .curve(d3.curveMonotoneX)
          .x((d) => x(d.date))
          .y0(chartHeight)
          .y1(chartHeight),
      )
      .transition()
      .duration(1000)
      .attr("d", area);

    // Draw Line
    const pathLine = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", chartColor)
      .attr("stroke-width", 3)
      .attr("d", line);

    const totalLength = pathLine.node()?.getTotalLength() || 0;
    pathLine
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
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
      .style("border", `1px solid ${theme.palette.divider}`);

    // Focus overlay for tooltip
    const focus = g.append("g").style("display", "none");
    focus.append("circle").attr("r", 5).attr("fill", chartColor);
    focus
      .append("line")
      .attr("stroke", theme.palette.divider)
      .attr("stroke-dasharray", "3,3")
      .attr("y1", 0)
      .attr("y2", chartHeight);

    g.append("rect")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => {
        focus.style("display", "none");
        tooltip.style("opacity", 0);
      })
      .on("mousemove", (event) => {
        const x0 = x.invert(d3.pointer(event)[0]);
        const bisect = d3.bisector((d: AreaData) => d.date).left;
        const i = bisect(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        if (!d0 || !d1) return;
        const d =
          x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime()
            ? d1
            : d0;

        focus.attr("transform", `translate(${x(d.date)},${y(d.value)})`);
        focus
          .select("line")
          .attr("y1", chartHeight - y(d.value))
          .attr("y2", 0);

        tooltip.transition().duration(50).style("opacity", 1);
        tooltip
          .html(
            `<strong>${d3.timeFormat("%b %d")(d.date)}</strong><br/>Value: ${d.value}`,
          )
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px");
      });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
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
    g.selectAll(".domain").remove();

    return () => {
      tooltip.remove();
    };
  }, [data, height, theme, chartColor]);

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
