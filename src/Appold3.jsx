import React, { useMemo, useState } from "react";

const periods = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const rawInputDefinitions = [
  { key: "shifts", label: "Shifts Worked", suffix: "", decimals: 0, minimum: 1 },
  { key: "availability", label: "Telephone Availability", suffix: "%", decimals: 0, minimum: 0 },
  { key: "resolvesTotal", label: "Resolves", suffix: "", decimals: 0, minimum: 0 },
  { key: "ftfTotal", label: "FTF", suffix: "", decimals: 0, minimum: 0 },
  { key: "touchesTotal", label: "Ticket Touches", suffix: "", decimals: 0, minimum: 0 },
  { key: "csat", label: "CSAT %", suffix: "%", decimals: 0, minimum: 0 },
  { key: "fiveStarTotal", label: "Customer Recognition Count", suffix: "", decimals: 0, minimum: 0 },
  { key: "mttu", label: "Mean Time to Update", suffix: " hrs", decimals: 1, minimum: 0 },
];

const metricDefinitions = [
  { key: "availability", label: "Telephone Availability", suffix: "%", higherIsBetter: true, decimals: 0 },
  { key: "resolves", label: "Resolves / Shift", suffix: "", higherIsBetter: true, decimals: 0 },
  { key: "ftf", label: "FTF / Shift", suffix: "", higherIsBetter: true, decimals: 0 },
  { key: "touches", label: "Ticket Touches / Shift", suffix: "", higherIsBetter: true, decimals: 0 },
  { key: "csat", label: "CSAT %", suffix: "%", higherIsBetter: true, decimals: 0 },
  { key: "mttu", label: "Mean Time to Update", suffix: " hrs", higherIsBetter: false, decimals: 1 },
  { key: "fiveStar", label: "Customer Recognition", suffix: "", higherIsBetter: true, decimals: 0 },
];

const seedTeamMembers = [
  { name: "Alex Morgan", shifts: [19, 20, 21], availability: [91, 92, 94], resolvesTotal: [156, 172, 191], ftfTotal: [74, 82, 84], touchesTotal: [589, 656, 714], csat: [94, 92, 89], fiveStarTotal: [36, 28, 20], mttu: [2.8, 3.0, 3.2] },
  { name: "Beth Taylor", shifts: [18, 17, 19], availability: [84, 83, 81], resolvesTotal: [126, 114, 124], ftfTotal: [79, 73, 86], touchesTotal: [468, 428, 471], csat: [91, 90, 92], fiveStarTotal: [30, 28, 32], mttu: [3.9, 4.0, 4.3] },
  { name: "Chris Patel", shifts: [21, 22, 20], availability: [88, 90, 89], resolvesTotal: [160, 174, 156], ftfTotal: [65, 64, 56], touchesTotal: [746, 818, 776], csat: [78, 81, 80], fiveStarTotal: [12, 14, 10], mttu: [1.4, 1.3, 1.2] },
  { name: "Dana Lewis", shifts: [20, 21, 22], availability: [95, 96, 97], resolvesTotal: [180, 197, 216], ftfTotal: [100, 109, 121], touchesTotal: [600, 641, 682], csat: [87, 86, 88], fiveStarTotal: [24, 22, 26], mttu: [1.9, 1.7, 1.5] },
  { name: "Elliot Brooks", shifts: [16, 18, 20], availability: [79, 82, 86], resolvesTotal: [93, 115, 146], ftfTotal: [74, 86, 102], touchesTotal: [304, 369, 440], csat: [95, 96, 97], fiveStarTotal: [42, 48, 52], mttu: [4.6, 3.8, 3.0] },
  { name: "Farah Ahmed", shifts: [22, 20, 18], availability: [93, 92, 90], resolvesTotal: [194, 168, 144], ftfTotal: [114, 108, 101], touchesTotal: [792, 680, 567], csat: [84, 82, 79], fiveStarTotal: [14, 12, 8], mttu: [1.5, 1.8, 2.4] },
  { name: "George Reid", shifts: [19, 20, 19], availability: [91, 79, 92], resolvesTotal: [156, 112, 162], ftfTotal: [82, 58, 84], touchesTotal: [572, 448, 588], csat: [90, 76, 91], fiveStarTotal: [24, 10, 26], mttu: [2.3, 4.0, 2.2] },
  { name: "Hannah Price", shifts: [21, 22, 23], availability: [96, 95, 96], resolvesTotal: [214, 238, 258], ftfTotal: [88, 88, 87], touchesTotal: [882, 964, 1047], csat: [74, 73, 71], fiveStarTotal: [8, 6, 4], mttu: [0.9, 0.8, 0.7] },
  { name: "Isla Bennett", shifts: [15, 18, 21], availability: [72, 81, 89], resolvesTotal: [83, 122, 162], ftfTotal: [51, 76, 103], touchesTotal: [360, 495, 662], csat: [79, 88, 94], fiveStarTotal: [10, 22, 36], mttu: [4.4, 3.2, 2.0] },
  { name: "James Carter", shifts: [18, 19, 17], availability: [98, 97, 95], resolvesTotal: [122, 133, 112], ftfTotal: [104, 112, 102], touchesTotal: [324, 333, 286], csat: [98, 99, 98], fiveStarTotal: [52, 58, 62], mttu: [2.6, 2.7, 3.0] },
  { name: "Kelly Wong", shifts: [22, 21, 22], availability: [86, 85, 83], resolvesTotal: [202, 189, 209], ftfTotal: [64, 67, 66], touchesTotal: [869, 861, 946], csat: [69, 72, 70], fiveStarTotal: [4, 8, 6], mttu: [1.1, 1.2, 1.4] },
  { name: "Liam Foster", shifts: [20, 19, 20], availability: [90, 91, 92], resolvesTotal: [154, 150, 162], ftfTotal: [94, 87, 96], touchesTotal: [500, 485, 520], csat: [90, 89, 91], fiveStarTotal: [26, 28, 30], mttu: [2.5, 2.4, 2.3] },
  { name: "Maya Singh", shifts: [21, 22, 22], availability: [97, 98, 98], resolvesTotal: [202, 222, 235], ftfTotal: [116, 125, 130], touchesTotal: [725, 792, 832], csat: [96, 97, 98], fiveStarTotal: [48, 54, 60], mttu: [1.4, 1.2, 1.0] },
  { name: "Noah Bennett", shifts: [20, 21, 21], availability: [94, 95, 96], resolvesTotal: [178, 195, 204], ftfTotal: [106, 116, 122], touchesTotal: [640, 701, 733], csat: [93, 94, 95], fiveStarTotal: [38, 44, 52], mttu: [1.8, 1.6, 1.3] },
  { name: "Olivia Turner", shifts: [21, 20, 19], availability: [74, 78, 84], resolvesTotal: [84, 101, 132], ftfTotal: [41, 52, 74], touchesTotal: [548, 590, 644], csat: [71, 77, 84], fiveStarTotal: [2, 6, 14], mttu: [5.3, 4.4, 3.1] },
];

function expandSeries(values, minimum = 0, decimals = 1, maximum = Number.POSITIVE_INFINITY) {
  const expanded = [...values].map((value) => Number(Math.min(maximum, Math.max(minimum, Number(value))).toFixed(decimals)));
  while (expanded.length < periods.length) {
    const last = expanded[expanded.length - 1];
    const previous = expanded[expanded.length - 2] ?? last;
    const trendAmount = last - previous;
    const variance = Math.sin(expanded.length * 1.7) * Math.max(Math.abs(trendAmount) * 0.35, decimals === 0 ? 1 : 0.4);
    const next = Math.min(maximum, Math.max(minimum, last + trendAmount * 0.6 + variance));
    expanded.push(Number(next.toFixed(decimals)));
  }
  return expanded.slice(0, periods.length);
}

