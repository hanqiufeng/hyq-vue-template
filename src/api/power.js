export default {
  editor: [
    {
      path: "/example",
      redirect: "/example/table",
      name: "Examples",
      meta: {
        title: "例子",
        icon: "example"
      },
      children: [
        {
          path: "table", // 后台用户
          component: "table/index",
          name: "Tables",
          meta: {
            title: "表格"
          }
        },
        {
          path: "tree", // 后台权限
          component: "tree/index",
          name: "Trees",
          meta: {
            title: "树状列表"
          }
        }
      ]
    }
  ]
};
