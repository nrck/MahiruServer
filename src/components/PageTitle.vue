<template>
  <h1 class="p-2">{{ title }}</h1>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PageTitle extends Vue {
  @Prop() private title!: string;
}
</script>
