import "./App.css";
import { useState } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function GithubNode({ data }) {
  return (
    <div className="github-node">
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = {
  github: GithubNode,
};

const defaultEdge = {
  type: "smoothstep",
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#3fb950",
  },
  style: {
    stroke: "#3fb950",
    strokeWidth: 2,
  },
};

const allNodes = [
  {
    id: "ticket",
    type: "github",
    data: { label: "New Ticket" },
    position: { x: 100, y: 300 },
  },
  {
    id: "confidence",
    type: "github",
    data: { label: "Confidence Score" },
    position: { x: 500, y: 300 },
  },
  {
    id: "autoroute",
    type: "github",
    branch: "above90",
    data: { label: "Auto-route + Suggested Fix" },
    position: { x: 1000, y: 150 },
  },
  {
    id: "resolution",
    type: "github",
    branch: "above90",
    data: { label: "Resolution" },
    position: { x: 1450, y: 150 },
  },
  {
    id: "rca",
    type: "github",
    branch: "above90",
    data: { label: "RCA Agent" },
    position: { x: 1900, y: 150 },
  },
  {
    id: "manual",
    type: "github",
    branch: "below90",
    data: { label: "Manual Review Queue" },
    position: { x: 1000, y: 500 },
  },
  {
    id: "pattern",
    type: "github",
    branch: "below90",
    data: { label: "Pattern Detection" },
    position: { x: 1450, y: 500 },
  },
  {
    id: "recurrence",
    type: "github",
    branch: "below90",
    data: { label: "Recurrence Engine" },
    position: { x: 1900, y: 500 },
  },
  {
    id: "human",
    type: "github",
    branch: "below90",
    data: { label: "Human Review" },
    position: { x: 2350, y: 500 },
  },
  {
    id: "dashboard",
    type: "github",
    data: { label: "Power BI Dashboard" },
    position: { x: 2800, y: 325 },
  },
];

const allEdges = [
  {
    id: "e1",
    source: "ticket",
    target: "confidence",
    label: "Triage Agent",
    ...defaultEdge,
  },
  {
    id: "e2",
    source: "confidence",
    target: "autoroute",
    label: "Confidence > 90%",
    branch: "above90",
    ...defaultEdge,
  },
  {
    id: "e3",
    source: "confidence",
    target: "manual",
    label: "Confidence < 90%",
    branch: "below90",
    ...defaultEdge,
  },
  {
    id: "e4",
    source: "autoroute",
    target: "resolution",
    branch: "above90",
    label: "Similarity Grounded",
    ...defaultEdge,
  },
  {
    id: "e5",
    source: "resolution",
    target: "rca",
    branch: "above90",
    label: "Human Resolves",
    ...defaultEdge,
  },
  {
    id: "e6",
    source: "rca",
    target: "dashboard",
    branch: "above90",
    label: "Drafts Structured RCA",
    ...defaultEdge,
  },
  {
    id: "e7",
    source: "manual",
    target: "pattern",
    branch: "below90",
    label: "Human Classifies",
    ...defaultEdge,
  },
  {
    id: "e8",
    source: "pattern",
    target: "recurrence",
    branch: "below90",
    label: "vs RCA Repository",
    ...defaultEdge,
  },
  {
    id: "e9",
    source: "recurrence",
    target: "human",
    branch: "below90",
    label: "Flag + Count",
    ...defaultEdge,
  },
  {
    id: "e10",
    source: "human",
    target: "dashboard",
    branch: "below90",
    label: "Approve / Reject",
    ...defaultEdge,
  },
];

export default function App() {
  const [visibleNodes, setVisibleNodes] = useState(["ticket"]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [rfInstance, setRfInstance] = useState(null);
  const [autoFitView, setAutoFitView] = useState(true);

  const handleNodeClick = (_, node) => {
  if (node.branch) {
    setSelectedBranch(node.branch);
  }

  const nextNodes = allEdges
    .filter((edge) => edge.source === node.id)
    .map((edge) => edge.target);

  setVisibleNodes((prev) => [
    ...new Set([...prev, node.id, ...nextNodes]),
  ]);

  if (autoFitView) {
    setTimeout(() => {
      rfInstance?.fitView({
        padding: 0.5,
        duration: 800,
      });
    }, 100);
  }
};

  const resetFlow = () => {
  setVisibleNodes(["ticket"]);
  setSelectedBranch(null);

  setTimeout(() => {
    rfInstance?.fitView({
      padding: 1,
      duration: 800,
    });
  }, 100);
};

const showFullFlow = () => {
  setVisibleNodes(allNodes.map((n) => n.id));

  setTimeout(() => {
    rfInstance?.fitView({
      padding: 0.5,
      duration: 1000,
    });
  }, 100);
};

  const nodes = allNodes
    .filter((n) => visibleNodes.includes(n.id))
    .map((n) => ({
      ...n,
      style: {
        opacity:
          selectedBranch &&
          n.branch &&
          n.branch !== selectedBranch
            ? 0.25
            : 1,

        filter:
          selectedBranch &&
          n.branch &&
          n.branch !== selectedBranch
            ? "blur(2px)"
            : "none",
      },
    }));

  const edges = allEdges
    .filter(
      (e) =>
        visibleNodes.includes(e.source) &&
        visibleNodes.includes(e.target)
    )
    .map((e) => ({
      ...e,
      style: {
        stroke: "#3fb950",
        strokeWidth:
          e.branch === selectedBranch ? 3 : 2,
        opacity:
          selectedBranch &&
          e.branch &&
          e.branch !== selectedBranch
            ? 0.2
            : 1,
      },
    }));

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="toolbar">
        <button className="github-btn" onClick={resetFlow}>
          Reset Flow
        </button>
        <button
  className="github-btn"
  onClick={() => setAutoFitView(!autoFitView)}
>
  {autoFitView
    ? "Stop Auto Full View"
    : "Enable Auto Full View"}
</button>

        <button
          className="github-btn"
          onClick={showFullFlow}
        >
          Show Full Flow
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onInit={setRfInstance}
        fitView
        minZoom={0.01}
        maxZoom={4}
      >
        <Background color="#30363d" gap={24} />
        <Controls />
      </ReactFlow>
    </div>
  );
}



html,
body,
#root {
  margin: 0;
  width: 100%;
  height: 100%;
}

.react-flow {
  background: #0d1117;
}

.github-node {
  min-width: 280px;

  background: #161b22;

  color: #c9d1d9;

  border: 1px solid #3fb950;

  border-radius: 8px;

  padding: 18px;

  font-size: 15px;

  font-weight: 600;

  box-shadow:
    0 8px 24px rgba(1, 4, 9, 0.85);

  transition: all 0.25s ease;
}

.react-flow__edge-text {
  fill: #56d364;
  font-size: 12px;
  font-weight: 600;
}

.react-flow__controls {
  background: #161b22;
  border: 1px solid #30363d;
}

.react-flow__controls button {
  background: #161b22;
  color: #c9d1d9;
}

.github-btn {
  background: #21262d;
  color: #c9d1d9;

  border: 1px solid #3fb950;

  border-radius: 6px;

  padding: 10px 16px;

  cursor: pointer;

  font-weight: 600;

  transition: all 0.2s ease;
}

.github-btn:hover {
  background: #30363d;
  border-color: #56d364;
}

.toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 999;
  display: flex;
  gap: 10px;
}

.github-btn {
  background: #21262d;
  color: #c9d1d9;
  border: 1px solid #3fb950;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.github-btn:hover {
  background: #30363d;
}

html,
body,
#root {
  margin: 0;
  width: 100%;
  height: 100%;
}

.react-flow {
  background: #f5f5f5;
}

.react-flow__edge-text {
  font-size: 12px;
  font-weight: 600;
  fill: #444;
}

.react-flow__node {
  text-align: center;
}
