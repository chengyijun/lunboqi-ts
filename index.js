/**
 * 轮播器类
 */
var Swiper = /** @class */ (function () {
    function Swiper() {
        // 图片浮动拼接后的卷轴
        this.imgList = document.querySelector(".img-list");
        // 图片总数
        this.imgCount = this.imgList.children.length;
        // 每张图片的宽度
        this.imgWidth = 1280;
        // 每次移动的距离 px
        this.moveStep = 10;
        // 每次移动花费的时间 毫秒
        this.moveCost = 10;
        // 每张图片移动间歇时间 毫秒
        this.sleepCost = 1000;
        // 图片拼接的组 margin-left 的初始数据
        this.currentLeft = 0;
        // 向前翻
        this.prev = document.querySelector(".prev");
        // 向后翻
        this.next = document.querySelector(".next");
        this.iconList = document.querySelector(".icon-list");
        // 注意 NodeListOf 不是数组或者字符串所以不能用 for...of  只能用 this.lis.forEach() 进行遍历
        this.lis = this.iconList.querySelectorAll("li");
        this.createVirtualDom();
        this.registerEvents();
        this.autoRun();
    }
    /**
     *  创建一个虚拟dom 深度拷贝一份第一个子节点并追加到img-list之后
     */
    Swiper.prototype.createVirtualDom = function () {
        var firstChild = this.imgList.firstElementChild;
        var virtualDom = firstChild.cloneNode(true);
        this.imgList.appendChild(virtualDom);
    };
    /**
     * 自动轮播
     */
    Swiper.prototype.autoRun = function () {
        var _this = this;
        if (-this.currentLeft >= this.imgWidth * 3) {
            this.currentLeft = 0;
        }
        else {
            this.currentLeft -= this.moveStep;
            this.imgList.style.marginLeft = "".concat(this.currentLeft, "px");
        }
        var waitDuration = this.currentLeft % this.imgWidth == 0 ? this.sleepCost : this.moveCost;
        this.timer = setTimeout(function () { _this.autoRun(); }, waitDuration);
        var currentN = this.getCurrentN();
        this.markIcon(currentN);
    };
    /**
     *  获取当前正在轮播的图片序号
     */
    Swiper.prototype.getCurrentN = function () {
        return Math.floor(-this.currentLeft / this.imgWidth);
    };
    /**
     * 注册向前翻页和向后翻页点击事件
     */
    Swiper.prototype.registerEvents = function () {
        var _this = this;
        this.prev.onclick = function () {
            var prevN = _this.getCurrentN() - 1;
            _this.jumpToN(prevN);
        };
        this.next.onclick = function () {
            var nextN = _this.getCurrentN() + 1;
            _this.jumpToN(nextN);
        };
        this.lis.forEach(function (v, k, item) {
            v.onclick = function (event) {
                var li = event.target;
                var currentN = parseInt(li.innerText) - 1;
                _this.jumpToN(currentN);
            };
        });
    };
    /**
     *  跳转到指定图片位置
     */
    Swiper.prototype.jumpToN = function (n) {
        if (n < 0) {
            n = this.imgCount - 1;
        }
        if (n > this.imgCount - 1) {
            n = 0;
        }
        var distance = -n * this.imgWidth;
        this.imgList.style.marginLeft = distance + "px";
        // 移动后更新当前的margin-left
        this.currentLeft = distance;
    };
    /**
 *  将当前展示图像的对应图标点亮
 */
    Swiper.prototype.markIcon = function (n) {
        this.lis.forEach(function (v, k, item) {
            v.style.backgroundColor = "";
        });
        if (n < 3) {
            this.lis[n].style.backgroundColor = "red";
        }
    };
    return Swiper;
}());
// 创建一个轮播图对象
var swiper = new Swiper();
