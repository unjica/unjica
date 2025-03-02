/**
 * Simple in-memory scheduler for periodic tasks
 */
class SchedulerService {
  private tasks: Map<string, {
    fn: () => Promise<void>;
    interval: number;
    lastRun: Date | null;
    running: boolean;
  }> = new Map();
  
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  
  /**
   * Registers a periodic task
   * @param taskId Unique identifier for the task
   * @param fn The function to execute
   * @param intervalMs Interval in milliseconds between executions
   */
  registerTask(taskId: string, fn: () => Promise<void>, intervalMs: number) {
    this.tasks.set(taskId, {
      fn,
      interval: intervalMs,
      lastRun: null,
      running: false
    });
    
    // Schedule the task immediately
    this.scheduleTask(taskId);
  }
  
  /**
   * Schedules a registered task
   */
  private scheduleTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    // Clear any existing interval
    if (this.intervals.has(taskId)) {
      clearInterval(this.intervals.get(taskId)!);
      this.intervals.delete(taskId);
    }
    
    // Create a new interval
    const interval = setInterval(async () => {
      await this.runTask(taskId);
    }, task.interval);
    
    this.intervals.set(taskId, interval);
  }
  
  /**
   * Runs a specific task
   */
  async runTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task || task.running) return;
    
    try {
      task.running = true;
      await task.fn();
      task.lastRun = new Date();
    } catch (error) {
      console.error(`Error running task ${taskId}:`, error);
    } finally {
      task.running = false;
    }
  }
  
  /**
   * Cancels a registered task
   */
  cancelTask(taskId: string) {
    if (this.intervals.has(taskId)) {
      clearInterval(this.intervals.get(taskId)!);
      this.intervals.delete(taskId);
    }
    
    this.tasks.delete(taskId);
  }
  
  /**
   * Gets information about all registered tasks
   */
  getTaskInfo() {
    const info: Record<string, {
      lastRun: Date | null;
      running: boolean;
      intervalMs: number;
    }> = {};
    
    this.tasks.forEach((task, taskId) => {
      info[taskId] = {
        lastRun: task.lastRun,
        running: task.running,
        intervalMs: task.interval
      };
    });
    
    return info;
  }
}

// Singleton instance
export const scheduler = new SchedulerService(); 