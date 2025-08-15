import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {getTasks, add, update, updateStatus, remove} from "../../../services/tasksApi";

const PlusCircle = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const Trash2 = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const Edit = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const LogOut = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ListChecks = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>;
const Bell = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;
const AlertTriangle = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const ArrowUpDown = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>;
const CheckCircle = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const Clock = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const CalendarIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

function HomeScreen({ setAuthToken }) {
    const navigate = useNavigate();


    const [tasksList, setTasksList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState(null);
    const [sortOption, setSortOption] = useState("createdAt:desc");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [modalForm, setModalForm] = useState({ title: '', description: '', initiateTask: '', endTask: '' });


    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, taskId: null });

    const handleLogout = useCallback(() => {
        setAuthToken(null);
        navigate("/login");
    }, [setAuthToken, navigate]);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [sortBy, direction] = sortOption.split(':');
            const params = { page: 0, size: 20, sortBy, direction };
            if (filter) params.status = filter;
            
            const data = await getTasks(params);
            console.log('Dados recebidos do backend:', data.content);
            setTasksList(data.content || []);
        } catch (err) {
            if (err.response?.status === 403) handleLogout();
            else setError("Ocorreu um erro ao carregar as tarefas.");
            setTasksList([]);
        } finally {
            setLoading(false);
        }
    }, [filter, sortOption, handleLogout]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const openModalForNew = () => {
        setEditingTask(null);
        setModalForm({ title: '', description: '', initiateTask: '', endTask: '' });
        setIsModalOpen(true);
    };


    const openModalForEdit = (task) => {
        setEditingTask(task);
        setModalForm({
            title: task.title,
            description: task.description,
            initiateTask: formatDateForInput(task.initiateTask),
            endTask: formatDateForInput(task.endTask),
        });
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();

        const initiateISO = modalForm.initiateTask ? new Date(modalForm.initiateTask).toISOString() : null;
        const endISO = modalForm.endTask ? new Date(modalForm.endTask).toISOString() : null;

        const taskData = {
            title: modalForm.title,
            description: modalForm.description,
            initiateTask: initiateISO,
            endTask: endISO,
         };
        
         try {
        if (editingTask) {
            await update(editingTask.id, taskData);
        } else {
            await add(taskData);
        }
        console.log("Tarefa salva: ", taskData);

        setIsModalOpen(false);
        fetchTasks();
    } catch (err) {
        console.error("Erro ao salvar tarefa:", err);
    }
    };

    const handleDelete = (taskId) => {
        setConfirmDelete({ isOpen: true, taskId });
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete.taskId) return;
        try {
            await remove(confirmDelete.taskId);
            setConfirmDelete({ isOpen: false, taskId: null });
            fetchTasks();
        } catch (err) {
            console.error("Erro ao apagar tarefa:", err);
        }
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await updateStatus(task.id, newStatus);
            fetchTasks();
        } catch (err) {
            console.error("Erro ao mudar status:", err);
        }
    };
    
    const getStatusClass = (status) => ({
        'PENDENTE': 'bg-yellow-100 text-yellow-800',
        'EM_PROGRESSO': 'bg-blue-100 text-blue-800',
        'CONCLUIDA': 'bg-green-100 text-green-800',
    }[status] || 'bg-gray-100 text-gray-800');
    
    const getStatusText = (status) => ({
        'PENDENTE': 'Pendente',
        'EM_PROGRESSO': 'Em Progresso',
        'CONCLUIDA': 'Concluída',
    }[status] || 'Desconhecido');

    const formatDateForDisplay = (dateString) => {
        console.log("formatDateForDisplay called with:", dateString);
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-PT', options);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <aside className="w-64 bg-white shadow-lg flex flex-col z-10">
                <div className="p-6 text-2xl font-bold text-indigo-600 border-b-2 border-gray-100">Task Manager 🚀</div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setFilter(null)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-base font-medium transition-colors ${!filter ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}><ListChecks className="w-5 h-5" /> Todas</button>
                    <button onClick={() => setFilter("PENDENTE")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-base font-medium transition-colors ${filter === "PENDENTE" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}><Bell className="w-5 h-5" /> Pendentes</button>
                    <button onClick={() => setFilter("EM_PROGRESSO")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-base font-medium transition-colors ${filter === "EM_PROGRESSO" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}><Clock className="w-5 h-5" /> Em Progresso</button>
                    <button onClick={() => setFilter("CONCLUIDA")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-base font-medium transition-colors ${filter === "CONCLUIDA" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}><CheckCircle className="w-5 h-5" /> Concluídas</button>
                </nav>
                <div className="p-4 border-t-2 border-gray-100"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-gray-600 hover:bg-gray-100 font-medium transition-colors"><LogOut className="w-5 h-5" /> Sair</button></div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">Minhas Tarefas</h1>
                        <p className="text-gray-500 mt-1">Bem-vindo(a) de volta, organize o seu dia!</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <div className="relative">
                            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <option value="createdAt:desc">Mais Recentes</option>
                                <option value="createdAt:asc">Mais Antigas</option>
                                <option value="title:asc">Título (A-Z)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ArrowUpDown className="w-4 h-4" /></div>
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openModalForNew} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition"><PlusCircle className="w-5 h-5" /> Nova Tarefa</motion.button>
                    </div>
                </header>
                
                <AnimatePresence>
                    {loading ? <div className="text-center text-gray-500">Carregando tarefas...</div> : error ? <div className="text-center text-red-500">{error}</div> : (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasksList.length > 0 ? tasksList.map((task) => (
                                <motion.div layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring" }} key={task.id} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition-shadow">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-gray-800 break-words pr-2">{task.title}</h3>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusClass(task.status)}`}>{getStatusText(task.status)}</span>
                                        </div>
                                        <p className="text-gray-600 mb-4 h-20 overflow-y-auto break-words">{task.description}</p>
                                        <div className="text-sm text-gray-500 space-y-1 border-t pt-3 mt-3">
                                            <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-green-500" /><span>Início: {formatDateForDisplay(task.initiateTask)}</span></div>
                                            <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-red-500" /><span>Fim: {formatDateForDisplay(task.endTask)}</span></div>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4 mt-4 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => openModalForEdit(task)} className="text-gray-500 hover:text-indigo-600"><Edit className="w-5 h-5"/></motion.button>
                                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(task.id)} className="text-gray-500 hover:text-red-600"><Trash2 className="w-5 h-5"/></motion.button>
                                        </div>
                                        <select value={task.status} onChange={(e) => handleStatusChange(task, e.target.value)} className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                                            <option value="PENDENTE">Pendente</option>
                                            <option value="EM_PROGRESSO">Em Progresso</option>
                                            <option value="CONCLUIDA">Concluída</option>
                                        </select>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full text-center py-16 bg-gray-100/50 rounded-lg">
                                    <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada para este filtro.</p>
                                    <p className="text-gray-400">Tente outra opção ou adicione uma nova tarefa!</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
                        <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-6">{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</h2>
                            <form onSubmit={handleModalSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                    <input type="text" name="title" id="title" value={modalForm.title} onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea name="description" id="description" rows="4" value={modalForm.description} onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="initiateTask" className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                                        <input type="date" name="initiateTask" id="initiateTask" value={modalForm.initiateTask} onChange={(e) => setModalForm({ ...modalForm, initiateTask: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="endTask" className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
                                        <input type="date" name="endTask" id="endTask" value={modalForm.endTask} onChange={(e) => setModalForm({ ...modalForm, endTask: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold">Cancelar</motion.button>
                                    <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-5 py-2 bg-indigo-600 text-white rounded-md font-semibold">Salvar</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {confirmDelete.isOpen && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
                        <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
                           <AlertTriangle className="w-16 h-16 mx-auto text-red-500" />
                           <h2 className="text-xl font-bold mt-4">Confirmar Exclusão</h2>
                           <p className="text-gray-600 mt-2 mb-6">Tem a certeza de que deseja apagar esta tarefa? Esta ação não pode ser desfeita.</p>
                           <div className="flex justify-center gap-4">
                               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setConfirmDelete({ isOpen: false, taskId: null })} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold">Cancelar</motion.button>
                               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleConfirmDelete} className="px-5 py-2 bg-red-600 text-white rounded-md font-semibold">Apagar</motion.button>
                           </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default HomeScreen;
