<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Incident Copilot — Interactive Flow Charts</title>
<style>
    :root{
      --bg:#0b1020;
      --panel:#121a33;
      --panel2:#0f1630;
      --card:#18224a;
      --text:#e8ecff;
      --muted:#aab3da;
      --accent:#7c5cff;
      --accent2:#22c55e;
      --warn:#f59e0b;
      --danger:#ef4444;
      --line:rgba(232,236,255,.15);
      --shadow: 0 10px 30px rgba(0,0,0,.35);
      --radius:16px;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
      background: radial-gradient(1200px 800px at 10% 10%, rgba(124,92,255,.25), transparent 55%),
                  radial-gradient(900px 600px at 90% 30%, rgba(34,197,94,.18), transparent 55%),
                  var(--bg);
      color:var(--text);
    }
    header{
      padding:24px 20px 14px;
      max-width:1200px;
      margin:0 auto;
    }
    h1{
      margin:0 0 6px;
      font-size:20px;
      letter-spacing:.2px;
      font-weight:700;
    }
    .subtitle{
      margin:0;
      color:var(--muted);
      font-size:13px;
      line-height:1.35;
    }
    .wrap{
      max-width:1200px;
      margin:0 auto;
      padding:0 20px 28px;
      display:grid;
      grid-template-columns: 1.55fr .95fr;
      gap:16px;
    }
    .tabs{
      display:flex;
      gap:10px;
      flex-wrap:wrap;
      padding:12px;
      background:rgba(18,26,51,.65);
      border:1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(8px);
    }
    .tabbtn{
      border:1px solid var(--line);
      background: linear-gradient(180deg, rgba(24,34,74,.9), rgba(15,22,48,.9));
      color:var(--text);
      padding:10px 12px;
      border-radius: 12px;
      cursor:pointer;
      font-weight:650;
      font-size:13px;
      transition:.18s transform, .18s border-color, .18s background;
      user-select:none;
    }
    .tabbtn:hover{ transform: translateY(-1px); border-color: rgba(124,92,255,.55); }
    .tabbtn.active{
      border-color: rgba(124,92,255,.9);
      background: linear-gradient(180deg, rgba(124,92,255,.22), rgba(24,34,74,.95));
    }
 
    .board{
      margin-top:12px;
      background:rgba(18,26,51,.55);
      border:1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow:hidden;
    }
    .boardHeader{
      padding:14px 14px 10px;
      border-bottom:1px solid var(--line);
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:10px;
      background: linear-gradient(180deg, rgba(24,34,74,.55), rgba(18,26,51,.25));
    }
    .boardTitle{
      margin:0;
      font-size:14px;
      font-weight:750;
    }
    .boardHint{
      margin:2px 0 0;
      font-size:12px;
      color:var(--muted);
    }
    .boardActions{
      display:flex;
      gap:8px;
      align-items:center;
      flex-wrap:wrap;
      justify-content:flex-end;
    }
    .chip{
      font-size:12px;
      color:var(--muted);
      border:1px solid var(--line);
      padding:7px 10px;
      border-radius:999px;
      background:rgba(15,22,48,.6);
      user-select:none;
    }
    .btn{
      font-size:12px;
      color:var(--text);
      border:1px solid var(--line);
      padding:8px 10px;
      border-radius:999px;
      background:rgba(24,34,74,.7);
      cursor:pointer;
      user-select:none;
    }
    .btn:hover{ border-color: rgba(124,92,255,.55); }
 
    /* Flow layout */
    .flow{
      padding:14px;
      display:none;
    }
    .flow.active{ display:block; }
 
    .lane{
      display:grid;
      grid-template-columns: 1fr;
      gap:12px;
      max-width:720px;
      margin:0 auto;
      padding:6px 0 16px;
    }
    .node{
      border:1px solid var(--line);
      border-radius: 14px;
      background: linear-gradient(180deg, rgba(24,34,74,.85), rgba(15,22,48,.75));
      padding:12px 12px;
      box-shadow: 0 8px 22px rgba(0,0,0,.28);
      cursor:pointer;
      transition: .15s transform, .15s border-color, .15s box-shadow;
      position:relative;
    }
    .node:hover{ transform: translateY(-1px); border-color: rgba(124,92,255,.6); }
    .node.selected{
      border-color: rgba(124,92,255,.95);
      box-shadow: 0 10px 28px rgba(124,92,255,.18);
    }
    .nodeTop{
      display:flex;
      justify-content:space-between;
      gap:10px;
      align-items:flex-start;
    }
    .nodeTitle{
      margin:0;
      font-size:13px;
      font-weight:800;
      letter-spacing:.2px;
      line-height:1.25;
    }
    .badge{
      font-size:11px;
      padding:4px 8px;
      border-radius:999px;
      border:1px solid var(--line);
      color:var(--muted);
      background: rgba(15,22,48,.55);
      white-space:nowrap;
    }
    .badge.ok{ color: rgba(34,197,94,.95); border-color: rgba(34,197,94,.35); }
    .badge.warn{ color: rgba(245,158,11,.95); border-color: rgba(245,158,11,.35); }
    .badge.danger{ color: rgba(239,68,68,.95); border-color: rgba(239,68,68,.35); }
    .nodeDesc{
      margin:8px 0 0;
      font-size:12px;
      color:var(--muted);
      line-height:1.35;
    }
    .arrow{
      text-align:center;
      color:rgba(232,236,255,.35);
      font-size:18px;
      user-select:none;
    }
 
    /* Right panel */
    .side{
      background:rgba(18,26,51,.55);
      border:1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow:hidden;
      height: fit-content;
      position: sticky;
      top: 14px;
      align-self:start;
    }
    .sideHeader{
      padding:14px;
      border-bottom:1px solid var(--line);
      background: linear-gradient(180deg, rgba(24,34,74,.55), rgba(18,26,51,.25));
    }
    .sideTitle{
      margin:0;
      font-size:14px;
      font-weight:850;
    }
    .sideSub{
      margin:6px 0 0;
      font-size:12px;
      color:var(--muted);
      line-height:1.35;
    }
    .sideBody{
      padding:14px;
    }
    .kv{
      display:grid;
      gap:10px;
    }
    .kvRow{
      border:1px solid var(--line);
      border-radius:14px;
      padding:10px 10px;
      background: rgba(15,22,48,.55);
    }
    .k{
      font-size:11px;
      color:var(--muted);
      margin:0 0 6px;
      letter-spacing:.2px;
      text-transform:uppercase;
    }
    .v{
      margin:0;
      font-size:12.5px;
      line-height:1.35;
      color:var(--text);
      white-space:pre-wrap;
    }
 
    .footerNote{
      max-width:1200px;
      margin:0 auto;
      padding:0 20px 26px;
      color:rgba(232,236,255,.55);
      font-size:12px;
      line-height:1.35;
    }
 
    @media (max-width: 980px){
      .wrap{ grid-template-columns: 1fr; }
      .side{ position:relative; top:auto; }
      .lane{ max-width: none; }
    }
