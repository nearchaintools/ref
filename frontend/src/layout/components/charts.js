import * as React from "react";
import { useRef } from "react";

import { Sparklines, SparklinesBars, SparklinesLine } from "react-sparklines";
import { Bar, Chart } from "react-chartjs-2";

// SparkLines not used, it doesn't have tooltip
const drawChart = ({ eraPrefHistory }) => {
  const data = eraPrefHistory.map((item) => item.commission);
  return (
    <Sparklines data={data} limit={10} width={120} height={50} margin={2}>
      <SparklinesBars
        style={{ stroke: "white", strokeWidth: "1", fill: "#40c0f5" }}
      />
    </Sparklines>
  );
};

// not used
const tooltipPlugin = Chart.registry.getPlugin("tooltip");
tooltipPlugin.positioners.bottom = function (elements, eventPosition) {
  const tooltip = this;
  const pos = tooltipPlugin.positioners.average(elements);
  if (pos === false) {
    return false;
  }
  return {
    x: pos.x,
    y: this._chart.chartArea.bottom,
  };
};

export const ReactChart = React.memo(({ record }) => {
  const { account } = record;

  const eraPrefHistory = account?.eraValidators;

  const chartRef = useRef();
  if (!eraPrefHistory) return <React.Fragment></React.Fragment>;

  // if (chartRef.current) {
  //   const chart = Chart.getChart(record.id);
  //   const chart2 = chartRef.current;  // same as before
  //   chart.tooltip.x = 100;
  //   chart.tooltip.y = -100;
  //   chart.update();
  // }

  const commissions = eraPrefHistory.map((item) => item.commission);
  const eras = eraPrefHistory.map((item) => item.eraIndex);
  const backgroundColor = commissions.map((item) => {
    if (item <= 10) {
      return "rgb(54, 162, 235)";
    } else if (item > 10 && item <= 20) {
      return "orange";
    } else {
      return "red";
    }
  });
  const chartData = {
    labels: eras,
    datasets: [
      {
        type: "bar",
        label: false,
        backgroundColor,
        data: commissions,
        borderColor: "white",
        borderWidth: 1,
        base: 0,
      },
    ],
  };

  const getOrCreateTooltip = (chart) => {
    //let tooltipEl = chart.canvas.parentNode.querySelector("div");
    let commisionCell = chart.canvas.parentElement.parentElement;
    commisionCell.style.position = "relative";
    let tooltipEl = commisionCell.querySelector("div");

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.id = "commission-tooltip";
      tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
      tooltipEl.style.borderRadius = "3px";
      tooltipEl.style.color = "white";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .1s ease";

      const table = document.createElement("table");
      table.style.margin = "0px";

      tooltipEl.appendChild(table);
      //chart.canvas.parentNode.appendChild(tooltipEl);
      commisionCell.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b) => b.lines);

      const tableHead = document.createElement("thead");

      titleLines.forEach((title) => {
        const tr = document.createElement("tr");
        tr.style.borderWidth = 0;

        const th = document.createElement("th");
        th.style.borderWidth = 0;
        const text = document.createTextNode(title);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });

      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];

        const span = document.createElement("span");
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = "2px";
        span.style.marginRight = "10px";
        span.style.height = "10px";
        span.style.width = "10px";
        span.style.display = "inline-block";

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;

        const td = document.createElement("td");
        td.style.borderWidth = 0;

        const text = document.createTextNode(body);

        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector("table");

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    // tooltipEl.style.left = positionX + tooltip.caretX + "px";
    // tooltipEl.style.top = positionY + tooltip.caretY + "px";
    tooltipEl.style.left = "0px";
    tooltipEl.style.top = "10px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding =
      tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };

  const options = {
    maintainAspectRatio: false,
    responsive: false,
    layout: {
      padding: 5,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: "bottom",
        external: externalTooltipHandler,
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
  };
  return (
    <Bar
      id={record.id}
      data={chartData}
      options={options}
      width={100}
      height={26}
      ref={chartRef}
    />
  );
});
