<template>
  <div>
    <HeaderNav/>
    <PageTitle title="エージェント一覧"/>
    <div class="container-fluid">
      <div class="row">
        <div class="row-12 col-md-12">
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
import Agent from "@/components/Agent.vue";

@Component({
  components: {
    HeaderNav,
    PageTitle,
    Agent
  }
})
export default class Dashboard extends Vue {}
</script>
