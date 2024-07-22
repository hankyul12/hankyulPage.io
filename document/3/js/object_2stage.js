    //canvas
    let board = document.getElementById('board');
    let gold = document.getElementById('gold');
    let count = document.getElementById('count');
    let gif = document.getElementById('pilot_img');
    let player_gold = document.getElementById('player_gold');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.canvas.width=(window.innerWidth)*0.8; //80% 왼쪽화면
    ctx.canvas.height=window.innerHeight;

    var user = localStorage.getItem('user');
    var rank = JSON.parse(localStorage.getItem('rank'));
    var new_rank = JSON.parse(localStorage.getItem('new_rank'));
    if(new_rank!=rank){
        rank=new_rank
    }

    const player = {    //플레이어
        x: canvas.width / 2 ,  //초반위치
        y: canvas.height-200,
        width: 48,      //플레이어 크기
        height: 33,
        img : '../image/player1.png',
        speed: 5,       //이속
        atk:1,         //공격력
        hp:30,           //hp
        shield:0,         //쉴드
        shield_img:'../image/shield.png',
        gold:0          //골드
    };
    const item = {      //코인 역할
        x: Math.random() * canvas.width,
        y: 10,
        width: 30,
        height: 30,
        img:'../image/coin.png',
        speed: 7
    };
    const boss= {
        x: canvas.width / 2-80,  //초반위치
        y: -100,
        width: 200,      //보스 크기
        height: 100,
        img:'../image/spaceship2.png',
        color: '#F00',
        hp:700,
        speed:3
    };
    const laser={
        x: boss.x+(boss.width/2),  //초반위치
        y: boss.y,
        width: 15,    
        height: 33,
        img:'../image/laser.png',
        speed:8,
        atk:50
    }
    const Saturn = {
        x: canvas.width-(canvas.width*0.8),
        y: -190,
        width: canvas.width,      
        height: canvas.height,
        speed : 0.1,
        img:'../image/Saturn.png'
    }
    const bg = {
        x: 0,
        y: 0,
        width : canvas.width,
        height :canvas.height,
        img : '../image/background.png'
    }

    let enemySpeed = 4; //적 이속
    let enemySpawnRate = 800;  //ms단위, 소환시간
    let lastSpawnTime = -1; 
    let LaserLastSpawnTime = -1;
    let startBossHP = boss.hp;
    let gameOver = false; //게임오버
    let coin_count = 0;  //아이템먹은횟수
    let game_count = localStorage.getItem('game_count'); //재도전횟수
    let bomb_count = 2; //폭탄개수

    let ran = Math.random() * canvas.width;

    const enemies = []; //적 배열
    const mobs=[];
    const bombs = [];
    const bullets = [];     //내가 쏘는 총알
    const bulletSpeed = 10; //내가 쏘는 총알 스피드
    const keys = {};

    window.addEventListener('keydown', e => {      //총알 발사
        keys[e.key] = true;
        if (e.key === 'j') { // 스페이스 바를 누르면 
            shootBullet();
        }
    });

    window.addEventListener('keydown', e => {      //총알 발사
        keys[e.key] = true;
        if (e.key === 'k') { // 스페이스 바를 누르면 
            shootBomb();
        }
    });

    window.addEventListener('keyup', e => keys[e.key] = false);
    
    count.innerText=game_count;
    ranking(rank);
    function gameLoop() { //게임시작
        if (gameOver) return;
        
        let sec_timer = document.querySelector('.sec').innerText;
        startBossHP = boss.hp;

        item.y += item.speed; //아이템 움직이기 
        if (item.y > canvas.height) {  //캔버스나가면 삭제
            item.x = Math.random() * canvas.width;
            item.y = -10;
        }
        Saturn.y+=Saturn.speed;

        if(boss.y<(canvas.height)*0.1){
            boss.y+=7;
            setTimeout(function () { 
                boss.y-=5;
             },50);
        }
        else if (boss.y>(canvas.height)*0.9){
            boss.y=0;
        }
        else if(boss.y>(canvas.height)*0.1){
            setTimeout(function(){
                if(boss.x>=(canvas.width-boss.width)){  // 적 움직이기
                    boss.speed = -3;
                    boss.x+=boss.speed;
                }
                
                else if (boss.x<0) { 
                    boss.speed = 3;
                    boss.x+=boss.speed;
                }

                else{
                    boss.x+=boss.speed;
                }

                if(sec_timer%7===1){
                    setTimeout(function(){
                        boss.y+=7;
                        setTimeout(function () { 
                            boss.img='../image/spaceship2.png';
                         })
                    },100);
                }

                if(sec_timer%15===1){
                    boss.img='../image/spaceship2_heal.png';
                    setTimeout(function(){
                        if(boss.hp<=700){
                            boss.hp+=1;
                        }
                        if(boss.hp>700){
                            boss.hp=700;
                        }
                        
                        setTimeout(function () { 
                            boss.img='../image/spaceship2.png';
                         })
                    },100);
                }
            }, 2000);

        }
        if (keys['a'] || keys['A']){
            if(player.x > 0) { // <
                player.x -= player.speed;
                player.img='../image/player3.png';
            }
        }
        if (keys['d'] || keys['D']){
            if(player.x < canvas.width - player.width) { // >
                player.x += player.speed;
                player.img='../image/player2.png';
            }
        }
        if (keys['w'] ||keys['W']){
            if(player.y > 0) {  // 위
                player.y -= player.speed;
                player.img='../image/player1.png';
            }
        }
        if (keys['s'] || keys['S']){
            if(player.y < canvas.height - player.height) { //아래
                player.y += player.speed;
                player.img='../image/player1.png';
            }
        }
        if (isCollision(player, item)) {  //충돌계산 함수 player와 item 충돌시
            coin_count ++ ;
            ran = Math.random() * canvas.width;
            item.x = Math.random() * canvas.width;
            item.y = -10; //먹으면 삭제(충돌시 안보이게, 아마 이거땜에 하나씩 소환되는거같음) 
                            // 다른오브젝트들처럼 배열안써서 하나씩나오는거였음
        }
        if (isCollision(player, boss)) {  //충돌계산 함수 player와 boss 충돌시
            showGameOver(); //결과창
        }

        const currentTime = Date.now();

        if (currentTime - lastSpawnTime > enemySpawnRate) { //적소환
            const enemy = { //적 정보
                x: Math.random() * canvas.width,
                y: -10,
                width: 5,  //반지름으로 사용
                height: 5,  
                color: '#f00',
                speed: enemySpeed,
                atk : 30
            }; 
            enemies.push(enemy);
            lastSpawnTime = currentTime;

            if (enemySpawnRate > 100) {  //점점 많아지고
                enemySpawnRate -= 20;
            }
            if (enemySpeed < 10) {      //점점 빨라지게
                enemySpeed += 0.01;
            }
        }

        enemies.forEach(enemy => {  //적 각각
            enemy.y += enemy.speed; //적움직임
            if (isCollision(player, enemy)) {   //닿으면 게임오버
                player.hp-=enemy.atk;
                if(player.shield>=1){
                    player.shield--;
                    enemies.splice(enemies.indexOf(enemy), 1);
                }
                
                else if(player.hp<=0){
                    showGameOver(); //결과창
                }
                else{
                    enemies.splice(enemies.indexOf(enemy), 1);
                }
                
            }
            if (enemy.y > canvas.height) { //캔버스 나가면 사라지게 (배열에서)
                enemies.splice(enemies.indexOf(enemy), 1);
            }
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);   //캔버스 초기화

        draw(bg);
        draw(Saturn);

        enemies.forEach(enemy => {  //각각의 적 그리기
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y,(enemy.width)*0.9,0,2*Math.PI,false);
            ctx.fill();
            ctx.stroke();
        });

        if(player.shield>=1){
            const img_shield=new Image(); //아이템 그리기
            img_shield.src = player.shield_img;
            ctx.drawImage(img_shield,player.x, player.y-5, player.width, player.height+15);
        }

        draw(player);
        draw(item);
        draw(boss);

        const img_bombDisplay=new Image();
            if(bomb_count===2){
                img_bombDisplay.src='../image/bomb_display0.png'; 
            }
            else if(bomb_count===1){
                img_bombDisplay.src='../image/bomb_display1.png'; 
            }
            else{
                img_bombDisplay.src='../image/bomb_display2.png'; 
            }
            ctx.drawImage(img_bombDisplay,player.x+6, player.y+25, player.width-10, player.height-10);

        ctx.font = "18px Silkscreen, sans-serif"; //보스hp
        ctx.fillText(boss.hp,boss.x+85, boss.y-20);
        
        moveBullets();  //내가 쏜 총알 움직이게
        drawBullets();  //총알그리기
        moveBombs();
        drawBombs();
        
        if(boss.hp <= 0){ //보스 피가 0이하면 클리어
            gameOver = true;
            showGameClaer();
        }
        const laserCurrentTime = Date.now();
        if(boss.hp<=700){
            if (laserCurrentTime - LaserLastSpawnTime > 5000){
                laser.y += laser.speed; //아이템 움직이기 
                if (laser.y > canvas.height) {  //캔버스나가면 삭제
                    laser.x = boss.x+(boss.width/2);
                    laser.y = boss.y;
                }
            }
            if(isCollision(player,laser)){ 
                player.hp -= laser.atk;
                if(player.shield>=1){
                    player.shield--;
                    laser.x = boss.x+(boss.width/2);
                    laser.y = boss.y;
                }
                
                else if(player.hp<=0){
                    laser.x = boss.x+(boss.width/2);
                    laser.y = boss.y;
                    showGameOver(); //결과창
                }
                else{
                    laser.x = boss.x+(boss.width/2);
                    laser.y = boss.y;
                }

            }
            const img_laser=new Image(); //아이템 그리기
            img_laser.src = laser.img;
            ctx.drawImage(img_laser,laser.x, laser.y, laser.width, laser.height);
        }

        if (!gameOver) {
            requestAnimationFrame(gameLoop); //무한 요청 , 일시정지같은게잇으면 좋을지도 찾아봐야됨
        }
    }

    function draw(obj){ //오브젝트 그리기
        const img=new Image();
        img.src=obj.img; 
        ctx.drawImage(img,obj.x, obj.y, obj.width, obj.height);
    }

    function shootBullet() {    //총쏘기 , 적소환되는거랑 똑같이 구현
        const bullet = {
            x: player.x + player.width / 2,
            y: player.y,
            width: 30,
            height: 30,
            color: '#0f0',
            speed: bulletSpeed
        };
        bullets.push(bullet);
    }

    function shootBomb() { 
        const bomb = {
            x: player.x + player.width / 2,
            y: player.y,
            width: 30,
            height: 30,
            speed: 20,
            atk:50,
            count: bomb_count
        };
        if(bomb.count>0){
            bombs.push(bomb);
            bomb_count--;
        }
     }


     function moveBombs() {   //폭탄 움직이기
        bombs.forEach(bomb => {
            
            bomb.y -= bomb.speed;
            if (bomb.y < 0) {
                bombs.splice(bombs.indexOf(bomb), 1);
            }

            if(isCollision(bomb,boss)){ 
                boss.hp -= bomb.atk;
                boss.img="../image/spaceship2_bomb.png";
                bombs.splice(bombs.indexOf(bomb), 1);
                setTimeout(function(){
                    boss.img="../image/spaceship2.png";
                },400);
            }
        });
    }
    function drawBombs() {    
        bombs.forEach(Bomb => {
            const img_bomb=new Image();
            img_bomb.src="../image/bomb.png";
            ctx.drawImage(img_bomb,Bomb.x - Bomb.width / 2, Bomb.y, Bomb.width, Bomb.height);
        });
    }

    function moveBullets() {    //총움직이기, 적없어지는거랑 똑같이 구현 
        bullets.forEach(bullet => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                bullets.splice(bullets.indexOf(bullet), 1);
            }

            if(isCollision(bullet,boss)){ //총알에 보스 충돌
                boss.hp -= player.atk;
                boss.img="../image/spaceship2_attack.png";
                bullets.splice(bullets.indexOf(bullet), 1);
                setTimeout(function(){
                    boss.img="../image/spaceship2.png";
                },400);
            }
            if(isCollision(bullet,laser)){ //총알에 보스 충돌
                bullets.splice(bullets.indexOf(bullet), 1);
                laser.x = boss.x+(boss.width/2);
                laser.y = boss.y;
            }
        });
    }

    function drawBullets() {    //총그리기, 적그리는거랑 똑같이 구현
        bullets.forEach(bullet => {
            ctx.fillStyle = bullet.color;

            const img_bullet=new Image();
            if(atk_i===0){
                img_bullet.src="../image/bullet0.png";
            }
            else if(atk_i===1){
                img_bullet.src="../image/bullet1.png";
            }
            else{
                img_bullet.src="../image/bullet2.png";
            }
            ctx.drawImage(img_bullet,bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
        });
    }

    function isCollision(player, enemy) {  //충돌함수
        return player.x < enemy.x + enemy.width &&
               player.x + player.width > enemy.x &&
               player.y < enemy.y + enemy.height &&
               player.y + player.height > enemy.y;
    }

    function showGameOver() { //게임오버시 안보였던거 block처리
        gameOver = true;
        let gold_calc1 =Math.floor(( (700-boss.hp) / 700 ) * 1000); //깐 체력비례 코인획득
        // 까인 체력 퍼센트 *10만큼 골드획득
        let gold_calc2 = coin_count *3000; //코인 먹은 횟수 * 50 만큼 코인획득
        let final_gold=gold_calc1+gold_calc2; //최종적으로 얻은 골드
        gold.innerText = final_gold;  //해당 게임에서 얻은 코인
        player.gold = player.gold+final_gold;
        player_gold.innerText=player.gold; // 가지고 있는 코인
        gif.src="../image/noSignal.gif";
        const gameOverDiv = document.getElementById('gameOver');
        gameOverDiv.style.display = 'block';
    }

    function showGameClaer() { //게임클리어시 안보였던거 block처리
        const gameClearDiv = document.getElementById('gameClear');
        gameClearDiv.style.display = 'block';

        rank[user]=game_count;
        
        const rank_sort = ranking(rank);    //rank_sort에 저장
        localStorage.setItem('new_rank', JSON.stringify(rank_sort)); //sort된 걸 로컬에 저장
    }

    function ranking(rank){
        const rankArray = Object.entries(rank).map(([key, value]) => [key, parseInt(value, 10)]);

        rankArray.sort((a, b) => a[1] - b[1]);
    
        const sortedRank = {};
        rankArray.slice(0, 10).forEach(([key, value]) => {
            sortedRank[key] = value;
        });

        const rank_sort = JSON.stringify(sortedRank);
        console.log('rank_sort:', rank_sort);
    
        let ul_text = "<ol>";
    
        for (var key in sortedRank) {
            console.log(key + " " + JSON.stringify({ [key]: sortedRank[key] })); // JSON 형식으로 출력
            ul_text += "<li>" + key + " -- " + sortedRank[key] + "</li>";
        }
        ul_text += "</ol>";
    
        document.getElementById('rank_p').innerHTML = ul_text;

        return sortedRank; // JSON 문자열 대신 객체 자체를 반환
    }

    function restartGame() { //리겜, 설정초기화
        gameOver = false;

        enemies.length = 0;
        bullets.length = 0;

        enemySpeed = 3;
        enemySpawnRate = 1000;
        lastSpawnTime = -1;
        LaserLastSpawnTime =-1;

        player.x = canvas.width / 2;
        player.y = canvas.height-200;

        player.atk = player.atk+(atk_i*1); //피해량
        boss.hp= 700-(boss_hp_i*10); // 적HP감소
        boss.y= -100;
        player.hp = 30+(HP_i*0.5); //HP
        player.shield = player.shield+(shield_i*1); //방어막
        player.speed = player.speed+(spd_i*0.5); //이속

        coin_count=0;
        player.gold=Number(player_gold.innerText);
        game_count++;
        min = "1";
        sec= "00";
        count.innerText=game_count;
        Saturn.y=-10;
        bomb_count=2;
        gif.src="../image/pilot.gif";

        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameClear').style.display = 'none';
        
        gameLoop();
    }
    

    gameLoop();