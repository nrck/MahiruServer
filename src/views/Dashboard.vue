<template>
  <div>
    <HeaderNav/>
    <PageTitle title="ダッシュボード"/>
    <div class="container-fluid">
      <div class="row">
        <div class="row-12 col-md-6">
          <RunJobnet/>
        </div>
        <div class="row-12 col-md-6">
          <Agent/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderNav from "@/components/HeaderNav.vue";
import PageTitle from "@/components/PageTitle.vue";
import RunJobnet from "@/components/RunJobnet.vue";
import Agent from "@/components/Agent.vue";

@Component({
  components: {
    HeaderNav,
    PageTitle,
    RunJobnet,
    Agent
  }
})
export default class Dashboard extends Vue {}
</script>
