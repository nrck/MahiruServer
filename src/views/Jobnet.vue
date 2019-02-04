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
        <div class="p-4">
          <h3>ジョブネットを追加する</h3>
          <b-form-group id="newJobnetName">
            <b-form-input id="newJobnetName" type="text" required placeholder="新しいジョブネット名を入力します"></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">作成</b-button>
        </div>
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
