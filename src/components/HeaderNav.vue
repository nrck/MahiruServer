<template>
  <b-navbar toggleable="md" type="dark" variant="dark" class="mb-4">
    <b-navbar-brand href="/">JOB WORKING!!</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item href="#">Dashboard</b-nav-item>
        <b-nav-item href="#">Jobnet</b-nav-item>
        <b-nav-item href="#">Agent</b-nav-item>
        <b-nav-item href="#">History</b-nav-item>
        <b-nav-item href="#">Setting</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HeaderNav extends Vue {}
</script>