let addBtn = document.querySelector("main .zoon .addbtn") ;
let inputTask = document.querySelector("main .zoon .newtask .input") ;
let taskTitle = document.querySelector("main .zoon .newtask .input input") ;
let taskDesc = document.querySelector("main .zoon .newtask .input textarea") ;
let tasks = document.querySelectorAll("main .zoon .task") ;
let tasksZoon = document.querySelector("main .zoon .tasksArea") ;
let removeTaskButtons = document.querySelectorAll("main .zoon .task .content .head .options .deleteTask") ;
let newTaskForm = document.querySelector("main .zoon .newtask") ;
let checkboxes = document.querySelectorAll("main .zoon .task input") ;
let notesFields = document.querySelectorAll("menu .notes ul li") ;
let addFieldInput = document.querySelector("menu .input input") ;
let addFieldButton = document.querySelector("menu .input button") ;
let fieldsContainer = document.querySelector("menu .tasksFields ul") ;
let closeMenuBtn = document.getElementsByClassName("closeMenu")[0];
let showMenuBtn = document.getElementsByClassName("showMenu")[0] ;

let fieldsDisponible = [] ;
let lastFieldVisited = '' ;
if(localStorage.getItem("fieldsDisponible")){
    fieldsDisponible = JSON.parse(localStorage.getItem("fieldsDisponible")) ;
}else{
    fieldsDisponible = ["Personnal Tasks" , "Family Tasks" , "Working Tasks" , "Untagged Tasks"] ;
    localStorage.setItem("fieldsDisponible",JSON.stringify(fieldsDisponible)) ;
}
if(localStorage.getItem("lastFieldVisited")){
    lastFieldVisited = JSON.parse(localStorage.getItem("lastFieldVisited")) ;
}else{
    lastFieldVisited = fieldsDisponible[0] ;
}

