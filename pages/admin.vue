<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Task Management(Admin)</h1>
        <div class="flex items-center space-x-4">
          <div v-if="profile" class="flex items-center space-x-2">
            <img src="../public/avatar_cs1vpz.png" alt="Profile" class="w-8 h-8 rounded-full">
            <span class="text-sm font-medium text-gray-700">{{ profile.firstname }} {{ profile.lastname }}</span>
          </div>
          <button @click="logout" class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <LogOutIcon class="h-5 w-5 text-gray-600" />
            <span class="text-sm font-medium text-gray-700">Logout</span>
          </button>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6 flex flex-col sm:flex-row justify-between items-center">
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
            <button
              @click="sortByDate"
              class="flex items-center space-x-2 p-2 rounded-md bg-indigo-600  text-white hover:bg-indigo-700 focus:outline-none "
            >
              <CalendarIcon class="h-5 w-5" />
              <span class="text-sm font-medium">Date</span>
            </button>
            <button
              @click="sortByPriority"
              class="flex items-center space-x-2 p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none  "
            >
              <FlagIcon class="h-5 w-5" />
              <span class="text-sm font-medium">Priority</span>
            </button>
          </div>
        </div>

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
          <p class="mt-1 text-sm text-gray-500">Adjust your filters to see tasks.</p>
        </div>

        <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="task in filteredTasks" :key="task.taskId">
              <div class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div class="flex items-center justify-between">
                  <div class="sm:flex sm:justify-between w-full">
                    <div>
                      <p class="text-sm font-medium text-indigo-600 truncate">{{ task.title }}</p>
                      <p class="mt-1 text-sm text-gray-500">Assigned to: {{task.assignedTo }}</p>
                      <p class="mt-1 text-sm text-gray-500">Assigned by: {{ task.assignedBy}}</p>
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>Due on {{ formatDate(task.dueDate) }}</p>
                    </div>
                  </div>
                  <div class="ml-5 flex-shrink-0 flex space-x-2">
                    <button
                      @click="openEditTaskModal(task)"
                      class="p-2 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
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

    <!-- Edit Task Modal -->
    <div v-if="showTaskModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Edit Task
            </h3>
            <div class="mt-2">
              <form @submit.prevent="updateTask">
                <div class="space-y-4">
                  <div>
                    <label for="task-title" class="block text-sm font-medium text-gray-700">Task Title</label>
                    <input type="text" name="task-title" id="task-title" v-model="currentTask.title" required
                           class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div>
                    <label for="task-description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="task-description" name="task-description" rows="3" v-model="currentTask.description" required
                              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                  </div>
                  <div>
                    <label for="assigned-to" class="block text-sm font-medium text-gray-700">Assign To</label>
                    <select id="assigned-to" name="assigned-to" v-model="currentTask.assignedTo" required
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option v-for="employee in employees" :key="employee._id" :value="employee._id">
                        {{ employee.firstname }} {{ employee.lastname }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label for="assigned-by" class="block text-sm font-medium text-gray-700">Assigned By</label>
                    <select id="assigned-by" name="assigned-by" v-model="currentTask.assignedBy" required
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option v-for="manager in managers" :key="manager._id" :value="manager._id">
                        {{ manager.firstname }} {{ manager.lastname }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label for="due-date" class="block text-sm font-medium text-gray-700">Due Date</label>
                    <input type="date" name="due-date" id="due-date" v-model="currentTask.dueDate" required
                           class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div>
                    <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                    <select id="priority" name="priority" v-model="currentTask.priority" required
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" name="status" v-model="currentTask.status" required
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button type="submit"
                          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
                    Save Changes
                  </button>
                  <button type="button" @click="closeTaskModal"
                          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SearchIcon, CalendarIcon, FlagIcon, PencilIcon, LoaderIcon, AlertCircleIcon, ClipboardListIcon, LogOutIcon } from 'lucide-vue-next'
import { getAllTaskRoute, updateTaskByAdmine, getManagersRoute, getEmployeesRoute, getProfileRoute }

 from '~/util'
const {$socket}=useNuxtApp();

const router = useRouter()

const tasks = ref([])
const employees = ref([])
const managers = ref([])
const isLoading = ref(true)
const error = ref(null)
const profile = ref(null)

const taskId = ref(null)

const searchQuery = ref('')
const filterStatus = ref('all')
const showTaskModal = ref(false)
const currentTask = ref({
  taskId: null,
  title: '',
  description: '',
  assignedTo: '',
  assignedBy: '',
  dueDate: '',
  priority: '',
  status: ''
})

const sortOrder = ref({
  date: 'asc',
  priority: 'asc'
})

const filteredTasks = computed(() => {
  let filtered = tasks.value.filter(task => 
    task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (filterStatus.value === 'all' || task.status === filterStatus.value)
  )

  // Sort by date
  if (sortOrder.value.date !== 'none') {
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return sortOrder.value.date === 'asc' ? dateA - dateB : dateB - dateA
    })
  }

  // Sort by priority
  if (sortOrder.value.priority !== 'none') {
    const priorityOrder = { low: 1, medium: 2, high: 3 }
    filtered.sort((a, b) => {
      const priorityA = priorityOrder[a.priority]
      const priorityB = priorityOrder[b.priority]
      return sortOrder.value.priority === 'asc' ? priorityA - priorityB : priorityB - priorityA
    })
  }

  return filtered
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const fetchTasks = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(getAllTaskRoute, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('task-managment')
      }
    })

    const data = await response.json()
    console.log('Fetched tasks:', data)
    if (data.success) {
      tasks.value = data.allTasks.map(task => ({
        ...task,
        taskId: task._id
      }))
    } else {
      throw new Error(data.message || 'Failed to fetch tasks')
    }
  } catch (err) {
    console.error('Error fetching tasks:', err)
    error.value = 'Failed to load tasks. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const fetchEmployees = async () => {
  try {
    const response = await fetch(getEmployeesRoute, {
      method: 'GET',
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
    showToast('Failed to load employees. Please try again.', 'error')
  }
}

const fetchManagers = async () => {
  try {
    const response = await fetch(getManagersRoute, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('task-managment')
      }
    })

    const data = await response.json()

    if (data.success) {
      managers.value = data.managers
    } else {
      throw new Error(data.message || 'Failed to fetch managers')
    }
  } catch (err) {
    console.error('Error fetching managers:', err)
    showToast('Failed to load managers. Please try again.', 'error')
  }
}

