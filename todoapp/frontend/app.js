const titleInput = document.getElementById("input-name");
const detailInput = document.getElementById('task-detail')
const button = document.getElementById("submit-task")
const notesGrid = document.querySelector(".notes-grid")

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
                <button onclick="editTask(${index})">Sửa</button>
                <button onclick="deleteTask(${index})" style ="background: #ff4d4d">Xoá</button>
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

window.deleteTask =(index)=>{
    if(confirm("ban co chac chan muon xoa hay khong ?")){
        tasks.splice(index,1); // xoá từ phần tử thứ index và xoá 1 phần tử ở đó 
        addTask();
        renderTask();
    }
}

window.editTask =(index) =>{
    const newTiltle = prompt("nhap tieu de moi :", tasks[index].title);
    const newDetail = prompt("nhap thong tin moi : ", tasks[index].detail)

    if(newTiltle && newDetail){
        tasks[index] = {title: newTiltle, detail :newDetail};
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

renderTask();