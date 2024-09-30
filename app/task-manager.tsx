'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, Circle, PlusCircle } from 'lucide-react'

interface Task {
  id: number
  title: string
  completed: boolean
  category: string
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [newCategory, setNewCategory] = useState('work')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, completed: false, category: newCategory }])
      setNewTask('')
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.completed
    if (filter === 'active') return !task.completed
    return task.category === filter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Task Manager</h1>
        
        <form onSubmit={addTask} className="mb-6 flex gap-2">
          <div className="flex-1">
            <Label htmlFor="task" className="sr-only">New Task</Label>
            <Input
              id="task"
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" size="icon">
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Add task</span>
          </Button>
        </form>

        <div className="mb-4">
          <Label htmlFor="filter" className="sr-only">Filter tasks</Label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full" id="filter">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center p-3 bg-gray-50 rounded-md mb-2 shadow-sm"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTask(task.id)}
                className={`mr-2 ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
              >
                {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                <span className="sr-only">{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</span>
              </Button>
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                task.category === 'work' ? 'bg-blue-100 text-blue-800' :
                task.category === 'personal' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {task.category}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No tasks found.</p>
        )}
      </div>
    </div>
  )
}