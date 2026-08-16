import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import ServicesView from "../views/ServicesView.vue";

const PostsView = () => import("../views/PostsView.vue");
const FavoritesView = () => import("../views/FavoritesView.vue");
const CreatePostView = () => import("../views/CreatePostView.vue");
const PostDetailsView = () => import("../views/PostDetailsView.vue");
const ContactView = () => import("../views/ContactView.vue");
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
    path: "/posts/create",
    name: "create-post",
    component: CreatePostView,
  },

  {
    path: "/posts/:id",
    name: "post-details",
    component: PostDetailsView,
  },

  {
    path: "/posts",
    name: "posts",
    component: PostsView,
  },

  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesView,
  },

  {
    path: "/contact",
    name: "contact",
    component: ContactView,
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

export default router;
