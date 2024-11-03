<template>



   <NuxtPage/>
</template>

<script setup>

import { onMounted } from 'vue';

const { $socket } = useNuxtApp();





  onMounted(()=>  $socket.emit('connection'));



</script>
