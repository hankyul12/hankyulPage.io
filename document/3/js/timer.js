reset();
    function reset(){
        min = "1";
        sec= "00";

        setInterval((e)=>{
            setCount();
            if(gameOver){
                min = "1";
                sec= "00";
            }
        },1000);
    }

    function setCount(){
        document.querySelector('.min').innerText=min;
        document.querySelector('.sec').innerText=sec;

        const numMin = Number(min);
        const numSec = Number(sec);

        if(numMin===0&& numSec ===0){
            showGameOver();
        }else{
            if(numSec===0){
                const newMin=numMin-1;
                const newSec =59;

                min=newMin.toString();
                sec=newSec.toString();
            }else{
                const newSec = numSec-1;

                if(newSec<10){
                    sec="0"+newSec.toString();
                }else{
                    sec=newSec.toString();
                }
            }
        }
    }