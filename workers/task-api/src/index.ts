/**
 * Task API Worker
 * 
 * A stateless API that stores tasks in GitHub repository as JSON files.
 * Uses Hono for Express-like routing.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  ADMIN_KEY: string;
  FRIEND_KEY: string;
  GITHUB_PAT: string;
  REPO_OWNER: string;
  REPO_NAME: string;
  REPO_BRANCH: string;
}

type UserType = 'public' | 'friend' | 'admin';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: ['https://hadoku.me', 'https://api.hadoku.me', 'http://localhost:*'],
  credentials: true
}));

// Authentication middleware
app.use('*', async (c, next) => {
  const providedKey = c.req.header('X-Admin-Key') || c.req.query('key');
  
  let userType: UserType = 'public';
  
  if (providedKey === c.env.ADMIN_KEY) {
    userType = 'admin';
  } else if (providedKey === c.env.FRIEND_KEY) {
    userType = 'friend';
  }
  
  c.set('userType', userType);
  await next();
});

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'task-api',
    timestamp: new Date().toISOString()
  });
});

// List tasks
app.get('/', async (c) => {
  const userType = c.get('userType') as UserType;
  
  if (userType === 'public') {
    return c.json({ error: 'Forbidden - Public users should use localStorage' }, 403);
  }
  
  try {
    const tasks = await fetchTasksFromGitHub(c.env, userType);
    return c.json({ tasks, userType });
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// Get stats
app.get('/stats', async (c) => {
  const userType = c.get('userType') as UserType;
  
  if (userType === 'public') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  
  try {
    const tasks = await fetchTasksFromGitHub(c.env, userType);
    const completed = tasks.filter((t: any) => t.completed).length;
    
    return c.json({
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      userType
    });
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// Create task
app.post('/', async (c) => {
  const userType = c.get('userType') as UserType;
  
  if (userType === 'public') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  
  try {
    const body = await c.req.json();
    const task = {
      id: generateId(),
      text: body.text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    await saveTaskToGitHub(c.env, userType, task);
    
    return c.json({ success: true, task }, 201);
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// Update task
app.patch('/:id', async (c) => {
  const userType = c.get('userType') as UserType;
  
  if (userType === 'public') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    await updateTaskInGitHub(c.env, userType, id, body);
    
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// Complete task
app.post('/:id/complete', async (c) => {
  const userType = c.get('userType') as UserType;
  
  if (userType === 'public') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  
  try {
    const id = c.req.param('id');
    await updateTaskInGitHub(c.env, userType, id, { completed: true });
    
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// Delete task
app.delete('/:id', async (c) => {
  const userType = c.get('userType') as UserType;
  
  if (userType === 'public') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  
  try {
    const id = c.req.param('id');
    await deleteTaskFromGitHub(c.env, userType, id);
    
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// Clear all tasks (admin only)
app.post('/clear', async (c) => {
  const userType = c.get('userType') as UserType;
  
  if (userType !== 'admin') {
    return c.json({ error: 'Forbidden - Admin only' }, 403);
  }
  
  try {
    await clearAllTasks(c.env, userType);
    return c.json({ success: true, message: 'All tasks cleared' });
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// GitHub API helpers (placeholder implementations)

async function fetchTasksFromGitHub(env: Env, userType: UserType): Promise<any[]> {
  const path = `data/task/${userType}/tasks.json`;
  const url = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}?ref=${env.REPO_BRANCH}`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'hadoku-task-api'
    }
  });
  
  if (res.status === 404) {
    return []; // File doesn't exist yet
  }
  
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  
  const data = await res.json() as any;
  const content = atob(data.content);
  return JSON.parse(content);
}

async function saveTaskToGitHub(env: Env, userType: UserType, task: any): Promise<void> {
  const tasks = await fetchTasksFromGitHub(env, userType);
  tasks.push(task);
  
  const path = `data/task/${userType}/tasks.json`;
  const content = btoa(JSON.stringify(tasks, null, 2));
  
  // Get current file SHA (if exists)
  let sha: string | undefined;
  try {
    const fileUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}?ref=${env.REPO_BRANCH}`;
    const fileRes = await fetch(fileUrl, {
      headers: {
        'Authorization': `Bearer ${env.GITHUB_PAT}`,
        'Accept': 'application/vnd.github+json'
      }
    });
    if (fileRes.ok) {
      const fileData = await fileRes.json() as any;
      sha = fileData.sha;
    }
  } catch (e) {
    // File doesn't exist, no SHA needed
  }
  
  // Update or create file
  const url = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Add task ${task.id}`,
      content,
      sha,
      branch: env.REPO_BRANCH
    })
  });
  
  if (!res.ok) {
    throw new Error(`Failed to save task: ${res.status}`);
  }
}

async function updateTaskInGitHub(env: Env, userType: UserType, id: string, updates: any): Promise<void> {
  const tasks = await fetchTasksFromGitHub(env, userType);
  const index = tasks.findIndex((t: any) => t.id === id);
  
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks[index] = { ...tasks[index], ...updates };
  
  const path = `data/task/${userType}/tasks.json`;
  const content = btoa(JSON.stringify(tasks, null, 2));
  
  // Get current SHA
  const fileUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}?ref=${env.REPO_BRANCH}`;
  const fileRes = await fetch(fileUrl, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json'
    }
  });
  
  const fileData = await fileRes.json() as any;
  
  // Update file
  const url = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Update task ${id}`,
      content,
      sha: fileData.sha,
      branch: env.REPO_BRANCH
    })
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update task: ${res.status}`);
  }
}

async function deleteTaskFromGitHub(env: Env, userType: UserType, id: string): Promise<void> {
  const tasks = await fetchTasksFromGitHub(env, userType);
  const filtered = tasks.filter((t: any) => t.id !== id);
  
  const path = `data/task/${userType}/tasks.json`;
  const content = btoa(JSON.stringify(filtered, null, 2));
  
  // Get current SHA
  const fileUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}?ref=${env.REPO_BRANCH}`;
  const fileRes = await fetch(fileUrl, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json'
    }
  });
  
  const fileData = await fileRes.json() as any;
  
  // Update file
  const url = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Delete task ${id}`,
      content,
      sha: fileData.sha,
      branch: env.REPO_BRANCH
    })
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete task: ${res.status}`);
  }
}

async function clearAllTasks(env: Env, userType: UserType): Promise<void> {
  const path = `data/task/${userType}/tasks.json`;
  const content = btoa(JSON.stringify([], null, 2));
  
  // Get current SHA
  const fileUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}?ref=${env.REPO_BRANCH}`;
  const fileRes = await fetch(fileUrl, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json'
    }
  });
  
  const fileData = await fileRes.json() as any;
  
  // Update file
  const url = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Clear all tasks',
      content,
      sha: fileData.sha,
      branch: env.REPO_BRANCH
    })
  });
  
  if (!res.ok) {
    throw new Error(`Failed to clear tasks: ${res.status}`);
  }
}

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default app;
