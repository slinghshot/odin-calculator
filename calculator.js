const numberPad = document.querySelectorAll('.num');
numberPad.forEach(number=>number.addEventListener('click',usrInput));
window.addEventListener('keydown',usrInput);

/* 
TODO: 
Figure out truncating answers that are too big

FIX!: If addition output it really big and 
    it truncates to 1e+10, function split('+') splits it to 1e,10 then adds it

ADD keyboard functionality

*/

function clickSanatize(e){
    // console.log(e.target.id);
    let userInput=parseInt(e.target.id);
    if(Number.isInteger(userInput)){
        return userInput;
    }
    userInput=checkForKeys(e);
    return userInput;
    

}
// function kbdSanatize(e){
//     /*
//      '+' => 61
//      '-' => 173
//      '*' => 56
//      '/' => 191
//      'c' => 67 // clear all
//      'backspace' => 8 //delete one character
//     */
//     // console.log();
//     // console.log(e);
//     let userInput=parseInt(e.key);
//     if(userInput || e.keyCode==48){
//         console.log(userInput);
//         return userInput;
//     }else if(checkForKeys(e)){
//         return e.key;
//     }
// }

function checkForKeys(e){
    let userInput=e.target.id;
    switch(userInput){
        case 'add': return '+';
        case 'sub': return '-';
        case 'mul': return 'x';
        case 'div': return '÷';    
        case 'dot': return '.';
        case 'openP':return '(';
        case 'closeP':return ')';
    }
    return "wrong";
}


function usrInput(e){
    let userInput=0;
    if(e.type ==="keydown"){
        userInput=kbdSanatize(e);
    }
    else if(e.type==="click"){
        if(e.target.id =="delChar"){
            // console.log("here");
            screenUpdate("delChar");
            return;
        }
        else if(e.target.id=="clearAll"){
            screenUpdate("clearAll");
            return;
        }
        else if(e.target.id=="equal"){
            let answer = runCalculation();
            // let answer = new Date().getSeconds();
            console.log(answer);
            screenUpdateAnswer(answer);
            return;
        }
        else{
            userInput=clickSanatize(e);
        }
    }
    
    if(userInput!="wrong"){
        screenUpdate(userInput);
    }

}

const screenScrollWidth = screen.scrollWidth;
var isLastSymbol=false;

function checkPrevSymbol(userIn){
    switch (userIn){
        case '+': 
        case '-': 
        case '÷': 
        case 'x': 
            return true;
    }
    return false;

}

function screenUpdateAnswer(answer){
    let screen = document.querySelector('#output');
    screen.textContent=`=> ${answer}`;
}

function screenUpdate(userIn){
    let screen = document.querySelector('#input');
    let screenArr=Array.from(screen.textContent);
    let userIOpertor=false,isPrevOperator=false;

    if(userIn=="delChar"){
        screenArr.pop();
        userIn="";
    }
    else if(userIn=="clearAll"){
        while(screenArr.lenght){
            screenArr.pop();
        }
        let screenO = document.querySelector('#output');
        screenO.textContent="";
    }else{
        userIOpertor=checkPrevSymbol(userIn);
        isPrevOperator=checkPrevSymbol(screenArr.at(-1));
    }

    if(userIOpertor && isPrevOperator){
        screenArr.pop();
    }
    
    if(userIn!="clearAll"){
        screenArr.push(userIn);
        screen.textContent=(screenArr).join("");
    }
    else{
        screen.textContent='';
    }
    let sLeft=screen.scrollLeft;
    for(let i =0;i<10;i++){
        sLeft+=100;
        screen.scrollTo(sLeft,4);
        // screen.scrollTo(screen.scrollLeft+20,4);
    }
    
}

function findPrevOperator(spliter, i){
    for(let j=i-1;j>=0;j--){
        // console.log("j is " +j);
        // console.log(spliter[j]);
        switch(spliter[j]){
            case '+': 
            case '-': 
            case '÷': 
            case 'x':
            // case '(':
                return j+1;
        }
    }
    return 0;
}

function findNextOperator(spliter,i){
    for(let j=i+1;j<spliter.length;j++){
        // console.log("j is " +j);
        // console.log(spliter[j]);
        switch(spliter[j]){
            case '+': 
            case '-': 
            case '÷': 
            case 'x':
            // case ')':
                return j-1;
        }
        
    }
    return spliter.length-1;
}
function findPrevPrenth(spliter,i){
    for(let j=i+1;j<spliter.length;j++){
        // console.log("j is " +j);
        // console.log(spliter[j]);
        switch(spliter[j]){
            case '(':
                return j+1;
        }
        
    }
    return spliter.length-1;
}
function findNextPrenth(spliter,i){
    for(let j=i+1;j<spliter.length;j++){
        // console.log("j is " +j);
        // console.log(spliter[j]);
        switch(spliter[j]){
            case ')':
                return j-1;
        }
        
    }
    return spliter.length-1;
}



