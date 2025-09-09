import { useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { route } from 'ziggy-js';
import '../../../css/app.css';


export default function Index({ tasks: initialTasks, filter }) {
  const { data, setData, post, reset } = useForm({ title: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);


    // Dark mode sur le body
    useEffect(() => {
        if (darkMode) {
        document.body.classList.add('bg-dark', 'text-light');
        document.getElementsByClassName("carton")[0].classList.add('bg-dark', 'text-light');
        } else {
        document.body.classList.remove('bg-dark', 'text-light');
        document.getElementsByClassName("carton")[0].classList.remove('bg-dark', 'text-light');
        }
    }, [darkMode]);

  // Ajouter une tâche
  const addTask = (e) => {
    e.preventDefault();
    post(route('tasks.store'), {
      onSuccess: (page) => {
        setTasks(page.props.tasks);
        reset();
      }
    });
  };

  // Marquer comme terminé
  const markCompleted = (task) => {
    if (!task.completed) {
      router.patch(route('tasks.update', task.id), {}, {
        onSuccess: (page) => setTasks(page.props.tasks)
      });
    }
  };

  // Supprimer une tâche
  const deleteTask = (task) => {
    router.delete(route('tasks.destroy', task.id), {
      onSuccess: (page) => setTasks(page.props.tasks)
    });
  };

  // Effacer toutes les terminées
  const clearCompleted = () => {
    router.delete(route('tasks.clear'), {
      onSuccess: (page) => setTasks(page.props.tasks)
    });
  };

  return (
    <div className={`container py-5 carton`}>
    <div id='todo-container'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 id='title'>❤︎ Todo List</h2>
        <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Mode clair' : 'Mode sombre'}
        </button>
      </div>

      {/* Formulaire ajout */}
      <form onSubmit={addTask} className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nouvelle tâche..."
          value={data.title}
          onChange={e => setData('title', e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Ajouter</button>
      </form>

      {/* Liste des tâches */}
      <ul className="list-group mb-3">
        {tasks.map(task => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'default',
                flexGrow: 1
              }}
            >
              {task.title}
            </span>
            {!task.completed && (
              <button
                className="btn btn-sm btn-success me-2"
                onClick={() => markCompleted(task)}
              >
                Terminé
              </button>
            )}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteTask(task)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      {/* Filtres + Effacer */}
      <div className="d-flex justify-content-between">
        <div>
          <Link href={route('tasks.index', { filter: 'all' })} className={`btn btn-sm ${filter==='all' ? 'btn-primary' : 'btn-outline-primary'} me-1`}> Toutes </Link>
          <Link href={route('tasks.index', { filter: 'active' })} className={`btn btn-sm ${filter==='active' ? 'btn-primary' : 'btn-outline-primary'} me-1`}> Actives </Link>
          <Link href={route('tasks.index', { filter: 'completed' })} className={`btn btn-sm ${filter==='completed' ? 'btn-primary' : 'btn-outline-primary'}`} > Terminées </Link>
        </div>
        <button className="btn btn-sm btn-warning" onClick={clearCompleted}>Effacer terminées</button>
      </div>
    </div>
    </div>
  );
}
