# Core principles: The Three Ways, CALMS, and constraints

[← Back to Methodologies](./README.md)

If you only memorize tools, you will copy the wrong ones. These principles are what serious DevOps teaching starts with — from *The DevOps Handbook* / *The Phoenix Project* (Gene Kim et al.) and the widely used **CALMS** lens (often credited in the DevOps community to Jez Humble and others). Learn them before Jenkins vs GitHub Actions debates.

---

## What DevOps is (and is not)

**DevOps** is a way of working so that building, shipping, and running software are one feedback system — culture, practices, and automation together — to deliver value to users **faster and safer**.

| DevOps is | DevOps is not |
|-----------|----------------|
| Shared ownership from commit → production | A job title that replaces thinking |
| Small batches, fast feedback, continual learning | “We installed Kubernetes” |
| Automation in service of flow and safety | Automation theater with the same silos |
| Measured improvement (DORA and friends) | A single vendor toolchain |

Microsoft, Atlassian, AWS, and DORA all describe the same shape: **culture + practices + tools**, with culture as the hard part. Tools alone do not create DevOps.

---

## The Three Ways (DevOps Handbook)

Source: [IT Revolution — The Three Ways](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/).

### First Way — Flow (left → right)

Optimize the **whole** path from idea to user, not local heroics in Dev or Ops alone.

- Make work visible; limit WIP  
- Reduce handoffs and wait time  
- Never pass known defects downstream  
- Seek small batch sizes  

→ Practices: trunk-based development, CI, deployment automation ([4](./4_Branching_And_PR_Practices.md), [CiCd/](../CiCd/README.md)).

### Second Way — Feedback (right → left)

Shorten and amplify feedback from prod and users back to builders.

- Telemetry, alerts, fast test feedback  
- Peer review that teaches, not theater  
- Stop the line when quality is wrong  

→ Practices: observability, shift-left tests/security, on-call ([3](./3_Team_Patterns_SRE_Incident.md), [Observability/](../Observability/README.md), [Security/](../Security/README.md)).

### Third Way — Continual learning and experimentation

Build a culture that experiments, practices recovery, and improves daily work.

- Time for improvement, not only features  
- Rituals that reward learning from failure  
- Repetition / game days to build mastery  

→ Practices: blameless postmortems, chaos/resilience experiments (literacy in [3](./3_Team_Patterns_SRE_Incident.md)), learning reviews.

```text
  FLOW                 FEEDBACK              LEARNING
  Idea ──► Prod        Prod ──► Builders     Improve the system
  (First Way)          (Second Way)          (Third Way)
```

---

## CALMS (adoption lens)

CALMS is a checklist for whether an org is adopting DevOps in balance — not a competing religion to the Three Ways.

| Letter | Meaning | Beginner check |
|--------|---------|----------------|
| **C**ulture | Trust, collaboration, shared ownership | Do Dev and Ops share outcomes? |
| **A**utomation | Automate repetitive, error-prone steps | Is deploy still a hero ritual? |
| **L**ean | Value over waste; small batches; limit WIP | Are we optimizing the queue? |
| **M**easurement | Evidence over opinion | Do we look at DORA / SLIs? |
| **S**haring | Knowledge, runbooks, pairing, guilds | Is expertise trapped in one head? |

If you only automate (A) without culture (C) and measurement (M), you get a faster mess. See also TechTarget / industry CALMS summaries; treat vendor blogs as secondary to Handbook + DORA.

---

## Theory of Constraints (ToC) — enough for DevOps

A system’s throughput is limited by its **bottleneck**. Improving non-bottlenecks does not improve the system.

In delivery, common constraints: slow code review, flaky tests, waiting for environments, CAB queues, knowledge silos.

**Practice:** map the value stream ([11](./11_Value_Streams_And_Lean_Flow.md)), find the constraint, fix that first. Do not “optimize” a step that is not limiting flow.

---

## How to use this as a beginner

1. Read this file once.  
2. When you learn a tool, ask: which Way does it serve — flow, feedback, or learning?  
3. When your team stalls, ask: which CALMS letter is weak? Where is the constraint?  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Memorizing CALMS as buzzwords | Use the beginner checks above on a real team |
| Local optimization (faster builds, same CAB delay) | Attack the constraint |
| “Three Ways” posters without changing batch size | Change how work flows |

## Next

- Lean flow + value streams: [11_Value_Streams_And_Lean_Flow.md](./11_Value_Streams_And_Lean_Flow.md)  
- How Agile / Lean / ITSM relate: [12_Agile_Lean_ITSM_And_DevOps.md](./12_Agile_Lean_ITSM_And_DevOps.md)  
- Culture in depth: [1_DevOps_Culture_And_Collaboration.md](./1_DevOps_Culture_And_Collaboration.md)

## Further reading (primary)

- [The Three Ways — Gene Kim / IT Revolution](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/)  
- *The DevOps Handbook* (Kim, Humble, Debois, Willis) — principles then practices  
- [DORA capability catalog](https://dora.dev/capabilities/) — researched practices tied to performance  