const fetchProfile = async () => {
  try {
    const response = await fetch(getProfileRoute, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('task-managment')
      }
    })

    const data = await response.json()
console.log(data)
    if (data.success) {

      profile.value = data.user
    } else {
      throw new Error(data.message || 'Failed to fetch profile')
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    showToast('Failed to load profile. Please try again.', 'error')
  }
}

const getEmployeeName = (id) => {

  const employee = employees.value.find(e => e._id === id)
  console.log(employees.value);
  console.log(employee);
  return employee ? `${employee.firstname} ${employee.lastname}` : 'Unknown'
}

const getManagerName = (id) => {
  const manager = managers.value.find(m => m._id === id)
  return manager ? `${manager.firstname} ${manager.lastname}` : 'Unknown'
}

const getAssignedToId = (assignedTo) => {
  if (typeof assignedTo === 'object' && assignedTo._id) {
    return assignedTo._id
  }
  const employee = employees.value.find(e => 
    `${e.firstname} ${e.lastname}`.toLowerCase() === assignedTo.toLowerCase()
  )
  return employee ? employee._id : assignedTo
}

const getAssignedById = (assignedBy) => {
  if (typeof assignedBy === 'object' && assignedBy._id) {
    return assignedBy._id
  }
  const manager = managers.value.find(m => 
    `${m.firstname} ${m.lastname}`.toLowerCase() === assignedBy.toLowerCase()
  )
  return manager ? manager._id : assignedBy
}

const openEditTaskModal = (task) => {

  console.log(task)
  taskId.value = task.id;

  currentTask.value = { 
    ...task,
    assignedTo: getAssignedToId(task.assignedTo),
    assignedBy: getAssignedById(task.assignedBy),
    dueDate: new Date(task.dueDate).toISOString().split('T')[0] // Convert to YYYY-MM-DD format
  }
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
}

const updateTask = async () => {
  if (!validateTask()) {
    return
  }

  try {
    const response = await fetch(updateTaskByAdmine, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('task-managment')
      },
      body: JSON.stringify({
        ...currentTask.value,
        taskId: taskId.value
      })
    })

    const data = await response.json()

    if (data.success) {
      await fetchTasks()
      showToast('Task updated successfully', 'success')
      $socket.emit('update');
    } else {
      throw new Error(data.message || 'Failed to update task')
    }
  } catch (err) {
    console.error('Error updating task:', err)
    showToast('Failed to update task. Please try again.', 'error')
  } finally {
    closeTaskModal()
  }
}

const validateTask = () => {
  const requiredFields = ['title', 'description', 'assignedTo', 'assignedBy', 'dueDate', 'priority', 'status']
  for (const field of requiredFields) {
    if (!currentTask.value[field]) {
      showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`, 'error')
      return false
    }
  }
  return true
}

const showToast = (message, type = 'info') => {
  // Implement your toast notification logic here
  console.log(`Toast: ${type} - ${message}`)
}

const logout = () => {
  localStorage.removeItem('task-managment')
  router.push('/login')
}

const sortByDate = () => {
  if (sortOrder.value.date === 'asc') {
    sortOrder.value.date = 'desc'
  } else if (sortOrder.value.date === 'desc') {
    sortOrder.value.date = 'none'
  } else {
    sortOrder.value.date = 'asc'
  }
  sortOrder.value.priority = 'none'
}

const sortByPriority = () => {
  if (sortOrder.value.priority === 'asc') {
    sortOrder.value.priority = 'desc'
  } else if (sortOrder.value.priority === 'desc') {
    sortOrder.value.priority = 'none'
  } else {
    sortOrder.value.priority = 'asc'
  }
  sortOrder.value.date = 'none'
}

$socket.on('onUpdate',()=>{
  fetchTasks();
  fetchEmployees();
  fetchManagers();
});

onMounted(() => {
  fetchTasks()
  fetchEmployees()
  fetchManagers()
  fetchProfile()
})
</script>