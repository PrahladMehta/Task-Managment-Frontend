<template>
      
      hello


</template>

<script setup>

import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const router=useRouter();

onMounted(()=>{


      router.push('/signup');
})


</script>

