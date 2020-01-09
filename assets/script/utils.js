let C = {};

//获取鼠标在元素上的坐标
C.getOffset = function (ele) {
  let mouse = { x: 0, y: 0 };
  ele.addEventListener('mousemove', function (e) {
    let { x, y } = C.eventWrapper(e);
    mouse.x = x;
    mouse.y = y;
  })
  return mouse;
}

//坐标系转换
C.eventWrapper = function (ev) {
  let { pageX, pageY, target } = ev;
  let { left, top } = target.getBoundingClientRect();
  return { x: pageX - left, y: pageY - top };
}

//角度转弧度
C.toRad = function (angle) {
  return angle * Math.PI / 180
}

//弧度转角度
C.toAngle = function (rad) {
  return rad * 180 / Math.PI
}

//生成随机数
C.rp = function (arr, int) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const num = Math.random() * (max - min) + min;
  return int ? Math.round(num) : num;
}

//生成随机颜色
C.createColor = function () {
  return `rgb(${C.rp([55, 255], true)}, ${C.rp([55, 255], true)}, ${C.rp([55, 255], true)})`;
}

//矩形之间的碰撞检测，x和y坐标为矩形的左上角的坐标
//矩形1的最左边的临界坐标为矩形2的最优边，矩形1的最右边的临界边为矩形2的最左边；矩形1的最上边的临界边矩形2的最下边，矩形1的最下边的临界边为矩形2的最上边；
C.rectDuang = function (rect1, rect2) {
  return (rect1.x + rect1.w >= rect2.x && rect1.x <= rect2.x + rect2.w && rect1.y <= rect2.y + rect2.h && rect1.y + rect1.h >= rect2.y);
}

//求两点之间的距离
C.getDist = function (x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

//求小球和边界作用之后的效果，参数为ball，边界W和H，反弹系数bounce
C.checkBallBounce = function(ball, W, H, bounce){
  if (ball.x + ball.r >= W
  ) {
    ball.x = W - ball.r;
    ball.vx *= bounce;
  }
  if (ball.x - ball.r <= 0
  ) {
    ball.x = ball.r;
    ball.vx *= bounce;
  }
  if (ball.y + ball.r >= H) {
    ball.y = H - ball.r;
    ball.vy *= bounce;
  }
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy *= bounce;
  }
}

C.checkBallHit = function (b1, b2){
  let dx = b2.x-b1.x;
  let dy = b2.y-b1.y;
  let dist = Math.sqrt(dx**2+dy**2);
  if( dist < b1.r + b2.r){
    let angle = Math.atan2(dy,dx);
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    // 以b1为参照物，设定b1的中心点为旋转基点
    let x1 = 0;
    let y1 = 0;
    let x2 = dx * cos + dy * sin;
    let y2 = dy * cos - dx * sin;

    //旋转b1和b2的速度
    let vx1 = b1.vx * cos + b1.vy * sin;
    let vy1 = b1.vy * cos - b1.vx * sin;
    let vx2 = b2.vx * cos + b2.vy * sin;
    let vy2 = b2.vy * cos - b2.vx * sin;

    //求出两个小球碰撞之后的速度
    //v1' = ((m1-m2)*v1 + 2*m2*v2)/(m1+m2);
    //v2' = ((m2-m1)*v2) + 2*m1*v1)/(m1+m2);
    vx1Final = ((b1.m - b2.m) * vx1 + 2 * b2.m * vx2)/(b1.m +b2.m);
    vx2Final = ((b2.m-b1.m) * vx2 + 2 * b1.m * vx1 )/(b1.m + b2.m);

    //处理两个小球碰撞之后让他们归位
    let lep = b1.r + b2.r - Math.abs(x2-x1);
    x1 = x1 + (vx1Final < 0 ? - lep/2 : lep/2);
    x2 = x2 + (vx2Final < 0 ? - lep/2 : lep/2);

    b2.x = b1.x + (x2 * cos - y2 * sin);
    b2.y = b1.y + (y2 * cos + x2 * sin);
    b1.x = b1.x + (x1 * cos - y1 * sin);
    b1.y = b1.y + (y1 * cos + x1 * sin);
    
    b1.vx = vx1Final * cos - vy1 * sin;
    b1.vy = vy1 * cos + vx1Final * sin;
    b2.vx = vx2Final * cos - vy2 * sin;
    b2.vy = vy2 * cos + vx2Final * sin;

  }
}