function addSub(spliter){
    spliter = Array.from(spliter);
    console.log("split"+spliter);

    for(let i =0;i<spliter.length;i++){
        if(spliter[i]=='x'){
            let l=findPrevOperator(spliter,i);
            console.log("last left: "+ l);
            let r=findNextOperator(spliter,i);
            console.log("last right: "+ r);
            let joinedMul=spliter.slice(l,r+1).join('');
            console.log(joinedMul);
            let spliterd=joinedMul.split('x');
            let answer = spliterd.reduce((a,b)=>{
                b=b*a;
                return b;
            },1)
            spliter.splice(l,(r+1)-l,answer);
            console.log(spliter);
            i=0;
        }
        if(spliter[i]=='÷'){
            let l=findPrevOperator(spliter,i);
            console.log("last left: "+ l);
            let r=findNextOperator(spliter,i);
            console.log("last right: "+ r);
            let joinedMul=spliter.slice(l,r+1).join('');
            console.log(joinedMul);
            let spliterd=joinedMul.split('÷');
            let answer = spliterd.reduce((a,b)=>{
                if(!a){
                    return b;
                }
                b=a/b;
                return b;
            },false)
            spliter.splice(l,(r+1)-l,answer);
            console.log(spliter);
            i=0;
        }
    }
    for(let i =0;i<spliter.length;i++){
        if(spliter[i]=='+'){
            let l=findPrevOperator(spliter,i);
            console.log("last left: "+ l);
            let r=findNextOperator(spliter,i);
            console.log("last right: "+ r);
            let joinedMul=spliter.slice(l,r+1).join('');
            console.log(joinedMul);
            let spliterd=joinedMul.split('+');
            console.log(spliterd);
            let answer = spliterd.reduce((a,b)=>{
                // a=parseInt(a);
                b=parseFloat(b)+a;
                return b;
            },0)
            console.log(`answer ${answer}`)
            spliter.splice(l,(r+1)-l,answer);
            console.log(spliter[i]);
            console.log(spliter);
            i=0;
        }
        if(spliter[i]=='-'){
            let l=findPrevOperator(spliter,i);
            console.log("last left: "+ l);
            let r=findNextOperator(spliter,i);
            console.log("last right: "+ r);
            let joinedMul=spliter.slice(l,r+1).join('');
            console.log(joinedMul);
            let spliterd=joinedMul.split('-');
            let answer =spliterd.reduce((a,b)=>{
                b=parseFloat(b);
                // 2-3
                // 2-a
                // 3-2 = 1
                b=b-a;
                return b;
            },0);
            spliter.splice(l,(r+1)-l,answer*-1);
            console.log(spliter);
            i=0;
        }
    }
    return spliter[0];

}


function runCalculation(){
    let screen = document.querySelector('#input');
    let spliter=Array.from(screen.textContent);
    console.log("aaa");
    console.log(spliter);
    // check for open prenthisis
    for(let i =0;i<spliter.length;i++){
        if(spliter[i]=='('){
            // let l = findPrevPrenth(spliter,i);
            let r = findNextPrenth(spliter,i);
            console.log(`r: ${r} l: ${i}\n`)
            let joinedMul=spliter.slice(i+1,r+1).join('');
            console.log("joined" + joinedMul);
            let answer = addSub(joinedMul);
            console.log("answer:" + answer);
            console.log("SPLITER[r+2]: "+r);
            if(spliter[i]=='(' && spliter[r+1]==')'){
                console.log('before INSERTION: '+spliter);
                if(i==0){
                    spliter.splice(i,(r+2),answer);    
                }else{
                    spliter.splice(i,(r-i)+2,answer);
                }
                console.log(spliter);
            }
            
        }
    }
    console.log("after prenth: "+spliter);


    for(let i =0;i<spliter.length;i++){
        if(spliter[i]=='x'){
            let l=findPrevOperator(spliter,i);
            console.log("last left: "+ l);
            let r=findNextOperator(spliter,i);
            console.log("last right: "+ r);
            let joinedMul=spliter.slice(l,r+1).join('');
            console.log(joinedMul);
            let spliterd=joinedMul.split('x');
            let answer = spliterd.reduce((a,b)=>{
                b=b*a;
                return b;
            },1)
            spliter.splice(l,(r+1)-l,answer);
            console.log(spliter);
            i=0;
        }
        if(spliter[i]=='÷'){
            let l=findPrevOperator(spliter,i);
            console.log("last left: "+ l);
            let r=findNextOperator(spliter,i);
            console.log("last right: "+ r);
            let joinedMul=spliter.slice(l,r+1).join('');
            console.log(joinedMul);
            let spliterd=joinedMul.split('÷');
            let answer = spliterd.reduce((a,b)=>{
                if(!a){
                    return b;
                }
                b=a/b;
                return b;
            },false)
            spliter.splice(l,(r+1)-l,answer);
            console.log(spliter);
            i=0;
        }
    }


    for(let i =0;i<spliter.length;i++){
        if(spliter[i]=='+'){
            let l=findPrevOperator(spliter,i);
            console.log("last left: "+ l);
            let r=findNextOperator(spliter,i);
            console.log("last right: "+ r);
            let joinedMul=spliter.slice(l,r+1).join('');
            console.log(joinedMul);
            let spliterd=joinedMul.split('+');
            console.log(spliterd);
            let answer = spliterd.reduce((a,b)=>{
                // a=parseInt(a);
                b=parseFloat(b)+a;
                return b;
            },0)
            console.log(`answer ${answer}`)
            spliter.splice(l,(r+1)-l,answer);
            console.log(spliter[i]);
            // if(spliter[l-1]=='(' && spliter[i]==')'){
            //     console.log('there');
            //     spliter.splice(i-1,(i+1)-1,answer);
            //     console.log(spliter);
            //     spliter.splice(l-1,1,);
            // }
            console.log(spliter);
            i=0;
        }
        if(spliter[i]=='-'){
            let l=findPrevOperator(spliter,i);
            console.log("last left: "+ l);
            let r=findNextOperator(spliter,i);
            console.log("last right: "+ r);
            let joinedMul=spliter.slice(l,r+1).join('');
            console.log(joinedMul);
            let spliterd=joinedMul.split('-');
            let answer =spliterd.reduce((a,b)=>{
                b=parseFloat(b);
                // 2-3
                // 2-a
                // 3-2 = 1
                b=b-a;
                return b;
            },0);
            spliter.splice(l,(r+1)-l,answer*-1);
            console.log(spliter);
            i=0;
        }
    }
    return spliter.join('');
            
    // map, reduce, sort, filter

}