</style>
</head>
<body>
<header>
<h1>Incident Copilot — Interactive Flow Charts</h1>
<p class="subtitle">
      Click any step to view details. Use tabs to switch between problems, solution workflow, decision logic, and Queue Health Score.
</p>
</header>
 
  <div class="wrap">
<div>
<div class="tabs" id="tabs"></div>
 
      <div class="board">
<div class="boardHeader">
<div>
<p class="boardTitle" id="boardTitle">—</p>
<p class="boardHint" id="boardHint">—</p>
</div>
<div class="boardActions">
<span class="chip" id="statsChip">0 steps</span>
<button class="btn" id="resetBtn" type="button">Reset selection</button>
</div>
</div>
 
        <div class="flow" id="flowContainer"></div>
</div>
</div>
 
    <aside class="side">
<div class="sideHeader">
<p class="sideTitle">Details</p>
<p class="sideSub" id="detailsIntro">Select a node to see the explanation.</p>
</div>
<div class="sideBody">
<div class="kv" id="detailsKv">
<div class="kvRow">
<p class="k">Tip</p>
<p class="v">For PPT/demo: click through the nodes top-to-bottom while explaining the story (problem → workflow → decision → outcomes).</p>
</div>
</div>
</div>
</aside>
</div>
 
  <div class="footerNote">
    Notes: This is a standalone HTML (no external libraries). You can rename labels, reorder steps, or add screenshots later.
</div>
 
