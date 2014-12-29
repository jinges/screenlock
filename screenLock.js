ScreenLock = function () {
	var r = 30, 
		width = height = document.body.offsetWidth,
		margin = 30, 
		ninePointArr = [],
		dirNinePoint=[],
		color,
		canvas,
		cxt,
		lockNum = [],
		isErr=0;

	//画9个圆圈
	this.caculateNinePoint = function  (space) {
		var ninePoint=[];
		for(var row =0; row < 3; row++) {
			for(var col = 0; col < 3; col++ ) {
				var point = {
					x: margin + (col * 2 + 1) * r + space * col,
					y: margin + (row * 2 + 1) * r + space * row
				}
				ninePoint.push(point);
			}
		}
		return ninePoint;
	};

	//记录划过的圆圈
    this.caculateOverPoint = function (touch) {
		for(var i=0; i< ninePointArr.length; i++){
			var currentPoint = ninePointArr[i];
			var pointX = Math.abs(currentPoint.x - touch.pageX);
			var pointY = Math.abs(currentPoint.y - touch.pageY);
			var point = Math.sqrt( pointX * pointX + pointY * pointY);

			if(point < r){
				if(dirNinePoint.indexOf(i) < 0){
					dirNinePoint.push(i);
					break;
				}
			}
		}
	},

	//画线条
	this.drawLine = function (touch) {
		if(dirNinePoint.length > 0){
			cxt.beginPath();
			cxt.strokeStyle = color;
			cxt.lineWidth = 10 ;
			for(var i=0; i< dirNinePoint.length; i++){
				var index = dirNinePoint[i];
				cxt.lineTo(ninePointArr[index].x, ninePointArr[index].y);
			}
			cxt.stroke();
			cxt.closePath();
			if(touch != null){
				var index = dirNinePoint[dirNinePoint.length - 1];
				var point = ninePointArr[index];
				cxt.beginPath();
				cxt.moveTo(point.x, point.y);
				cxt.lineTo(touch.pageX, touch.pageY);
				cxt.stroke();
				cxt.closePath();
			}
		}
		if(isErr){
			this.drawPoint();
			return false;
		}
		return true;
	};

	//划圆圈
	this.drawPoint = function () {
		for(var i = 0; i< ninePointArr.length; i++) {
			var point = ninePointArr[i];
			cxt.fillStyle= '#ccc';
			cxt.beginPath();
			cxt.arc(point.x,point.y,r,0,Math.PI * 2, true);
			cxt.closePath();
			cxt.fill();
			cxt.fillStyle = "#fff";
			cxt.beginPath();
			cxt.arc(point.x, point.y, r-2,0, Math.PI * 2, true);
			cxt.closePath();
			cxt.fill();
			this.drawSelectPoint(i, point);
		}
	};

	//划过圆圈的效果
	this.drawSelectPoint = function (index, point) {
		if(dirNinePoint.indexOf(index) >= 0) {
			for(var i = 0, len = dirNinePoint.length; i < len; i++ ){
				if(lockNum.length > 0 && dirNinePoint[i] !== lockNum[i]*1){
					color = "#f93a3b";
					isErr =1;
				}
			}
			cxt.fillStyle= color;
			cxt.beginPath();
			cxt.arc(point.x,point.y,r,0,Math.PI * 2, true);
			cxt.closePath();
			cxt.fill();
			cxt.fillStyle = "#fff";
			cxt.beginPath();
			cxt.arc(point.x, point.y, r-2,0, Math.PI * 2, true);
			cxt.closePath();
			cxt.fill();
			cxt.fillStyle = color;
			cxt.beginPath();
			cxt.arc(point.x, point.y, r-20,0, Math.PI * 2, true);
			cxt.closePath();
			cxt.fill();
		}
	};

	this.setLockNum = function (numCode) {
		lockNum = numCode;
	};

	//滑动事件
	this.touch = function (callback) {
		var that = this;
		that.init();
		canvas.addEventListener("touchstart", function (e) {
			that.caculateOverPoint(e.touches[0]);
		}, false)

		canvas.addEventListener('touchmove', function (e) {
			e.stopPropagation();
			var touch = e.touches[0];
			that.caculateOverPoint(touch);
			cxt.clearRect(0, 0, width, height);
			flag = that.drawLine(touch);
			that.drawPoint();
			if(!flag){
				callback({"error": "error"});
			}
		}, false)

		canvas.addEventListener('touchend', function (e) {
			if(callback){
				callback(null, dirNinePoint);
			}
			setTimeout(function () {
				that.init();
			}, 500);
		}, false)
	};

	this.init = function() {
		canvas = document.querySelector("#canvas"),
		cxt = canvas.getContext('2d');

		canvas.width = width;
		canvas.height = height;
		dirNinePoint=[];
		color = '#92ca02';

		var Xspac = ( width - r * 2 * 3 - margin * 2) / 2; 
		ninePointArr = this.caculateNinePoint( Xspac );
		this.drawPoint();
		return this;
	};
}
var Jiu = new ScreenLock();