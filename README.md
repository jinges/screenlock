jiugongsuo
==========
年底了闲着无聊，就学习楼下canvas
用canvas 模仿安卓手机的开机屏幕锁锁（也叫图案锁或者九宫锁），不知道在webapp 中能不能用到。

这个屏幕锁的用法也很简单，只需要定义一个 id="canvas"的 canvas画布，
然后引用screenlock.min.js 或者 screenlock.js.
再定定义一个script标签，直接调用Jiu.touch(cb)方法：

Jiu.touch(function (err, code) {
		if(err){
			console.log("发生错误！");
		}
		if(!sessionStorage.lockCode){
			sessionStorage.lockCode = code;
		}
	});
