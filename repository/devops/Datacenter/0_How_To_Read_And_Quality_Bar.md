# 0 — How to read this track (plain language + quality bar)

[README](./README.md) · [0b glossary →](./0b_Equipment_In_Plain_Language.md) · [0c whole-hall map →](./0c_Whole_Hall_Mental_Map.md) · [On-ramp 1 →](./1_On_Prem_As_A_Solution.md)

---

## 1. Concepts — who this is for

You do **not** need to be an electrician, mechanical engineer, or network PE to learn this track. You need curiosity and patience. Every deep chapter assumes you may be meeting the word for the first time.

**A datacenter** is a building (or a hall inside one) whose job is to keep computers **powered, cool, connected, and physically safe**—24×7. Software runs *on* that metal. Cloud is often many of these buildings behind an API.

### How to read any chapter

1. Read **Concepts** as a story: what is this thing, where does it sit, why does IT care?  
2. Read **Disconfirm** (myths): wrong ideas people bring from elsewhere.  
3. Read **Advanced** only after Concepts clicks.  
4. Do the **Confirm** check: if you cannot answer it, re-read Concepts—do not fake it.  
5. Use **Applications** and the staff checklist as practice, not decoration.  
6. **References** are official docs for deeper lookup—not homework to memorize.

### Suggested first week

| Day | Read |
|-----|------|
| 1 | This file + [0b](./0b_Equipment_In_Plain_Language.md) + [0c whole-hall map](./0c_Whole_Hall_Mental_Map.md) |
| 2–3 | On-ramp [1](./1_On_Prem_As_A_Solution.md)–[3](./3_Facility_Power_Cooling_And_Rooms.md) |
| 4 | [Setup-And-Bring-Up/1](./Setup-And-Bring-Up/1_Hall_Network_Mental_Map.md) (planes) + [Integration/11](./Integration/11_Aggregate_Telemetry_Reports_And_Steering.md) |
| 5–7 | On-ramp [4](./4_Rack_BMC_And_Provisioning.md)–[6](./6_Storage_Backup_And_Restore.md) or Setup [2](./Setup-And-Bring-Up/2_Crate_To_Live_Rack.md)–[8](./Setup-And-Bring-Up/8_Server_Setup_Playbook.md) |
| Later | Deep tracks by role ([Jobs/1](./Jobs/1_Role_Map.md)) |

---

## 2. Quality bar (what “good” means in these articles)

Every Datacenter article aims for this bar. If a chapter fails it, that is a bug—not “reader weakness.”

| Rule | Meaning |
|------|---------|
| **Define on first use** | Spell the acronym, then say what it *does* in one plain sentence |
| **Mental map** | Diagram or ASCII near the top—planes/paths, not only paragraphs |
| **Asset plate** | For physical gear: photo or labeled SVG under `Assets/Datacenter/` with “what to notice” |
| **Where it sits** | Room, rack, or screen—so you can picture it |
| **Why IT/apps care** | Link to outage, throttle, ticket, or bill |
| **Disconfirm** | Explicit “this is **not** …” for common mix-ups |
| **Confirm** | 2–4 questions you can answer without looking |
| **Failure mode** | What breaks and what you see |
| **Operator experience** | Optional lore (verify locally)—never a substitute for standards |
| **Global variant** | Same job, different voltage/name—skills transfer |
| **No persona meta** | Teach jobs, not “customer vs employee” storytelling |
| **Official References** | Pointers to standards/vendor docs—not scraped blogs |

### Disconfirm / confirm (how learning sticks)

- **Disconfirm** kills a wrong mental model early (e.g. “two power cords ≠ two power plants”).  
- **Confirm** proves the right model landed (e.g. “point to where A and B first share a board”).  

If you only memorize names, you will fail on the floor. If you can **trace a path** and **spot a fake redundancy**, you are learning.

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| Absolute beginner | 0 → 0b → on-ramp 1–3 → Integration 11 |
| SE joining colo work | On-ramp 1–12, then Provider-Use |
| Facilities-curious SE | 0b + Electrical/Mechanical Concepts only first |
| Study check | After each chapter, write Confirm answers in your notes |

**Confirm (this file)**

1. What four jobs does a datacenter hall sell to computers?  
2. What should you do if a term appears without a definition?  
3. What is the difference between Disconfirm and Confirm?  

**Disconfirm**

- This track is **not** a PE license course.  
- This track is **not** “memorize every OEM model.”  
- Cloud IAM chapters live in [Cloud/](../Cloud/README.md)—not here.

---

## References

- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- Datacenter [README](./README.md) staircase  
