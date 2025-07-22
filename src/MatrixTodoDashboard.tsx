import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, DollarSign, User, CheckCircle, X, Edit2, Plus, Trash2, Lightbulb, ChevronDown, ChevronUp, MessageCircle, Send, Bot, User as UserIcon, Link, ExternalLink } from 'lucide-react';

const MatrixTodoDashboard = () => {
  const [editingTask, setEditingTask] = useState(null);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [ideas, setIdeas] = useState([
    { id: 1001, text: 'Explore AI-powered due diligence automation', timestamp: new Date().toISOString() },
    { id: 1002, text: 'Research Web3 investment opportunities', timestamp: new Date().toISOString() }
  ]);
  const [ideasExpanded, setIdeasExpanded] = useState(true);
  const [editingIdea, setEditingIdea] = useState(null);
  const [isAddingNewIdea, setIsAddingNewIdea] = useState(false);
  
  // Category editing state
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Links state
  const [categoryLinks, setCategoryLinks] = useState({
    venture: [
      { id: 1, title: 'Portfolio Strategy', url: 'https://docs.google.com/spreadsheets/d/example', type: 'sheets' },
      { id: 2, title: 'Investment Thesis', url: 'https://docs.google.com/presentation/d/example', type: 'slides' }
    ],
    finance: [
      { id: 1, title: 'Expense Tracking', url: 'https://docs.google.com/spreadsheets/d/example', type: 'sheets' }
    ],
    personal: [
      { id: 1, title: 'Goals & Vision', url: 'https://docs.google.com/document/d/example', type: 'docs' }
    ]
  });
  const [expandedLinks, setExpandedLinks] = useState({});
  const [editingLink, setEditingLink] = useState(null);
  
  // Chatbot state
  const [chatbotExpanded, setChatbotExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm your productivity assistant. I can help you:\n\n• Organize your thoughts into tasks and ideas\n• Assess priorities and categorize work\n• Review your progress and completed items\n• Provide suggestions when you're stuck\n• Help with braindumps and planning\n\nWhat would you like to work on today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Ref for chat messages container
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added or loading state changes
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  // Load data from file on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate data structure before setting state
        if (data && typeof data === 'object') {
          if (data.todos && typeof data.todos === 'object') setTodos(data.todos);
          if (Array.isArray(data.ideas)) setIdeas(data.ideas);
          if (data.categoryLinks && typeof data.categoryLinks === 'object') setCategoryLinks(data.categoryLinks);
          if (Array.isArray(data.chatMessages)) setChatMessages(data.chatMessages);
          console.log('Data loaded successfully');
        } else {
          console.warn('Invalid data structure received from API');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Show user-friendly error message or set default state
        // Could add toast notification here
      }
    };

    loadData();
  }, []);

  // Save data to file whenever state changes
  const saveData = async () => {
    try {
      const dataToSave = {
        todos,
        ideas,
        categoryLinks,
        chatMessages
      };

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        console.log('Data saved successfully:', result.lastSaved);
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

    const [todos, setTodos] = useState({
    venture: {
      icon: <Briefcase className="w-5 h-5" />,
      color: 'bg-blue-600',
      items: [
        { id: 1, task: 'Portfolio management tool development', priority: 'week', completed: false, status: 'grey', 
          subtasks: [
            { id: 101, text: 'Letter to founders', completed: false, status: 'grey' },
            { id: 102, text: 'Competitive landscape analysis', completed: false, status: 'grey' }
          ]
        },
        { id: 2, task: 'Nvidia partnership management', priority: 'week', completed: false, status: 'grey', subtasks: [] },
        { id: 3, task: 'Deal sourcing', priority: 'week', completed: false, status: 'grey', 
          subtasks: [
            { id: 103, text: 'Harmonic report sharing', completed: false, status: 'grey' }
          ]
        },
        { id: 4, task: 'Build AI tools for VC firms (Your Company)', priority: 'month', completed: false, status: 'grey', subtasks: [] },
        { id: 5, task: 'Establish your own VC firm', priority: 'future', completed: false, status: 'grey', subtasks: [] },
        { id: 6, task: 'Fundraising pitch practice', priority: 'month', completed: false, status: 'grey', subtasks: [] },
        { id: 7, task: 'Regional expansion research', priority: 'quarter', completed: false, status: 'grey', subtasks: [] },
        { id: 8, task: 'Hyperscaler partnerships', priority: 'quarter', completed: false, status: 'grey', subtasks: [] },
        { id: 9, task: 'Connect with later-stage VCs', priority: 'quarter', completed: false, status: 'grey', subtasks: [] },
        { id: 10, task: 'I-40 capital understanding', priority: 'quarter', completed: false, status: 'grey', subtasks: [] },
        { id: 18, task: 'Build a billion-dollar portfolio company', priority: 'future', completed: false, status: 'grey', subtasks: [] },
        { id: 19, task: 'Launch international VC fund', priority: 'future', completed: false, status: 'grey', subtasks: [] }
      ]
    },
    finance: {
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-green-600',
      items: [
        { id: 11, task: 'Ramp demo for expense management', priority: 'week', completed: false, status: 'grey', subtasks: [] },
        { id: 12, task: 'Trim concentrated stock positions', priority: 'month', completed: false, status: 'grey', subtasks: [] },
        { id: 13, task: 'Tax strategy planning', priority: 'month', completed: false, status: 'grey', subtasks: [] },
        { id: 14, task: 'Business expense organization', priority: 'month', completed: false, status: 'grey', subtasks: [] },
        { id: 15, task: 'Research new investment opportunities', priority: 'quarter', completed: false, status: 'grey', subtasks: [] },
        { id: 20, task: 'Achieve financial independence', priority: 'future', completed: false, status: 'grey', subtasks: [] },
        { id: 21, task: 'Build generational wealth portfolio', priority: 'future', completed: false, status: 'grey', subtasks: [] }
      ]
    },
    personal: {
      icon: <User className="w-5 h-5" />,
      color: 'bg-purple-600',
      items: [
        { id: 16, task: 'China visa application', priority: 'week', completed: false, status: 'grey', subtasks: [] },
        { id: 17, task: 'Establish health & wellness routine', priority: 'month', completed: false, status: 'grey', subtasks: [] },
        { id: 22, task: 'Learn Mandarin fluently', priority: 'future', completed: false, status: 'grey', subtasks: [] },
        { id: 23, task: 'Achieve work-life balance mastery', priority: 'future', completed: false, status: 'grey', subtasks: [] }
      ]
    }
  });

  // Auto-save on state changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveData();
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [todos, ideas, categoryLinks, chatMessages]);

  const priorities = ['week', 'month', 'quarter', 'future', 'waiting_actioned', 'completed'];
  const priorityLabels = {
    week: 'This Week',
    month: 'This Month',
    quarter: 'This Quarter',
    future: 'Future',
    waiting_actioned: 'Waiting',
    completed: 'Completed'
  };
  const priorityColors = {
    week: 'bg-red-50 border-red-200',
    month: 'bg-yellow-50 border-yellow-200',
    quarter: 'bg-blue-50 border-blue-200',
    future: 'bg-purple-50 border-purple-200',
    waiting_actioned: 'bg-gray-50 border-gray-200',
    completed: 'bg-green-50 border-green-200'
  };

  const updateTask = (category, taskId, updates) => {
    setTodos(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map(item =>
          item.id === taskId ? {
            ...item,
            ...updates,
            subtasks: updates.subtasks !== undefined ? updates.subtasks : (item.subtasks !== undefined ? item.subtasks : []),
            status: updates.status !== undefined ? updates.status : (item.status || 'green')
          } : item
        )
      }
    }));
  };

  const updateSubtask = (category, taskId, subtaskId, completed, status = null) => {
    setTodos(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map(item => {
          if (item.id === taskId && item.subtasks) {
            return {
              ...item,
              subtasks: item.subtasks.map(subtask =>
                subtask.id === subtaskId ? { 
                  ...subtask, 
                  completed,
                  ...(status && { status })
                } : subtask
              )
            };
          }
          return item;
        })
      }
    }));
  };

  const updateSubtaskText = (category, taskId, subtaskId, newText) => {
    setTodos(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map(item => {
          if (item.id === taskId && item.subtasks) {
            return {
              ...item,
              subtasks: item.subtasks.map(subtask =>
                subtask.id === subtaskId ? { 
                  ...subtask, 
                  text: newText
                } : subtask
              )
            };
          }
          return item;
        })
      }
    }));
  };

  const deleteSubtask = (category, taskId, subtaskId) => {
    setTodos(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map(item => {
          if (item.id === taskId && item.subtasks) {
            return {
              ...item,
              subtasks: item.subtasks.filter(subtask => subtask.id !== subtaskId)
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

  const updateCategoryName = (oldCategory, newCategory) => {
    if (newCategory.trim() && newCategory !== oldCategory) {
      setTodos(prev => {
        const newTodos = { ...prev };
        newTodos[newCategory] = newTodos[oldCategory];
        delete newTodos[oldCategory];
        return newTodos;
      });
      
      // Update links for the renamed category
      setCategoryLinks(prev => {
        const newLinks = { ...prev };
        newLinks[newCategory] = newLinks[oldCategory] || [];
        delete newLinks[oldCategory];
        return newLinks;
      });
    }
    setEditingCategory(null);
  };

  const addLink = (category, title, url, type) => {
    if (title.trim() && url.trim()) {
      const newLink = {
        id: Date.now(),
        title: title.trim(),
        url: url.trim(),
        type: type || 'docs'
      };
      
      setCategoryLinks(prev => ({
          ...prev,
        [category]: [...(prev[category] || []), newLink]
      }));
    }
  };

  const updateLink = (category, linkId, title, url, type) => {
    if (title.trim() && url.trim()) {
      setCategoryLinks(prev => ({
        ...prev,
        [category]: prev[category].map(link =>
          link.id === linkId ? { ...link, title: title.trim(), url: url.trim(), type: type || link.type } : link
        )
      }));
    }
    setEditingLink(null);
  };

  const deleteLink = (category, linkId) => {
    setCategoryLinks(prev => ({
      ...prev,
      [category]: prev[category].filter(link => link.id !== linkId)
    }));
  };

  const toggleLinksExpanded = (category) => {
    setExpandedLinks(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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

    const handleDragStart = (e) => {
      if (e.target.closest('button') || e.target.closest('input') || item.completed) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('taskId', item.id.toString());
      e.dataTransfer.setData('category', category);
    };



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
            {editingTask === item.id ? (
              <textarea
                defaultValue={item.task}
                className="text-xs font-medium text-gray-800 bg-white border-2 border-blue-400 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-4 focus:ring-blue-200 resize-none shadow-xl"
                rows={Math.max(6, Math.ceil(item.task.length / 20))}
                style={{ minHeight: '160px', width: '200%', marginLeft: '-50%', zIndex: 50, position: 'relative' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    updateTask(category, item.id, { task: target.value.trim() });
                    setEditingTask(null);
                  } else if (e.key === 'Escape') {
                    setEditingTask(null);
                  }
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  updateTask(category, item.id, { task: target.value.trim() });
                  setEditingTask(null);
                }}
                autoFocus
              />
            ) : (
              <p 
                className={`text-xs font-medium text-gray-800 break-words cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded ${item.completed ? 'line-through text-green-700' : ''}`}
                onClick={() => setEditingTask(item.id)}
              >
              {item.task}
              {item.subtasks && item.subtasks.length > 0 && (
                <span className="ml-1 text-xs text-gray-500">
                  ({item.subtasks.filter(s => s.completed).length}/{item.subtasks.length})
                </span>
              )}
            </p>
            )}
          </div>
          {editingTask !== item.id && (
            <button
              onClick={() => {
                const statuses = ['green', 'yellow', 'red', 'grey'];
                const currentIndex = statuses.indexOf(item.status || 'green');
                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                updateTask(category, item.id, { status: nextStatus });
              }}
              className={`w-3 h-3 rounded-full transition-colors flex-shrink-0 ${item.status === 'red' ? 'bg-red-500 hover:bg-red-600' : item.status === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' : item.status === 'grey' ? 'bg-gray-400 hover:bg-gray-600' : 'bg-green-500 hover:bg-green-600'}`} 
              title={item.status === 'red' ? 'Blocked' : item.status === 'yellow' ? 'Waiting' : item.status === 'grey' ? 'On hold' : 'For me to do'}
            />
          )}
        </div>
        <div className="space-y-1">
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
                  {editingSubtask === subtask.id ? (
                    <textarea
                      defaultValue={subtask.text}
                      className="flex-1 text-xs text-gray-600 bg-white border-2 border-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-200 resize-none shadow-xl"
                      rows={Math.max(4, Math.ceil(subtask.text.length / 15))}
                      style={{ minHeight: '120px', width: '150%', marginLeft: '-25%', zIndex: 50, position: 'relative' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const target = e.target as HTMLTextAreaElement;
                          updateSubtaskText(category, item.id, subtask.id, target.value.trim());
                          setEditingSubtask(null);
                        } else if (e.key === 'Escape') {
                          setEditingSubtask(null);
                        }
                      }}
                      onBlur={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        updateSubtaskText(category, item.id, subtask.id, target.value.trim());
                        setEditingSubtask(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <span 
                      className={`flex-1 cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded ${subtask.completed ? 'line-through text-gray-500' : ''}`}
                      onClick={() => setEditingSubtask(subtask.id)}
                    >
                      {subtask.text}
                    </span>
                  )}
                                      {editingSubtask !== subtask.id && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const statuses = ['green', 'yellow', 'red', 'grey'];
                            const currentIndex = statuses.indexOf(subtask.status || 'green');
                            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                            updateSubtask(category, item.id, subtask.id, subtask.completed, nextStatus);
                          }}
                          className={`w-2 h-2 rounded-full transition-colors flex-shrink-0 ${subtask.status === 'red' ? 'bg-red-500 hover:bg-red-600' : subtask.status === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' : subtask.status === 'grey' ? 'bg-gray-400 hover:bg-gray-600' : 'bg-green-500 hover:bg-green-600'}`} 
                          title={subtask.status === 'red' ? 'Blocked' : subtask.status === 'yellow' ? 'Waiting' : subtask.status === 'grey' ? 'On hold' : 'For me to do'}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubtask(category, item.id, subtask.id);
                          }}
                          className="text-red-400 hover:text-red-600 flex-shrink-0"
                          title="Delete subtask"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          <div className="mt-1">
            <input
              type="text"
              placeholder="Type @ to add subtask..."
              className="w-full text-xs border-none bg-transparent focus:outline-none text-gray-500 placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const text = e.target.value.trim();
                  if (text.startsWith('@')) {
                    const subtaskText = text.substring(1).trim();
                    if (subtaskText) {
                      const newSubtask = {
                        id: Date.now() + Math.random(),
                        text: subtaskText,
                        completed: false,
                        status: 'grey'
                      };
                      updateTask(category, item.id, {
                        subtasks: [...(item.subtasks || []), newSubtask]
                      });
                      e.target.value = '';
                    }
                  }
                }
              }}
            />
          </div>
          <div className="flex gap-1 flex-shrink-0">
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
          
          {priority !== 'completed' && (
            <div className="relative">
              <textarea
                                        placeholder="Type tasks here..."
                className="w-full p-2 text-xs border border-gray-200 rounded bg-white/50 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    const text = target.value.trim();
                    if (text) {
                      // Parse for subtasks (lines starting with - or * or •)
                      const lines = text.split('\n');
                      const mainTask = lines[0];
                      const subtasks = lines.slice(1)
                        .filter(line => line.trim().match(/^[-*•]\s+/))
                        .map(line => ({
                          id: Date.now() + Math.random(),
                          text: line.trim().replace(/^[-*•]\s+/, ''),
                          completed: false,
                          status: 'grey'
                        }));
                      
                      const maxId = Math.max(0, ...Object.values(todos).flatMap(cat => cat.items.map(item => item.id)));
                      const newTaskObj = {
                        id: maxId + 1,
                        task: mainTask,
                        priority: priority,
                        completed: false,
                        status: 'grey',
                        subtasks: subtasks.length > 0 ? subtasks.map(s => ({ ...s, status: 'grey' })) : []
                      };
                      
                      setTodos(prev => ({
                          ...prev,
                        [category]: {
                          ...prev[category],
                          items: [...prev[category].items, newTaskObj]
                        }
                      }));
                      
                      target.value = '';
                    }
                  }
                }}
                style={{ minHeight: '60px' }}
              />

              </div>
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
      byPriority: { week: 0, month: 0, quarter: 0, future: 0, completed: 0 } 
    };
    Object.values(todos).forEach(category => {
      category.items.forEach(item => {
        stats.total++;
        if (item.completed) stats.completed++;
        if (item.priority in stats.byPriority) {
          stats.byPriority[item.priority as keyof typeof stats.byPriority]++;
        }
        
        if (item.subtasks) {
          stats.totalSubtasks += item.subtasks.length;
          stats.completedSubtasks += item.subtasks.filter(s => s.completed).length;
        }
      });
    });
    return stats;
  };

  const addIdea = (text) => {
    if (!text.trim()) return;
    
    const newIdeaObj = {
      id: Date.now(),
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    
    setIdeas([newIdeaObj, ...ideas]);
    setIsAddingNewIdea(false);
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
    const newTaskFromIdea = {
      id: Date.now(),
      task: idea.text,
      priority: 'week',
      completed: false,
      status: 'grey'
    };
    
    setTodos(prev => ({
      ...prev,
      venture: {
        ...prev.venture,
        items: [...prev.venture.items, newTaskFromIdea]
      }
    }));
    
    // Remove the idea after converting
    deleteIdea(idea.id);
  };

  // Chatbot functions
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await processWithClaude(message);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or check your internet connection.",
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const processWithClaude = async (userMessage) => {
    // Get current state for context
    const currentTasks = Object.entries(todos).flatMap(([category, data]) =>
      data.items.map(item => ({
        ...item,
        category,
        subtasks: item.subtasks || []
      }))
    );

    const completedTasks = currentTasks.filter(task => task.completed);
    const pendingTasks = currentTasks.filter(task => !task.completed);
    const currentIdeas = ideas;

    const context = {
      todos: {
        venture: todos.venture.items,
        finance: todos.finance.items,
        personal: todos.personal.items
      },
      ideas: currentIdeas,
      stats: getStats(),
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length
    };

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage,
          context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;

    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    sendMessage(chatInput);
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Matrix To-Do Dashboard</h1>
        <p className="text-gray-600">Check off tasks and subtasks • Edit to modify • Drag to reprioritize • Capture ideas below</p>
      </div>

      <div className="grid grid-cols-9 gap-4 mb-6">
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
          <p className="text-sm text-gray-600">Future Goals</p>
          <p className="text-2xl font-bold text-purple-500">{stats.byPriority.future || 0}</p>
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
        {Object.entries(todos).map(([category, data]) => (
          <div key={category} className="border-t">
            {/* Category Header */}
            <div className={`p-4 ${data.color} text-white flex items-center gap-2 shadow-md border-b-2 border-white/20`}>
              {data.icon}
              {editingCategory === category ? (
                <input
                  type="text"
                  defaultValue={category}
                  className="bg-white/20 text-white font-semibold border-none outline-none rounded px-2 py-1 flex-1 placeholder-white/70"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      updateCategoryName(category, e.target.value);
                    }
                  }}
                  onBlur={(e) => updateCategoryName(category, e.target.value)}
                />
              ) : (
                <span 
                  className="font-semibold capitalize cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors text-white"
                  onClick={() => setEditingCategory(category)}
                >
                  {category}
                </span>
              )}
            </div>
            
            {/* Links Section */}
            <div className="bg-gray-50 border-b">
              <div 
                className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleLinksExpanded(category)}
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Link className="w-4 h-4" />
                  <span>Project Links ({categoryLinks[category]?.length || 0})</span>
                </div>
                {expandedLinks[category] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              
              {expandedLinks[category] && (
                <div className="px-4 pb-3 space-y-2">
                  {/* Existing Links */}
                  {categoryLinks[category]?.map(link => (
                    <div key={link.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                      {editingLink === link.id ? (
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            defaultValue={link.title}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            placeholder="Link title"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                updateLink(category, link.id, e.target.value, link.url, link.type);
                              }
                            }}
                            onBlur={(e) => updateLink(category, link.id, e.target.value, link.url, link.type)}
                          />
                          <input
                            type="url"
                            defaultValue={link.url}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            placeholder="URL"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                updateLink(category, link.id, link.title, e.target.value, link.type);
                              }
                            }}
                            onBlur={(e) => updateLink(category, link.id, link.title, e.target.value, link.type)}
                          />
                        </div>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 text-sm text-blue-600 hover:text-blue-800 truncate"
                            title={link.title}
                          >
                            {link.title}
                          </a>
                        </>
                      )}
                      
                      <div className="flex gap-1">
                        {editingLink === link.id ? (
                          <button
                            onClick={() => setEditingLink(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingLink(link.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteLink(category, link.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Link */}
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border-dashed border-2 border-gray-300">
                    <Plus className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Add new link</span>
                    <button
                      onClick={() => {
                        const title = prompt('Enter link title:');
                        const url = prompt('Enter URL:');
                        if (title && url) {
                          addLink(category, title, url);
                        }
                      }}
                      className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Priority Headers for this Category */}
            <div className="grid grid-cols-6">
          {priorities.map(priority => (
            <div key={priority} className={`p-3 text-center font-semibold ${priorityColors[priority]}`}> 
              <div className="text-base">{priorityLabels[priority]}</div>
                  <div className={`text-xs ${priority === 'week' ? 'text-red-600' : priority === 'month' ? 'text-yellow-600' : priority === 'quarter' ? 'text-blue-600' : priority === 'future' ? 'text-purple-600' : priority === 'waiting_actioned' ? 'text-gray-600' : 'text-green-600'}`}> 
                    {priority === 'week' ? 'Urgent' : priority === 'month' ? 'Important' : priority === 'quarter' ? 'Strategic' : priority === 'future' ? 'Long-term' : priority === 'waiting_actioned' ? 'Actioned' : 'Done'}
              </div>
            </div>
          ))}
        </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-6">
            {priorities.map(priority => (
              <div key={priority} className="p-1">
                <MatrixCell category={category} priority={priority} />
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ideas and Assistant Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Ideas Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
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
                <p className="text-xs text-gray-500">💡 Tip: Click on a sticky note to edit, or click the checkmark to convert an idea into a task</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Add Idea Sticky Note */}
                <div 
                  className="relative transform rotate-1 hover:rotate-0 transition-transform duration-200 cursor-pointer"
                  style={{ 
                    transform: `rotate(-1deg)`,
                    zIndex: ideas.length + 1 
                  }}
                  onClick={() => setIsAddingNewIdea(true)}
                >
                  <div className="bg-amber-100 p-2 rounded-sm shadow-lg border-l-4 border-amber-300 min-h-[40px] relative border-2 border-dashed border-amber-400">
                    {/* Sticky note shadow effect */}
                    <div className="absolute -bottom-1 -right-1 w-full h-full bg-amber-200 rounded-sm transform rotate-1"></div>
                    
                    {isAddingNewIdea ? (
                      <div className="relative z-10">
                        <textarea
                          placeholder="Type your idea here..."
                          className="w-full bg-transparent border-none outline-none resize-none text-gray-800 font-handwriting text-sm"
                          rows={3}
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              addIdea(e.target.value);
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              addIdea(e.target.value);
                            } else {
                              setIsAddingNewIdea(false);
                            }
                          }}
                />
                <button
                          onClick={() => setIsAddingNewIdea(false)}
                          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                >
                          <X className="w-4 h-4" />
                </button>
              </div>
                    ) : (
                      <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center">
                          <Plus className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
                          <p className="text-gray-600 font-handwriting text-xs">Add idea</p>
                        </div>
                      </div>
                    )}
                  </div>
            </div>
            
                {/* Existing Ideas */}
                {ideas.map((idea, index) => (
                  <div 
                    key={idea.id} 
                    className="relative transform rotate-1 hover:rotate-0 transition-transform duration-200 cursor-pointer"
                    style={{ 
                      transform: `rotate(${(index % 3 - 1) * 2}deg)`,
                      zIndex: ideas.length - index 
                    }}
                    onClick={() => setEditingIdea(idea.id)}
                  >
                    <div className="bg-amber-100 p-2 rounded-sm shadow-lg border-l-4 border-amber-300 min-h-[40px] relative">
                      {/* Sticky note shadow effect */}
                      <div className="absolute -bottom-1 -right-1 w-full h-full bg-amber-200 rounded-sm transform rotate-1"></div>
                      
                    {editingIdea === idea.id ? (
                        <div className="relative z-10">
                          <textarea
                          defaultValue={idea.text}
                            className="w-full bg-transparent border-none outline-none resize-none text-gray-800 font-handwriting text-sm"
                            rows={3}
                          autoFocus
                          onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                              updateIdea(idea.id, e.target.value);
                            }
                          }}
                          onBlur={(e) => updateIdea(idea.id, e.target.value)}
                        />
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingIdea(null);
                            }}
                            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                        <div className="relative z-10">
                          <p className="text-gray-800 font-handwriting text-xs leading-tight mb-1">{idea.text}</p>
                          <p className="text-xs text-gray-600 font-mono">
                            {new Date(idea.timestamp).toLocaleDateString()} at {new Date(idea.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          
                          {/* Action buttons */}
                          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                convertIdeaToTask(idea);
                              }}
                              className="text-green-600 hover:text-green-700 bg-white/80 rounded-full p-1"
                            title="Convert to task"
                          >
                              <CheckCircle className="w-3 h-3" />
                          </button>
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingIdea(idea.id);
                              }}
                              className="text-gray-500 hover:text-gray-700 bg-white/80 rounded-full p-1"
                            >
                              <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteIdea(idea.id);
                              }}
                              className="text-red-500 hover:text-red-700 bg-white/80 rounded-full p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                ))}
              </div>
            </div>
              )}
            </div>

        {/* Productivity Assistant */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 cursor-pointer flex items-center justify-between"
            onClick={() => setChatbotExpanded(!chatbotExpanded)}
          >
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Productivity Assistant</h2>
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                AI-powered
              </span>
          </div>
            {chatbotExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          
          {chatbotExpanded && (
            <div className="flex flex-col h-96">
              {/* Chat Messages */}
              <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'assistant' && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t p-4">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask for help with tasks, ideas, or planning..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isChatLoading}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="mt-2 text-xs text-gray-500">
                  💡 Try: "Help me organize my thoughts" or "What should I focus on this week?"
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatrixTodoDashboard;