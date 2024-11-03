<template>
      <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat" style="background: linear-gradient(to bottom right, #4a69bd, #6a89cc, #82ccdd, #60a3bc)">
        <div class="max-w-md w-full space-y-8 bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out">
          <div>
            <img class="mx-auto h-16 w-auto" src="https://i.pinimg.com/236x/e0/78/82/e078826cf89684d7e9dcdb5ba6662116.jpg" alt="Logo" />
            <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p class="mt-1 text-center text-sm text-gray-600">
              Join our task management platform
            </p>
          </div>
          <form class="mt-4 space-y-4 px-4" @submit.prevent="handleSubmit">
            <div class="rounded-md shadow-sm space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                
                  <input id="first-name" v-model="firstName" name="first-name" type="text" required class="placeholder-black appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out" placeholder="First Name" />
                </div>
                <div>
                 
                  <input id="last-name" v-model="lastName" name="last-name" type="text" required class="placeholder-black appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out" placeholder="Last Namee" />
                </div>
              </div>
              <div class="relative">
               
                <div class="flex">
                  <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required class="placeholder-black appearance-none rounded-l-md relative block w-full px-3 py-1 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out" placeholder="Email address" />
                  <button @click.prevent="sendOtp" type="button" :disabled="!email || otpSent" class="inline-flex items-center px-4 py-1  border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ otpSent ? 'OTP Sent' : 'Send OTP' }}
                  </button>
                </div>
              </div>
              <div v-if="otpSent" class="relative">
               
                <input id="otp" v-model="otp" name="otp" type="text" required class="placeholder-black appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out" placeholder="Enter OTP" />
              </div>

              <div class="flex gap-3">

              <div class="">
           
                <input id="password" v-model="password" name="password" type="password" autocomplete="new-password" required class="placeholder-black appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out" placeholder="Password" />
              </div>
              <div>
               
                <input id="confirm-password" v-model="confirmPassword" name="confirm-password" type="password" autocomplete="new-password" required class=" placeholder-black appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out" placeholder="Confirm Password" />
              </div>

            </div>
              <div>
                <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select id="role" v-model="role" name="role" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition duration-300 ease-in-out">
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" :disabled="!isFormValid" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                Sign up
              </button>
            </div>

            <p class="text-center">Already have account <span class=" text-indigo-500 font-bold underline " @click="signup">LOG IN</span></p>
          </form>
        </div>
        <div v-if="toast.show" class="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300" :class="{ 'opacity-0': toast.fadeOut }">
          {{ toast.message }}
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref, computed } from 'vue'
    import { signupRoute, sendOtpRoute } from '~/util'

    import { useRouter } from 'vue-router';

    const router=useRouter();

  const signup=()=>{
      router.push("/login");
    }
    
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const otp = ref('')
    const otpSent = ref(false)
    const password = ref('')
    const confirmPassword = ref('')
    const role = ref('Employee')
    const toast = ref({ show: false, message: '', fadeOut: false })
    
    const isFormValid = computed(() => {
      return (
        firstName.value &&
        lastName.value &&
        email.value &&
        otpSent.value &&
        otp.value &&
        password.value &&
        confirmPassword.value &&
        password.value === confirmPassword.value
      )
    })
    
    const showToast = (message) => {
      toast.value = { show: true, message, fadeOut: false }
      setTimeout(() => {
        toast.value.fadeOut = true
        setTimeout(() => {
          toast.value.show = false
        }, 300)
      }, 3000)
    }
    
    const validateForm = () => {
      if (!firstName.value) {
        showToast("First Name is required")
        return false
      }
      if (!lastName.value) {
        showToast("Last Name is required")
        return false
      }
      if (!email.value) {
        showToast("Email is required")
        return false
      }
      if (!otpSent.value) {
        showToast("OTP has not been sent")
        return false
      }
      if (!otp.value) {
        showToast("OTP is required")
        return false
      }
      if (!password.value) {
        showToast("Password is required")
        return false
      }
      if (!confirmPassword.value) {
        showToast("Confirm Password is required")
        return false
      }
      if (password.value !== confirmPassword.value) {
        showToast("Passwords do not match")
        return false
      }
      return true
    }
    
    const sendOtp = async () => {
      if (!email.value) {
        showToast('Email is required to send OTP')
        return
      }
      
      try {

            console.log(email.value);
            console.log(sendOtpRoute);
        const response = await fetch(sendOtpRoute, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value }),
        })
        console.log(response);
        const data = await response.json()
        
        if (data.success) {
          otpSent.value = true
          showToast('OTP sent successfully')
        } else {
          showToast(data.message || 'Failed to send OTP. Please try again.')
        }
      } catch (error) {
        console.error('Error sending OTP:', error)
        showToast('Failed to send OTP. Please try again.')
      }
    }
    
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }
    
      try {
        const response = await fetch(signupRoute, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstname: firstName.value,
            lastname: lastName.value,
            email: email.value,
            otp: otp.value,
            password: password.value,
            role: role.value
          }),
        })
        const data = await response.json()
    
        if (data.success) {
          console.log('Form submitted:', { firstName: firstName.value, lastName: lastName.value, email: email.value, password: password.value, role: role.value });
          console.log(data);
          showToast('Signup successful!')

           localStorage.setItem('task-managment',JSON.stringify(data.token));
            router.push(`/${role.value.toLowerCase()}`);
        } else {
            console.log(data);
          showToast(data.message || 'Failed to submit form. Please try again.')
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        showToast('Failed to submit form. Please try again.')     
      }
    }
    </script>