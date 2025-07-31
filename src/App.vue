<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-container">
    <nav class="navigation">
      <router-link to="/incomes">Доходы</router-link>
      <router-link to="/orders">Заказы</router-link>
      <router-link to="/sales">Продажи</router-link>
      <router-link to="/stocks">Склады</router-link>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.navigation {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.navigation a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navigation a:hover {
  background-color: #f0f0f0;
}

.navigation a.router-link-active {
  background-color: #42b983;
  color: white;
}
</style>
