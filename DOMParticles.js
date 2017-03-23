  function DOMParticles (options) {
    // TODO: implement friction.
    
    // Physical parameters.
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.maxspeed = 10;
    this.acceleration = .1;
    this.angle = 0;
    this.weight = 100;
    this.friction = null;
    
    // Other options.
    this.dom = null;
    this.visible = true;
    this.container = document.body;
    // TODO: Attach event handler to recalc on resize.
    this.container_size = this.container.getBoundingClientRect();
    this.className = 'particle';
    this.styles = {};
    this.paused = false;
    
    // Time relevance.
    this.accel_tick = 0;
    
    // Override defaults.
    for (var i in options) {
      this[i] = options[i];
    }
    
    // TODO: option to create element or use canvas.
    this.dom = _createElement(this.container,this.className,this.styles);
    this.dom.particle = this;
    
    // Derivative.
    this.size = this.dom.getBoundingClientRect();
    this.center = {x:this.x+this.size.width/2,y:this.y+this.size.height/2};
    // Velocity is calculated every frame.
    this.velocity = {x:0,y:0};
    this.collision_angle = false;
    this.collision_speed = false;
    this.overlap_angle = false;

    
    this.move = function () {
      if (this.paused) {
        return;
      }
      this.accelerate();
      
      if (this.collision_angle !== false) {
        this.angle = this.collision_angle;
        this.collision_angle = false;
      }
      if (this.collision_speed !== false) {
        this.speed = this.maxspeed = this.collision_speed;
        this.collision_speed = false;
      }
      if (this.overlap_angle !== false) {
        var speed = this.speed;
        var angle = this.angle;
        this.speed = 20;
        this.angle = this.overlap_angle;
        this.overlap_angle = false;
        this.move();
        this.speed = speed;
        this.angle = angle;
      }

      this.radian = this.angle*Math.PI/180;
      this.velocity.x = Math.cos(this.radian)*this.speed;
      this.velocity.y = Math.sin(this.radian)*this.speed;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      
      // Set center coordinate.
      this.center = {x:this.x+this.size.width/2,y:this.y+this.size.height/2};
      
      // TODO: more collision options.
      //this.detectCollision();
    }

    this.accelerate = function () {
      if (this.speed < this.maxspeed) {
        // Smootherstep (s-curve from 0-1).
        var x = this.accel_tick/(1/this.acceleration);
        var step = Math.pow(x,3)*(x*(x*6-15)+10);
        this.speed = this.maxspeed*step;
        this.speed = (this.maxspeed-this.speed < .01) ? this.maxspeed : this.speed;
        this.accel_tick += 1/this.weight;
      }
    }

    this.moveElement = function () {
      this.move();
      this.drawElement();
    }
    
    this.drawElement = function () {
      this.dom.style.transform = 'translate('+this.x+'px,'+this.y+'px)';
      // TODO: Implement canvas drawing of HTML elements.
    }
    
    this.detectCollision = function () {
      var bounding = this.container.getBoundingClientRect();

      if (this.y+this.size.height >= bounding.bottom ||
            this.y <= bounding.top) {
        this.angle = 360-this.angle;
      }
      if (this.x+this.size.width >= bounding.right ||
          this.x <= bounding.left) {
        this.angle = -this.angle+540;
 
      }
      this.angle %= 360;


      var hit = this.detectSiblingCollision();
      if (hit) {
        this.collide(hit);
      }
      
    }
    
    this.collide = function (hit) {
      var dx = this.center.x-hit.center.x;
      var dy = this.center.y-hit.center.y;

      // Normalize:
      var da = _angleFromVector(dx,dy);
      var dr = da*Math.PI/180;
      var dx = Math.cos(dr);
      var dy = Math.sin(dr);

      var a1 = _dot(this.velocity, {x:dx,y:dy});
      var a2 = _dot(hit.velocity, {x:dx,y:dy});

      var p = (2 * (a1 - a2));// / (this.weight + hit.weight);

      var newx = this.velocity.x - dx*p;//*this.weight;
      var newy = this.velocity.y - dy*p;//*this.weight;

      var newa = _angleFromVector(newx,newy);
      
      var speed_old = Math.abs(this.velocity.x) + Math.abs(this.velocity.y);
      var speed_new = Math.abs(newx) + Math.abs(newy);

      this.collision_angle = newa;
      this.collision_speed = this.speed * (speed_new/speed_old/2);
    }
    
    // TODO: Should this be in ParticleEngine?
    this.detectSiblingCollision = function () {
      var siblings = _self.particles;

      for (var i=0; i<siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling == this || sibling.paused) {
          continue;
        }
        
        if (this.detectCircularCollision(sibling)) {
          return sibling;
        }
      }
    }
    this.detectCircularCollision = function (sibling) {
      var a = this.center.x-sibling.center.x;
      var b = this.center.y-sibling.center.y;
      var c = Math.sqrt(a*a+b*b);
      var d = this.size.width/2+sibling.size.width/2
      
      if (c <= d) {
        return true;
      }
      return false;
    }
    
    this.detectSquareCollision = function (sibling) {

    }
    
    function _createElement (container, className, styles) {
      var div = document.createElement('div');
      div.className = className;
      for (var i in styles) {
        div.style[i] = styles[i];
      }
      container.appendChild(div);
      return div;
    }
    
    function _dot (v1, v2) {
      return v1.x * v2.x + v1.y * v2.y;
    }
  }
  
  function _angleFromVector(x, y) {
    var a = Math.atan(y/x)*180/Math.PI;
    if (x < 0 && y < 0) {
      return a+180;
    }
    // If only one axis is negative, so will be the angle, so an extra
    // 90deg is added. (90+90, 270+90);
    else if (x < 0) {
      return a+180;
    }
    else if (y < 0) {
      return a+360;
    }
    return a;
  }
}
