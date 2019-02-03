<template>
  <div>
    <HeaderNav/>
    <PageTitle title="ジョブネット"/>
    <b-tabs class="p-3">
      <b-tab title="実行中" active>
        <RunJobnet class="p-4"/>
      </b-tab>
      <b-tab title="開始待ち">
        <WaittingJobnet class="p-4"/>
      </b-tab>
      <b-tab title="定義">
        <DefineJobnet class="p-4"/>
      </b-tab>
      <b-tab title="ジョブネットを追加する">
        <br>I'm the second tab content
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderNav from "@/components/HeaderNav.vue";
import PageTitle from "@/components/PageTitle.vue";
import Agent from "@/components/Agent.vue";
import RunJobnet from "@/components/RunJobnet.vue";
import DefineJobnet from "@/components/DefineJobnet.vue";
import WaittingJobnet from "@/components/WaittingJobnet.vue";

@Component({
  components: {
    HeaderNav,
    PageTitle,
    RunJobnet,
    DefineJobnet,
    WaittingJobnet,
    Agent
  }
})
export default class Dashboard extends Vue {}
</script>
