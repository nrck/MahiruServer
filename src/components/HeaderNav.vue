<template>
  <b-navbar toggleable="md" type="dark" variant="dark" class="mb-4">
    <b-navbar-brand href="/">JOB WORKING!!</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item href="/dashboard">Dashboard</b-nav-item>
        <b-nav-item href="/jobnet">Jobnet</b-nav-item>
        <b-nav-item href="/agent">Agent</b-nav-item>
        <b-nav-item href="/history">History</b-nav-item>
        <b-nav-item href="/setting">Setting</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HeaderNav extends Vue {}
</script>