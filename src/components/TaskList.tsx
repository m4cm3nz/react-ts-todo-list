import { ChangeEvent, FormEvent, InvalidEvent, useEffect, useState } from "react";
import { TaskItem } from "./TaskItem";
import { PlusCircle }  from "phosphor-react"
import styles from "./TaskList.module.css"
import clipboard from "../assets/clipboard.svg"

interface TaskItem
{
    id:number;
    checked: boolean;
    description: string;    
}

export function TaskList()
{        
    const [taskList, setTaskList] = useState<TaskItem[]>([]);
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [isTaskListEmpty, setIsTaskListEmpty] = useState(false);
    const [taskDone, setTaskDone] = useState(0);

    useEffect(()=> {
        setIsTaskListEmpty(taskList.length === 0);
        setTaskDone(taskList.filter(task=> task.checked).length);
    }, [taskList]); 
    

    function handleNewTaskTextChange(event:ChangeEvent<HTMLInputElement>)
    {
        event.target.setCustomValidity(''); 
        setNewTaskDescription(event.target.value);
    }

    function handleCreateNewTask(event:FormEvent)
    {
        event.preventDefault();

        const nextId = 1 + (
            taskList.length === 0 ? 
                taskList.length :
                Math.max(...taskList.map(task => task.id))
        );

        const newTask = {
            id: nextId,
            checked:false,
            description: newTaskDescription
        }

        setTaskList([...taskList, newTask]);
        setNewTaskDescription('');
    }

    function handleInvalidTask(event:InvalidEvent<HTMLInputElement>)
    {
        event.target.setCustomValidity('Campo obrigatório!');
    }

    function deleteTaskById(id:number)
    {
        setTaskList(taskList.filter(task=> task.id!=id));
    }

    function finishTask(id:number, isDone:boolean)
    {
        const taskIndex = taskList.findIndex(task=> task.id===id);
        
        if(taskIndex>=0){
            
            let tasks = [...taskList];

            const finishedTask = {...tasks[taskIndex], checked: isDone};            
            tasks[taskIndex] = finishedTask;

            setTaskList(tasks);
        }
    }

    return (
        <>
            <form onSubmit={handleCreateNewTask} className={styles.newTask}>
                <input 
                    onChange={handleNewTaskTextChange} 
                    placeholder="Adicione uma nova tarefa"
                    value={newTaskDescription}
                    onInvalid={handleInvalidTask}
                    required
                />
                <button>Criar<PlusCircle size={22}/></button>                            
            </form>

            <div className={styles.taskList}>

                <header className={styles.taskInfo}>
                    <div className={styles.createdTasks}>
                        <a href="#">Tarefas criadas</a>
                        <small>{taskList.length}</small>
                    </div>
                    <div className={styles.tasksDone}>
                        <a href="#">Concluídas</a>
                        <small>{`${taskDone} de ${taskList.length}`}</small>
                    </div>
                </header>

                <div className={styles.taskItems}>
                    { isTaskListEmpty && (
                        <div className={styles.emptyList}>
                            <img src={clipboard}/>                                    
                            <span>
                                <strong>Você ainda não tem tarefas cadastradas</strong>
                                <p>Crie tarefas e organize seus itens a fazer</p>
                            </span>
                        </div>                
                    )}
                    <ul>
                        {taskList.map(task=>{
                            return (
                                <TaskItem 
                                    key={task.id} 
                                    task={task}
                                    onDeleteTask={deleteTaskById}
                                    onTaskDone={finishTask}
                                />
                            )
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}