export interface Record{
  id:string
}
export default class TodoRecordService {
    private todoList: Record[] = [];
  
    get getTodoList() {
      return this.todoList;
    }
  
    public addRecord(newRecord: Record) {
      this.todoList.push(newRecord);
    }
  
    public deleteRecord(id: string) {
      this.todoList = this.todoList.filter((record) => record.id !== id);
    }
  
    public getRecord(id: string) {
      const targetIndex = this.todoList.findIndex((record) => record.id === id);
      return { index: targetIndex, ele: this.todoList[targetIndex] };
    }
  }
  
  