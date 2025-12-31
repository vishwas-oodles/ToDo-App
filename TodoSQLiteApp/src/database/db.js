import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db = null;






// Open the database
export const getDBConnection = async () => {
  if (db) return db;

  db = await SQLite.openDatabase(
    { name: 'todo_app.db', location: 'default' },
    () => console.log('Database opened'),
    error => console.log('DB error', error)
  );

  return db;
};

// Initialize tables
export const initDatabase = async () => {
  const db = await getDBConnection();

  await db.executeSql(`DROP TABLE IF EXISTS todos;`);
  await db.executeSql(`DROP TABLE IF EXISTS users;`);

  await db.executeSql(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `);

  await db.executeSql(`
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      priority TEXT,
      due_date TEXT,
      completed INTEGER DEFAULT 0,
      created_at TEXT
    );
  `);
};


// Create user
export const createUser = async (username, password) => {
  const db = await getDBConnection();
  await db.executeSql(
    'INSERT INTO users (username, password) VALUES (?, ?);',
    [username, password]
  );
};

// Login user
export const loginUser = async (username, password) => {
  const db = await getDBConnection();
  const result = await db.executeSql(
    'SELECT * FROM users WHERE username = ? AND password = ?;',
    [username, password]
  );

  if (result[0].rows.length > 0) {
    return result[0].rows.item(0);
  }
  return null;
};

//  Add new todo
export const addTodo = async (userId, title, priority, dueDate) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO todos 
         (user_id, title, priority, due_date, completed, created_at)
         VALUES (?, ?, ?, ?, 0, datetime('now'))`,
        [userId, title, priority, dueDate],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};



//  Get all todos for a user
export const getTodos = async (userId) => {
  const db = await getDBConnection();
  const result = await db.executeSql(
    'SELECT * FROM todos WHERE user_id = ?;',
    [userId]
  );
  const todos = [];
  for (let i = 0; i < result[0].rows.length; i++) {
    todos.push(result[0].rows.item(i));
  }
  return todos;
};

// Toggle todo completion
export const markCompleted = async(id) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE todos SET completed = 1 WHERE id = ?`,
        [id],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};


//  Delete a todo
export const deleteTodo = async (id) => {
  const db = await getDBConnection();
  await db.executeSql('DELETE FROM todos WHERE id = ?;', [id]);
};


export const updateTodoTitle = async (id, newTitle) => {
  const db = await getDBConnection();
  await db.executeSql(
    'UPDATE todos SET title = ? WHERE id = ?;',
    [newTitle, id]
  );
};