closeMenuBtn.onclick = function(){
    document.getElementsByTagName("menu")[0].style.display = "none" ;
    showMenuBtn.style.display = "block" ;
    if(document.body.clientWidth > 600){
        document.getElementsByTagName("main")[0].style.margin = "0 40px";
        document.getElementsByTagName("main")[0].style.width = "90%" ;
    }
}
showMenuBtn.onclick = function(){
    document.getElementsByTagName("menu")[0].style.display = "block" ;
    showMenuBtn.style.display = "none" ;
    if(document.body.clientWidth > 600){
        console.log("true") ;
        document.getElementsByTagName("main")[0].style.marginLeft = "310px";
        document.getElementsByTagName("main")[0].style.width = "calc(100%-300px)" ;
    }else{
        document.getElementsByTagName("main")[0].style.marginLeft = "0px";
    }
}
function createNewFieldElement(fieldName){
    let field = document.createElement("li") ;
    if(fieldName == lastFieldVisited){
        field.classList.add("currentField") ;
        let fieldName = lastFieldVisited.split(" ").join("") ;
        currentTasks = [] 
        if(localStorage.getItem(fieldName)){
            currentTasks = JSON.parse(localStorage.getItem(fieldName)) ;
        }
        tasksZoon.innerHTML = "" ;
        if(currentTasks.length > 0){
            for(let i = 0 ; i<currentTasks.length ; i++){
                tasksZoon.appendChild(createNewTaskElement(currentTasks[i].title , currentTasks[i].description , currentTasks[i].id , currentTasks[i].done))
            }
        }else{
            showMessageWhereThereIsNoTasks() ;
        }
    }
    let par = document.createElement("p") ;
    par.appendChild(document.createTextNode(fieldName)) ;
    let dltFieldBtn = document.createElement("button") ;
    dltFieldBtn.classList.add("dltFieldBtn") ;
    dltFieldBtn.appendChild(document.createTextNode("delete")) ;
    dltFieldBtn.onclick = function(){
        let confirm = window.confirm("are you sure , you want delete the field :") ;
        if(confirm == true){
            this.parentElement.remove() ;
            localStorage.removeItem(this.previousElementSibling.innerText.split(" ").join("")) ;
            for(let i = 0 ; i<fieldsDisponible.length ; i++){
                if(fieldsDisponible[i] == this.previousElementSibling.innerText.trim()){
                    fieldsDisponible.splice(i,1) ;
                    localStorage.setItem('fieldsDisponible' , JSON.stringify(fieldsDisponible))
                    if(this.parentElement.classList.contains("currentField")){
                        if(fieldsDisponible.length != 0){
                            lastFieldVisited = fieldsDisponible[0] ;
                            fieldsContainer.firstElementChild.classList.add("currentField") ;
                            let fieldName = lastFieldVisited.split(" ").join("") ;
                            let currentTasks = [] ;
                            if(localStorage.getItem(fieldName)){
                                currentTasks = JSON.parse(localStorage.getItem(fieldName)) ;
                            }
                            console.log(fieldName) ;
                            tasksZoon.innerHTML = "" ;
                            if(currentTasks.length > 0){
                                for(let i = 0 ; i<currentTasks.length ; i++){
                                    tasksZoon.appendChild(createNewTaskElement(currentTasks[i].title , currentTasks[i].description , currentTasks[i].id , currentTasks[i].done))
                                }
                            }else{
                                showMessageWhereThereIsNoTasks() ;
                            }
                        }else{
                            lastFieldVisited = '' ;
                        }
                        localStorage.setItem('lastFieldVisited' , JSON.stringify(lastFieldVisited)) ;
                    }

                }
            }
        }
        
    }
    field.appendChild(par) ;
    field.appendChild(dltFieldBtn) ;
    field.onclick = function(e){
        if(!e.target.classList.contains("dltFieldBtn")){
            lastFieldVisited = field.firstChild.innerText.trim() ;
            localStorage.setItem("lastFieldVisited" , JSON.stringify(lastFieldVisited)) ;
            let fields = document.querySelectorAll("menu .tasksFields ul li") ;
            fields.forEach((f)=>{
                f.classList.remove("currentField") ;
            })
            field.classList.add("currentField") ;
            let fieldName = field.firstChild.innerText.split(" ").join("") ;
            let currentTasks = [] ;
            if(localStorage.getItem(fieldName)){
                currentTasks = JSON.parse(localStorage.getItem(fieldName)) ;
            }
            tasksZoon.innerHTML = "" ;
            if(currentTasks.length > 0){
                for(let i = 0 ; i<currentTasks.length ; i++){
                    tasksZoon.appendChild(createNewTaskElement(currentTasks[i].title , currentTasks[i].description , currentTasks[i].id , currentTasks[i].done))
                }
            }else{
                showMessageWhereThereIsNoTasks() ;
            }
        }
        
    } 
    fieldsContainer.appendChild(field) ;
}
for(let j=0 ; j<fieldsDisponible.length ; j++){
    createNewFieldElement(fieldsDisponible[j]) ;
}

addFieldButton.onclick = function(){
    if(addFieldInput.value != ""){
        createNewFieldElement(addFieldInput.value.trim()) ;
        fieldsDisponible.push(addFieldInput.value.trim()) ;
        localStorage.setItem("fieldsDisponible" , JSON.stringify(fieldsDisponible)) ;
        addFieldInput.value = "" ;
    }
    
}

