// TypeScript interfaces for Matrix Todo Dashboard

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: 'Day' | 'Week' | 'Month';
  timestamp: string;
  subtasks?: Subtask[];
  tags?: string[];
}

export interface Subtask {
  id: number;
  text: string;
  completed: boolean;
  timestamp: string;
}

export interface TodoCategory {
  icon: string;
  color: string;
  items: TodoItem[];
}

export interface TodoState {
  venture: TodoCategory;
  finance: TodoCategory;
  personal: TodoCategory;
}

export interface Idea {
  id: number;
  text: string;
  timestamp: string;
  category?: 'venture' | 'finance' | 'personal';
}

export interface CategoryLink {
  id: number;
  title: string;
  url: string;
  type: 'docs' | 'sheets' | 'slides' | 'external';
}

export interface ChatMessage {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DashboardData {
  todos: TodoState;
  ideas: Idea[];
  categoryLinks: {
    venture: CategoryLink[];
    finance: CategoryLink[];
    personal: CategoryLink[];
  };
  chatMessages: ChatMessage[];
  lastSaved?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  lastSaved?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}