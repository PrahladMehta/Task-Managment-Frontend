<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">My Tasks </h1>
        <div class="flex items-center space-x-4" v-if="user">
          <img src="../public/avatar_cs1vpz.png" :alt="`${user.firstname} ${user.lastname}`" class="h-8 w-8 rounded-full object-cover">
          <span class="text-sm font-medium text-gray-700">{{ user.firstname }} {{ user.lastname }}</span>
          <button
            @click="logout"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOutIcon class="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Search and filter controls -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div class="flex items-center space-x-4 mb-4 sm:mb-0">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search tasks..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
              />
              <SearchIcon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <select
              v-model="filterStatus"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="sortTasks('dueDate')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CalendarIcon class="h-5 w-5 mr-2 text-gray-500" />
              Sort by Due Date
            </button>
            <button
              @click="sortTasks('priority')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FlagIcon class="h-5 w-5 mr-2 text-gray-500" />
              Sort by Priority
            </button>
          </div>
        </div>

        <!-- Task list -->
        <div v-if="isLoading" class="text-center py-12">
          <LoaderIcon class="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Loading tasks...</h3>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <AlertCircleIcon class="mx-auto h-12 w-12 text-red-400" />
          <h3 class="mt-2 text-sm font-medium text-red-900">Error loading tasks</h3>
          <p class="mt-1 text-sm text-red-500">{{ error }}</p>
        </div>

        <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
          <ClipboardListIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new task or adjust your filters.</p>
        </div>

        <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="task in filteredTasks" :key="task._id">
              <div class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <select
                      :value="task.status"
                      @change="(e) => updateTaskStatus(task.taskId, e.target.value)"
                      class="mr-3 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div>
                      <span class="text-sm font-medium text-gray-900">
                        {{ task.title }}
                      </span>
                      <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ task.description }}</p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': task.status === 'completed',
                        'bg-yellow-100 text-yellow-800': task.status === 'in-progress',
                        'bg-red-100 text-red-800': task.status === 'todo'
                      }"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ task.status }}
                    </span>
                    <ClockIcon class="ml-2 h-5 w-5 text-gray-400" />
                    <span class="ml-1 text-sm text-gray-500">{{ formatDate(task.dueDate) }}</span>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <UserIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {{ task.assignedBy }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <FlagIcon
                      :class="{
                        'text-red-500': task.priority === 'high',
                        'text-yellow-500': task.priority === 'medium',
                        'text-green-500': task.priority === 'low'
                      }"
                      class="flex-shrink-0 mr-1.5 h-5 w-5"
                    />
                    {{ task.priority }} priority
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SearchIcon, CalendarIcon, FlagIcon, ClockIcon, UserIcon, ClipboardListIcon, LoaderIcon, AlertCircleIcon, LogOutIcon } from 'lucide-vue-next'
import { getTasksRoute, updateTaskRoute, getProfileRoute } from '~/util'
import { useRouter } from 'vue-router'

const router = useRouter()

const tasks = ref([])
const user = ref(null)
const searchQuery = ref('')
const filterStatus = ref('all')
const sortBy = ref('dueDate')
const sortOrder = ref('asc')
const isLoading = ref(false)
const error = ref(null)

const { $socket } = useNuxtApp();

const fetchTasks = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(getTasksRoute, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('task-managment')
      }
    })
    
    const data = await response.json()

    console.log(data);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    tasks.value = data.task.map(task => ({
      ...task,
      status: task.status || 'todo' // Ensure each task has a status
    }))
  } catch (err) {
    console.error('Error fetching tasks:', err)
    error.value = 'Failed to load tasks. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

const fetchUserProfile = async () => {
  try {
    const response = await fetch(getProfileRoute, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('task-managment')
      }
    })
    
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    user.value = {
      firstname: data.user.firstname,
      lastname: data.user.lastname,
      image: data.user.image
    }
  } catch (err) {
    console.error('Error fetching user profile:', err)
    // You might want to show an error message to the user here
  }
}

const logout = () => {
  localStorage.removeItem('task-managment')
  router.push('/login')
}

const updateTaskStatus = async (taskId, newStatus) => {
  console.log(taskId);
  try {
    const response = await fetch(updateTaskRoute, {
      method: "PUT",
      headers: {
        "Authorization": localStorage.getItem('task-managment'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ task: { id: taskId, status: newStatus } })
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  
    const index = tasks.value.findIndex(task => task._id === taskId)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], status: newStatus }
    }

    fetchTasks();

    const { $socket } = useNuxtApp();
    $socket.emit('update');
    
  } catch (err) {
    console.error('Error updating task status:', err)
    // You might want to show an error message to the user here
  }
}

const filteredTasks = computed(() => {
  return tasks.value.filter(task => 
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (filterStatus.value === 'all' || task.status === filterStatus.value)
    )
    .sort((a, b) => {
      if (sortBy.value === 'dueDate') {
        return sortOrder.value === 'asc' 
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate)
      } else {
        const priorityOrder = { low: 1, medium: 2, high: 3 }
        return sortOrder.value === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority]
      }
    })
})

const sortTasks = (criteria) => {
  if (sortBy.value === criteria) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'    
  } else {
    sortBy.value = criteria
    sortOrder.value = 'asc'   
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

$socket.on('onUpdate',()=>{
  fetchTasks();
})

onMounted(() => {
  fetchTasks()
  fetchUserProfile()
})
</script>