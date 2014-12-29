jiugongsuo
==========
年底了闲着无聊，就学习楼下canvas
用canvas 模仿安卓手机的开机屏幕锁锁（也叫图案锁或者九宫锁），不知道在webapp 中能不能用到。

这个屏幕锁的用法也很简单，只需要定义一个 id="canvas"的 canvas画布，
然后引用screenlock.min.js 或者 screenlock.js.zuoy

设置屏幕锁的时候，直接调用Jiu.touch(cb)方法，在cb 中会返回两个参数：一个是错误提示，一个是图案数组 。

Jiu.touch(function (err, code) {
		if(err){
			console.log("发生错误！");
		}
		if(!sessionStorage.lockCode){
			sessionStorage.lockCode = code;
		}
	});
	
1》cb返回的code 参数是你在设置密码的时候所划过的图案数组，在这里做验证并存储（我这里是把密码保存在sessiontStorage中）；
2》cb里的第二个参数err，是在你验证密码的时候，如果错误就会返回一个错误信息，并在这里做页面错误处理，如果没有发生错误，就做相应他跳转处理。

验证图案密码的时候，还需要通过setNum（）方法把存储的密码传递给screenlock对象，要在滑动的时候验证用户滑动操作是否正确。

if(sessionStorage.lockCode){
	Jiu.setLockNum(sessionStorage.lockCode.split(','))
}

