// This is the JS file for the touch triggered lightning
/* 
The function to set the static connection points (positionConnectors)
is in the lightning.js file since they need to be adjusted anytime the canvas resizes
Canvas resizing function is in the lightning.js file
*/
let touch = false;
let tchTarget;
let tchLightning;

class TchLightning {
  constructor(thickness, roughness, segHeight) {
    this.thickness = thickness;
    this.roughness = roughness;
    this.minSegmentHeight = segHeight;
    this.threshold = .4;
    this.tlvLn = [];
    this.colour;
    this.shadowColour;
    this.radius1 = 20;
    this.radius2 = 5;
  }

  setColours() {
    const colourLight = `hsl(180, 80%, 80%)`;
    const colourDark = `hsl(187, 100%, 89%)`;
    if(checkMode()) {
      this.colour = colourDark;
      this.shadowColour = colourDark;
    } else {
      this.colour = colourLight;
      this.shadowColour = colourLight;
    }
  }
  cast(ctx, start, end) {
    if (!start || !end) {
      return;
    }

    let distance = Math.sqrt(Math.pow(end.x - start.x, 2));
    if (this.threshold && distance > cvsTch.width * this.threshold) {
      return;
    }
    let segmentHeight = Math.sqrt(Math.pow(end.y - start.y, 2));
    this.tlvLn = [];
    // Starting point of the lightning strike
    this.tlvLn.push(start);
    // Ending point of the lightning strike
    this.tlvLn.push(end);
    let currDiff = cvsTch.width / 10;
    while (segmentHeight > this.minSegmentHeight) {
      let newSegments = [];
      for (let i = 0; i < this.tlvLn.length - 1; i++) {
        const first = this.tlvLn[i];
        const last = this.tlvLn[i + 1];
        const midX = (first.x + last.x) / 2;
        const newX = midX + (Math.random() * 2 - 1) * currDiff;
        newSegments.push(first, {x: newX, y: (first.y + last.y) / 2});
      }
      // Add the ending point to the segment array
      newSegments.push(this.tlvLn.pop());
      // Update the lightning strike with the new segments;
      this.tlvLn = newSegments;
      
      currDiff /= roughness;
      segmentHeight /= 2;
    }
    
    this.setColours();
    this.tchLine(ctx);
    this.tchCircle(ctx, 0, this.radius1);
    this.tchCircle(ctx, this.tlvLn.length - 1, this.radius2);
  }
  tchLine(ctx) {
    ctx.strokeStyle = this.colour;
    ctx.shadowColor = this.shadowColour;
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.lineWidth = this.thickness;
    for (var i = 0; i < this.tlvLn.length; i++) {
      ctx.lineTo(this.tlvLn[i].x, this.tlvLn[i].y);
    }
    ctx.stroke();
  }
  tchCircle(ctx, index, radius) {
    ctx.beginPath();
    ctx.arc(this.tlvLn[index].x, this.tlvLn[index].y, radius, 0, 2*Math.PI);
    let gradient = ctx.createRadialGradient(
      this.tlvLn[index].x, this.tlvLn[index].y, radius * .05,
      this.tlvLn[index].x, this.tlvLn[index].y, radius * .85
    );
    gradient.addColorStop(0, 'hsla(187, 100%, 95%, .5');
    gradient.addColorStop(1, 'hsla(0, 0%, 100%, .05');
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  clear(ctx) {
    ctx.clearRect(0, 0, cvsTch.width, cvsTch.height);
    ctx.beginPath();
  }
}

function createTchLightning(t, r, h) {
  tchLightning = new TchLightning(t, r, h);
}

function tchAnimate() {
  if (touch) {
    tchLightning.clear(ctxTch);
    tchConnectors.forEach(c => {
      tchLightning.cast(ctxTch, c, tchTarget);
    });
  }
  setTimeout(() => {
    this.tchAnimate();
  }, 60);
}