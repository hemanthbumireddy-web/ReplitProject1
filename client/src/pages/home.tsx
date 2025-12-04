import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Draft the project proposal", completed: false, createdAt: new Date() },
    { id: "2", text: "Review team updates", completed: true, createdAt: new Date() },
    { id: "3", text: "Prepare for client meeting", completed: false, createdAt: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Calculate stats
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-primary/10">
      
      {/* Header Section */}
      <header className="w-full max-w-2xl mb-8 text-center sm:text-left">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-primary mb-2">
            Mindful Tasks
          </h1>
          <p className="text-muted-foreground text-lg">
            Focus on what matters, one step at a time.
          </p>
        </motion.div>

        {/* Progress Bar (Subtle) */}
        <motion.div 
          className="mt-6 w-full h-1.5 bg-secondary rounded-full overflow-hidden"
          initial={{ opacity: 0, scaleX: 0.9 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="h-full bg-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
        <div className="mt-2 flex justify-between text-sm text-muted-foreground font-medium">
          <span>{completedCount} completed</span>
          <span>{totalCount - completedCount} remaining</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl space-y-6">
        
        {/* Add Task Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-lg shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-2">
              <form onSubmit={addTodo} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-14 pl-4 pr-4 text-lg border-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50"
                    data-testid="input-new-task"
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-10 w-10 mr-2 rounded-full bg-primary hover:bg-primary/90 transition-all shadow-md"
                  disabled={!inputValue.trim()}
                  data-testid="button-add-task"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-muted-foreground"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                  <Check className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="text-lg">All caught up! Enjoy your day.</p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <Card className={`
                    border-none shadow-sm hover:shadow-md transition-all duration-300
                    ${todo.completed ? 'bg-secondary/50 opacity-75' : 'bg-card'}
                  `}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <Checkbox 
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300"
                          data-testid={`checkbox-task-${todo.id}`}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span 
                          className={`
                            text-lg block truncate transition-all duration-300
                            ${todo.completed ? 'text-muted-foreground line-through decoration-muted-foreground/50' : 'text-foreground font-medium'}
                          `}
                          data-testid={`text-task-${todo.id}`}
                        >
                          {todo.text}
                        </span>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/70">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Today
                          </span>
                          {/* Placeholder for future functionality */}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-9 w-9"
                        data-testid={`button-delete-task-${todo.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
