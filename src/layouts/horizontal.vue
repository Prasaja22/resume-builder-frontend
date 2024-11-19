<script>
import router from "@/router";

import HorizontalTopbar from "@/components/horizontal-topbar";
import HorizontalNav from "@/components/horizontal-nav";
import SideBar from "@/components/side-bar";
import { useLayoutStore } from "@/state/pinia";
const layoutStore = useLayoutStore();

/**
 * Horizontal-layout
 */
export default {
  props: {},
  components: {
    HorizontalTopbar,
    HorizontalNav,
    SideBar,
  },
  data() {
    return {
      type: layoutStore.leftSidebarType,
      isMenuCondensed: false,
    };
  },
  computed: {
    layoutWidth() {
      return layoutStore.layoutWidth;
    },
    topbar() {
      return layoutStore.topbar;
    },
    leftSidebarType() {
      return layoutStore.leftSidebarType;
    },
    loader() {
      return layoutStore.loader;
    },
    mode() {
      return layoutStore.mode;
    },
  },
  created: () => {
    document.body.setAttribute("data-layout", "horizontal");
    document.body.setAttribute("data-topbar", "dark");
    document.body.removeAttribute("data-sidebar");
    document.body.removeAttribute("data-layout-size");
    document.body.classList.remove("auth-body-bg");
  },
  methods: {
    toggleMenu() {
      document.body.classList.toggle("sidebar-enable");
      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
          document.body.classList.remove("vertical-collpsed");
        });
        document.body.classList.toggle("vertical-collpsed");
      } else {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
        document.body.classList.remove("vertical-collpsed");
      }
      this.isMenuCondensed = !this.isMenuCondensed;
    },
  },
  mounted() {
    const verticalMenu = document.querySelectorAll(".vertical-menu");
    verticalMenu.forEach((vMenu) => {
      vMenu.style.display = "none";
    });
    if (window.innerWidth < 992) {
      document.body.classList.remove("sidebar-enable");
      document.body.classList.add("vertical-collpsed");
      verticalMenu.forEach((vMenu) => {
        vMenu.style.display = "block";
      });
    } else {
      document.querySelectorAll(".mm-active").forEach((element) => {
        element.classList.remove("mm-active");
      });
    }
    if (this.loader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  },
};
</script>

<template>
  <div>
    <div id="preloader">
      <div id="status">
        <div class="spinner-chase">
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
        </div>
      </div>
    </div>
    <!-- Begin page -->
    <div id="layout-wrapper">
      <HorizontalTopbar :type="topbar" :width="layoutWidth" :mode="mode" />
      <HorizontalNav />

      <SideBar
        :is-condensed="isMenuCondensed"
        :type="leftSidebarType"
        :width="layoutWidth"
        :mode="mode"
      />
      <!-- ============================================================== -->
      <!-- Start right Content here -->
      <!-- ============================================================== -->
      <div class="main-content">
        <div class="page-content">
          <BContainer fluid>
            <slot />
          </BContainer>
          <!-- container-fluid -->
        </div>
        <!-- End Page-content -->
      </div>
      <!-- end main content-->
    </div>
    <!-- END layout-wrapper -->
  </div>
</template>
