<template>
  <div>
    <h4>ジョブネット定義</h4>
    <p v-if="this.items.length == 0">ジョブネットの定義はありません</p>
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
  public fields = [
    { name: "ジョブネット名" },
    { info: "説明" },
    {
      key: "schedule",
      label: "開始時刻",
      formatter: value => {
        var time = value.start.time;
        var month = value.month.operation;
        var day = value.day.operation;
        return month + " " + day + " at " + time;
      }
    
    }
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
      .get("http://192.168.2.36:17380/api/jobnet")
      .then(response => {
        this.items = response.data.define;
      })
      .catch(err => {
        this.items = [];
      });
  }
}
</script>