<script>
  const data = [
    {
      id: "problems_current",
      tab: "Problems we are solving",
      title: "Current process pain points",
      hint: "Why manual triage & monitoring causes delays and SLA risk.",
      steps: [
        {
          id: "p1",
          title: "Manual Incident Triage (Current)",
          badge: { text: "Problem", kind: "warn" },
          short: "Engineers manually analyze new SAP incidents.",
          details: {
            "What happens today":
              "New Incident → Open ServiceNow → Search old tickets manually → Analyze similar issues → Perform RCA → Assign ticket → Resolve incident",
            "Problems":
              "- Historical incidents search takes too much time\n- Similar incidents are hard to identify\n- Repeated investigations waste effort\n- Knowledge stays locked in closed tickets"
          }
        },
        {
          id: "p2",
          title: "SLA breaches",
          badge: { text: "Problem", kind: "danger" },
          short: "Critical tickets are identified late; queues aren’t monitored continuously.",
          details: {
            "Problems":
              "- Critical tickets are identified late\n- Continuous queue monitoring is difficult\n- SLA breach prediction is missing"
          }
        },
        {
          id: "p3",
          title: "Customer updates are missed",
          badge: { text: "Problem", kind: "warn" },
          short: "Customer comments get added later; engineers must keep checking manually.",
          details: {
            "Problems":
              "- Customer updates are missed\n- Manual comment-checking creates delays\n- Important updates can be overlooked"
          }
        },
        {
          id: "p4",
          title: "No real-time notifications",
          badge: { text: "Problem", kind: "warn" },
          short: "Engineers must keep watching the ServiceNow dashboard.",
          details: {
            "Problems":
              "- Need to continuously monitor dashboard\n- No instant visibility when new incidents enter queue"
          }
        }
      ]
    },
 
    {
      id: "solution_workflow",
      tab: "Solution workflow",
      title: "Incident Copilot — real-time workflow",
      hint: "ServiceNow → automation → AI engines → human review → notifications & analytics.",
      steps: [
        { id:"s1", title:"ServiceNow", badge:{text:"Source", kind:"ok"}, short:"Incident created in ServiceNow.", details:{
          "Role":"Primary incident source (enterprise system of record).",
          "Input signals":"New incident, updates/comments, SLA fields, priority, assignment group."
        }},
        { id:"s2", title:"REST API / Webhook", badge:{text:"Ingestion", kind:"ok"}, short:"Events/data pushed out from ServiceNow.", details:{
          "Why":"Near real-time data capture without manual polling.",
          "Output":"Incident payload for automation layer."
        }},
        { id:"s3", title:"Power Automate", badge:{text:"Automation", kind:"ok"}, short:"Extracts, cleans, standardizes ticket data.", details:{
          "Key tasks":"- Extract fields\n- Clean HTML tags\n- Deduplicate comments\n- Standardize inconsistent formats",
          "Why it matters":"Improves AI quality and reduces hallucinations."
        }},
        { id:"s4", title:"Dataverse", badge:{text:"Data", kind:"ok"}, short:"Stores new + 7,409 historical incidents.", details:{
          "Why real data wins":"Grounds the system in enterprise history: patterns, recurrence, resolution quality.",
          "Scale":"7,409 historical SAP incidents (as provided)."
        }},
        { id:"s5", title:"Copilot Studio (AI agent)", badge:{text:"Orchestration", kind:"ok"}, short:"Routes to similarity search, RCA, confidence, and decision logic.", details:{
          "Responsibilities":"- Orchestrate steps\n- Generate recommendation\n- Decide Human Review vs Escalation"
        }},
        { id:"s6", title:"Similarity Search Engine", badge:{text:"AI", kind:"ok"}, short:"Retrieves & ranks similar historical incidents.", details:{
          "Output":"Top 5 similar incidents (from top 20 candidates).",
          "Signals used":"Subject, Description, Component, Resolution patterns, Historical keywords."
        }},
        { id:"s7", title:"RCA Engine", badge:{text:"AI", kind:"ok"}, short:"Generates root cause + resolution + preventive actions.", details:{
          "Inputs":"Top 5 similar incidents + historical patterns",
          "Outputs":"Root cause, recommended fix, preventive actions."
        }},
        { id:"s8", title:"Confidence Engine", badge:{text:"Scoring", kind:"ok"}, short:"Computes confidence score using weighted factors.", details:{
          "Factors & weights":
            "- Similar incident count: 30%\n- Similarity score: 30%\n- Resolution source: 15%\n- Recurrence indicator: 15%\n- AI confidence: 10%",
          "Formula":
            "Confidence = 0.30×SimilarCount + 0.30×SimilarityScore + 0.15×ResolutionSource + 0.15×Recurrence + 0.10×AIConfidence"
        }},
        { id:"s9", title:"Decision Engine", badge:{text:"Routing", kind:"warn"}, short:"Chooses AI Recommendation vs Human Review vs Escalation.", details:{
          "Decision logic":
            "- Confidence ≥ 75% → AI Recommendation\n- 40%–75% → Human Review\n- < 40% → Immediate Escalation",
          "Why":"Keeps risky outputs under human control."
        }},
        { id:"s10", title:"Teams Notifications", badge:{text:"Realtime", kind:"ok"}, short:"Pushes alerts (new incident, customer update, SLA risk, queue entry).", details:{
          "Alert types":"- New incident alerts\n- Customer update alerts\n- Queue-based alerts\n- High-priority incident alerts\n- SLA breach alerts"
        }},
        { id:"s11", title:"Power Apps Review Queue", badge:{text:"Human-in-loop", kind:"warn"}, short:"Engineers review medium-confidence or complex cases.", details:{
          "Purpose":"Human validation + correction + final assignment.",
          "Result":"Improves trust and auditability."
        }},
        { id:"s12", title:"Power BI Dashboard", badge:{text:"Analytics", kind:"ok"}, short:"Ops visibility: trends, SLA risk, queue health.", details:{
          "What it enables":"- Management reporting\n- Continuous improvement\n- Proactive operations"
        }},
      ]
    },
 
    {
      id: "decision_logic",
      tab: "Decision logic",
      title: "How recommendations are controlled",
      hint: "Confidence-driven routing reduces risk and improves SLA outcomes.",
      steps: [
        { id:"d1", title:"Compute confidence score", badge:{text:"Scoring", kind:"ok"}, short:"Confidence is computed from multiple factors.", details:{
          "Factors & weights":
            "- Similar incident count: 30%\n- Similarity score: 30%\n- Resolution source: 15%\n- Recurrence history: 15%\n- AI confidence: 10%"
        }},
        { id:"d2", title:"Confidence ≥ 75%", badge:{text:"Auto", kind:"ok"}, short:"AI Recommendation (high confidence).", details:{
          "Action":"Provide recommended RCA + resolution + preventive actions.",
          "Why it helps":"Speeds up triage and reduces repeated investigations."
        }},
        { id:"d3", title:"40%–75%", badge:{text:"Review", kind:"warn"}, short:"Human Review in Power Apps queue.", details:{
          "Action":"Engineer reviews and approves/edits recommendation.",
          "Why":"Balances speed with safety."
        }},
        { id:"d4", title:"< 40%", badge:{text:"Escalate", kind:"danger"}, short:"Immediate escalation.", details:{
          "Action":"Route to senior/on-call / critical path immediately.",
          "Why":"Avoids SLA breaches and reduces risk of wrong automation."
        }},
      ]
    },
 
    {
      id: "queue_health",
      tab: "Queue Health Score",
      title: "Queue Health Score (judge-impress feature)",
      hint: "Turns reactive incident management into proactive incident intelligence.",
      steps: [
        { id:"q1", title:"Open tickets", badge:{text:"Signal", kind:"warn"}, short:"Current backlog size.", details:{
          "Definition":"Count of open incidents in queue.",
          "Why it matters":"High backlog correlates with SLA risk and slower triage."
        }},
        { id:"q2", title:"SLA risk", badge:{text:"Signal", kind:"danger"}, short:"How close tickets are to breaching SLA.", details:{
          "Includes":"Remaining time, priority, breach probability.",
          "Outcome":"Proactive alerts on high-risk tickets."
        }},
        { id:"q3", title:"Customer updates", badge:{text:"Signal", kind:"warn"}, short:"New/important customer comments detected.", details:{
          "Why":"Missed updates cause delays and poor customer experience.",
          "Action":"Notify engineers instantly."
        }},
        { id:"q4", title:"Priority distribution", badge:{text:"Signal", kind:"warn"}, short:"How many P1/P2 vs lower-priority tickets.", details:{
          "Why":"Even moderate backlog becomes critical if high-priority concentration is high."
        }},
        { id:"q5", title:"Single Health Score", badge:{text:"Output", kind:"ok"}, short:"One number to represent queue health.", details:{
          "Story for judges":
            "Queue Health Score combines backlog + SLA risk + customer updates + priority distribution into a single metric. This enables proactive ops decisions and targeted staffing before SLAs breach."
        }},
      ]
    },
  ];
 
  const tabsEl = document.getElementById("tabs");
  const flowContainer = document.getElementById("flowContainer");
  const boardTitle = document.getElementById("boardTitle");
  const boardHint = document.getElementById("boardHint");
  const statsChip = document.getElementById("statsChip");
  const detailsKv = document.getElementById("detailsKv");
  const detailsIntro = document.getElementById("detailsIntro");
  const resetBtn = document.getElementById("resetBtn");
 
  let activeFlowId = data[0].id;
  let selectedNodeId = null;
 
  function badgeClass(kind){
    if(kind === "ok") return "ok";
    if(kind === "warn") return "warn";
    if(kind === "danger") return "danger";
    return "";
  }
 
  function renderTabs(){
    tabsEl.innerHTML = "";
    data.forEach(flow => {
      const b = document.createElement("button");
      b.className = "tabbtn" + (flow.id === activeFlowId ? " active" : "");
      b.textContent = flow.tab;
      b.onclick = () => {
        activeFlowId = flow.id;
        selectedNodeId = null;
        renderAll();
        renderDetails(null);
      };
      tabsEl.appendChild(b);
    });
  }
 
  function renderFlow(){
    const flow = data.find(f => f.id === activeFlowId);
    boardTitle.textContent = flow.title;
    boardHint.textContent = flow.hint;
    statsChip.textContent = `${flow.steps.length} steps`;
 
    flowContainer.innerHTML = "";
    flowContainer.className = "flow active";
 
    const lane = document.createElement("div");
    lane.className = "lane";
 
    flow.steps.forEach((step, idx) => {
      const node = document.createElement("div");
      node.className = "node" + (step.id === selectedNodeId ? " selected" : "");
      node.setAttribute("data-nodeid", step.id);
 
      node.innerHTML = `
<div class="nodeTop">
<div>
<p class="nodeTitle">${step.title}</p>
</div>
<div class="badge ${badgeClass(step.badge?.kind)}">${step.badge?.text ?? ""}</div>
</div>
<p class="nodeDesc">${step.short ?? ""}</p>
      `;
 
      node.onclick = () => {
        selectedNodeId = step.id;
        renderFlow(); // re-render to highlight selection
        renderDetails(step);
      };
 
      lane.appendChild(node);
 
      if(idx < flow.steps.length - 1){
        const arr = document.createElement("div");
        arr.className = "arrow";
        arr.textContent = "↓";
        lane.appendChild(arr);
      }
    });
 
    flowContainer.appendChild(lane);
  }
 
  function renderDetails(step){
    detailsKv.innerHTML = "";
 
    if(!step){
      detailsIntro.textContent = "Select a node to see the explanation.";
      detailsKv.innerHTML = `
<div class="kvRow">
<p class="k">How to present</p>
<p class="v">1) Start with “Problems we are solving”.\n2) Switch to “Solution workflow”.\n3) Show “Decision logic” to build trust.\n4) End with “Queue Health Score” as a standout feature.</p>
</div>
      `;
      return;
    }
 
    detailsIntro.textContent = step.title;
 
    const entries = step.details || {};
    Object.keys(entries).forEach(key => {
      const row = document.createElement("div");
      row.className = "kvRow";
      row.innerHTML = `
<p class="k">${key}</p>
<p class="v">${entries[key]}</p>
      `;
      detailsKv.appendChild(row);
    });
  }
 
  function renderAll(){
    renderTabs();
    renderFlow();
  }
 
  resetBtn.onclick = () => {
    selectedNodeId = null;
    renderFlow();
    renderDetails(null);
  };
 
  // initial
  renderAll();
  renderDetails(null);
</script>
</body>
</html>
