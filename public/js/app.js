const searchInput = document.getElementById("question-search");
let questionTitle = document.getElementById("new-question-input");
let questionDescription = document.getElementById("new-question-description-input");
const newQuestionBtn = document.getElementById("new-question-btn");
const formWrapper = document.getElementById("new-question-form-wrapper");
const questionsWrapper = document.getElementById("all-questions-wrapper");
const sectionTitle = document.getElementById("section-title");
const submitQuestionBtn = document.getElementById("submit-question-btn");
const url = 'http://127.0.0.1:4000';


function main(){
    fetchQuestions('');
    generateEvents();
}


function generateEvents(){
    newQuestionBtn.onclick=generateNewQuestion;
    submitQuestionBtn.onclick=submitQuestion;
}


function generateNewQuestion(){
    formWrapper.toggleAttribute("hidden");
    questionsWrapper.toggleAttribute("hidden");
    submitQuestionBtn.toggleAttribute("hidden");
    newQuestionBtn.textContent = formWrapper.hidden ? "Haz una pregunta": "Regresar";
    sectionTitle.textContent = formWrapper.hidden ? "Preguntas" : "Realiza tu pregunta";
}


function submitQuestion(){
    const title = document.getElementById("new-question-input").value;
    const description = document.getElementById("new-question-description-input").value;
    let request = new Request(url+"/questions", {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            description: description,
            date: (new Date()).toString()
        }),
        mode: 'no-cors'
    })

    fetch(request)
    .then(response =>{
        newQuestionBtn.click();
        displayQuestions(response.body)
    })
    .catch(error=>{
        console.error('Error: ', error);
    })
}


function fetchQuestions(query){
    let request = new Request(url+"/questions", {
        method: 'GET',
        mode: 'cors'
    })

    fetch(request)
    .then(response => {
        return response.json();
    })
    .then(data=>{
        displayQuestions(data);
    })
    .catch(error=>{
        console.error('Error: ', error);
    })
}


function displayQuestions(responseBody){
    let questionList = document.querySelector("ul.questions-list");
    if (responseBody === null) return;
    responseBody.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);
    })
    for(let question of responseBody){
        let li = document.createElement("li");
        li.className = "question";
        let p = document.createElement("p");
        p.textContent = question.date;
        let h2 = document.createElement("h2");
        h2.textContent = question.title;
        let h4 = document.createElement("h4");
        h4.textContent = question.description;
        let a = document.createElement("a");
        a.href = `./question.html?id=${question.id}&title=${question.title}&description=${question.description}`
        a.textContent= "view";
        li.appendChild(p);
        li.appendChild(h2);
        li.appendChild(h4);
        li.appendChild(a);
        questionList.appendChild(li);
    }
}