function createNewTaskElement(title , description , currentId , done = false){
    let taskContainer = document.createElement("div") ;
    taskContainer.classList.add("task") ;
    taskContainer.id = `${currentId}` ;
    let checkbox = document.createElement("input") ;
    checkbox.type = "checkbox" ;
    checkbox.checked = done ;
    let content = document.createElement("div") ;
    content.classList.add("content") ;
    if(done){
        content.classList.add("done") ;
    }
    let head = document.createElement("div") ;
    head.classList.add("head") ;
    let titleElement = document.createElement("h3") ;
    titleElement.classList.add("title") ;
    let titleValue = document.createTextNode(`${title}`) ;
    titleElement.appendChild(titleValue) ;
    let optionsIcon = document.createElement("i");
    optionsIcon.classList.add("fas" , "fa-ellipsis-h" , "taskOptions") ;
    let options = document.createElement("div") ;
    options.classList.add("options") ;     
    let updateBtn = document.createElement("button");
    updateBtn.appendChild(document.createTextNode("update")) ;
    updateBtn.className = "updateTask" ;
    let deleteBtn = document.createElement("button");
    deleteBtn.appendChild(document.createTextNode("delete")) ;
    deleteBtn.className = "deleteTask" ;
    options.appendChild(updateBtn) ;
    options.appendChild(deleteBtn) ;
    head.appendChild(titleElement) ;
    head.appendChild(optionsIcon) ;
    head.appendChild(options) ;
    descElement = document.createElement("p") ;
    descElement.classList.add("description") ;
    descValue = document.createTextNode(`${description}`) ;
    descElement.appendChild(descValue) ;
    let showTaskIcon = document.createElement("i") ;
    showTaskIcon.classList.add("fas", "fa-chevron-down" ,"showTask")
    content.appendChild(head) ;
    content.appendChild(descElement) ;
    content.appendChild(showTaskIcon) ;
    taskContainer.appendChild(checkbox) ;
    taskContainer.appendChild(content) ;
    return taskContainer ;
}
// show an message if there is no tasks
function showMessageWhereThereIsNoTasks(){
    if(tasksZoon.innerText == ""){
        let message = document.createElement("p") 
        message.appendChild(document.createTextNode("no tasks added currently")) ;
        message.classList.add("message") ;
        tasksZoon.appendChild(message) ;
    }
}
showMessageWhereThereIsNoTasks() ;
// button to add new task ;
addBtn.addEventListener("click" , ()=>{
    if(addBtn.textContent == "add new task"){
        addBtn.textContent = "add the task" ;
        inputTask.style.display = "flex" ;
    }else if(addBtn.textContent == "add the task"){
        if(taskTitle.value != "" && taskDesc != ""){
            if(tasksZoon.firstChild.classList.contains("message")){
                tasksZoon.innerHTML = "" ;
            }
            let currentTasks = [] ;
            let currentField = document.querySelector(".currentField") ;
            let nameField = currentField.innerText.split(" ").join("") ;
            if(localStorage.getItem(nameField)){
                currentTasks = JSON.parse(localStorage.getItem(nameField)) ;
            }
            let currentId ;
            if(currentTasks.length > 0){
                currentId = `i${+currentTasks[currentTasks.length-1].id.slice(1) + 1}` ;
            }else{
                currentId = `i${1}` ;
            }
            let newTask = {
                id : currentId ,
                title : taskTitle.value.trim() ,
                description : taskDesc.value.trim() ,
                done : false ,
            }
            currentTasks.push(newTask) ;
            localStorage.setItem(nameField , JSON.stringify(currentTasks)) ;
            tasksZoon.appendChild(createNewTaskElement(taskTitle.value.trim() , taskDesc.value.trim() , currentId )) ;
            
        }
        inputTask.style.display = "none" ;
        addBtn.textContent = "add new task" ;
        taskTitle.value = "" ;
        taskDesc.value = "" ;
    }else if(addBtn.textContent == "Update"){
        if(taskTitle.value != "" && taskDesc != ""){
            let selectedTaskForUpadate = document.querySelector("main .zoon .selectedForUpdate") ;
            let title = selectedTaskForUpadate.children[1].children[0].children[0] ;
            let description = selectedTaskForUpadate.children[1].children[1] ;
            title.textContent = taskTitle.value.trim() ;
            description.textContent = taskDesc.value.trim() ;

            let currentField = document.querySelector(".currentField") ;
            let fieldName = currentField.innerText.split(" ").join("") ;
            let currentTasks = JSON.parse(localStorage.getItem(fieldName)) ;
            let currentId = selectedTaskForUpadate.id ;
            for(let i = 0 ; i<currentTasks.length ; i++){
                if(currentTasks[i].id == currentId){
                    currentTasks[i].title = taskTitle.value.trim();
                    currentTasks[i].description = taskDesc.value.trim() ;
                }
            }
            localStorage.setItem(fieldName , JSON.stringify(currentTasks)) ;
        }
        inputTask.style.display = "none" ; 
        addBtn.textContent = "add new task" ;
        taskTitle.value = "" ;
        taskDesc.value = "" ;
    }
})

