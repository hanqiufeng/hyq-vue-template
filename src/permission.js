import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({
  showSpinner: false
}); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  if (getToken()) {
    if (to.path === "/login") {
      next({
        path: "/"
      });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      // console.log(hasGetUserInfo);
      if (hasGetUserInfo) {
        next();
      } else {
        // 获取当前登录用户 并传递到 ./store/modules/premission 中的 GenerateRoutes方法里
        store
          .dispatch("user/getInfo")
          .then(res => {
            // console.log("当前登录用户(全局permission)", res.roles);
            var roles = res.roles;
            store
              .dispatch("GenerateRoutes", {
                roles
              })
              .then(res => {
                // 根据roles权限生成可访问的路由表
                router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
                next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              });
          })
          .catch(error => {
            // remove token and go to login page to re-login
            store.dispatch("user/resetToken").then(() => {
              Message.error(error || "Has Error");
              // next(`/login?redirect=${to.path}`); // 跳转到上一次退出的页面
              next(`/login`);
              NProgress.done();
            });
          });
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      // 否则全部重定向到登录页
      // next(`/login?redirect=${to.path}`);
      next(`/login`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