const starterTeamMembers = seedTeamMembers.map((agent) => ({
  name: agent.name,
  inputs: Object.fromEntries(
    rawInputDefinitions.map((definition) => [
      definition.key,
      expandSeries(
        agent[definition.key],
        definition.minimum,
        definition.decimals,
        definition.suffix === "%" ? 100 : Number.POSITIVE_INFINITY
      ),
    ])
  ),
}));

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, className = "" }) {
  return <section className={cx("rounded-3xl bg-white shadow-sm ring-1 ring-slate-200", className)}>{children}</section>;
}

function average(values) {
  const clean = values.map(Number).filter(Number.isFinite);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
}

function percentile(sortedValues, percentileValue) {
  if (!sortedValues.length) return 0;
  const index = (sortedValues.length - 1) * percentileValue;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (upper >= sortedValues.length) return sortedValues[lower];
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function sliceToReportingMonth(values, reportingPeriodIndex) {
  return values.slice(0, reportingPeriodIndex + 1);
}

function deriveMetrics(inputs) {
  const shifts = inputs.shifts.map((shift) => (Number(shift) > 0 ? Number(shift) : 1));
  return {
    availability: inputs.availability,
    resolves: inputs.resolvesTotal.map((value, index) => Number((value / shifts[index]).toFixed(2))),
    ftf: inputs.ftfTotal.map((value, index) => Number((value / shifts[index]).toFixed(2))),
    touches: inputs.touchesTotal.map((value, index) => Number((value / shifts[index]).toFixed(2))),
    csat: inputs.csat,
    fiveStar: inputs.fiveStarTotal.map((value) => Number(Math.max(0, value).toFixed(0))),
    mttu: inputs.mttu,
  };
}

function quartileFor(value, allValues, higherIsBetter) {
  const clean = allValues.map(Number).filter(Number.isFinite);
  if (!clean.length || !Number.isFinite(Number(value))) return { q: "Q1", label: "Emerging", score: 1 };
  const sorted = [...clean].sort((a, b) => (higherIsBetter ? a - b : b - a));
  const position = sorted.findIndex((item) => item === Number(value));
  const rank = ((position === -1 ? 0 : position) + 1) / sorted.length;
  if (rank <= 0.25) return { q: "Q1", label: "Emerging", score: 1 };
  if (rank <= 0.5) return { q: "Q2", label: "Established", score: 2 };
  if (rank <= 0.75) return { q: "Q3", label: "Strong", score: 3 };
  return { q: "Q4", label: "Advanced", score: 4 };
}

function formatMetricValue(value, metricOrDecimals, suffixOverride) {
  const decimals = typeof metricOrDecimals === "number" ? metricOrDecimals : metricOrDecimals?.decimals ?? 1;
  const suffix = suffixOverride ?? (typeof metricOrDecimals === "object" ? metricOrDecimals?.suffix ?? "" : "");
  const numeric = Number(value);
  return `${Number.isFinite(numeric) ? numeric.toFixed(decimals) : "0"}${suffix}`;
}

function formatTrendDelta(value, metric) {
  const absoluteValue = Math.abs(Number(value));
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  if (metric?.suffix === "%") {
    return `${sign}${absoluteValue.toFixed(metric?.decimals ?? 0)} pts`;
  }

  return `${sign}${formatMetricValue(absoluteValue, metric)}`;
}

function trend(values, higherIsBetter, metric) {
  const clean = values.map(Number).filter(Number.isFinite);

  if (clean.length < 2) {
    return { label: "Stable", symbol: "→", direction: "stable", delta: 0 };
  }

  const recentWindow = clean.slice(-3);
  const previousWindow = clean.slice(-6, -3);

  const recentAverage = average(recentWindow);
  const previousAverage = previousWindow.length ? average(previousWindow) : clean[0];

  const rawDelta = recentAverage - previousAverage;
  const adjusted = higherIsBetter ? rawDelta : -rawDelta;
  const displayDelta = formatTrendDelta(rawDelta, metric);
  const meaningfulMovementThreshold = metric?.key === "availability" || metric?.key === "csat"
    ? 2
    : metric?.key === "mttu"
      ? 0.3
      : 1;

  if (!Number.isFinite(adjusted) || Math.abs(adjusted) < meaningfulMovementThreshold) {
    return { label: `No Significant Shift (${displayDelta})`, symbol: "→", direction: "stable", delta: adjusted };
  }

  return adjusted > 0
    ? { label: `Positive Movement (${displayDelta})`, symbol: "↑", direction: "up", delta: adjusted }
    : { label: `Pressure Movement (${displayDelta})`, symbol: "↓", direction: "down", delta: adjusted };
}

function quartileBoundaries(values) {
  const sorted = values.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  return {
    q1Max: sorted[Math.floor((sorted.length - 1) * 0.25)] ?? 0,
    q2Max: sorted[Math.floor((sorted.length - 1) * 0.5)] ?? 0,
    q3Max: sorted[Math.floor((sorted.length - 1) * 0.75)] ?? 0,
  };
}

function badgeClass(score) {
  return {
    1: "border-red-300 bg-red-100 text-red-800",
    2: "border-green-200 bg-green-100 text-green-700",
    3: "border-green-300 bg-green-300/60 text-green-900",
    4: "border-green-700 bg-green-600 text-white",
  }[score] || "border-slate-200 bg-slate-100 text-slate-700";
}

function widgetBackgroundClass(score) {
  return {
    1: "bg-red-50 border-red-200",
    2: "bg-green-50 border-green-200",
    3: "bg-green-100 border-green-300",
    4: "bg-green-600/10 border-green-600",
  }[score] || "bg-slate-50 border-slate-200";
}

function monthlyQuartileFor(agentName, metricKey, periodIndex, derivedTeamMembers) {
  const metric = metricDefinitions.find((item) => item.key === metricKey);
  const agent = derivedTeamMembers.find((item) => item.name === agentName);

  if (!metric || !agent || metric.key === "fiveStar") {
    return null;
  }

  const value = Number(agent.metrics[metric.key][periodIndex]);
  const teamValues = derivedTeamMembers.map((teamMember) => Number(teamMember.metrics[metric.key][periodIndex])).sort((a, b) => a - b);
  const stats = {
    min: teamValues[0],
    q1: percentile(teamValues, 0.25),
    q2: percentile(teamValues, 0.5),
    median: percentile(teamValues, 0.5),
    q3: percentile(teamValues, 0.75),
    max: teamValues[teamValues.length - 1],
  };

  return quartileForDisplayPosition(value, stats, metric.higherIsBetter);
}

function quartileForDisplayPosition(value, stats, higherIsBetter) {
  if (!stats || !Number.isFinite(Number(value))) {
    return { q: "Q1", label: "Emerging", score: 1 };
  }

  const q1Boundary = stats.q1;
  const q2Boundary = stats.median;
  const q3Boundary = stats.q3;

  if (higherIsBetter) {
    if (value <= q1Boundary) return { q: "Q1", label: "Emerging", score: 1 };
    if (value <= q2Boundary) return { q: "Q2", label: "Established", score: 2 };
    if (value <= q3Boundary) return { q: "Q3", label: "Strong", score: 3 };
    return { q: "Q4", label: "Advanced", score: 4 };
  }

  if (value >= q3Boundary) return { q: "Q1", label: "Emerging", score: 1 };
  if (value >= q2Boundary) return { q: "Q2", label: "Established", score: 2 };
  if (value >= q1Boundary) return { q: "Q3", label: "Strong", score: 3 };

  return { q: "Q4", label: "Advanced", score: 4 };
}

function trendClass() {
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

function actionClass(recommendation) {
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

function actionIcon(recommendation) {
  if (recommendation.includes("Focused support")) return "🤝";
  if (recommendation.includes("Light-touch check-in")) return "👀";
  return "✓";
}

function overallDevelopmentPathway(compositeScore) {
  if (compositeScore >= 3.5) {
    return {
      label: "Specialist Pathway",
      description: "Advanced capability exposure, mentoring and specialist development.",
      className: "bg-green-600 text-white",
    };
  }

  if (compositeScore >= 3) {
    return {
      label: "Growth Pathing",
      description: "Cross-training, broader exposure and leadership readiness.",
      className: "bg-green-300 text-green-900",
    };
  }

  if (compositeScore >= 2) {
    return {
      label: "Capability Building",
      description: "Focused progression toward stronger operational consistency.",
      className: "bg-green-100 text-green-700",
    };
  }

  return {
    label: "Performance Recovery",
    description: "Targeted support and coaching toward sustainable performance.",
    className: "bg-red-100 text-red-800",
  };
}

function BoxPlot({ stats, points = [], selectedTeamMember = "", suffix = "", showLegend = true, higherIsBetter = true, decimals = 1 }) {
  const range = stats.max - stats.min || 1;
  const raw = (value) => ((value - stats.min) / range) * 100;
  const position = (value) => `${higherIsBetter ? raw(value) : 100 - raw(value)}%`;
  const q1 = raw(stats.q1);
  const q2 = raw(stats.median);
  const q3 = raw(stats.q3);
  const leftWhiskerLeft = higherIsBetter ? raw(stats.min) : 100 - q1;
  const leftWhiskerWidth = q1 - raw(stats.min);
  const rightWhiskerLeft = higherIsBetter ? q3 : 100 - raw(stats.max);
  const rightWhiskerWidth = raw(stats.max) - q3;
  const boxLeft = higherIsBetter ? q1 : 100 - q3;
  const boxWidth = Math.max(q3 - q1, 1);

  return (
    <div className="min-w-[260px] space-y-2">
      <div className="relative h-16 overflow-hidden rounded-2xl bg-slate-50 px-2">
        {higherIsBetter ? (
          <>
            <div className="absolute inset-y-0 bg-red-100/70" style={{ left: "0%", width: `${q1}%` }} />
            <div className="absolute inset-y-0 bg-green-100/70" style={{ left: `${q1}%`, width: `${Math.max(q2 - q1, 0)}%` }} />
            <div className="absolute inset-y-0 bg-green-300/60" style={{ left: `${q2}%`, width: `${Math.max(q3 - q2, 0)}%` }} />
            <div className="absolute inset-y-0 bg-green-600/25" style={{ left: `${q3}%`, width: `${Math.max(100 - q3, 0)}%` }} />
          </>
        ) : (
          <>
            <div className="absolute inset-y-0 bg-red-100/70" style={{ left: "0%", width: `${100 - q3}%` }} />
            <div className="absolute inset-y-0 bg-green-100/70" style={{ left: `${100 - q3}%`, width: `${q3 - q2}%` }} />
            <div className="absolute inset-y-0 bg-green-300/60" style={{ left: `${100 - q2}%`, width: `${q2 - q1}%` }} />
            <div className="absolute inset-y-0 bg-green-600/25" style={{ left: `${100 - q1}%`, width: `${q1}%` }} />
          </>
        )}
        <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-slate-400" style={{ left: `${leftWhiskerLeft}%`, width: `${leftWhiskerWidth}%` }} />
        <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-slate-400" style={{ left: `${rightWhiskerLeft}%`, width: `${rightWhiskerWidth}%` }} />
        <div className="absolute top-1/2 h-5 -translate-y-1/2 rounded-md border border-slate-500 bg-white/30" style={{ left: `${boxLeft}%`, width: `${boxWidth}%` }} />
        <div className="absolute top-1/2 h-8 w-0.5 -translate-y-1/2 bg-slate-900" style={{ left: position(stats.median) }} title={`Median: ${formatMetricValue(stats.median, decimals, suffix)}`} />
        {points.map((point, index) => (
          <div
            key={`${point.name}-${point.value}-${index}`}
            className={cx("absolute h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-1 ring-white", point.name === selectedTeamMember ? "z-20 bg-amber-500 ring-2 ring-amber-900" : "z-10 bg-slate-500 opacity-70")}
            style={{ left: position(point.value), top: `${18 + (index % 5) * 7}px` }}
            title={`${point.name}: ${formatMetricValue(point.value, decimals, suffix)}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-500">
        {higherIsBetter ? (
          <><span>Low {formatMetricValue(stats.min, decimals, suffix)}</span><span>Median {formatMetricValue(stats.median, decimals, suffix)}</span><span>High {formatMetricValue(stats.max, decimals, suffix)}</span></>
        ) : (
          <><span>Slow {formatMetricValue(stats.max, decimals, suffix)}</span><span>Median {formatMetricValue(stats.median, decimals, suffix)}</span><span>Fast {formatMetricValue(stats.min, decimals, suffix)}</span></>
        )}
      </div>
      {showLegend && points.length > 0 && <div className="text-[10px] text-slate-500">Amber dot = selected agent. Grey dots = team members.</div>}
    </div>
  );
}

function runSelfTests() {
  const testDerived = deriveMetrics({ shifts: [20, 10], availability: [90, 91], resolvesTotal: [200, 50], ftfTotal: [100, 20], touchesTotal: [600, 200], csat: [95, 96], fiveStarTotal: [30, 0], mttu: [2.1, 1.9] });
  const tests = [
    { name: "resolves per shift derives from total divided by shifts", pass: testDerived.resolves[0] === 10 && testDerived.resolves[1] === 5 },
    { name: "Customer Recognition remains a cumulative total", pass: testDerived.fiveStar[0] === 30 && testDerived.fiveStar[1] === 0 },
    { name: "trend includes rolling percentage point delta label", pass: trend([80, 82, 84, 86, 88, 90], true, { suffix: "%", decimals: 0 }).label.includes("+6 pts") },
    { name: "lower is better metric shows improvement with rolling averages", pass: trend([4.0, 3.8, 3.5, 2.8, 2.4, 2.0], false, { suffix: " hrs", decimals: 1 }).direction === "up" },
    { name: "overall pathway maps composite score above 3.5 to specialist pathway", pass: overallDevelopmentPathway(3.6).label === "Specialist Pathway" },
    { name: "sample shift data includes variation", pass: new Set(starterTeamMembers.map((agent) => agent.inputs.shifts.slice(0, 3).join("-"))).size > 5 },
  ];
  tests.forEach((test) => { if (!test.pass) console.error(`OASIS self-test failed: ${test.name}`); });
}

runSelfTests();

export default function OASISDemo() {
  const [agents, setAgents] = useState(starterTeamMembers);
  const [selectedTeamMember, setSelectedTeamMember] = useState(starterTeamMembers[0].name);
  const [activeWorkspace, setActiveWorkspace] = useState("individual");
  const [activeTab, setActiveTab] = useState("input");
  const [reportingPeriodIndex, setReportingPeriodIndex] = useState(periods.length - 1);
  const [showAbout, setShowAbout] = useState(false);
  const [operationalContext, setOperationalContext] = useState({
    incomingTickets: 4200,
    backlog: 380,
    queueAge: 3.2,
    availabilityLoss: 12,
  });
  const currentPeriodIndex = reportingPeriodIndex;
  const currentPeriodLabel = periods[currentPeriodIndex];
  const activePeriods = periods.slice(0, currentPeriodIndex + 1);

  const derivedTeamMembers = useMemo(() => agents.map((agent) => ({ ...agent, metrics: deriveMetrics(agent.inputs) })), [agents]);
  const selected = derivedTeamMembers.find((agent) => agent.name === selectedTeamMember) || derivedTeamMembers[0];
  const selectedInputTeamMember = agents.find((agent) => agent.name === selectedTeamMember) || agents[0];

  const analysis = useMemo(() => derivedTeamMembers.map((agent) => {
    const metricRows = metricDefinitions.map((metric) => {
      const allValues = agent.metrics[metric.key];
      const values = sliceToReportingMonth(allValues, currentPeriodIndex);
      const ytdValue = metric.key === "fiveStar" ? values.reduce((sum, value) => sum + Number(value), 0) : average(values);
      const teamYtdValues = derivedTeamMembers.map((teamMember) => {
        const metricValues = sliceToReportingMonth(teamMember.metrics[metric.key], currentPeriodIndex);
        return metric.key === "fiveStar" ? metricValues.reduce((sum, value) => sum + Number(value), 0) : average(metricValues);
      });
      const sorted = [...teamYtdValues].sort((a, b) => a - b);
      const distributionStats = { min: sorted[0], q1: percentile(sorted, 0.25), q2: percentile(sorted, 0.5), median: percentile(sorted, 0.5), q3: percentile(sorted, 0.75), max: sorted[sorted.length - 1] };
      const distributionPoints = derivedTeamMembers.map((teamMember) => {
        const metricValues = sliceToReportingMonth(teamMember.metrics[metric.key], currentPeriodIndex);
        return {
          name: teamMember.name,
          value: metric.key === "fiveStar" ? metricValues.reduce((sum, value) => sum + Number(value), 0) : average(metricValues),
        };
      });
      return {
        metric,
        values,
        current: Number(allValues[currentPeriodIndex]),
        yearlyAverage: ytdValue,
        quartile: quartileForDisplayPosition(ytdValue, distributionStats, metric.higherIsBetter),
        trend: trend(values, metric.higherIsBetter, metric),
        distributionStats,
        distributionPoints,
      };
    });
    const operationalRows = metricRows.filter((row) => row.metric.key !== "fiveStar");
    const monthlyRedMatrix = operationalRows.map((row) => {
      return row.values.map((_, periodIndex) => {
        const score = monthlyQuartileFor(agent.name, row.metric.key, periodIndex, derivedTeamMembers)?.score ?? row.quartile.score;
        return {
          metricKey: row.metric.key,
          metricLabel: row.metric.label,
          periodIndex,
          isRed: score === 1,
        };
      });
    });

    const currentMonthReds = monthlyRedMatrix
      .map((metricMonths) => metricMonths[currentPeriodIndex])
      .filter((entry) => entry?.isRed);

    const repeatedSameMetricReds = monthlyRedMatrix.filter((metricMonths) => {
      if (currentPeriodIndex < 1) return false;
      return metricMonths[currentPeriodIndex]?.isRed && metricMonths[currentPeriodIndex - 1]?.isRed;
    });

    const awarenessSignals = currentMonthReds.length;
    const coachingSignals = repeatedSameMetricReds.length;
    const acutePressureSignal = currentMonthReds.length >= 2;

    const averageScore = operationalRows.reduce((sum, row) => sum + row.quartile.score, 0) / operationalRows.length;

    let recommendation = "No intervention required";

    if (coachingSignals >= 1 || acutePressureSignal) {
      recommendation = "Focused support conversation";
    } else if (awarenessSignals === 1) {
      recommendation = "Light-touch check-in";
    }

    return {
      agent,
      metricRows,
      q1Count: awarenessSignals,
      decliningCount: coachingSignals,
      acutePressureSignal,
      averageScore,
      recommendation,
    };
  }), [derivedTeamMembers, currentPeriodIndex]);

  const selectedAnalysis = analysis.find((item) => item.agent.name === selected.name) || analysis[0];

  const stretchGoalAnalysis = useMemo(() => {
    const averageQuartile = selectedAnalysis.averageScore;
    const teamScores = analysis.map((item) => item.averageScore).sort((a, b) => a - b);
    const pathway = overallDevelopmentPathway(averageQuartile);
    const overallDistribution = { min: teamScores[0], q1: percentile(teamScores, 0.25), q2: percentile(teamScores, 0.5), median: percentile(teamScores, 0.5), q3: percentile(teamScores, 0.75), max: teamScores[teamScores.length - 1] };
    const overallPoints = analysis.map((item) => ({ name: item.agent.name, value: item.averageScore }));
    const strengths = selectedAnalysis.metricRows.filter((row) => row.metric.key !== "fiveStar" && row.quartile.score >= 3);
    const focusAreas = selectedAnalysis.metricRows.filter((row) => row.metric.key !== "fiveStar" && row.quartile.score <= 2);
    const decliningAreas = selectedAnalysis.metricRows.filter((row) => row.metric.key !== "fiveStar" && row.trend.direction === "down");
    const recommendedFocus = pathway.label === "Performance Recovery"
      ? "Prioritise stability, confidence rebuilding and focused support around the clearest operational pressure areas."
      : pathway.label === "Capability Building"
        ? "Support operational consistency, reinforce sustainable habits and continue building confidence in emerging capability areas."
        : pathway.label === "Growth Pathing"
          ? "Consider broader operational exposure, cross-skilling opportunities and gradual expansion of responsibility."
          : "Consider specialist ownership, mentoring opportunities and wider knowledge-sharing across the operation.";
    return { averageQuartile, pathway, overallDistribution, overallPoints, strengths, focusAreas, decliningAreas, recommendedFocus };
  }, [selectedAnalysis, analysis]);

  const teamYearlyDistribution = useMemo(() => {
    const teamScores = analysis.map((item) => item.averageScore);
    const pathwayCounts = analysis.reduce(
      (counts, item) => {
        const pathway = overallDevelopmentPathway(item.averageScore);

        if (pathway.label === "Performance Recovery") counts.recovery += 1;
        else if (pathway.label === "Specialist Pathway") counts.advanced += 1;
        else counts.operationalRange += 1;

        return counts;
      },
      { recovery: 0, operationalRange: 0, advanced: 0 }
    );

    const total = analysis.length || 1;

    return {
      ...pathwayCounts,
      recoveryPercent: Math.round((pathwayCounts.recovery / total) * 100),
      operationalPercent: Math.round((pathwayCounts.operationalRange / total) * 100),
      advancedPercent: Math.round((pathwayCounts.advanced / total) * 100),
    };
  }, [analysis]);

  const teamPerformance = useMemo(() => {
    const operationalMetricDefinitions = metricDefinitions.filter((metric) => metric.key !== "fiveStar");
    const metricSummaries = operationalMetricDefinitions.map((metric) => {
      const monthlyAverages = activePeriods.map((_, periodIndex) => average(derivedTeamMembers.map((agent) => agent.metrics[metric.key][periodIndex])));
      const currentValues = derivedTeamMembers.map((agent) => Number(agent.metrics[metric.key][currentPeriodIndex])).sort((a, b) => a - b);
      const ytdValues = derivedTeamMembers.map((agent) => average(sliceToReportingMonth(agent.metrics[metric.key], currentPeriodIndex))).sort((a, b) => a - b);
      const { q1Max, q2Max, q3Max } = quartileBoundaries(ytdValues);
      const boxStats = { min: ytdValues[0], q1: percentile(ytdValues, 0.25), q2: percentile(ytdValues, 0.5), median: percentile(ytdValues, 0.5), q3: percentile(ytdValues, 0.75), max: ytdValues[ytdValues.length - 1] };
      return {
        metric,
        averages: monthlyAverages,
        current: average(currentValues),
        median: boxStats.median,
        boxStats,
        quartiles: metric.higherIsBetter
          ? { q1: `<= ${formatMetricValue(q1Max, metric)}`, q2: `${formatMetricValue(q1Max, metric)} - ${formatMetricValue(q2Max, metric)}`, q3: `${formatMetricValue(q2Max, metric)} - ${formatMetricValue(q3Max, metric)}`, q4: `> ${formatMetricValue(q3Max, metric)}` }
          : { q4: `<= ${formatMetricValue(q1Max, metric)}`, q3: `${formatMetricValue(q1Max, metric)} - ${formatMetricValue(q2Max, metric)}`, q2: `${formatMetricValue(q2Max, metric)} - ${formatMetricValue(q3Max, metric)}`, q1: `> ${formatMetricValue(q3Max, metric)}` },
        trend: trend(monthlyAverages, metric.higherIsBetter, metric),
      };
    });
    const positiveTrends = metricSummaries.filter((summary) => summary.trend.direction === "up").length;
    const decliningTrends = metricSummaries.filter((summary) => summary.trend.direction === "down").length;
    const health = decliningTrends >= 4 ? "Needs Attention" : decliningTrends >= 2 ? "Mixed" : "Healthy";
    const healthClass = decliningTrends >= 4 ? "bg-red-100 text-red-800" : decliningTrends >= 2 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800";

    const monthlyHealth = activePeriods.map((period, periodIndex) => {
      const improving = operationalMetricDefinitions.filter((metric) => {
        const values = activePeriods.slice(0, periodIndex + 1).map((_, idx) => average(derivedTeamMembers.map((agent) => agent.metrics[metric.key][idx])));
        return trend(values, metric.higherIsBetter, metric).direction === "up";
      }).length;

      const declining = operationalMetricDefinitions.filter((metric) => {
        const values = activePeriods.slice(0, periodIndex + 1).map((_, idx) => average(derivedTeamMembers.map((agent) => agent.metrics[metric.key][idx])));
        return trend(values, metric.higherIsBetter, metric).direction === "down";
      }).length;

      const status = declining >= 4 ? "Needs Attention" : declining >= 2 ? "Mixed" : "Healthy";
      const statusClass = declining >= 4 ? "bg-red-100 text-red-800" : declining >= 2 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800";
      return { period, improving, declining, status, statusClass };
    });

    return { metricSummaries, positiveTrends, decliningTrends, health, healthClass, monthlyHealth };
  }, [agents, derivedTeamMembers, activePeriods, currentPeriodIndex]);

  function updateInput(agentName, inputKey, periodIndex, value) {
    const definition = rawInputDefinitions.find((input) => input.key === inputKey);
    const numeric = Number(value);
    const safe = Number.isFinite(numeric) ? Math.max(definition?.minimum ?? 0, numeric) : definition?.minimum ?? 0;
    setAgents((previous) => previous.map((agent) => {
      if (agent.name !== agentName) return agent;
      const nextInputs = { ...agent.inputs, [inputKey]: [...agent.inputs[inputKey]] };
      nextInputs[inputKey][periodIndex] = Number(safe.toFixed(definition?.decimals ?? 1));
      return { ...agent, inputs: nextInputs };
    }));
  }

  function resetDemoData() {
    setAgents(starterTeamMembers);
    setSelectedTeamMember(starterTeamMembers[0].name);
    setReportingPeriodIndex(periods.length - 1);
    setActiveWorkspace("individual");
    setActiveTab("input");
  }

  const individualTabs = [
    { key: "input", label: "Metric Input" },
    { key: "individual", label: "People Overview" },
    { key: "stretch", label: "Development Pathways" },
  ];
  const teamTabs = [
    { key: "team", label: "Team Performance" },
    { key: "scorecard", label: "Whole Team Scorecard" },
    { key: "manager", label: "Leadership Signals" },
  ];

  const operationsTabs = [
    { key: "operations", label: "Operational Capacity" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {showAbout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="max-w-3xl rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">About OASIS</div>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Operational Awareness & Systems Intelligence Solution</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAbout(false)}
                  className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-600">
                <p>
                  OASIS is an operational awareness proof of concept designed to explore how workforce activity, operational telemetry and systems interpretation may help leadership better understand the operational conditions behind team performance.
                </p>

                <p>
                  The current demo focuses on team-level operational visibility using simulated operational and workforce data to interpret patterns such as workload exposure, operational strain, capability distribution, sustainability pressure and resilience signals.
                </p>

                <p>
                  Rather than treating KPIs as the full operational story, OASIS explores whether broader operational context and workforce experience may provide additional meaning behind performance outcomes.
                </p>

                <p>
                  The concept is intentionally exploratory and designed to demonstrate how operational awareness models could potentially evolve from team-level interpretation toward wider multi-layer operational visibility over time.
                </p>

                <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">Core Philosophy</div>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>• KPIs are outcomes, not the full operational picture.</p>
                    <p>• Stable operational systems naturally support healthier performance outcomes.</p>
                    <p>• Workforce experience can contain operational meaning.</p>
                    <p>• Humans should not be interpreted using purely mechanical performance models.</p>
                    <p>• Sustainability and resilience matter alongside productivity.</p>
                    <p>• Better operational awareness may support healthier leadership decisions over time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <header className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-3xl bg-emerald-100 p-3 text-2xl">O</div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">OASIS</h1>
                <p className="text-slate-600">Operational Awareness & Systems Intelligence Solution</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Reporting Month
                <select value={reportingPeriodIndex} onChange={(event) => setReportingPeriodIndex(Number(event.target.value))} className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm sm:w-40">
                  {periods.map((period, index) => <option key={period} value={index}>{period}</option>)}
                </select>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAbout(true)}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  About OASIS
                </button>

                <button type="button" onClick={resetDemoData} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700">Reset sample data</button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap gap-2">
              {[{ key: "individual", label: "People Intelligence", defaultTab: "input" }, { key: "team", label: "Team Intelligence", defaultTab: "team" }, { key: "operations", label: "Operational Intelligence", defaultTab: "operations" }].map((workspace) => (
                <button key={workspace.key} type="button" onClick={() => { setActiveWorkspace(workspace.key); setActiveTab(workspace.defaultTab); }} className={cx("rounded-2xl px-4 py-2 text-sm font-semibold transition-all", activeWorkspace === workspace.key ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>{workspace.label}</button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-100 p-3 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {(activeWorkspace === "individual" ? individualTabs : activeWorkspace === "team" ? teamTabs : operationsTabs).map((tab) => (
                  <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={cx("rounded-2xl px-4 py-2 text-sm font-semibold transition-all", activeTab === tab.key ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>{tab.label}</button>
                ))}
              </div>
              {activeWorkspace === "individual" && (
                <label className="block min-w-[260px] space-y-2 text-sm font-medium text-slate-700">
                  Team Member
                  <select value={selectedTeamMember} onChange={(event) => setSelectedTeamMember(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm">
                    {agents.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
                  </select>
                </label>
              )}
            </div>
          </div>
        </header>

        {activeTab === "input" && (
          <Card><div className="space-y-5 p-5">
            <div><h2 className="text-xl font-semibold">Metric Input</h2><p className="text-sm text-slate-600">Enter raw monthly totals plus shifts worked. Derived per-shift metrics are calculated automatically.</p></div>
            <div className="rounded-3xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">Most operational count metrics are converted into per-shift values to support fairer operational comparison across differing workforce exposure.</div>
            {rawInputDefinitions.map((input) => (
              <div key={input.key} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-2"><span className="text-sm font-semibold">{input.label}</span>{input.key === "shifts" && <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">Used for per-shift calculations</span>}</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
                  {periods.map((period, index) => (
                    <label key={period} className="space-y-1 text-xs text-slate-500">{period}<input type="number" step={input.decimals === 0 ? "1" : "0.1"} min={input.minimum} value={selectedInputTeamMember.inputs[input.key][index]} onChange={(event) => updateInput(selectedInputTeamMember.name, input.key, index, event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 shadow-sm" /></label>
                  ))}
                </div>
              </div>
            ))}
          </div></Card>
        )}

        {activeTab === "individual" && (
          <Card><div className="space-y-4 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold">People Overview</h2><p className="text-sm text-slate-600">Selected month: {currentPeriodLabel}. Reference quartile is based on YTD averages, except Customer Recognition which uses a cumulative YTD total.</p></div><div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium">Selected Team Member: {selected.name}</div></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {selectedAnalysis.metricRows.map((row) => <div key={row.metric.key} className={cx("rounded-3xl border p-4 shadow-sm", row.metric.key !== "fiveStar" ? widgetBackgroundClass(row.quartile.score) : "border-amber-200 bg-amber-50")}><div className="text-sm font-medium text-slate-500">{row.metric.label}</div><div className="mt-2 flex items-end justify-between gap-3"><div><div className="text-4xl font-bold tracking-tight text-slate-900">{formatMetricValue(row.current, row.metric)}</div><div className="mt-1 text-xs text-slate-500">{currentPeriodLabel} result</div></div>{row.metric.key !== "fiveStar" && <span className={cx("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", badgeClass(row.quartile.score))}>{row.quartile.label}</span>}</div><div className="mt-4 flex items-center justify-between"><div><div className="text-xs uppercase tracking-wide text-slate-400">{row.metric.key === "fiveStar" ? "YTD Total" : "YTD Avg"}</div><div className="text-lg font-semibold text-slate-800">{formatMetricValue(row.yearlyAverage, row.metric)}</div>{row.metric.key === "fiveStar" && row.yearlyAverage > 0 && <div className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">★ Customer Recognition Received</div>}</div>{row.metric.key !== "fiveStar" && <div className={cx("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", trendClass(row.trend.direction))}>{row.trend.symbol}</div>}</div></div>)}
            </div>
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white"><table className="w-full min-w-[1250px] text-left text-sm"><thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Metric</th>{activePeriods.map((period) => <th key={period} className="p-3">{period}</th>)}<th className="p-3">YTD Value</th><th className="p-3">Quartile</th><th className="p-3">Trend</th><th className="p-3">Team YTD Distribution</th></tr></thead><tbody>{selectedAnalysis.metricRows.map((row) => <tr key={row.metric.key} className="border-t border-slate-200"><td className="p-3 font-medium">{row.metric.label}</td>{row.values.map((value, index) => (
                        <td key={activePeriods[index]} className="p-3">
                          <span className={cx(
                            "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
                            row.metric.key !== "fiveStar"
                              ? badgeClass(monthlyQuartileFor(selected.name, row.metric.key, index, derivedTeamMembers)?.score ?? row.quartile.score)
                              : "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
                          )}>
                            {formatMetricValue(value, row.metric)}
                          </span>
                        </td>
                      ))}<td className="p-3 font-semibold"><div className="flex flex-col gap-1"><span className={cx(
                            "inline-flex w-fit rounded-full px-2 py-1 text-xs font-semibold",
                            row.metric.key !== "fiveStar" ? badgeClass(row.quartile.score) : "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
                          )}>{formatMetricValue(row.yearlyAverage, row.metric)}</span>{row.metric.key === "fiveStar" && row.yearlyAverage > 0 && <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200">★ Recognition Received</span>}</div></td><td className="p-3">{row.metric.key !== "fiveStar" && <span className={cx("inline-flex rounded-full border px-2 py-1 text-xs font-semibold", badgeClass(row.quartile.score))}>{row.quartile.label}</span>}</td><td className="p-3">{row.metric.key !== "fiveStar" && <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold", trendClass(row.trend.direction))}>{row.trend.symbol}</span>}</td><td className="p-3">{row.metric.key !== "fiveStar" && <BoxPlot key={`${row.metric.key}-${currentPeriodIndex}`} stats={row.distributionStats} points={row.distributionPoints} selectedTeamMember={selected.name} suffix={row.metric.suffix} higherIsBetter={row.metric.higherIsBetter} decimals={row.metric.decimals} showLegend={false} />}</td></tr>)}</tbody></table></div>
          </div></Card>
        )}

        {activeTab === "team" && (
          <Card>
            <div className="space-y-5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Whole Team Performance</h2>
                  <p className="text-sm text-slate-600">
                    Aggregated team-wide operational averages, medians, YTD quartile ranges and broader operational movement trends for Jan to {currentPeriodLabel}.
                  </p>
                </div>
                <span className={cx("inline-flex rounded-full px-4 py-2 text-sm font-semibold", teamPerformance.healthClass)}>
                  Team Health: {teamPerformance.health}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl bg-green-50 p-4 ring-1 ring-green-200">
                  <div className="text-sm text-green-700">Positive Movement Signals</div>
                  <div className="mt-1 text-3xl font-bold text-green-800">{teamPerformance.positiveTrends}</div>
                  <div className="mt-2 text-xs text-green-700">Operational areas moving in the right direction.</div>
                </div>

                <div className="rounded-3xl bg-red-50 p-4 ring-1 ring-red-200">
                  <div className="text-sm text-red-700">Pressure Movement Signals</div>
                  <div className="mt-1 text-3xl font-bold text-red-800">{teamPerformance.decliningTrends}</div>
                  <div className="mt-2 text-xs text-red-700">Operational areas showing recent pressure.</div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Average CSAT</div>
                  <div className="mt-1 text-3xl font-bold">
                    {formatMetricValue(teamPerformance.metricSummaries.find((m) => m.metric.key === "csat")?.current ?? 0, metricDefinitions.find((m) => m.key === "csat"))}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">Current selected-month team average.</div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Average MTTU</div>
                  <div className="mt-1 text-3xl font-bold">
                    {formatMetricValue(teamPerformance.metricSummaries.find((m) => m.metric.key === "mttu")?.current ?? 0, metricDefinitions.find((m) => m.key === "mttu"))}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">Lower is better.</div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div>
                  <h3 className="text-lg font-semibold">Monthly Team Health</h3>
                  <p className="text-sm text-slate-600">Operational health by reporting month based on broader movement and pressure signals across operational metrics.</p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                  {teamPerformance.monthlyHealth.map((month) => (
                    <div key={month.period} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-700">{month.period}</div>
                        <span className={cx("rounded-full px-2 py-1 text-[10px] font-semibold", month.statusClass)}>{month.status}</span>
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>Positive Movement</span>
                          <span className="font-semibold text-green-700">{month.improving}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Pressure Movement</span>
                          <span className="font-semibold text-red-700">{month.declining}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                <table className="w-full min-w-[1500px] text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-3">Metric</th>
                      {activePeriods.map((period) => <th key={period} className="p-3">Avg {period}</th>)}
                      <th className="p-3">Median</th>
                      <th className="p-3">Quartile Ranges</th>
                      <th className="p-3">YTD Distribution</th>
                      <th className="p-3">Direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPerformance.metricSummaries.map((summary) => (
                      <tr key={summary.metric.key} className="border-t border-slate-200">
                        <td className="p-3 font-medium">{summary.metric.label}</td>
                        {summary.averages.map((avg, index) => (
                          <td key={activePeriods[index]} className="p-3">{formatMetricValue(avg, summary.metric)}</td>
                        ))}
                        <td className="p-3 font-semibold">{formatMetricValue(summary.median, summary.metric)}</td>
                        <td className="p-3">
                          <div className="space-y-1 text-xs">
                            <div className="rounded bg-green-600 px-2 py-1 text-white">Q4: {summary.quartiles.q4}</div>
                            <div className="rounded bg-green-300 px-2 py-1 text-green-900">Q3: {summary.quartiles.q3}</div>
                            <div className="rounded bg-green-100 px-2 py-1 text-green-700">Q2: {summary.quartiles.q2}</div>
                            <div className="rounded bg-red-100 px-2 py-1 text-red-800">Q1: {summary.quartiles.q1}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <BoxPlot key={`${summary.metric.key}-${currentPeriodIndex}`} stats={summary.boxStats} suffix={summary.metric.suffix} higherIsBetter={summary.metric.higherIsBetter} decimals={summary.metric.decimals} showLegend={false} />
                        </td>
                        <td className="p-3">
                          <span className={cx("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", trendClass(summary.trend.direction))}>
                            {summary.trend.symbol}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "scorecard" && (
          <Card><div className="space-y-4 p-5"><div><h2 className="text-xl font-semibold">Whole Team Scorecard View</h2><p className="text-sm text-slate-600">All team members together, showing each {currentPeriodLabel} derived metric with reference quartiles based on YTD averages, except Customer Recognition which uses a cumulative YTD total.</p></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Team Pathway Profile</h3>
                  <p className="text-sm text-slate-600">A simplified view of where the team broadly sits across operational pathway ranges.</p>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
                <div className="flex h-14 w-full overflow-hidden text-sm font-semibold">
                  <div
                    className="flex items-center justify-center bg-red-100 text-red-800"
                    style={{ width: `${teamYearlyDistribution.recoveryPercent}%` }}
                  >
                    {teamYearlyDistribution.recovery > 0 && `${teamYearlyDistribution.recovery} Recovery`}
                  </div>

                  <div
                    className="flex items-center justify-center bg-green-200 text-green-900"
                    style={{ width: `${teamYearlyDistribution.operationalPercent}%` }}
                  >
                    {teamYearlyDistribution.operationalRange > 0 && `${teamYearlyDistribution.operationalRange} Operational Range`}
                  </div>

                  <div
                    className="flex items-center justify-center bg-green-600 text-white"
                    style={{ width: `${teamYearlyDistribution.advancedPercent}%` }}
                  >
                    {teamYearlyDistribution.advanced > 0 && `${teamYearlyDistribution.advanced} Advanced`}
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white"><table className="w-full min-w-[1180px] text-left text-xs"><thead className="bg-slate-100 text-slate-600"><tr><th className="sticky left-0 z-10 bg-slate-100 p-3 text-sm">Team Member</th><th className="p-3">Yearly Pathway</th>{metricDefinitions.map((metric) => <th key={metric.key} className="p-3">{metric.label}</th>)}</tr></thead><tbody>{analysis.map((item) => <tr key={item.agent.name} className="border-t border-slate-200"><td className="sticky left-0 z-10 bg-white p-3 text-sm font-semibold">{item.agent.name}</td><td className="p-3"><div className={cx("inline-flex rounded-full px-3 py-1 text-xs font-semibold", overallDevelopmentPathway(item.averageScore).className)}>{overallDevelopmentPathway(item.averageScore).label}</div></td>{item.metricRows.map((row) => <td key={row.metric.key} className="p-3 align-top"><div className="space-y-1"><div className="font-semibold text-slate-900">{formatMetricValue(row.current, row.metric)}</div>{row.metric.key !== "fiveStar" ? <><span className={cx("inline-flex rounded-full border px-2 py-1 font-semibold", badgeClass(row.quartile.score))}>{row.quartile.label}</span><div className={cx("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold", trendClass(row.trend.direction))}>{row.trend.symbol}</div></> : <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200">★ Recognition</span>}</div></td>)}</tr>)}</tbody></table></div></div></Card>
        )}

        {activeTab === "stretch" && (
          <Card><div className="space-y-6 p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold">Development Pathways</h2><p className="text-sm text-slate-600">Gives the selected person one overall operational development descriptor based on broader operational patterns and capability signals.</p></div><div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium">Selected Team Member: {selected.name}</div></div><div className="rounded-3xl border border-slate-200 bg-white p-5"><div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]"><div><div className="text-sm font-medium text-slate-500">Potential Development Pathway</div><div className={cx("mt-3 inline-flex rounded-full px-5 py-3 text-lg font-bold", stretchGoalAnalysis.pathway.className)}>{stretchGoalAnalysis.pathway.label}</div><p className="mt-4 max-w-2xl text-sm text-slate-600">{stretchGoalAnalysis.pathway.description}</p></div><div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="text-sm font-medium text-slate-500">Team Positioning</div><div className="mt-4"><BoxPlot stats={stretchGoalAnalysis.overallDistribution} points={stretchGoalAnalysis.overallPoints} selectedTeamMember={selected.name} suffix="" higherIsBetter={true} decimals={1} showLegend={true} /></div></div></div></div><div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-500">Strength Areas</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stretchGoalAnalysis.strengths.map((row) => (
                    <span key={row.metric.key} className="rounded-full bg-green-100 px-3 py-2 text-xs font-semibold text-green-800">
                      {row.metric.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-500">Focus Areas</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stretchGoalAnalysis.focusAreas.map((row) => (
                    <span key={row.metric.key} className="rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800">
                      {row.metric.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-500">Leadership Considerations</div>
                <p className="mt-4 text-sm text-slate-600">
                  {stretchGoalAnalysis.recommendedFocus}
                </p>
              </div>
            </div>
          </div></Card>
        )}

        {activeTab === "manager" && (
          <Card>
            <div className="space-y-4 p-5">
              <div>
                <h2 className="text-xl font-semibold">Leadership Signals</h2>
                <p className="text-sm text-slate-600">
                  Highlights where leadership presence, coaching support or operational awareness may add value.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Team Members</div>
                  <div className="mt-1 text-3xl font-bold">{agents.length}</div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Awareness Signals</div>
                  <div className="mt-1 text-3xl font-bold">{analysis.reduce((sum, item) => sum + item.q1Count, 0)}</div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Coaching Signals</div>
                  <div className="mt-1 text-3xl font-bold">{analysis.filter((item) => item.decliningCount >= 1 || item.acutePressureSignal).length}</div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Focused Support</div>
                  <div className="mt-1 text-3xl font-bold">{analysis.filter((item) => item.recommendation.includes("Focused support")).length}</div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-3">Team Member</th>
                      <th className="p-3">Operational Position</th>
                      <th className="p-3">Current Awareness</th>
                      <th className="p-3">Repeated Focus Areas</th>
                      <th className="p-3">Suggested Leadership Response</th>
                      <th className="p-3">Scorecard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.map((item) => (
                      <tr key={item.agent.name} className="border-t border-slate-200">
                        <td className="p-3 font-medium">{item.agent.name}</td>
                        <td className="p-3">
                          <span className={cx("inline-flex rounded-full px-3 py-1 text-xs font-semibold", overallDevelopmentPathway(item.averageScore).className)}>
                            {overallDevelopmentPathway(item.averageScore).label}
                          </span>
                        </td>
                        <td className="p-3">{item.q1Count}</td>
                        <td className="p-3">{item.decliningCount}</td>
                        <td className="p-3">
                          <span className={cx("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", actionClass(item.recommendation))}>
                            <span>{actionIcon(item.recommendation)}</span>
                            <span>{item.recommendation === "No intervention required" ? "No active concerns" : item.recommendation}</span>
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTeamMember(item.agent.name);
                              setActiveWorkspace("individual");
                              setActiveTab("individual");
                            }}
                            className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition-all hover:bg-slate-200"
                          >
                            View scorecard
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "operations" && (
          <Card>
            <div className="space-y-5 p-5">
              <div>
                <h2 className="text-xl font-semibold">Operational Intelligence</h2>
                <p className="text-sm text-slate-600">
                  A broader operational interpretation layer showing capability density, operational throughput and support exposure across the workforce.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-300">Operational Summary</div>
                    <div className="mt-3 max-w-4xl text-base leading-relaxed text-slate-100">
                      {
                        operationalContext.backlog > 400 ||
                        operationalContext.queueAge > 5 ||
                        derivedTeamMembers.filter((agent) => agent.inputs.touchesTotal[currentPeriodIndex] > 850).length >= 2
                          ? "The operation is sustaining strong delivery throughput during the current reporting period, however operational signals suggest increasing workload concentration, dependency risk and emerging sustainability pressure across parts of the workforce."
                          : operationalContext.backlog > 150 ||
                            operationalContext.queueAge > 2.5 ||
                            analysis.filter((item) => item.recommendation.includes("Focused support")).length > 2
                          ? "Operational delivery appears stable overall, although visible workforce and operational signals suggest areas of elevated demand pressure and uneven operational exposure which may warrant additional leadership awareness."
                          : "Operational conditions currently appear balanced, with workload exposure, capability distribution and workforce sustainability signals remaining broadly stable across the reporting period."
                      }
                    </div>
                  </div>

                  <div className="hidden xl:flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold text-white">
                    {currentPeriodLabel}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Monthly Resolves per Avg Daily Headcount</div>
                  <div className="mt-1 text-3xl font-bold">
                    {Number(
                      derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.resolvesTotal[currentPeriodIndex], 0) /
                      (derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.shifts[currentPeriodIndex], 0) / 22)
                    ).toFixed(1)}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Monthly FTF per Avg Daily Headcount</span>
                    <span className="font-semibold text-slate-700">
                      {Number(
                        derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.ftfTotal[currentPeriodIndex], 0) /
                        (derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.shifts[currentPeriodIndex], 0) / 22)
                      ).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Monthly Touches per Avg Daily Headcount</div>
                  <div className="mt-1 text-3xl font-bold">
                    {Number(
                      derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.touchesTotal[currentPeriodIndex], 0) /
                      (derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.shifts[currentPeriodIndex], 0) / 22)
                    ).toFixed(1)}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Monthly Recognition per Avg Daily Headcount</div>
                  <div className="mt-1 text-3xl font-bold">
                    {Number(
                      derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.fiveStarTotal[currentPeriodIndex], 0) /
                      (derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.shifts[currentPeriodIndex], 0) / 22)
                    ).toFixed(1)}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Avg Daily Workforce Exposure</div>
                  <div className="mt-1 text-3xl font-bold">
                    {Number(
                      derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.shifts[currentPeriodIndex], 0) / 22
                    ).toFixed(1)}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Nominal Headcount</span>
                    <span className="font-semibold text-slate-700">{agents.length}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">Estimated using operational shift exposure across a 22-day month.</div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm text-slate-500">Support Exposure</div>
                  <div className="mt-1 text-3xl font-bold">
                    {analysis.filter((item) => item.recommendation.includes("Focused support")).length}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Operational Context Inputs</h3>
                    <p className="text-sm text-slate-600">Simulated monthly operational telemetry not currently visible through workforce activity alone.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Monthly Incoming Tickets
                    <input
                      type="number"
                      value={operationalContext.incomingTickets}
                      onChange={(event) => setOperationalContext((prev) => ({ ...prev, incomingTickets: Number(event.target.value) }))}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Open Backlog
                    <input
                      type="number"
                      value={operationalContext.backlog}
                      onChange={(event) => setOperationalContext((prev) => ({ ...prev, backlog: Number(event.target.value) }))}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Average Queue Age (Days)
                    <input
                      type="number"
                      step="0.1"
                      value={operationalContext.queueAge}
                      onChange={(event) => setOperationalContext((prev) => ({ ...prev, queueAge: Number(event.target.value) }))}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Availability Loss %
                    <input
                      type="number"
                      value={operationalContext.availabilityLoss}
                      onChange={(event) => setOperationalContext((prev) => ({ ...prev, availabilityLoss: Number(event.target.value) }))}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-500">Workforce Utilisation</div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">
                        {Number(
                          derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.touchesTotal[currentPeriodIndex], 0) /
                          (derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.shifts[currentPeriodIndex], 0) / 22)
                        ) > 700 ? "High" : Number(
                          derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.touchesTotal[currentPeriodIndex], 0) /
                          (derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.shifts[currentPeriodIndex], 0) / 22)
                        ) > 500 ? "Elevated" : "Healthy"}
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Workforce Load
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    Interprets assigned operational throughput against estimated workforce exposure to indicate how operationally busy the workforce appears.
                  </p>
                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Workload Density</span>
                      <span className="font-semibold text-slate-700">
                        {(operationalContext.incomingTickets / Math.max(1, derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.resolvesTotal[currentPeriodIndex], 0))).toFixed(2)}x
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Availability Loss</span>
                      <span className="font-semibold text-slate-700">{operationalContext.availabilityLoss}%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-500">Operational Resilience</div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">
                        {teamYearlyDistribution.advanced >= 4 && analysis.filter((item) => item.recommendation.includes("Focused support")).length <= 2 ? "Strong" : teamYearlyDistribution.advanced >= 2 ? "Stable" : "Fragile"}
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Capability Spread
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    Reflects how broadly operational capability is distributed across the workforce rather than concentrated within a small number of people.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-500">Operational Strain</div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">
                        {operationalContext.backlog > 400 || operationalContext.queueAge > 5 || operationalContext.availabilityLoss > 15 || (operationalContext.incomingTickets / Math.max(1, derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.resolvesTotal[currentPeriodIndex], 0))) > 1.1 ? "Emerging" : operationalContext.backlog > 150 || operationalContext.queueAge > 2.5 ? "Elevated" : "Controlled"}
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Demand Pressure
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    Interprets hidden operational pressure signals including backlog growth, queue ageing, incoming demand and workforce availability reduction.
                  </p>
                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Open Backlog</span>
                      <span className="font-semibold text-slate-700">{operationalContext.backlog}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Queue Age</span>
                      <span className="font-semibold text-slate-700">{operationalContext.queueAge.toFixed(1)} days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold">Workforce Signals</h3>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-amber-900">Sustained Operational Load</div>
                          <div className="mt-1 text-xs text-amber-800">Visible workforce patterns indicating sustained operational workload exposure which may warrant additional leadership awareness and operational context.</div>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                          {derivedTeamMembers.filter((agent) => agent.inputs.touchesTotal[currentPeriodIndex] > 850).length} people
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {derivedTeamMembers
                          .filter((agent) => agent.inputs.touchesTotal[currentPeriodIndex] > 850)
                          .map((agent) => (
                            <span key={agent.name} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-amber-200">
                              {agent.name}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-red-900">Emerging Quality Risk</div>
                          <div className="mt-1 text-xs text-red-800">Visible overlap between sustained operational throughput and declining customer experience indicators.</div>
                        </div>
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-900">
                          {derivedTeamMembers.filter((agent) => agent.metrics.csat[currentPeriodIndex] < 75 && agent.inputs.touchesTotal[currentPeriodIndex] > 800).length} people
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {derivedTeamMembers
                          .filter((agent) => agent.metrics.csat[currentPeriodIndex] < 75 && agent.inputs.touchesTotal[currentPeriodIndex] > 800)
                          .map((agent) => (
                            <span key={agent.name} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-red-200">
                              {agent.name}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-green-900">Operational Stabilising Influence</div>
                          <div className="mt-1 text-xs text-green-800">Visible operational consistency patterns contributing positively to broader workforce resilience and delivery stability.</div>
                        </div>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-900">
                          {analysis.filter((item) => item.averageScore >= 3.3 && !item.recommendation.includes("Focused support")).length} people
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysis
                          .filter((item) => item.averageScore >= 3.3 && !item.recommendation.includes("Focused support"))
                          .map((item) => (
                            <span key={item.agent.name} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-green-200">
                              {item.agent.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold">Operational System Signals</h3>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Backlog Momentum</div>
                          <div className="mt-1 text-xs text-slate-600">Interprets whether operational demand appears likely to outpace delivery throughput.</div>
                        </div>
                        <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-800">
                          {operationalContext.incomingTickets > derivedTeamMembers.reduce((sum, agent) => sum + agent.inputs.resolvesTotal[currentPeriodIndex], 0) ? "Growing" : "Stable"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Operational Dependency Risk</div>
                          <div className="mt-1 text-xs text-slate-600">Highlights whether operational throughput and operational stability appear increasingly concentrated within a smaller capability group.</div>
                        </div>
                        <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-800">
                          {derivedTeamMembers.filter((agent) => agent.inputs.resolvesTotal[currentPeriodIndex] > 190).length <= 3 ? "Elevated" : "Distributed"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Operational Sustainability</div>
                          <div className="mt-1 text-xs text-slate-600">Looks for visible signs of throughput pressure potentially impacting service sustainability.</div>
                        </div>
                        <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-800">
                          {derivedTeamMembers.filter((agent) => agent.inputs.touchesTotal[currentPeriodIndex] > 800 && agent.metrics.csat[currentPeriodIndex] < 80).length >= 2 ? "Emerging Pressure" : "Stable"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold">Operational Interpretation</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Operational Intelligence extends beyond coaching signals into organisational capability interpretation.</p>
                    <p>Operational indicators are normalised using simulated average daily workforce exposure rather than static nominal headcount.</p>
                    <p>This proof of concept estimates average daily headcount using operational shift exposure, assuming a standard five-day full-time working pattern across a 22-working-day operational month.</p>
                    <p>This layer is intended to support broader leadership and operational decisions rather than individual performance judgement.</p>
                    <p>Operational interpretation can additionally incorporate hidden operational telemetry such as backlog growth, queue ageing, incoming demand and workforce availability pressure.</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold">Capability Distribution</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-sm">
                      <span>Performance Recovery</span>
                      <span className="font-semibold">{teamYearlyDistribution.recovery}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-green-100 px-4 py-3 text-sm">
                      <span>Operational Range</span>
                      <span className="font-semibold">{teamYearlyDistribution.operationalRange}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-green-600/20 px-4 py-3 text-sm">
                      <span>Advanced Capability</span>
                      <span className="font-semibold">{teamYearlyDistribution.advanced}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
