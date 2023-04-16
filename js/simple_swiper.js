(function(e, fn) {
	"use strict";
	if (e.__proto__ === undefined) {
		e.SimSwiper = fn;
		return SimSwiper
	} else {
		if (typeof module !== 'undefined') {
			module.exports = fn
		} else {
			e.__proto__.SimSwiper = fn
		}
	}
})(this, (function() {
	"use strict";
	var con = null,
		data = null,
		g_conf = null,
		slider = null,
		page = null,
		duration = null,
		easing = null;

	function init(el, conf) {
		if (arguments.length !== 2) {
			el = ".simple-swiper-container"
		} else {
			g_conf = conf
		}
		duration = conf.duration || 300;
		easing = conf.easing || 'ease';
		con = document.querySelector(el);
		data = conf.data;
		var f = data[0];
		data.push(f);
		f = null;
		setLayout(con)
	}

	function setLayout(el) {
		var frag = document.createDocumentFragment();
		var wrap = document.createElement("div");
		frag.appendChild(wrap);
		wrap.setAttribute("class", "swiper-wrapper");
		wrap.style.overflow = 'hidden';
		slider = document.createElement("div");
		slider.setAttribute("class", "swiper-slider");
		frag = document.createDocumentFragment();
		var pa = document.querySelector("#" + el.id + ">" + g_conf['pagination'].el);
		var p_frag = document.createDocumentFragment();
		if (!g_conf.lazy) {
			data.forEach(function(item) {
				var slide = document.createElement("div");
				slide.setAttribute("class", "swiper-items");
				setStyle(slide, "float", "left");
				setStyle(slide, "height", "100%");
				setStyle(slide, "width", getStyle(con, "width") + "px");
				var a = document.createElement("a");
				a.setAttribute("href", encodeURI(item.href));
				var img = document.createElement("img");
				img.setAttribute("src", item.src);
				a.appendChild(img);
				slide.appendChild(a);
				frag.appendChild(slide);
				var p_el = document.createElement('span');
				p_el.setAttribute("class", "pagination-items");
				p_frag.appendChild(p_el)
			})
		}
		pa.appendChild(p_frag);
		pa.removeChild(pa.childNodes[0]);
		page = pa;
		slider.appendChild(frag);
		wrap.appendChild(slider);
		el.appendChild(wrap);
		setting.init();
		slider = document.querySelector("#" + el.id + ">.swiper-wrapper>.swiper-slider")
	};
	var th = null,
		now_position = 0,
		percentage = 0,
		setting = {
			prev: null,
			next: null,
			index: 0,
			width: 0,
			num: 1,
			duration: undefined,
			time: null,
			curIndex: 0,
			request: null,
			touchX: 0,
			autoplay: function() {
				var time = typeof(g_conf.autoplay) === 'number' ? g_conf.autoplay : 3500;
				th.time = setInterval(function() {
					th._next()
				}, time > th.duration ? time : 1200);
			},
			init: function() {
				th = this;
				th.duration = duration;
				this.num = data.length - 1;
				this.width = getStyle(con, "width");
				setStyle(slider, "width", this.width * data.length + "px");
				var _this = this;
				try {
					window.addEventListener("resize", function() {
						slider.style.transition = "all 0s"
					});
					var next = document.querySelector("#" + con.id + ">" + g_conf.button['next']);
					var prev = document.querySelector("#" + con.id + ">" + g_conf.button['prev']);
					next.addEventListener("click", function() {
						_this._next()
					}, false);
					prev.addEventListener("click", function() {
						_this._prev()
					})
				} catch (e) {
					throw new Error('element error');
				};
				if (g_conf.autoplay) {
					th.boot();
					con.addEventListener("mousedown", th.stop, false);
					con.addEventListener("mouseup", th.boot, false);
					con.addEventListener("mouseleave", th.boot, false);
					con.addEventListener("touchstart", th.stop, false);
					con.addEventListener("touchend", th.boot, false);
					window.addEventListener("visibilitychange", function() {
						var is = document.visibilityState;
						is === 'visible' ? th.boot() : th.stop();
					}, false)
				}
				_this.touchInit();
				if (g_conf.pagination['el'] !== undefined) {
					page.childNodes[th.curIndex].classList.add('pagination-items-active');
					if (g_conf.pagination['click']) {
						var poc = page.childNodes;
						for (var i = 0; i < poc.length; i++) {
							poc[i].index = i;
							poc[i].onclick = function() {
								th.index = th.curIndex = this.index;
								th.play();
								th.transform()
							}
						}
					}
				}
			},
			stop: function() {
				clearInterval(th.time);
			},
			boot: function() {
				if (th.time !== null) {
					clearInterval(th.time);
				}
				th.autoplay()
			},
			lazy: function(idx) {
				var m = data[idx];
				var slide = document.createElement("div");
				slide.setAttribute("class", "swiper-items");
				setStyle(slide, "float", "left");
				setStyle(slide, "height", "100%");
				setStyle(slide, "width", getStyle(con, "width") + "px");
				var a = document.createElement("a");
				a.setAttribute("href", encodeURI(m.href));
				var img = document.createElement("img");
				img.setAttribute("src", m.src);
				a.appendChild(img);
				slide.appendChild(a);
				slider.appendChild(slide)
			},
			_prev: function() {
				var _this = this;
				_this.index--;
				_this.change();
			},
			_next: function() {
				var _this = this;
				_this.index++;
				_this.change()
			},
			play: function() {
				th.curIndex = th.index === 5 ? 0 : th.index
				var pc = page.childNodes;
				for (var i = 0; i < pc.length; i++) {
					if (i === th.curIndex) {
						pc[i].classList.add('pagination-items-active')
					} else {
						pc[i].classList.remove('pagination-items-active')
					}
				}
			},
			transform: function() {
				slider.style.transform = "translate3d(-" + this.index * this.width + "px,0px,0px)";
				slider.style.transition = "all " + this.duration + "ms " + easing;
				now_position = this.index * this.width;
				th.play();
			},
			change: function() {
				var _this = this;
				if (_this.index === _this.num + 1) {
					_this.index = 0;
					_this.duration = 0;
					var id = setTimeout(function() {
						_this.index = 1;
						_this.duration = duration;
						_this.transform();
						clearTimeout(id)
					}, undefined)
				}
				if (_this.index < 0) {
					_this.index = _this.num;
					_this.duration = 0;
					var id = setTimeout(function() {
						_this.index = _this.num - 1;
						_this.duration = duration;
						_this.transform();
						clearTimeout(id)
					}, undefined)
				}
				_this.transform();
			},
			touchInit: function() {
				slider.addEventListener("mousedown", th.start, false);

				slider.addEventListener("touchstart", th.start, {
					passive: false
				});
				slider.addEventListener("mouseleave", th.stop, false);
			},
			start: function(e) {
				e.preventDefault();
				th.touchX = e.clientX || e.touches[0].clientX;
				if (e.button === 0) {
					document.addEventListener("mouseup", th.end, false);
					document.addEventListener("mousemove", th.move)
				}
				document.addEventListener("touchmove", th.move, {
					passive: false
				});
				document.addEventListener("touchend", th.end, {
					passive: false
				});
				con.style.cursor = "grabbing"
			},
			move: function(e) {
				try {
					slider.classList.add('no-click');
					e.preventDefault();
					var offX = (e.clientX || e.touches[0].clientX) - th.touchX;
					percentage = offX / th.width;
					var f = offX - now_position;
					var thre;
					if (th.checked(percentage)) {
						thre = -th.width / 10
					} else {
						thre = th.width + 100;
					}
					var tag = Math.abs(parseInt((offX - now_position - thre) / th.width));
					th.index = tag;

					if (Math.abs(f) > th.num * th.width) {
						now_position = 0;
						th.animate(f);
						th.index = 0
					} else if (f > 0) {
						now_position = th.num * th.width;
						th.index = th.num;
						th.animate(-now_position)
					} else {
						th.animate(f)
					}
				} catch (e) {}
			},
			checked: function(n) {
				return !(Math.floor(n) === -1)
			},
			animate: function(gv) {
				slider.style.transform = "translate3d(" + gv + "px,0px,0px)";
				slider.style.transition = "all ." + 0 + "s " + easing
			},
			end: function(e) {
				e.preventDefault();
				th.change()
				document.removeEventListener("touchmove", th.move);
				document.removeEventListener("touchend", th.end);
				document.removeEventListener("mousemove", th.move, false);
				document.removeEventListener("mouseup", th.end, false);
				slider.classList.remove('no-click');
				con.style.cursor = "default"
			}
		};

	function btnEvent() {
		return [prev, next]
	};

	function setStyle(el, prop, value) {
		el.style[prop] = value
	};

	function getStyle(el, prop) {
		return Math.ceil(parseFloat(window.getComputedStyle(el)[prop]))
	}
	return init
})())
