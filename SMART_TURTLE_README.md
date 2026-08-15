# Smart Turtle Mass Spectrometry Simulator browser port

This version runs entirely in the browser and does not require Python on the visitor's computer.

## Files

- `Smart_Turtle.html` — standalone simulator page and reusable iframe page
- `smart-turtle.js` — exact isotope calculation engine, interface logic, SVG export, and neutromer aggregation
- `smart-turtle-data.js` — isotope masses and natural abundance data
- `smart-turtle.css` — standalone and embedded interface styling
- `smart_turtle.svg` — simulator mascot

## Simulator capabilities

- Exact analytic isotope distributions using mass-keyed convolution
- Chemical formulas with nested parentheses
- Natural abundance or user-defined 2H, 13C, 15N, and 18O enrichment
- Element-specific labelable-site controls (`nL,H`, `nL,C`, `nL,N`, and `nL,O`)
- Positive and negative adducts, including singly and doubly charged ions
- Profile and centroid spectrum rendering
- Optional centroid/text aggregation by additional-neutron count (M0, M+1, M+2, …)
- Overlay runs, graph reset, copyable numerical output, and true vector SVG export

## Science Made Easy integration

`Science_Made_Easy.html` provides **Topics** and **Tools** menus. Both the first topic, `Understanding_Mass_Spectrometry.html`, and Smart Turtle Mass Spectrometry Simulator can be opened as movable/resizable workspace panes or in standalone browser tabs. The workspace saves pane position and size in the browser.

## License and attribution

The simulator remains GPL v3.0. Keep `SMART_TURTLE_LICENSE.txt` and the source copyright notices with redistributed or modified versions.

Isotope masses and natural-abundance data are attributed to Scientific Instrument Services, matching the desktop project's existing attribution.


## Neutromers

The optional neutromer view combines isotope fine-structure peaks that share the same additional-neutron count (M0, M+1, M+2, …). Their exact masses can differ slightly because nuclear binding energy produces isotope-specific mass defects.

- Default resolving power: 3000
