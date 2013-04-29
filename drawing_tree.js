// From: https://github.com/OpenTechSchool/js-beginners-day1/blob/gh-pages/examples/drawing_tree.js
var leaves = [];

function Leaf(coords) {
  this.x = coords.x;
  this.y = coords.y;
  this.offsetX = 0;
  this.colors = [ "green", "orange", "yellow" ];
  this.currentColor = 0;
  this.direction = (Math.floor(Math.random() * 2) == 1);
  this.getX = function() {
    return this.x + this.offsetX;
  }
  this.blow = function() {
    if (this.direction) {
      this.offsetX++;
    } else {
      this.offsetX--;
    }
    if (Math.abs(this.offsetX) > 3) {
      this.direction = !this.direction;
    }
  }
  this.color = function () {
    return this.colors[this.currentColor];
  }
  this.age = function() {
    if (this.currentColor < this.colors.length - 1) {
      this.currentColor++;
    } else {
      this.falling = true;
    }
  }
}

// use_html: drawing.html
function branch(thickness) {
  // Give the branches individuality by randomizing their length
  // (between 2 and 5 times their thickness)
  var height = thickness * (2 + Math.random() * 3);
  // Draw this branch
  color("black");
  box(-thickness / 2, height, thickness, height);

  // Go to the end of this branch
  moveTo(0, height);
  if (thickness < 2) {
    // Draw a leaf, and nothing more, if this branch is very thin
    addLeaf();
  } else {
    // Draw two branches springing from this branch, rotated at
    // 30-degree angles
    rotate(-30);
    branch(thickness * 0.8);
    goBack();
    rotate(30);
    branch(thickness * 0.8);
    goBack();
  }
  // Clears the moveTo above
  goBack();
}

function addLeaf() {
  leaves.push(new Leaf(absolutePosition(0,0)));
}

function drawLeaf(leaf) {
  circle(0, 0, 5);
}

function drawLeaves(cutoffHeight, windCutoffHeight) {
  for (var i=0; i<leaves.length; i++) {
    var leaf = leaves[i];
    color(leaf.color());
    circle(leaf.getX(), Math.max(leaf.y, cutoffHeight), 5);
    if (leaf.falling) {
      leaf.y--;
      if (leaf.y > windCutoffHeight) {
        leaf.blow();
      }
    }
  }
}

function ageOneLeaf() {
  var leaf = leaves[Math.floor(Math.random() * leaves.length)];
  leaf.age();
}

function drawing() {
  // Draw the trunk, which in turn draws branches, and so on.
  var seedId = Math.random();
  var treeBase = -100;
  moveTo(0, treeBase);
  branch(16);
  goBack();
  var imgData = copyRectangle(-200, 300, 400, 600);
  setInterval(redraw, 20);
  function redraw() {
    // Move down to make room for tree crown
    pasteRectangle(imgData, -200, 300);
    drawLeaves(treeBase, treeBase + 100);
    ageOneLeaf();
  }
}

// The following functions are available:
//
//  color(string)            - set the current color
//  lineWidth(number)        - set the line width
//  box(x, y, width, height) - draw a box
//  circle(x, y, radius)     - draw a circle
//  line(x1, y1, x2, y2)     - draw a line
//  text(x, y, string)       - draw text
//  clear()                  - clear the screen
//  path(string)             - draw a complex line
//    In a line description, the following commands are valid:
//    g x y - go to point x,y without drawing
//    l x y - draw a line from the current point to point x,y
//    c     - draw a line back to the start of the line
//    q x y cx cy - draw a curve to x,y, using cx,cy as
//                  'control point' to determine the curvature
//
//  fill()                   - fill the current path with the current color
//
// Coordinates are interpreted as if 0,0 is the center of the
// screen. x is the horizontal axis, and y the vertical.
// Positive x goes to the left, positive y goes up.
// These operations can transform the coordinate system:
//
//  moveTo(x, y)    - move the origin to x, y
//  rotate(degrees) - rotate subsequent drawing operations
//                    by a number of degrees
//  scale(factor)   - scale subsequent drawing operations
//  goBack()        - undo one transformation
