
/**
 * 轮播器类
 */
class Swiper {

    // 图片浮动拼接后的卷轴
    imgList = document.querySelector(".img-list") as HTMLDivElement;
    // 图片总数
    imgCount: number = this.imgList.children.length;
    // 每张图片的宽度
    imgWidth: number = 1280;
    // 每次移动的距离 px
    moveStep: number = 10;
    // 每次移动花费的时间 毫秒
    moveCost: number = 10;
    // 每张图片移动间歇时间 毫秒
    sleepCost: number = 1000;
    // 图片拼接的组 margin-left 的初始数据
    currentLeft: number = 0;
    // 自动轮播定时器
    timer: number
    // 向前翻
    prev = document.querySelector(".prev") as HTMLDivElement
    // 向后翻
    next = document.querySelector(".next") as HTMLDivElement
    iconList = document.querySelector(".icon-list") as HTMLUListElement;
    // 注意 NodeListOf 不是数组或者字符串所以不能用 for...of  只能用 this.lis.forEach() 进行遍历
    lis = this.iconList.querySelectorAll("li") as NodeListOf<HTMLLIElement>


    constructor() {
        this.createVirtualDom()
        this.registerEvents()
        this.autoRun()
    }

    /**
     *  创建一个虚拟dom 深度拷贝一份第一个子节点并追加到img-list之后
     */
    createVirtualDom() {
        const firstChild = this.imgList.firstElementChild as HTMLDListElement
        const virtualDom = firstChild.cloneNode(true) as HTMLDivElement;
        this.imgList.appendChild(virtualDom);

    }

    /**
     * 自动轮播
     */
    autoRun() {

        if (-this.currentLeft >= this.imgWidth * 3) {
            this.currentLeft = 0
        } else {
            this.currentLeft -= this.moveStep
            this.imgList.style.marginLeft = `${this.currentLeft}px`
        }



        let waitDuration = this.currentLeft % this.imgWidth == 0 ? this.sleepCost : this.moveCost

        this.timer = setTimeout(() => { this.autoRun() }, waitDuration)

        let currentN = this.getCurrentN();
        this.markIcon(currentN);
    }


    /**
     *  获取当前正在轮播的图片序号
     */
    getCurrentN() {
        return Math.floor(-this.currentLeft / this.imgWidth);
    }

    /**
     * 注册向前翻页和向后翻页点击事件
     */
    registerEvents() {

        this.prev.onclick = () => {
            let prevN = this.getCurrentN() - 1;
            this.jumpToN(prevN);
        };


        this.next.onclick = () => {
            let nextN = this.getCurrentN() + 1;
            this.jumpToN(nextN);
        };


        this.lis.forEach((v, k, item) => {
            v.onclick = (event: MouseEvent) => {
                const li = event.target as HTMLElement;
                let currentN = parseInt(li.innerText) - 1;
                this.jumpToN(currentN);
            };
        })


    }

    /**
     *  跳转到指定图片位置
     */
    jumpToN(n: number) {
        if (n < 0) {
            n = this.imgCount - 1;
        }
        if (n > this.imgCount - 1) {
            n = 0;
        }
        let distance = -n * this.imgWidth;
        this.imgList.style.marginLeft = distance + "px";
        // 移动后更新当前的margin-left
        this.currentLeft = distance;
    }


    /**
 *  将当前展示图像的对应图标点亮
 */
    markIcon(n: number) {
        this.lis.forEach((v, k, item) => {
            v.style.backgroundColor = "";
        })

        if (n < 3) {
            this.lis[n].style.backgroundColor = "red";
        }
    }
}


// 创建一个轮播图对象
const swiper = new Swiper()
