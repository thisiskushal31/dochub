# Availability in Numbers

## What it is

Availability is how much of the time the service is **up and able to serve**. It’s usually expressed as **uptime** (or downtime) as a **percentage** of time. People often talk in “**nines**”: e.g. 99.99% = “four nines.”

---

## Why we need it

To set **targets** (SLOs) and to **reason about** systems: if you have multiple components, their combined availability depends on whether they are in **sequence** (request passes through one then the other) or in **parallel** (redundant paths). The math below is how the topic is presented in the cloned repos.

---

## Availability in numbers (tables)

### 99.9% availability — three nines

| Duration           | Acceptable downtime |
|--------------------|----------------------|
| Downtime per year  | 8h 45min 57s         |
| Downtime per month | 43m 49.7s            |
| Downtime per week  | 10m 4.8s             |
| Downtime per day   | 1m 26.4s             |

### 99.99% availability — four nines

| Duration           | Acceptable downtime |
|--------------------|----------------------|
| Downtime per year  | 52min 35.7s          |
| Downtime per month | 4m 23s               |
| Downtime per week  | 1m 5s                |
| Downtime per day   | 8.6s                 |

(Exact numbers can vary slightly with how the year/month is defined; use an uptime calculator for your target.)

---

## Availability in parallel vs in sequence

If a service is made of **multiple components** that can fail, **overall availability** depends on whether those components are used **in sequence** or **in parallel**. The repos present this as follows.

### In sequence

A request must pass through **both** components (e.g. app server then database). Overall availability **goes down**:

```
Availability (Total) = Availability (Foo) × Availability (Bar)
```

Example: If Foo and Bar each have **99.9%** availability, total in sequence = **99.9% × 99.9% ≈ 99.8%**.

So: **minimize critical chains**; each link in the chain reduces total availability.

### In parallel

The two components are **redundant** (e.g. two replicas; the request can be served by either). Overall availability **goes up**:

```
Availability (Total) = 1 - (1 - Availability (Foo)) × (1 - Availability (Bar))
```

Example: If Foo and Bar each have **99.9%** availability, total in parallel = **1 - (0.001 × 0.001) = 99.9999%**.

So: **add redundancy in parallel** where high availability matters; avoid long chains in sequence.

---

## When to use

Use these numbers to **set SLOs** (e.g. “four nines”) and to **design** systems: put redundant components in parallel and keep the critical path short so the product of availabilities in sequence doesn’t drop too low.
