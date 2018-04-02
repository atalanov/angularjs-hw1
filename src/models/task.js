let counter = 1;
export default class Task{
    constructor(id, name){
        this.name = name;
        this.creationDate = Date.now();
        this.isDone = false;
        this.id = id;
    }
    finish(){
        this.isDone = true;
    }
    static create(name){
        return new Task(name);
    }
}