// show and hide the task options ;
document.addEventListener("click" , (e) =>{
    if(e.target.classList.contains("taskOptions")){
        let showOptionsIcon = document.querySelectorAll("main .zoon .task .content .taskOptions") ;
        let hasTheClass = e.target.nextElementSibling.classList.contains("showoptions") ;
        showOptionsIcon.forEach(function(element){
            element.nextElementSibling.classList.remove("showoptions") ;
        }) ; 
        if(hasTheClass){
            e.target.nextElementSibling.classList.remove("showoptions") ;
        }else{
            e.target.nextElementSibling.classList.add("showoptions") ;
        }
    }
})

// when i clicked in a any place in document the div options hide ;
document.addEventListener("click" , (e) =>{
    if(!e.target.classList.contains("taskOptions")){
        let showOptionsIcon = document.querySelectorAll("main .zoon .task .content .taskOptions") ;
        showOptionsIcon.forEach(function(element){
            element.nextElementSibling.classList.remove("showoptions") ;
        }) ;
    }
    if(!e.target.classList.contains("fieldOptions")){
        let fieldsOptions = document.querySelectorAll("menu .tasksFields ul li .options") ;
        fieldsOptions.forEach(function(fieldOptions){
            fieldOptions.style.display = "none" ;
            // if(!fieldOptions.parentElement.classList.contains("currentField")){
            //     fieldOptions.parentElement.style.backgroundColor = '#f7f4f49a' ;
            // }
        })
    }
})

// remove a task
document.addEventListener("click" , (e)=>{
    if(e.target.classList.contains("deleteTask")){
        let confirm = window.confirm("are you sure , you want delete the task : ") ;
        if(confirm == true ){
            e.target.parentElement.parentElement.parentElement.parentElement.remove() ;
            let currentField = document.querySelector(".currentField") ;
            let fieldName = currentField.innerText.split(" ").join("") ;
            let currentTasks = JSON.parse(localStorage.getItem(fieldName)) ;
            let currentId = e.target.parentElement.parentElement.parentElement.parentElement.id ;
            for(let i = 0 ; i<currentTasks.length ; i++){
                if(currentTasks[i].id == currentId){
                    currentTasks.splice(i , 1);
                }
            }
            localStorage.setItem(fieldName , JSON.stringify(currentTasks)) ;
            showMessageWhereThereIsNoTasks() ;
        }
    }else if(e.target.classList.contains("updateTask")){
        e.target.parentElement.parentElement.parentElement.parentElement.classList.add("selectedForUpdate") ;
        inputTask.style.display = "flex" ;
        taskTitle.value = e.target.parentElement.parentElement.children[0].textContent ;
        taskDesc.value = e.target.parentElement.parentElement.nextElementSibling.textContent ;
        addBtn.innerText = "Update" ;
    }else if(e.target.type=="checkbox"){
        if(e.target.checked == true){
            e.target.nextElementSibling.style.backgroundColor = "#76ece6e0" ;
        }else{
            e.target.nextElementSibling.style.backgroundColor = "#f7f4f49a" ;
        }
        let currentField = document.querySelector(".currentField") ;
        let fieldName = currentField.innerText.split(" ").join("") ;
        let currentTasks = JSON.parse(localStorage.getItem(fieldName)) ;
        let currentId = e.target.parentElement.id ;
        for(let i = 0 ; i<currentTasks.length ; i++){
            if(currentTasks[i].id == currentId){
                currentTasks[i].done = !currentTasks[i].done ;
            }
        }
        localStorage.setItem(fieldName , JSON.stringify(currentTasks)) ;
    }
})

document.addEventListener("click" , (e)=>{
    if(e.target.classList.contains("showTask")){
        //e.target.previousElementSibling.style.textWrap = "wrap" ;
        e.target.previousElementSibling.style.height = "auto" ;
        e.target.classList.remove("fa-chevron-down" ,"showTask") ;
        e.target.classList.add("fa-chevron-up" , "closeTask")
    }else if(e.target.classList.contains("closeTask")){
        //e.target.previousElementSibling.style.textWrap = "nowrap" ;
        e.target.previousElementSibling.style.height = "20px" ;
        e.target.classList.remove("fa-chevron-up" , "closeTask")
        e.target.classList.add("fa-chevron-down" ,"showTask") ;
    }
})




