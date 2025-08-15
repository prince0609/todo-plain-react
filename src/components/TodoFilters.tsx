import { Button } from '@/components/ui/button';
import type { FilterType } from './TodoApp';

interface TodoFiltersProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  activeTodosCount: number;
  totalTodos: number;
}

const TodoFilters = ({ filter, setFilter, activeTodosCount, totalTodos }: TodoFiltersProps) => {
  const completedCount = totalTodos - activeTodosCount;

  return (
    <div className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          {totalTodos === 0 ? (
            "No todos yet"
          ) : (
            <>
              <span className="font-medium text-primary">{activeTodosCount}</span> active
              {completedCount > 0 && (
                <>
                  {" • "}
                  <span className="font-medium text-success">{completedCount}</span> completed
                </>
              )}
              {" • "}
              <span className="font-medium">{totalTodos}</span> total
            </>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
            <Button
              key={filterType}
              size="sm"
              variant={filter === filterType ? 'default' : 'ghost'}
              onClick={() => setFilter(filterType)}
              className={`capitalize transition-all duration-200 ${
                filter === filterType
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-background/50'
              }`}
            >
              {filterType}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoFilters;