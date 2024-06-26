const messages      = [];
const textInput     = document.getElementById('textInput');
const voiceButton   = document.getElementById('start');
const chatContainer = document.querySelector(".chatbox");
      
async function postData(query) {  
// console.log(query);      
try {
          
    messages.push({ role: "user", content: query });
    const response = await fetch('/.netlify/functions/getData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages }),
    });
        
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
          
    const data = await response.json();
    console.log(data);
    return data;            
    } catch (error) {
        console.error('Fetch error:', error);
    }
}        

async function populateUsingGpt(input){
    postData(input).then((data) => {
        chatContainer.innerHTML = chatContainer.innerHTML + `<div>Question: ${input}</div>  <div>Answer: ${data.answer}</div> <hr>`
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
    });
}

let globalTranscript;
let globalText;
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
    globalTranscript = transcript 
});


voiceButton.addEventListener("click", () => {
        
    recognition.start(); 
    recognition.addEventListener('end', ()=>{
    console.log(globalTranscript)
    if(globalTranscript !== ""){
        populateUsingGpt(globalTranscript)
    }
        globalTranscript = ""
    }); 
        
})

textInput.addEventListener('keypress', (event)=>{
    if (event.keyCode === 13) {
        const inputValue = event.target.value;
        console.log('Input value:', inputValue);
        globalText = inputValue;
        if(globalText !== ""){
           populateUsingGpt(globalText)
        }
        globalText = ""

        // Empty the input field
        event.target.value = '';
    }
});

      

    