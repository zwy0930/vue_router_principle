let Vue

class ZRouter {
    constructor(options) {
        this.$options = options

        // 创建相应式的属性
        Vue.util.defineReactive(this, "currentRouter", "/")

        window.addEventListener("hashchange", this.onHashChange)
        window.addEventListener("load", this.onHashChange)
    }

    onHashChange = ()=> {
        this.currentRouter = window.location.hash.slice(1)
    }
}

ZRouter.install = function(_Vue) {
    Vue = _Vue

    // 全局混入
    Vue.mixin({
        beforeCreate() {
            // 只有根组件才存在 this.$router.router
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        },
    })

    Vue.component("router-link", {
        props: {
            to: {
                required: true,
            },
        },
        render(h) {
            return h(
                "a",
                { attrs: { href: "#" + this.to } },
                this.$slots.default
            )
        },
    })

    Vue.component("router-view", {
        render(h) {
            let component = null
            this.$router.$options.routes.forEach((route) => {
                if (route.path === this.$router.currentRouter) {
                    component = route.component
                    return ;
                }
            })
            return h(component)
        },
    })
}

export default ZRouter
