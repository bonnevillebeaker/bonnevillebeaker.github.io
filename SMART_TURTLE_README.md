# Smart Turtle browser port

Open `Smart_Turtle.html` through the Bonneville Beaker site or deploy the folder to GitHub Pages.
The calculation is performed entirely in the visitor's browser. No Python installation or server is required.

Files:
- `Smart_Turtle.html`: standalone tool page
- `smart-turtle.js`: interface, exact isotope calculation, graph rendering, download/copy actions
- `smart-turtle-data.js`: isotope masses and natural-abundance table
- `smart-turtle.css`: tool-specific responsive styling
- `smart_turtle_cropped_soft_edges.png`: mascot image

The browser port implements the v1.21 analytic convolution approach from the uploaded Python application. It supports formula parsing, selected adducts, charge states, D/13C/15N/18O enrichment, labelable hydrogens (nL), resolving power, baseline noise, fixed m/z windows, overlaid runs, centroid/profile display, text output, copy, reset, and PNG export.

License: GPL v3.0 or later. Isotope data attribution remains with Scientific Instrument Services.
