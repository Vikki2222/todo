Internal MOM: Presentation Debrief

Incident Copilot — Jury Feedback & Action Items

Jury Feedback & Action Items

1. The idea is strong, but the problem statement and solution were presented in bits and pieces rather than as one structured, end-to-end narrative.

Rebuild the presentation as a single narrative arc: Problem → Root Cause → Solution Architecture → Decision Logic → Outcomes — in that fixed order, every time.
Open with a one-slide problem summary (all 4 pain points together) before touching any solution content.
Add explicit transition lines between sections so the jury never has to infer how one slide connects to the next.

2. The decision-making algorithm should rely less on manual review — too much of the flow currently routes to a human.

Re-examine the confidence thresholds (≥75% auto, 40–75% review, <40% escalate) and tighten the review band so fewer borderline cases fall into it.
Introduce an adaptive calibration loop (see working note below) so the system relies on manual review less over time, not just less by threshold tuning.
Present a rough estimate of what % of tickets we expect to fall in each band, to make "less manual review" a measurable claim, not just a design intent.

3. The core logic behind the confidence score needs to be explained more clearly — the jury could not follow how the score is actually derived.

Add one dedicated slide that walks through the formula factor-by-factor with a worked example (one real-looking ticket, scored end-to-end).
Replace the bare formula with a visual breakdown (e.g. stacked bar of the 5 weighted factors) so the "why" is visible, not just the "what".
State explicitly why each factor is weighted the way it is (e.g. why similarity score and similar-incident count are weighted highest).

4. The solution should be benchmarked against the most optimal solution available, and we should show how close our approach gets to it.

Define what "optimal" means for this problem (e.g. an expert engineer's triage time/accuracy, or a fully manual baseline) and use it as the benchmark, not a vague competitor comparison.
Pull or estimate baseline metrics (avg. manual triage time, avg. RCA accuracy) to compare against projected system metrics.
Add a simple before/after or us-vs-baseline slide with 2–3 concrete numbers rather than a qualitative claim.
3. Working Note — Should the Algorithm Lean Toward Manual Review When Errors Rise?

This question came up while discussing points 2 and 3 together: if human reviewers keep correcting the AI's recommendation for a particular type of incident, should the system start routing more of that type to manual review — rather than staying at a fixed confidence threshold forever?

Short answer: yes, and it directly strengthens both feedback points. The current design (a static weighted formula with fixed 40%/75% cutoffs) has no memory of its own accuracy. Two changes would fix that:

3.1 Add an accuracy feedback loop

Every time a ticket passes through Human Review, log whether the reviewer accepted, edited, or rejected the AI's recommendation.
Aggregate this into an override rate, tracked per incident category / component (the same "flagged rate per category" pattern already used elsewhere in the project for trend tracking).
Feed that override rate back into the Confidence Engine as a 6th factor, or as a multiplier applied after the existing weighted score.

3.2 Let the threshold move, not just the score

Categories with a low override rate (reviewers rarely change the AI's call) can safely have their auto-approve threshold relaxed slightly over time — this is what actually reduces reliance on manual review, addressing point 2 with evidence instead of just a fixed cutoff.
Categories with a high override rate get a temporarily stricter threshold, so more of those specific tickets route to review until the pattern causing the errors is understood — this is the direct answer to "if too many people make mistakes, does it lean toward manual review": yes, for that category, until the override rate drops back down.
This also gives point 3 (explain the confidence score) a much stronger story: the score isn't static, it's a system that visibly gets better at knowing when to trust itself.

Framing for the next deck: describe this as a "self-calibrating confidence loop" — it answers points 2 and 3 in one mechanism, and gives point 4 (benchmarking) a natural metric to report over time: override rate trending down = the system closing the gap to the optimal (expert-engineer) baseline.
