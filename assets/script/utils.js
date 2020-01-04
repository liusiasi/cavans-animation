let C = {};

//获取鼠标在元素上的坐标
C.getOffset = function(ele){
  let mouse = {x:0, y:0};
  ele.addEventListener('mousemove', function(e) {
    let { x, y } = C.eventWrapper(e);
    mouse.x = x;
    mouse.y = y;
  })
  return mouse;
}

//坐标系转换
C.eventWrapper = function(ev) {
  let { pageX, pageY, target } = ev;
  let { left, top} = target.getBoundingClientRect();
  return { x : pageX-left, y: pageY-top};
}

//角度转弧度
C.toRad = function(angle){
  return angle * Math.PI / 180
}

//弧度转角度
C.toAngle = function(rad){
  return rad * 180 / Math.PI
}

//生成随机数
C.rp = function(arr, int){
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const num = Math.random()* (max-min) + min;
  return int ? Math.round(num) : num;
}

//生成随机颜色
C.createColor = function(){
  return `rgb(${C.rp([55, 255], true)}, ${C.rp([55, 255], true)}, ${C.rp([55, 255], true)})`;
}

//矩形之间的碰撞检测，x和y坐标为矩形的左上角的坐标
//矩形1的最左边的临界坐标为矩形2的最优边，矩形1的最右边的临界边为矩形2的最左边；矩形1的最上边的临界边矩形2的最下边，矩形1的最下边的临界边为矩形2的最上边；
C.rectDuang = function(rect1, rect2){
  return (rect1.x + rect1.w >= rect2.x && rect1.x <= rect2.x + rect2.w && rect1.y <= rect2.y + rect2.h && rect1.y + rect1.h >= rect2.y);
}
