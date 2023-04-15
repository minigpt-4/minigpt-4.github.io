$(document).ready(function(){
	//等图片加载完成之后在显示
	$(window).on("load",function(){
		ImgLocation();
		var dataImg={"data":[{"src":"1.jpg"},{"src":"2.jpg"}]};
		$(window).scroll(function(){
			//获取最后一张图片距离顶端的高度-也就是他自身的一半。
			if(getSideHeight()){
				$.each(dataImg.data,function(index,value){
					var pin = $("<div>").addClass("pin").appendTo("#main");
					var box = $("<div>").addClass("box").appendTo(pin);
					var img = $("<img>").attr("src","demos/"+$(value).attr("src")).appendTo(box);
				});
				ImgLocation();
			}
		})
	})
});

function getSideHeight(){
	var box = $(".pin");
	var lastImgHeight = (box.last().get(0)).offsetTop - Math.floor(box.last().height()/2);
	var documentHeight = $(document).height();//获取当前窗口的一个高度
	var scrollHeight = $(window).scrollTop();//获取滚动的距离。
	return (lastImgHeight<documentHeight+scrollHeight)?true:false;

}

function ImgLocation(){
	var box=$(".pin"); //获得一个.pin的数组
	var boxWidth=box.eq(0).width(); //eq()方法返回带有被选元素的指定索引号的元素。
	var num=Math.floor($(window).width()/boxWidth); //一行能摆放图片的个数
	var numArr=[];
	box.each(function(index,value){ //each() 方法规定为每个匹配元素规定运行的函数。
		var boxHeight=box.eq(index).height();//获取每张图片的高度。
		//console.log(boxHeight);
		
		if (index<num) {//第一排图片
			numArr[index] = boxHeight;
		}else{//第二排图片
			//Math.min可以获得最小的一项，apply()方法可以获得项的值。
			var minboxHeight = Math.min.apply(numArr,numArr);
			// console.log(minboxHeight);
			//方法jQuery.inArray(value,数组,数组的索引值默值为0)
			//$.inArray() 函数用于在数组中查找指定值，并返回它的索引值（如果没有找到，则返回-1）
			var minIndex = $.inArray(minboxHeight,numArr); //得到最小高度图片的索引值
			// console.log(minIndex);
			$(value).css({
				position:"absolute",
				top:minboxHeight,
				left:box.eq(minIndex).position().left
			});

			numArr[minIndex] += box.eq(index).height(); //设定了一个新高度
		}
	})
}
