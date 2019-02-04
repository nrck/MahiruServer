<template>
  <div>
    <h4>エージェント</h4>
    <p v-if="this.items.length == 0">エージェントはありません</p>
    <b-table v-else striped hover :items="this.items" :fields="this.fields"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as Axios from "axios";

@Component
export default class Agent extends Vue {
  @Prop()
  public items;
  public fields = [
    { connected: "状態" },
    { name: "名前" },
    { ipaddress: "IPアドレス" }
  ];
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
      .get("http://192.168.2.36:17380/api/state")
      .then(response => {
        this.items = response.data.agent;
        this.items.forEach(row => {
          if (row.connected) {
            row.connected = "接続中";
            row._rowVariant = "success";
          } else {
            row.connected = "未接続";
            row._rowVariant = "danger";
          }
        });
      })
      .catch(err => {
        this.items = [];
      });
  }
}
</script>
