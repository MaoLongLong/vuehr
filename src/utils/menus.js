import Http from './http';

export const formatRoutes = (routes) => {
  const fmtRoutes = [];

  routes.forEach((route) => {
    const {
      path,
      component,
      name,
      meta,
      iconCls,
    } = route;

    let { children } = route;

    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }

    const fmtRoute = {
      path,
      name,
      iconCls,
      meta,
      children,
      component(resolve) {
        if (component.startsWith('Home')) {
          require([`@/views/${component}.vue`], resolve);
        } else if (component.startsWith('Emp')) {
          require([`@/views/emp/${component}.vue`], resolve);
        } else if (component.startsWith('Per')) {
          require([`@/views/per/${component}.vue`], resolve);
        } else if (component.startsWith('Sal')) {
          require([`@/views/sal/${component}.vue`], resolve);
        } else if (component.startsWith('Sta')) {
          require([`@/views/sta/${component}.vue`], resolve);
        } else if (component.startsWith('Sys')) {
          require([`@/views/sys/${component}.vue`], resolve);
        }
      },
    };

    fmtRoutes.push(fmtRoute);
  });

  return fmtRoutes;
};

export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return;
  }
  Http.get('/system/config/menu')
    .then((value) => {
      if (value) {
        const fmtRoutes = formatRoutes(value);
        router.addRoutes(fmtRoutes);
        store.commit('initRoutes', fmtRoutes);
      }
    });
};
