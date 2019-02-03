<template>
  <div>
    <h4>開始待ち</h4>
    <p v-if='this.items.length == 0'>開始待ちのジョブネットはありません</p>
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
    setTimeout(() => {
      this.getState();
    }, 5000);

    this.axios
      .get("http://192.168.2.36:17380/api/jobnet")
      .then(response => {
        this.items = response.data.running;
      })
      .catch(err => {
        this.items = [];
      });
  }
}
</script>
