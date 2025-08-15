import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TodoItem from './TodoItem';
import TodoFilters from './TodoFilters';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodos(parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })));
      } catch (error) {
        console.error('Failed to parse saved todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos(prev => [todo, ...prev]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    if (newText.trim()) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, text: newText.trim() } : todo
        )
      );
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Todo App
          </h1>
          <p className="text-muted-foreground">
            Stay organized and get things done
          </p>
        </div>

        {/* Add todo form */}
        <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] mb-6 animate-fade-in">
          <div className="flex gap-3">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 text-base"
            />
            <Button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-glow hover:to-blue-500 transition-all duration-300 shadow-[var(--shadow-elegant)]"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <TodoFilters
          filter={filter}
          setFilter={setFilter}
          activeTodosCount={activeTodosCount}
          totalTodos={todos.length}
        />

        {/* Todo list */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {filter === 'active' && todos.length > 0
                ? "🎉 All done! No active todos."
                : filter === 'completed' && todos.length > 0
                ? "No completed todos yet."
                : "No todos yet. Add one above to get started!"}
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-in"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;