function setup() {
  createCanvas(800,600)
  root = new Numball(null, null)
  root.x = width/2
  root.y = 50 // height/2
  root.s = 0
  root.addVal(50)
  for (var i=0; i<10; i++) {
    root.addVal(floor(random(1,100)))
    root.tie()
    root.fly()
  }
}

function draw() {
  background(51)
  root.tie()
  root.fly()
  root.show()
  // for (var b in balls) {
  //   balls[b].tie()
  //   balls[b].fly()
  //   balls[b].show()
  // }
}

function Numball(parent, side) {
  Ball.call(this, parent)
  this.val = null
  this.left = null
  this.right = null
  this.side = side
}
Numball.prototype = Object.create(Ball.prototype);
Numball.prototype.constructor = Numball;

Numball.prototype.addVal = function (n) {
  if (this.val == null) {
    this.val = n
  } else if (this.val > n) {
    if (this.left == null) {
      this.left = new Numball(this, 0)
      this.left.x = this.x
      this.left.y = this.y + 50
    }
    this.left.addVal(n)
  } else if (this.val < n) {
    if (this.right == null) {
      this.right = new Numball(this, 1)
      this.right.x = this.x
      this.right.y = this.y + 50
    }
    this.right.addVal(n)
  }
}

Numball.prototype.show = function() {
  //Ball.prototype.show.call(this)
  if (this.target == null) stroke(255)
  else if (this.target.val > this.val) stroke(97,175,239)
  else if (this.target.val < this.val) stroke(224,108,117)
  strokeWeight(2)
  noFill()
  bsize = 30
  ellipse(this.x, this.y, bsize, bsize)
  if (this.target != null) {
    a = atan2(this.target.y - this.y, this.target.x - this.x)
    line(this.x+bsize/2*cos(a), this.y+bsize/2*sin(a), this.target.x-bsize/2*cos(a), this.target.y-bsize/2*sin(a))
  }
  fsize = 16
  textSize(fsize)
  fill(255)
  strokeWeight(1)
  if (this.val > 9) {
    text(this.val, this.x - fsize/1.9, this.y + fsize/2.6)
  } else {
    text(this.val, this.x - fsize/3.8, this.y + fsize/2.6)
  }
  if (this.left != null) this.left.show()
  if (this.right != null) this.right.show()
}

Numball.prototype.tie = function() {
  Ball.prototype.tie.call(this)
  if (this.left != null) this.left.tie()
  if (this.right != null) this.right.tie()
}

Numball.prototype.fly = function() {
  Ball.prototype.fly.call(this)
  if (this.left != null) this.left.fly()
  if (this.right != null) this.right.fly()
}

function Ball(target) {
  this.x = random(100, width-100)
  this.y = random(100, height-100)
  this.a = random(-PI, PI)
  this.s = 1
  this.target = target
  Ball.balls.push(this)
}
Ball.balls = []

Ball.prototype.fly = function () {
  this.x += this.s * cos(this.a)
  this.y += this.s * sin(this.a)
  if (this.target != null) {
    a = atan2(this.target.y - this.y, this.target.x - this.x)
    // this.x = this.target.x - 50*cos(a)
    // this.y = this.target.y - 50*sin(a)
  }
}

Ball.prototype.tie = function () {
  sx = this.s * cos(this.a)
  sy = this.s * sin(this.a)
  if (this.target != null) {
    d = ((this.x - this.target.x)**2 + (this.y - this.target.y)**2)**0.5
    a = atan2(this.target.y - this.y, this.target.x - this.x)
    this.a = atan2(sin(this.a)*99 + sin(a), cos(this.a)*99 + cos(a))
    tielength = 30
    sx += (d-tielength)/24 * cos(a)
    sy += (d-tielength)/24 * sin(a)
    var balls = Ball.balls
    for (var b in balls) {
      if (this == balls[b]) continue
      if (this.target == balls[b].target) continue
      d = dist(this.x, this.y, balls[b].x, balls[b].y)
      dx = this.x - balls[b].x
      dy = this.y - balls[b].y
      da = atan2(dy, dx)
      fleeforce = 12**4
      sx += fleeforce/d**3*cos(da)
      sy += fleeforce/d**3*sin(da)
    }
    // da = atan2(root.y - this.y, root.x - this.x)
    // sx -= .1*cos(da)
    // sy -= .1*sin(da)
    sy += 1
    if (this.side == 0) sx -= 1
    if (this.side == 1) sx += 1
  }
  this.s = (sx**2 + sy**2)**0.5
  this.a = atan2(sy, sx)
  this.s *= .70
}

Ball.prototype.show = function () {
  stroke(255)
  strokeWeight(2)
  noFill()
  bsize = 30
  ellipse(this.x, this.y, bsize, bsize)
  if (this.target != null) {
    a = atan2(this.target.y - this.y, this.target.x - this.x)
    line(this.x+bsize/2*cos(a), this.y+bsize/2*sin(a), this.target.x-bsize/2*cos(a), this.target.y-bsize/2*sin(a))
  }
}

function mouseReleased() {
  if (
    mouseX > 0 && mouseX < width &&
    mouseY > 0 && mouseY < height
  ) {
    root.addVal(floor(random(1,100)))
    // for (b in Ball.balls) {
    //   Balls.balls[b].s = 100
    // }
  }
}
