const sheetURL = "https://docs.google.com/spreadsheets/d/1M9xBXqVmA3fY1-ZuFBwtbBv-xOFzGu2NYCXBhYmkBMM/gviz/tq?tqx=out:csv";

let questions = [];
let filteredQuestions = [];
let current = 0;
let wrongList = [];
let randomMode = false;

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const unitSelect = document.getElementById("unitSelect");

const questionText = document.getElementById("questionText");
const choiceArea = document.getElementById("choiceArea");
const translateArea = document.getElementById("translateArea");
const reorderArea = document.getElementById("reorderArea");

const translateInput = document.getElementById("translateInput");

const wordPool = document.getElementById("wordPool");
const answerPool = document.getElementById("answerPool");

const result = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");

loadSheet();

async function loadSheet(){

const res = await fetch(sheetURL);
const text = await res.text();

const rows = text.trim().split("\n").map(r=>r.split(","));
rows.shift();

questions = rows.map(r=>({
type:r[0],
unit:r[1],
question:r[2],
choices:[r[3],r[4],r[5],r[6]],
answer:r[7]
}));

createUnitList();

}

function createUnitList(){

const units = [...new Set(questions.map(q=>q.unit))];

units.forEach(u=>{
const op=document.createElement("option");
op.value=u;
op.textContent=u;
unitSelect.appendChild(op);
});

}

document.getElementById("startNormal").onclick=()=>startQuiz(false);
document.getElementById("startRandom").onclick=()=>startQuiz(true);

function startQuiz(random){

randomMode=random;

const unit = unitSelect.value;

filteredQuestions = questions.filter(q=> unit==="all" || q.unit===unit);

if(randomMode){
filteredQuestions.sort(()=>Math.random()-0.5);
}

startScreen.classList.add("hidden");
quizScreen.classList.remove("hidden");

showQuestion();

}

function showQuestion(){

resetUI();

const q = filteredQuestions[current];

progress.textContent = (current+1)+" / "+filteredQuestions.length;

questionText.textContent = q.question;

if(q.type==="choice") showChoice(q);
if(q.type==="translate") showTranslate(q);
if(q.type==="reorder") showReorder(q);

}

function resetUI(){

choiceArea.innerHTML="";
wordPool.innerHTML="";
answerPool.innerHTML="";
result.textContent="";
translateInput.value="";

choiceArea.classList.add("hidden");
translateArea.classList.add("hidden");
reorderArea.classList.add("hidden");
nextBtn.classList.add("hidden");

}

function showChoice(q){

choiceArea.classList.remove("hidden");

q.choices.forEach(c=>{

if(!c) return;

const btn=document.createElement("button");
btn.textContent=c;

btn.onclick=()=>judge(c,q);

choiceArea.appendChild(btn);

});

}

function showTranslate(q){

translateArea.classList.remove("hidden");

document.getElementById("submitTranslate").onclick=()=>{

const val=translateInput.value.trim();

judge(val,q);

};

}

function showReorder(q){

reorderArea.classList.remove("hidden");

let words=q.question.split(" / ");

words.sort(()=>Math.random()-0.5);

words.forEach(w=>{

const div=document.createElement("div");
div.className="word";
div.textContent=w;

div.onclick=()=>answerPool.appendChild(div);

wordPool.appendChild(div);

});

document.getElementById("submitReorder").onclick=()=>{

const ans=[...answerPool.children].map(e=>e.textContent).join(" ");

judge(ans,q);

};

}

function judge(input,q){

if(input.toLowerCase()===q.answer.toLowerCase()){

result.textContent="Correct";

}else{

result.textContent="Wrong : "+q.answer;

wrongList.push(q);

}

nextBtn.classList.remove("hidden");

}

nextBtn.onclick=()=>{

current++;

if(current>=filteredQuestions.length){
finishQuiz();
return;
}

showQuestion();

};

function finishQuiz(){

quizScreen.classList.add("hidden");
resultScreen.classList.remove("hidden");

document.getElementById("score").textContent =
"間違い "+wrongList.length+" / "+filteredQuestions.length;

const ul=document.getElementById("wrongList");

wrongList.forEach(q=>{

const li=document.createElement("li");
li.textContent=q.question+" → "+q.answer;
ul.appendChild(li);

});

}
