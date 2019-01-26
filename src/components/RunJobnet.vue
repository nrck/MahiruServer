<template>
  <div>
    <h4>実行中ジョブネット</h4>
    <p v-if='this.items.length == 0'>実行中のジョブネットはありません</p>
    <b-table v-else striped hover :items="this.items" :fields="this.fields"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as Axios from "axios";

@Component
export default class RunJobnet extends Vue {
  @Prop()
  public items;
  //public fields = ["connected", "name", "ipaddress"];
  private axios = Axios.default;

  public data() {
    return {
      items: this.items
    };
  }

  public computed() {}

  public mounted() {
    this.getState();
  }

  public getState() {
    this.axios
      .get("http://192.168.2.36:17380/api/state")
      .then(response => {
        this.items = response.data.jobnet;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
</script>
