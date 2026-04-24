const titleInput = document.getElementById("input-name");
const detailInput = document.getElementById('task-detail')
const button = document.getElementById("submit-task")
const notesGrid = document.querySelector(".notes-grid")
const taskCard = document.querySelector(".task-card");

const titleUpdate = document.getElementById("update-title-input");
const detailUpdate = document.getElementById("task-detail-update");
const modalfield = document.getElementById("modal-hidden")
const overlay = document.getElementById("modal-overlay")
const indexEdit = document.getElementById("update-index")


let tasks = JSON.parse(localStorage.getItem("myTasks")) || []



const renderTask =() =>{
    notesGrid.innerHTML=""; // xoa noi dung cu de ve lai

    tasks.forEach((task,index)=>{
        const taskHTML = `
            <div class ="task-card">
                <h3>${task.title}</h3>
                <p>${task.detail}</p>
                <p>(${task.status})</p>

                <button onclick =changeStatus(${index})>tich</button>
                <button id = "open-modal" onclick="openModal(${index})">Sửa</button>
                <button id = "delete-task" onclick="deleteTask(${index})" style ="background: #ff4d4d">Xoá</button>
            </div>
        `;
        notesGrid.insertAdjacentHTML("beforeend",taskHTML);
    })
}

const addTask =()=>{
    localStorage.setItem("myTasks",JSON.stringify(tasks));
}

const changeStatus =(index) =>{
    if(tasks[index].status=="chua hoan thanh") tasks[index] = {...tasks[index],status :"hoan thanh"}
    else tasks[index] ={...tasks[index],status:"chua hoan thanh"}
    console.log("da cap nhat trang thai task "+tasks[index].status)
    renderTask();
}

const deleteTask =(index)=>{
    if(confirm("ban co chac chan muon xoa hay khong ?")){
        tasks.splice(index,1); // xoá từ phần tử thứ index và xoá 1 phần tử ở đó 
        addTask();
        renderTask();
    }
}

button.addEventListener('click',(e)=>{
    e.preventDefault();
    const title = titleInput.value.trim();
    const detail = detailInput.value.trim();

    if(!title||!detail){
        alert("vui long nhap thong tin")
        return;
    }
    if(title.length < 5 || title.length>100){
        alert("noi dung nhap vao khong duoc it hon 5 ki tu hoac nhieu hon 100 ki tu")
    }
    const status = "chua hoan thanh";

    tasks.push({title,detail,status})
    alert("da them task thanh cong")
    addTask();
    renderTask();

    console.log(`ten task la  ${title}`)
    console.log(`noi dung task la ${detail}`)
    console.log("--------------------------------------------")

    titleInput.value = "";
    detailInput.value = "";
})

titleInput.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        e.preventDefault();
        detailInput.focus();
    }
})

detailInput.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        e.preventDefault();
        button.click();
        titleInput.focus();
    }
})
const openModal =(index)=>{
    const task = tasks[index];
    titleUpdate.value = task.title;
    detailUpdate.value = task.detail;
    indexEdit.value = index;

    document.title = `edit ${task.title}`;

    modalfield.classList.remove('hidden')
    overlay.classList.remove('hidden')
}

const closeModal =() =>{
    document.title = `Todolist app`
    overlay.classList.add('hidden')
    modalfield.classList.add('hidden')
    
}

document.getElementById("close-edit").onclick = closeModal;
overlay.onclick = closeModal;

document.getElementById("confirm-update").onclick=()=>{
    const idx = indexEdit.value;
    console.log(`task dang sưa la ${idx}`)
    tasks[idx]= {
        ...tasks[idx], title: titleUpdate.value.trim(), detail : detailUpdate.value.trim()
    }
    console.log(tasks[idx])
    addTask();
    renderTask();
    closeModal();
}

renderTask();