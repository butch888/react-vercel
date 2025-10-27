import { useState } from 'react';
import axios from 'axios';
import styles from './App.module.css'; // Если используете CSS Modules
import { useEffect } from 'react';

function App() {

  const API_BASE_URL = import.meta.env.PROD 
  ? 'https://express-prisma-versel.vercel.app'
  : '';

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Эффект для автоматического скрытия сообщения
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      
      // Очистка таймера при размонтировании компонента или изменении message
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Отправка формы - добавление пользователя
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, formData);
      setMessage('Пользователь успешно добавлен!');
      setFormData({ username: '', password: '' }); // Очищаем форму
      console.log('Добавлен пользователь:', response.data);
    } catch (error) {
      setMessage('Ошибка при добавлении пользователя');
      console.error('Ошибка:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Получение всех пользователей
const fetchUsers = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    setUsers(response.data);
    
    // Правильное условие для сообщения
    if(response.data.length === 0) {
      setMessage('Пользователи не найдены');
    } else {
      setMessage('Пользователи загружены');
    }
    
  } catch (error) {
    setMessage('Ошибка при загрузке пользователей');
    console.error('Ошибка:', error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  // Удаление всех пользователей
  const deleteUsers = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/users`);
      setUsers([]);
      setMessage('Все пользователи удалены');
    } catch (error) {
      setMessage('Ошибка при удалении пользователей');
      console.error('Ошибка:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <h1>Форма регистрации</h1>
      
      {/* Форма добавления пользователя */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Имя пользователя:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Отправка...' : 'Добавить пользователя'}
        </button>
      </form>

      {/* Кнопка для получения пользователей */}
      <button 
        onClick={fetchUsers} 
        disabled={loading}
        className={styles.buttonSecondary}
      >
        {loading ? 'Загрузка...' : 'Получить всех пользователей'}
      </button>

      {/* Кнопка для удаления пользователей */}
      <button 
        onClick={deleteUsers} 
        disabled={loading}
        className={styles.buttonSecondary}
      >
        {loading ? 'Удаление...' : 'Удалить всех пользователей'}
      </button>

      {/* Сообщения */}
      {message && <p className={styles.message}>{message}</p>}

      {/* Список пользователей */}
      {users.length > 0 && (
        <div className={styles.usersList}>
          <h2>Зарегистрированные пользователи:</h2>
          <ul>
            {users.map(user => (
              <li key={user.id} className={styles.userItem}>
                <strong>ID:</strong> {user.id} <br />
                <strong>Username:</strong> {user.username} <br />
                <strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;