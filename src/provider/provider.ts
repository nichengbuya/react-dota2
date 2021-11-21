import { createContext, useCallback, useState } from "react";


export interface TodoList{
    todoList:any[];
    handleAdd(i:any):void;
    handleDelete(i:any):void;
}
export const TodoService = createContext<TodoList|null>(null);
export const useTodoService = ():TodoList => {
    const [todoList,setTodoList] = useState<any[]>([]);
    const handleAdd = useCallback((i)=>{
        setTodoList([...todoList,i]);
    },[todoList]);
    const handleDelete = useCallback((i)=>{
        const arr = todoList.slice();
        arr.pop();
        setTodoList(arr);
    },[todoList]);
    return {
        todoList,
        handleAdd,
        handleDelete
    }
}   

