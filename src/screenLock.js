
class ScreenLock{
  radius = 30; //原点半径
  padding = 20;  //边距
  screenWidth = document.body.offsetWidth;
  ninePoint = [];
  selectedPoint = [];
  defaultColor = "#92ca02";
  hammer;

  constructor(){
    this.init();
  }

  init() {
    let canvas = document.querySelector('#canvas');
    this.ctx  = canvas.getContext("2d");

    this.getRatio();
    this.ctx.scale(this.ratio, this.ratio);
    this.ctx.translate(0.5, 0.5);

    canvas.width = canvas.height = this.screenWidth * this.ratio;
    this.canvas = canvas;

    this.caculateNinePoint()
    this.drawPoint()
    this.selectedPoint = [];
  }

  getRatio() {
    const ctx = this.ctx;
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;
    this.ratio = devicePixelRatio / backingStoreRatio;
  }

  /**
   * 计算是否经过某一个点
   * @param {经过的点坐标} point 
   */
  cavulateOverPoint(point){
    for(let i = 0,len = this.ninePoint.length; i< len; i++) {
      const item = this.ninePoint[i];
      const _x = Math.abs(item.x - point.pageX * this.ratio);
      const _y = Math.abs(item.y - point.pageY * this.ratio);
      const _z = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));

      if (_z <= this.radius && !this.selectedPoint.includes(item)) {
        this.selectedPoint.push(item)
        break
      }
    }
  }

  /**
   * 绘制经过的轨迹线条
   */
  drawLine(){
    const data = this.selectedPoint;
    const ctx = this.ctx;
    if(!data.length) {
      return
    }
    ctx.beginPath()
    ctx.strokeStyle = this.defaultColor;
    ctx.lineWidth = 10 * this.ratio;
    this.selectedPoint.map(item=>{
      ctx.lineTo(item.x, item.y)
    })
    ctx.stroke();
    ctx.closePath();
  }

  /** 
   * 绘制经过的圆点
  */
  drawSelectPoint() {
    const data = this.selectedPoint;
    const ctx = this.ctx;
    if (!data.length) {
      return
    }
    data.map(item => {
      this.drawCircle(ctx, this.defaultColor, item, this.radius)
      this.drawCircle(ctx, '#fff', item, this.radius- 2)
      this.drawCircle(ctx, this.defaultColor, item, this.radius - 16)
    })
  }
  /**
   * 画圆
   * @param {*} ctx 
   * @param {*} color 
   * @param {*} item 
   * @param {*} radius 
   */
  drawCircle(ctx, color, item, radius) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(item.x, item.y, radius * this.ratio, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
  /** 
   * 绘制初始化的圆点
  */
  drawPoint() {
    let ctx = this.ctx;
    this.ninePoint.map((item, k)=>{
      this.drawCircle(ctx, '#ccc', item, this.radius)
      this.drawCircle(ctx, '#fff', item, this.radius - 3)
      // this.drawSelectPoint(k, item)
    })
  }

  /**
   * 计算九个点的坐标
   */
  caculateNinePoint() {
    let arr = [];
    let space = (this.screenWidth - this.radius * 2 * 3 - this.padding * 2) * this.ratio / 2;
    for( let i=0; i<3; i++) {
      for(let j=0;j<3; j++) {
        arr.push({
          x: this.padding * this.ratio + (i * 2 + 1) * this.radius * this.ratio + space * i,
          y: this.padding * this.ratio + (j * 2 + 1) * this.radius * this.ratio + space * j,
        })
      }
    }
    this.ninePoint = arr;
  }
}

const screen_lock = new ScreenLock();

screen_lock.canvas
  .addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    screen_lock.cavulateOverPoint(touch)
  }, false)
screen_lock.canvas
  .addEventListener('touchmove', (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    screen_lock.cavulateOverPoint(touch)
    screen_lock.drawLine()
    screen_lock.drawSelectPoint()
  }, false)
screen_lock.canvas
  .addEventListener('touchend', (e) => {
    console.log(screen_lock.selectedPoint)
    screen_lock.init()
  }, false)