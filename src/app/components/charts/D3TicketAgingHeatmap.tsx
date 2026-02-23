import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, Typography, useTheme } from "@mui/material";

export type HeatmapData = {
  priority: string;
  ageBucket: string;
  count: number;
};

interface Props {
  data: HeatmapData[];
  title?: string;
  height?: number;
}

export default function D3TicketAgingHeatmap({
  data,
  title,
  height = 300,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 30, right: 30, bottom: 40, left: 80 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", containerWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Extract unique values
    const priorities = ["URGENT", "HIGH", "MEDIUM", "LOW"];
    const prioritiesPresent = Array.from(new Set(data.map((d) => d.priority)));
    const yDomain = priorities.filter((p) => prioritiesPresent.includes(p));
    // If none match exact standard, fallback to actual data
    if (yDomain.length === 0) {
      yDomain.push(...prioritiesPresent);
    }

    const ageBuckets = ["0-2 days", "3-7 days", "7+ days"];
    const xDomain = Array.from(new Set(data.map((d) => d.ageBucket))).sort(
      (a, b) => ageBuckets.indexOf(a) - ageBuckets.indexOf(b),
    );

    // X Scale
    const x = d3
      .scaleBand()
      .range([0, chartWidth])
      .domain(xDomain)
      .padding(0.05);

    // Y Scale
    const y = d3
      .scaleBand()
      .range([0, chartHeight])
      .domain(yDomain)
      .padding(0.05);

    // Color Scale - using warning/error palette
    const maxCount = d3.max(data, (d) => d.count) || 1;
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateOranges) // Use oranges/reds for ticket aging urgency
      .domain([0, maxCount]);

    // Add Axes
    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary)
      .style("font-size", "12px");
    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", theme.palette.text.secondary)
      .style("font-size", "12px");
    g.selectAll(".domain").remove();

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

    // Draw cells
    g.selectAll(".cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.ageBucket) || 0)
      .attr("y", (d) => y(d.priority) || 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("fill", theme.palette.action.selected)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke", theme.palette.text.primary)
          .attr("stroke-width", 2);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `<strong>${d.priority}</strong> priority<br/><strong>${d.ageBucket}</strong> old<br/>Tickets: ${d.count}`,
          )
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

    // Add labels inside cells
    g.selectAll(".cell-label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => (x(d.ageBucket) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => (y(d.priority) || 0) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d) => d.count || "")
      .style("fill", (d) =>
        d.count > maxCount * 0.5 ? "#fff" : theme.palette.text.primary,
      )
      .style("font-size", "14px")
      .style("font-weight", 600)
      .style("pointer-events", "none")
      .style("opacity", 0)
      .transition()
      .delay(400)
      .duration(800)
      .style("opacity", 1);

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
      <div ref={containerRef} style={{ width: "100%" }}>
        <svg ref={svgRef} />
      </div>
    </Card>
  );
}
