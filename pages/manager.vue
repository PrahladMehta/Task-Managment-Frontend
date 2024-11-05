<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-900 sm:text-3xl">Assign Tasks (Manager)</h1>
        <div class="flex items-center space-x-4">
          <div v-if="profile" class="flex items-center space-x-2">
            <img src="../public/avatar_cs1vpz.png" :alt="profile.firstname" class="h-8 w-8 rounded-full object-cover">
            <span class="text-sm font-medium text-gray-700">{{ profile.firstname }} {{ profile.lastname }}</span>
          </div>
          <button
            @click="logout"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOutIcon class="h-4 w-4 mr-2" />

            <p class="hidden sm:flex"> Logout</p>
           
          </button>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Create New Task</h3>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <form @submit.prevent="createTask">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-4">
                    <label for="task-title" class="block text-sm font-medium text-gray-700">Task Title</label>
                    <input type="text" name="task-title" id="task-title" v-model="newTask.title" required
                           class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div class="col-span-6 sm:col-span-4">
                    <label for="task-description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="task-description" name="task-description" rows="3" v-model="newTask.description"
                              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="assigned-to" class="block text-sm font-medium text-gray-700">Assign To</label>
                    <select id="assigned-to" name="assigned-to" v-model="newTask.assignedTo" required
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="">Select an employee</option>
                      <option v-for="employee in employees" :key="employee._id" :value="employee._id">
                        {{ employee.firstname + " " + employee.lastname }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="due-date" class="block text-sm font-medium text-gray-700">Due Date</label>
                    <input type="date" name="due-date" id="due-date" v-model="newTask.dueDate" required
                           class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                    <select id="priority" name="priority" v-model="newTask.priority" required
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div class="mt-5">
                  <button type="submit"
                          :disabled="isCreatingTask"
                          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <PlusIcon class="h-5 w-5 mr-2" />
                    {{ isCreatingTask ? 'Creating...' : 'Create Task' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recently Assigned Tasks</h3>
          <div class="mb-4 flex space-x-4">
            <div>
              <label for="status-filter" class="block text-sm font-medium text-gray-700">Filter by Status</label>
              <select id="status-filter" v-model="statusFilter" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label for="priority-filter" class="block text-sm font-medium text-gray-700">Filter by Priority</label>
              <select id="priority-filter" v-model="priorityFilter" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div v-if="isLoadingTasks" class="text-center">
            <LoaderIcon class="animate-spin h-10 w-10 mx-auto text-indigo-600" />
          </div>
          <div v-else-if="error" class="text-center text-red-600">
            {{ error }}
          </div>
          <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="task in filteredTasks" :key="task.userTask._id">
                <div class="px-4 py-4 flex items-center sm:px-6">
                  <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div class="flex text-sm">
                        <p class="font-medium text-indigo-600 truncate">{{ task.userTask.title }}</p>
                        <p class="ml-1 flex-shrink-0 font-normal text-gray-500">
                          assigned to {{ task.assignedTo.firstname + " " + task.assignedTo.lastname }}
                        </p>
                      </div>
                      <div class="mt-2 flex">
                        <div class="flex items-center text-sm text-gray-500">
                          <CalendarIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p>
                            Due on <time :datetime="task.userTask.dueDate">{{ formatDate(task.userTask.dueDate) }}</time>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <div class="flex overflow-hidden">
                        <span
                          :class="{
                            'bg-green-100 text-green-800': task.userTask.priority === 'low',
                            'bg-yellow-100 text-yellow-800': task.userTask.priority === 'medium',
                            'bg-red-100 text-red-800': task.userTask.priority === 'high'
                          }"
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        >
                          {{ task.userTask.priority }}
                        </span>
                        <span
                          :class="{
                            'bg-blue-100 text-blue-800': task.userTask.status === 'todo',
                            'bg-yellow-100 text-yellow-800': task.userTask.status === 'in-progress',
                            'bg-green-100 text-green-800': task.userTask.status === 'completed'
                          }"
                          class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        >
                          {{ task.userTask.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <button @click="deleteTask(task.userTask._id)" class="text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <div v-if="toast.show" class="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300" :class="{ 'opacity-0': toast.fadeOut }">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon, CalendarIcon, LoaderIcon, LogOutIcon } from 'lucide-vue-next'
import { createTaskRoute, getEmployeesRoute, getRecentTasksRoute, deleteTaskRoute, getProfileRoute } from '~/util'
const {$socket}=useNuxtApp();

const router = useRouter()

const employees = ref([])
const isLoadingEmployees = ref(true)
const employeeError = ref(null)

const profile = ref(null)

const newTask = ref({
  title: '',
  description: '',
  assignedTo: '',
  dueDate: '',
  priority: 'medium',
})

const recentTasks = ref([])
const isLoadingTasks = ref(true)
const isCreatingTask = ref(false)
const error = ref(null)
const toast = ref({ show: false, message: '', fadeOut: false })

const statusFilter = ref('all')
const priorityFilter = ref('all')

const showToast = (message) => {
  toast.value = { show: true, message, fadeOut: false }
  setTimeout(() => {
    toast.value.fadeOut = true
    setTimeout(() => {
      toast.value.show = false
    }, 300)
  }, 3000)
}

const fetchProfile = async () => {
  try {
    const response = await fetch(getProfileRoute, {
      headers: {
        'Authorization': localStorage.getItem('task-managment')
      }
    })
    const data = await response.json()
    if (data.success) {
      profile.value = data.user
    } else {
      throw new Error(data.message || 'Failed to fetch profile')
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    showToast('Failed to load profile. Please try again.')
  }
}

const fetchEmployees = async () => {
  isLoadingEmployees.value = true
  employeeError.value = null
  try {
    const response = await fetch(getEmployeesRoute, {
      headers: {
        'Authorization': localStorage.getItem('task-managment')
      }
    })
    const data = await response.json()
    if (data.success) {
      employees.value = data.employees
    } else {
      throw new Error(data.message || 'Failed to fetch employees')
    }
  } catch (err) {
    console.error('Error fetching employees:', err)
    employeeError.value = 'Failed to load employees. Please try again.'
  } finally {
    isLoadingEmployees.value = false
  }
}

const createTask = async () => {
  isCreatingTask.value = true
  try {
    const response = await fetch(createTaskRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('task-managment')
      },
      body: JSON.stringify({task: newTask.value})
    })
    const data = await response.json()
    if (data.success) {
      showToast('Task created successfully')
      newTask.value = {
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium',
      }
      fetchRecentTasks()
      $socket.emit('update');
    } else {
      showToast(data.message || 'Failed to create task')
    }
  } catch (err) {
    console.error('Error creating task:', err)
    showToast('An error occurred while creating the task')
  } finally {
    isCreatingTask.value = false
  }
}

const fetchRecentTasks = async () => {
  isLoadingTasks.value = true
  error.value = null
  try {
    const response = await fetch(getRecentTasksRoute, {
      headers: {
        'Authorization': localStorage.getItem('task-managment')
      }
    })
    const data = await response.json()
    if (data.success) {
      recentTasks.value = data.task
    } else {
      throw new Error(data.message || 'Failed to fetch recent tasks')
    }
  } catch (err) {
    console.error('Error fetching recent tasks:', err)
    error.value = 'Failed to load recent tasks. Please try again.'
  } finally {
    isLoadingTasks.value = false
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      const response = await fetch(deleteTaskRoute, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('task-managment'),
          'Content-Type':'application/json'
        },
        body:JSON.stringify({taskId})
      })
      const data = await response.json()
      if (data.success) {
        showToast('Task deleted successfully')
        fetchRecentTasks()
        $socket.emit('update');
      } else {
        showToast(data.message || 'Failed to delete task')
      }
    } catch (err) {
      console.error('Error deleting task:', err)
      showToast('An error occurred while deleting the task')
    }
  }
}

const filteredTasks = computed(() => {
  return recentTasks.value.filter(task => 
    (statusFilter.value === 'all' || task.userTask.status === statusFilter.value) &&
    (priorityFilter.value === 'all' || task.userTask.priority === priorityFilter.value)
  )
})

const logout = () => {
  localStorage.removeItem('task-managment')
  router.push('/login')
}

$socket.on('onUpdate',()=>{
  fetchEmployees();
  fetchRecentTasks();
});


onMounted(() => {
  fetchProfile()
  fetchEmployees()
  fetchRecentTasks()
  


})
</script>