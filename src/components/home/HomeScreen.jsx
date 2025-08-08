import React, {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import { tasks } from "../../services/tasksApi";

const PlusCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const Trash2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const Edit = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const LogOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ListChecks = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>;
const Bell = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;


function HomeScreen({setAuthToken }) {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [modalForm, setModalForm] = useState({ title: '', description: '' });

    const handleLogout = () => {
        localStorage.removeItem("token");
        setAuthToken(null);
        navigate("/login");
    };

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                status: filter,
                page: 0,
                size: 20,
                sortBy: 'createdAt',
                direction: 'desc'
            };
            if (!filter) {
                delete params.status;
            }
            const response = await tasks.getTasks(params);
            setTasks(response.data.content || []);
        } catch (err) {
            if (err.response?.status === 403) {
                handleLogout();
            }
            setError("Não foi possível carregar as tarefas.");
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const openModalForNew = () => {
        setEditingTask(null);
        setModalForm({ title: '', description: '' });
        setIsModalOpen(true);
    };

    const openModalForEdit = (task) => {
        setEditingTask(task);
        setModalForm({ title: task.title, description: task.description });
        setIsModalOpen(true);
    };


    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await tasks.update(editingTask.id, modalForm.title,modalForm.description);
            } else {
                await tasks.add(modalForm.title, modalForm.description);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (err) {
            console.error("Erro ao salvar tarefa:", err);
        }
    };


    const handleDelete = async (taskId) => {
        if (window.confirm("Tem certeza que deseja apagar esta tarefa?")) {
            try {

                await tasks.remove(taskId);
                fetchTasks();
            } catch (err) {
                console.error("Erro ao apagar tarefa:", err);
            }
        }
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await tasks.updateStatus(task.id, newStatus);
            fetchTasks();
        } catch (err) {
            console.error("Erro ao mudar status:", err);
        }
    };
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Pendente';
            case 'IN_PROGRESS': return 'Em Progresso';
            case 'COMPLETED': return 'Concluída';
            default: return 'Desconhecido';
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 text-2xl font-bold text-indigo-600 border-b">To-Do List</div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setFilter(null)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left ${!filter ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}><ListChecks /> Todas</button>
                    <button onClick={() => setFilter('PENDING')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left ${filter === 'PENDING' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}><Bell /> Pendentes</button>
                </nav>
                <div className="p-4 border-t">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-200"><LogOut /> Sair</button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Minhas Tarefas</h1>
                    <button onClick={openModalForNew} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"><PlusCircle /> Nova Tarefa</button>
                </header>

                {loading && <p className="text-center text-gray-500">Carregando tarefas...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.length > 0 ? tasks.map(task => (
                            <div key={task.id} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h3>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(task.status)}`}>{getStatusText(task.status)}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{task.description}</p>
                                </div>
                                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <button onClick={() => openModalForEdit(task)} className="text-gray-500 hover:text-indigo-600"><Edit /></button>
                                        <button onClick={() => handleDelete(task.id)} className="text-gray-500 hover:text-red-600"><Trash2 /></button>
                                    </div>
                                    <select value={task.status} onChange={(e) => handleStatusChange(task, e.target.value)} className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="PENDING">Pendente</option>
                                        <option value="IN_PROGRESS">Em Progresso</option>
                                        <option value="COMPLETED">Concluída</option>
                                    </select>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-500">Nenhuma tarefa encontrada. Que tal adicionar uma?</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
                        <form onSubmit={handleModalSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                                <input type="text" name="title" id="title" value={modalForm.title} onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                                <textarea name="description" id="description" rows="4" value={modalForm.description} onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomeScreen;