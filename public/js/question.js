const searchInput = document.getElementById("question-search");
const newAnswerBtn = document.getElementById("new-answer-btn");
const formWrapper = document.getElementById("new-answer-form-wrapper");
const answersWrapper = document.getElementById("all-questions-wrapper");
const submitAnswerBtn = document.getElementById("submit-question-btn");
const urlParams = new URLSearchParams(window.location.search);
const url = 'http://127.0.0.1:4000';


function main(){
    loadQuestionInfo();
    fetchAnswers();
    generateEvents();
}


function generateEvents(){
    newAnswerBtn.onclick=generateNewAnswer;
    submitAnswerBtn.onclick=submitAnswer;
}


function generateNewAnswer(){
    formWrapper.toggleAttribute("hidden");
    answersWrapper.toggleAttribute("hidden");
    submitAnswerBtn.toggleAttribute("hidden");
    newAnswerBtn.textContent = formWrapper.hidden ? "Responder": "Regresar";
}


function submitAnswer(){
    const description = document.getElementById("new-answer-description-input").value;
    if (!description){
        window.alert("Este campo no puede estar vacío");
        return;
    }
    const id = Number(urlParams.get('id'));
    let request = new Request(url+"/answers", {
        method: 'POST',
        body: JSON.stringify({
            description: description,
            id: id,
            date: (new Date()).toString()
        }),
        mode: 'no-cors'
    })

    fetch(request)
    .then(response =>{
        newAnswerBtn.click();
        displayAnswers(response.body)
    })
    .catch(error=>{
        console.error('Error: ', error);
    })
}


function fetchAnswers(){
    let id = urlParams.get('id');
    let request = new Request(url+"/answers"+"?id="+id, {
        method: 'GET',
        mode: 'cors',
    })

    fetch(request)
    .then(response => {
        return response.json();
    })
    .then(data=>{
        displayAnswers(data);
    })
    .catch(error=>{
        console.error('Error: ', error);
    })
}


function displayAnswers(responseBody){
    let answerList = document.querySelector("ul.answers-list");
    if (responseBody === null) return;
    responseBody.sort(function(a,b){
        return new Date(b.time) - new Date(a.time);
    })
    for(let answer of responseBody){
        let li = document.createElement("li");
        li.className = "answer";
        let p = document.createElement("p");
        p.textContent = answer.date;
        let h4 = document.createElement("h4");
        h4.textContent = answer.answer;
        li.appendChild(p);
        li.appendChild(h4);
        answerList.appendChild(li);
    }
}

function loadQuestionInfo(){
    let questionTitle = document.querySelector("h2.question-title");
    let questionDescription = document.querySelector("h4.question-description");
    questionTitle.textContent = urlParams.get("title");
    questionDescription.textContent = urlParams.get("description")
}

