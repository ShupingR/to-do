import React, { useState } from 'react';
import { Briefcase, DollarSign, User, CheckCircle, X, Edit2, Plus, Trash2, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const MatrixTodoDashboard = () => {
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ category: null, priority: null, text: '', subtasks: [] });
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [ideas, setIdeas] = useState([
    { id: 1001, text: 'Explore AI-powered due diligence automation', timestamp: new Date().toISOString() },
    { id: 1002, text: 'Research Web3 investment opportunities', timestamp: new Date().toISOString() }
  ]);
  const [newIdea, setNewIdea] = useState('');
  const [ideasExpanded, setIdeasExpanded] = useState(true);
  const [editingIdea, setEditingIdea] = useState(null);

  const [todos, setTodos] = useState({
    business: {
      icon: <Briefcase className="w-5 h-5" />,
      color: 'bg-blue-500',
      items: [
        { id: 1, task: 'Portfolio management tool development', priority: 'week', completed: false, 
          subtasks: [
            { id: 101, text: 'Letter to founders', completed: false },
            { id: 102, text: 'Competitive landscape analysis', completed: false }
          ]
        },
        { id: 2, task: 'Nvidia partnership management', priority: 'week', completed: false },
        { id: 3, task: 'Deal sourcing', priority: 'week', completed: false, 
          subtasks: [
            { id: 103, text: 'Harmonic report sharing', completed: false }
          ]
        },
        { id: 4, task: 'Build AI tools for VC firms (Your Company)', priority: 'month', completed: false },
        { id: 5, task: 'Establish your own VC firm', priority: 'quarter', completed: false },
        { id: 6, task: 'Fundraising pitch practice', priority: 'month', completed: false },
        { id: 7, task: 'Regional expansion research', priority: 'quarter', completed: false },
        { id: 8, task: 'Hyperscaler partnerships', priority: 'quarter', completed: false },
        { id: 9, task: 'Connect with later-stage VCs', priority: 'quarter', completed: false },
        { id: 10, task: 'I-40 capital understanding', priority: 'quarter', completed: false }
      ]
    },
    finance: {
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-green-500',
      items: [
        { id: 11, task: 'Ramp demo for expense management', priority: 'week', completed: false },
        { id: 12, task: 'Trim concentrated stock positions', priority: 'month', completed: false },
        { id: 13, task: 'Tax strategy planning', priority: 'month', completed: false },
        { id: 14, task: 'Business expense organization', priority: 'month', completed: false },
        { id: 15, task: 'Research new investment opportunities', priority: 'quarter', completed: false }
      ]
    },
    personal: {
      icon: <User className="w-5 h-5" />,
      color: 'bg-purple-500',
      items: [
        { id: 16, task: 'China visa application', priority: 'week', completed: false },
        { id: 17, task: 'Establish health & wellness routine', priority: 'month', completed: false }
      ]
    }
  });

  const priorities = ['week', 'month', 'quarter', 'completed'];
  const priorityLabels = {
    week: 'This Week',
    month: 'This Month',
    quarter: 'This Quarter',
    completed: 'Completed'
  };
  const priorityColors = {
    week: 'bg-red-50 border-red-200',
    month: 'bg-yellow-50 border-yellow-200',
    quarter: 'bg-blue-50 border-blue-200',
    completed: 'bg-green-50 border-green-200'
  };

  const updateTask = (category, taskId, updates) => {
    setTodos(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map(item =>
          item.id === taskId ? { ...item, ...updates } : item
        )
      }
    }));
  };

  const updateSubtask = (category, taskId, subtaskId, completed) => {
    setTodos(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map(item => {
          if (item.id === taskId && item.subtasks) {
            return {
              ...item,
              subtasks: item.subtasks.map(subtask =>
                subtask.id === subtaskId ? { ...subtask, completed } : subtask
              )
            };
          }
          return item;
        })
      }
    }));
  };

  const deleteTask = (category, taskId) => {
    setTodos(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.filter(item => item.id !== taskId)
      }
    }));
  };

  const addTask = () => {
    if (!newTask.text.trim() || !newTask.category || !newTask.priority) return;
    
    const maxId = Math.max(0, ...Object.values(todos).flatMap(cat => cat.items.map(item => item.id)));
    const newId = maxId + 1;
    
    setTodos(prev => ({
      ...prev,
      [newTask.category]: {
        ...prev[newTask.category],
        items: [...prev[newTask.category].items, {
          id: newId,
          task: newTask.text,
          priority: newTask.priority,
          completed: false,
          subtasks: newTask.subtasks.length > 0 ? newTask.subtasks : undefined
        }]
      }
    }));
    
    setNewTask({ category: null, priority: null, text: '', subtasks: [] });
    setNewSubtaskInput('');
  };

  const moveTask = (taskId, fromCategory, toPriority) => {
    const task = todos[fromCategory].items.find(item => item.id === taskId);
    if (task && priorities.includes(toPriority)) {
      updateTask(fromCategory, taskId, { priority: toPriority });
    }
  };

  const toggleTaskCompletion = (category, taskId) => {
    const task = todos[category].items.find(item => item.id === taskId);
    if (task) {
      const newCompleted = !task.completed;
      const newPriority = newCompleted ? 'completed' : task.priority;
      updateTask(category, taskId, { completed: newCompleted, priority: newPriority });
    }
  };

  const TaskCard = ({ category, item }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.task);
    const [editCategory, setEditCategory] = useState(category);
    const [editPriority, setEditPriority] = useState(item.priority);
    const [editSubtasks, setEditSubtasks] = useState(item.subtasks || []);
    const [newSubtask, setNewSubtask] = useState('');

    const handleSave = () => {
      if (editCategory !== category) {
        // Move task to new category
        deleteTask(category, item.id);
        const maxId = Math.max(0, ...Object.values(todos).flatMap(cat => cat.items.map(t => t.id)));
        setTodos(prev => ({
          ...prev,
          [editCategory]: {
            ...prev[editCategory],
            items: [...prev[editCategory].items, {
              id: maxId + 1,
              task: editText,
              priority: editPriority,
              completed: item.completed,
              subtasks: editSubtasks.length > 0 ? editSubtasks : undefined
            }]
          }
        }));
      } else {
        updateTask(category, item.id, { 
          task: editText, 
          priority: editPriority,
          subtasks: editSubtasks.length > 0 ? editSubtasks : undefined
        });
      }
      setIsEditing(false);
    };

    const addSubtask = () => {
      if (newSubtask.trim()) {
        const newSubtaskObj = { 
          id: Date.now(), 
          text: newSubtask.trim(), 
          completed: false 
        };
        setEditSubtasks([...editSubtasks, newSubtaskObj]);
        setNewSubtask('');
      }
    };

    const removeSubtask = (index) => {
      setEditSubtasks(editSubtasks.filter((_, i) => i !== index));
    };

    const handleDragStart = (e) => {
      if (e.target.closest('button') || e.target.closest('input') || item.completed) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('taskId', item.id.toString());
      e.dataTransfer.setData('category', category);
    };

    if (isEditing) {
      return (
        <div className="bg-white p-3 rounded shadow-sm border border-blue-400">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm mb-2"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="business">Business</option>
              <option value="finance">Finance</option>
              <option value="personal">Personal</option>
            </select>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          
          <div className="mb-2">
            <p className="text-xs font-medium text-gray-600 mb-1">Subtasks:</p>
            {editSubtasks.map((subtask, idx) => (
              <div key={subtask.id || idx} className="flex items-center gap-1 mb-1">
                <button
                  onClick={() => {
                    const updated = [...editSubtasks];
                    updated[idx] = { ...subtask, completed: !subtask.completed };
                    setEditSubtasks(updated);
                  }}
                  className="flex-shrink-0"
                >
                  <CheckCircle className={`w-3 h-3 ${subtask.completed ? 'text-green-500' : 'text-gray-400'} hover:text-green-600`} />
                </button>
                <span className={`text-xs flex-1 ${subtask.completed ? 'line-through' : ''}`}>{subtask.text}</span>
                <button
                  onClick={() => removeSubtask(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex gap-1 mt-1">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 px-2 py-1 border rounded text-xs"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              />
              <button
                onClick={addSubtask}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
            >
              Save All
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(item.task);
                setEditCategory(category);
                setEditPriority(item.priority);
                setEditSubtasks(item.subtasks || []);
                setNewSubtask('');
              }}
              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`bg-white p-2 rounded shadow-sm border hover:shadow-md transition-shadow ${item.completed ? 'bg-green-50 border-green-200' : ''} hover:border-gray-300`}
        draggable={!item.completed}
        onDragStart={handleDragStart}
      >
        <div className="flex items-start gap-1">
          <button
            onClick={() => toggleTaskCompletion(category, item.id)}
            className="mt-0.5 flex-shrink-0"
          >
            <CheckCircle className={`w-4 h-4 ${item.completed ? 'text-green-500' : 'text-gray-400'}`} />
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium text-gray-800 break-words ${item.completed ? 'line-through text-green-700' : ''}`}>
              {item.task}
              {item.subtasks && item.subtasks.length > 0 && (
                <span className="ml-1 text-xs text-gray-500">
                  ({item.subtasks.filter(s => s.completed).length}/{item.subtasks.length})
                </span>
              )}
            </p>
            {item.subtasks && item.subtasks.length > 0 && (
              <ul className="mt-1 ml-2">
                {item.subtasks.map((subtask) => (
                  <li key={subtask.id} className="text-xs text-gray-600 flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateSubtask(category, item.id, subtask.id, !subtask.completed);
                      }}
                      className="flex-shrink-0"
                    >
                      <CheckCircle className={`w-3 h-3 ${subtask.completed ? 'text-green-500' : 'text-gray-400'} hover:text-green-600`} />
                    </button>
                    <span className={subtask.completed ? 'line-through text-gray-500' : ''}>{subtask.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
              title="Edit task, category, priority, and subtasks"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => deleteTask(category, item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MatrixCell = ({ category, priority }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const tasks = todos[category].items.filter(item => item.priority === priority);
    
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const taskId = parseInt(e.dataTransfer.getData('taskId'));
      const fromCategory = e.dataTransfer.getData('category');
      if (priority !== 'completed') {
        moveTask(taskId, fromCategory, priority);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const isAddingNewTask = newTask.category === category && newTask.priority === priority;

    return (
      <div 
        className={`min-h-[200px] p-3 border ${priorityColors[priority]} rounded-lg transition-all ${isDragOver && priority !== 'completed' ? 'border-2 border-blue-400 bg-blue-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={priority !== 'completed' ? handleDragOver : undefined}
        onDragLeave={priority !== 'completed' ? handleDragLeave : undefined}
      >
        <div className="space-y-2">
          {tasks.map(item => (
            <TaskCard key={item.id} category={category} item={item} />
          ))}
          
          {isAddingNewTask && priority !== 'completed' ? (
            <div className="bg-white p-2 rounded shadow-sm border border-blue-400">
              <input
                type="text"
                value={newTask.text}
                onChange={(e) => setNewTask(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter new task..."
                className="w-full px-2 py-1 border rounded text-sm mb-2"
                autoFocus
              />
              
              {newTask.subtasks.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-600 mb-1">Subtasks:</p>
                  {newTask.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-1 mb-1">
                      <CheckCircle className={`w-3 h-3 ${subtask.completed ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={`text-xs flex-1 ${subtask.completed ? 'line-through' : ''}`}>{subtask.text}</span>
                      <button
                        onClick={() => setNewTask(prev => ({
                          ...prev,
                          subtasks: prev.subtasks.filter((s) => s.id !== subtask.id)
                        }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  placeholder="Add subtask (optional)..."
                  className="flex-1 px-2 py-1 border rounded text-xs"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSubtaskInput.trim()) {
                        setNewTask(prev => ({
                          ...prev,
                          subtasks: [...prev.subtasks, { 
                            id: Date.now(), 
                            text: newSubtaskInput.trim(), 
                            completed: false 
                          }]
                        }));
                        setNewSubtaskInput('');
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newSubtaskInput.trim()) {
                      setNewTask(prev => ({
                        ...prev,
                        subtasks: [...prev.subtasks, { 
                          id: Date.now(), 
                          text: newSubtaskInput.trim(), 
                          completed: false 
                        }]
                      }));
                      setNewSubtaskInput('');
                    }
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={addTask}
                  className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setNewTask({ category: null, priority: null, text: '', subtasks: [] });
                    setNewSubtaskInput('');
                  }}
                  className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setNewTask({ category, priority, text: '', subtasks: [] })}
              className="w-full border border-dashed border-gray-300 p-2 rounded text-gray-500 hover:text-gray-700 hover:border-gray-400 flex items-center justify-center gap-1 text-sm"
            >
              <Plus className="w-3 h-3" />
              Add task
            </button>
          )}
        </div>
      </div>
    );
  };

  const getStats = () => {
    const stats = { 
      total: 0, 
      completed: 0, 
      totalSubtasks: 0,
      completedSubtasks: 0,
      byPriority: { week: 0, month: 0, quarter: 0, completed: 0 } 
    };
    Object.values(todos).forEach(category => {
      category.items.forEach(item => {
        stats.total++;
        if (item.completed) stats.completed++;
        if (item.priority in stats.byPriority) {
          stats.byPriority[item.priority]++;
        }
        
        if (item.subtasks) {
          stats.totalSubtasks += item.subtasks.length;
          stats.completedSubtasks += item.subtasks.filter(s => s.completed).length;
        }
      });
    });
    return stats;
  };

  const addIdea = () => {
    if (!newIdea.trim()) return;
    
    const newIdeaObj = {
      id: Date.now(),
      text: newIdea.trim(),
      timestamp: new Date().toISOString()
    };
    
    setIdeas([newIdeaObj, ...ideas]);
    setNewIdea('');
  };

  const deleteIdea = (ideaId) => {
    setIdeas(ideas.filter(idea => idea.id !== ideaId));
  };

  const updateIdea = (ideaId, newText) => {
    setIdeas(ideas.map(idea => 
      idea.id === ideaId ? { ...idea, text: newText } : idea
    ));
    setEditingIdea(null);
  };

  const convertIdeaToTask = (idea) => {
    // Add to business category, this month priority by default
    const maxId = Math.max(0, ...Object.values(todos).flatMap(cat => cat.items.map(item => item.id)));
    const newTaskFromIdea = {
      id: maxId + 1,
      task: idea.text,
      priority: 'month',
      completed: false
    };
    
    setTodos(prev => ({
      ...prev,
      business: {
        ...prev.business,
        items: [...prev.business.items, newTaskFromIdea]
      }
    }));
    
    // Remove the idea after converting
    deleteIdea(idea.id);
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Matrix To-Do Dashboard</h1>
        <p className="text-gray-600">Check off tasks and subtasks • Edit to modify • Drag to reprioritize • Capture ideas below</p>
      </div>

      <div className="grid grid-cols-8 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Subtasks</p>
          <p className="text-2xl font-bold text-purple-500">
            {stats.completedSubtasks}/{stats.totalSubtasks}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-red-500">{stats.byPriority.week}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.byPriority.month}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">This Quarter</p>
          <p className="text-2xl font-bold text-blue-500">{stats.byPriority.quarter}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.byPriority.completed || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Ideas</p>
          <p className="text-2xl font-bold text-orange-500">{ideas.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-5">
          <div className="p-4 bg-gray-100 font-semibold">Category</div>
          {priorities.map(priority => (
            <div key={priority} className={`p-4 text-center font-semibold ${priorityColors[priority]}`}>
              <div className="text-lg">{priorityLabels[priority]}</div>
              <div className={`text-sm ${priority === 'week' ? 'text-red-600' : priority === 'month' ? 'text-yellow-600' : priority === 'quarter' ? 'text-blue-600' : 'text-green-600'}`}>
                {priority === 'week' ? 'Urgent' : priority === 'month' ? 'Important' : priority === 'quarter' ? 'Strategic' : 'Done'}
              </div>
            </div>
          ))}
        </div>

        {Object.entries(todos).map(([category, data]) => (
          <div key={category} className="grid grid-cols-5 border-t">
            <div className={`p-4 ${data.color} text-white flex items-center gap-2`}>
              {data.icon}
              <span className="font-semibold capitalize">{category}</span>
            </div>
            {priorities.map(priority => (
              <div key={priority} className="p-2">
                <MatrixCell category={category} priority={priority} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Ideas Section */}
      <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <div 
          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 cursor-pointer flex items-center justify-between"
          onClick={() => setIdeasExpanded(!ideasExpanded)}
        >
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Ideas</h2>
            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
              {ideas.length} ideas
            </span>
          </div>
          {ideasExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        
        {ideasExpanded && (
          <div className="p-6">
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="Capture an idea..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyPress={(e) => e.key === 'Enter' && addIdea()}
                />
                <button
                  onClick={addIdea}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">💡 Tip: Click the checkmark to convert an idea into a task</p>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {ideas.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No ideas yet. Start capturing your thoughts!</p>
              ) : (
                ideas.map((idea) => (
                  <div key={idea.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                    {editingIdea === idea.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={idea.text}
                          className="flex-1 px-2 py-1 border rounded"
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              updateIdea(idea.id, e.target.value);
                            }
                          }}
                          onBlur={(e) => updateIdea(idea.id, e.target.value)}
                        />
                        <button
                          onClick={() => setEditingIdea(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-gray-800">{idea.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(idea.timestamp).toLocaleDateString()} at {new Date(idea.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => convertIdeaToTask(idea)}
                            className="text-green-600 hover:text-green-700"
                            title="Convert to task"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingIdea(idea.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteIdea(idea.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixTodoDashboard;