# Assets — Datacenter

Component photos and diagrams for the Datacenter track. **Download here; do not hotlink.** Credit every use in the topic MD.

## Layout

| Folder | Use |
|--------|-----|
| `Integration/` | Whole-hall layer plate |
| `Electrical/` | Street → chip power path |
| `Mechanical/` | Heat / airflow loop |
| `White-Space/` | Rack elevation sketch |
| `Facility/` | Site / product types |
| `Compute/` | Server anatomy; chassis photos |
| `Accelerators/` | GPU power-density plate |
| `Setup-And-Bring-Up/` | Bring-up playbook plates (rack, switch, AP, RAID, planes) |
| `Fabric-Physical/` | Leaf–spine, ToR/MMR sketches |
| `Storage-Physical/` | RAID board, disk-bay sketches |

## Credit table (maintain when adding files)

| File | Source | License / note | Shows |
|------|--------|----------------|-------|
| `Integration/whole-hall-layers.svg` | Handbook original | handbook | Five layers of the product |
| `Electrical/power-path-street-to-chip.svg` | Handbook original | handbook | Utility → PSU chain |
| `Mechanical/heat-airflow-loop.svg` | Handbook original | handbook | Cold → IT → hot → plant |
| `White-Space/rack-elevation-sketch.svg` | Handbook original | handbook | U map / A-B / ToR |
| `Facility/site-product-types.svg` | Handbook original | handbook | Colo / wholesale / edge |
| `Compute/server-anatomy.svg` | Handbook original | handbook | Chassis blocks |
| `Accelerators/gpu-power-density.svg` | Handbook original | handbook | kW vs U pressure |
| `Setup-And-Bring-Up/server-rack-populated.jpg` | [Wikimedia Foundation Servers-8055 13](https://commons.wikimedia.org/wiki/File:Wikimedia_Foundation_Servers-8055_13.jpg) | Commons | Populated IT racks |
| `Setup-And-Bring-Up/network-switch-front.jpg` | [3Com OfficeConnect Gigabit Switch 8](https://commons.wikimedia.org/wiki/File:3Com_OfficeConnect_Gigabit_Switch_8_(2698444087).jpg) | Commons | Switch faceplate (illustrative) |
| `Setup-And-Bring-Up/patch-panel-fiber.jpg` | Wikimedia Commons photographic hit (see git history / EXIF) | Commons | Patch / fiber field context |
| `Setup-And-Bring-Up/wifi-access-point.jpg` | [Access-point-wireless](https://commons.wikimedia.org/wiki/File:Access-point-wireless.jpg) | Commons | Wi‑Fi AP |
| `Setup-And-Bring-Up/hall-planes-map.svg` | Handbook original | handbook | Plane separation map |
| `Setup-And-Bring-Up/raid-concept.svg` | Handbook original | handbook | Disks → logical volume |
| `Fabric-Physical/leaf-spine-concept.svg` | Handbook original | handbook | Leaf–spine sketch |
| `Storage-Physical/raid-levels-board.svg` | Handbook original | handbook | RAID 0/1/5/6/10 |
| `Storage-Physical/disk-bay-front.svg` | Handbook original | handbook | Hot-swap bay sketch |
| `Compute/rack-server-front.jpg` | Same family as WMF servers plate | Commons | Hall server context |

## Rules

1. Prefer Wikimedia Commons, Open Compute Project public figures, or handbook-original SVG.  
2. You review plates before treating as “looks like our gear.”  
3. Caption in MD: what to **notice**, not just a filename.  
4. Topic path example: `![…](../../Assets/Datacenter/Setup-And-Bring-Up/….jpg)`  
5. Track chapter **1** files should embed the matching mental-map SVG near the top.  
