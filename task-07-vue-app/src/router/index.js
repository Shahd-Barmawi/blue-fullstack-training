import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import ServicesView from "../views/ServicesView.vue";

const PostsView = () => import("../views/PostsView.vue");
const MyPostsView = () => import("../views/MyPostsView.vue");
const FavoritesView = () => import("../views/FavoritesView.vue");
const CreatePostView = () => import("../views/CreatePostView.vue");
const PostDetailsView = () => import("../views/PostDetailsView.vue");
const ContactView = () => import("../views/ContactView.vue");
const LoginView = () => import("../views/LoginView.vue");
const NotFoundView = () => import("../views/NotFoundView.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  {
    path: "/services",
    name: "services",
    component: ServicesView,
  },

  {
    path: "/posts",
    name: "posts",
    component: PostsView,
  },

  {
    path: "/my-posts",
    name: "my-posts",
    component: MyPostsView,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/posts/create",
    name: "create-post",
    component: CreatePostView,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/posts/:id",
    name: "post-details",
    component: PostDetailsView,
  },

  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesView,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/contact",
    name: "contact",
    component: ContactView,
  },

  {
    path: "/login",
    name: "login",
    component: LoginView,
  },

  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),

  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 90,
      };
    }

    return {
      top: 0,
      left: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to) => {
  const token = localStorage.getItem("authToken");

  if (to.meta.requiresAuth && !token) {
    return {
      name: "login",
    };
  }
});

export default router;
