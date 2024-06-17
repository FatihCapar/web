export const getTasksForUser = async () => {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    return tasks;
  };
  
  export const createTask = async (task) => {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    const newTask = await response.json();
    return newTask;
  };
  
  export const deleteTask = async (taskId) => {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    return result;
  };
  
  export const deleteAllTasks = async () => {
    const response = await fetch('/tasks', {
      method: 'DELETE',
    });
    const result = await response.json();
    return result;
  };
  
  export const getCommentsForTask = async (taskId) => {
    const response = await fetch(`/comments/${taskId}`);
    const comments = await response.json();
    return comments;
  };
  
  export const addCommentToTask = async (taskId, comment) => {
    const response = await fetch(`/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task_id: taskId, content: comment }),
    });
    const newComment = await response.json();
    return newComment;
  };
  