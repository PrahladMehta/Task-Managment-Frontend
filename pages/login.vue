<template>
      <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-covr bg-center bg-no-repeat" style="background: linear-gradient(to bottom right, #4a69bd, #6a89cc, #82ccdd, #60a3bc) ">
       
        <div class="max-w-md w-full space-y-8 bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out">
          <div>
            <img class="mx-auto h-16 w-auto" src="https://i.pinimg.com/236x/e0/78/82/e078826cf89684d7e9dcdb5ba6662116.jpg" alt="Logo" />
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account</h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Access your task management platform
            </p>
          </div>
          <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
            <div class="rounded-md shadow-sm space-y-4">
              <div>
                <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out" placeholder="example@gmail.com" @blur="checkField('email')" />
              </div>
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input id="password" v-model="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out" placeholder="Enter Password" @blur="checkField('password')" />
              </div>
              <div>
                <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select id="role" v-model="role" name="role" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition duration-300 ease-in-out" @blur="checkField('role')">
                  <option value="">Select a role</option>
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" @click="handleLoginClick" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                Log in
              </button>
            </div>

            <p class="text-center">Create Account <span @click="signup"  class=" text-indigo-500 font-bold underline ">SIGN UP</span></p>
          </form>
        </div>
        <div v-if="toast.show" class="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300" :class="{ 'opacity-0': toast.fadeOut }">
          {{ toast.message }}
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref, computed } from 'vue'
    import { loginRoute } from '~/util'
    import { useRouter } from 'vue-router';


    const route=useRouter();
    
    const email = ref('')
    const password = ref('')
    const role = ref('')
    const toast = ref({ show: false, message: '', fadeOut: false })
    
    const isFormValid = computed(() => {
      return email.value && password.value && role.value
    })

    const signup=()=>{

      route.push('/signup');

    }
    
    const showToast = (message) => {
      toast.value = { show: true, message, fadeOut: false }
      setTimeout(() => {
        toast.value.fadeOut = true
        setTimeout(() => {
          toast.value.show = false
        }, 300)
      }, 3000)
    }
    
    const checkField = (field) => {
      if (!eval(field).value) {
        showToast(`Please fill in the ${field} field`)
      }
    }
    
    const handleLoginClick = (event) => {
      if (!isFormValid.value) {
        event.preventDefault()
        showToast('Please fill in all fields')
      }
    }
    
    const handleLogin = async () => {
      if (!isFormValid.value) {
        showToast('Please fill in all fields')
        return
      }
    
      try {
        const response = await fetch(loginRoute, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
            role: role.value
          }),
        })
        const data = await response.json()
    
        if (data.success) {
          console.log('Login successful:', { email: email.value, role: role.value })
          showToast('Login successful!')
          localStorage.setItem('task-managment', JSON.stringify(data.token))
           route.push(`/${role.value.toLowerCase()}`)
        } else {
          showToast(data.message || 'Login failed. Please try again.')
        }
      } catch (error) {
        console.error('Error during login:', error)
        showToast('Login failed. Please try again.')
      }
    }
    </script>