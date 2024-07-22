var atk_i= 0;
    var click_atk = document.getElementById('atk');
    click_atk.onclick =()=>{
        if(atk_i>=2){
            alert("최대치입니다.");
        }
        else if(Number(player_gold.innerText) < 1000 ){
            alert('1000골드가 없습니다.');
        }
        else{
            atk_i++;
            player_gold.innerText=Number(player_gold.innerText)-1000;
        }
        var atk_div = document.getElementById('atk_div');
        atk_div.innerText=atk_i+"/2"; 
        
    };


    var boss_hp_i= 0;
    var click_boss_hp = document.getElementById('boss_hp');
    click_boss_hp.onclick =()=>{
        if(boss_hp_i>=2){
            alert("최대치입니다.");
        }
        else if(Number(player_gold.innerText) < 1000 ){
            alert('1000골드가 없습니다.');
        }
        else{
            boss_hp_i++;
            player_gold.innerText=Number(player_gold.innerText)-1000;
        }
        var boss_hp_div = document.getElementById('boss_hp_div');
        boss_hp_div.innerText=boss_hp_i+"/2"; 
    };
    
    var shield_i= 0;
    var click_shield = document.getElementById('shield');
    click_shield.onclick =()=>{
        if(shield_i>=2){
            alert("최대치입니다.");
        }
        else if(Number(player_gold.innerText) < 1000 ){
            alert('1000골드가 없습니다.');
        }
        else{
            shield_i++;
            player_gold.innerText=Number(player_gold.innerText)-1000;
        }
        var shield_div = document.getElementById('shield_div');
        shield_div.innerText=shield_i+"/2"; 
    };

    var HP_i= 0;
    var click_HP = document.getElementById('HP');
    click_HP.onclick =()=>{
        if(HP_i>=2){
            alert("최대치입니다.");
        }
        else if(Number(player_gold.innerText) < 1000 ){
            alert('1000골드가 없습니다.');
        }
        else{
            HP_i++;
            player_gold.innerText=Number(player_gold.innerText)-1000;
        }
        var HP_div = document.getElementById('HP_div');
        HP_div.innerText=HP_i+"/2"; 
    };

    var spd_i= 0;
    var click_spd = document.getElementById('spd');
    click_spd.onclick =()=>{
        if(spd_i>=3){
            alert("최대치입니다.");
        }
        else if(Number(player_gold.innerText) < 1000 ){
            alert('1000골드가 없습니다.');
        }
        else{
            spd_i++;
            player_gold.innerText=Number(player_gold.innerText)-1000;
        }
        var spd_div = document.getElementById('spd_div');
        spd_div.innerText=spd_i+"/3"; 
    };