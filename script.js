let balance=10000, dealer=[], player=[], activeGame='';
const $=s=>document.querySelector(s), modal=$("#modal"), content=$("#modalContent");
function fmt(n){return Math.floor(n).toLocaleString("ru-RU")}
function setBalance(n){balance=Math.max(0,n);$("#balance").textContent=fmt(balance);$("#heroBalance").textContent=fmt(balance)}
function closeModal(){modal.classList.remove("show")}
function show(html){content.innerHTML=html;modal.classList.add("show")}
const suits=["♠","♥","♦","♣"], ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
function deck(){let d=[];for(const s of suits)for(const r of ranks)d.push({r,s});return d.sort(()=>Math.random()-.5)}
function val(c){return c.r==="A"?11:["K","Q","J"].includes(c.r)?10:+c.r}
function score(hand){let x=hand.reduce((a,c)=>a+val(c),0), ac=hand.filter(c=>c.r==="A").length;while(x>21&&ac--)x-=10;return x}
function cards(h){return `<div class="cards">${h.map(c=>`<span class="card">${c.r}${c.s}</span>`).join("")}</div>`}
function openGame(type){
 activeGame=type;
 if(type==="roulette") roulette();
 if(type==="blackjack") blackjackStart();
 if(type==="slots") slots();
 if(type==="dice") dice();
}
function stakeBox(defaultBet=100){return `<div class="betrow"><input id="bet" type="number" min="1" value="${defaultBet}"><span>RP</span></div>`}
function roulette(){
 show(`<div class="game-ui"><div class="eyebrow">ROYAL TABLE</div><h2>🎡 Roulette</h2><div class="table"><div class="wheel">🎡</div><p>Выберите число или цвет</p><div class="choices">${Array.from({length:12},(_,i)=>`<button class="choice" onclick="spinRoulette(${i+1})">${i+1}</button>`).join("")}</div></div>${stakeBox()}<div id="gameResult"></div></div>`)
}
function spinRoulette(n){
 const bet=Math.floor(+$("input#bet").value); if(!validBet(bet))return;
 balance-=bet; const result=Math.floor(Math.random()*12)+1, color=result%2?"Красное":"Чёрное";
 const win=result===n; if(win)balance+=bet*10; setBalance(balance);
 $("#gameResult").innerHTML=`<div class="result ${win?"win":"lose"}">Выпало <b>${result}</b> • ${color}<br>${win?"🎉 Точное попадание! +"+fmt(bet*10)+" RP":"Вы выбрали "+n}</div>`;
}
function blackjackStart(){
 dealer=[];player=[];let d=deck();player=[d.pop(),d.pop()];dealer=[d.pop(),d.pop()];
 show(`<div class="game-ui"><div class="eyebrow">ROYAL TABLE</div><h2>🂡 Blackjack</h2>${stakeBox(250)}<div class="table"><p>Дилер</p>${cards([dealer[0],{r:"?",s:""}])}<p>Вы · ${score(player)}</p>${cards(player)}<div class="choices"><button onclick="bjHit()">Hit</button><button onclick="bjStand()">Stand</button><button onclick="blackjackStart()">Новая раздача</button></div></div><div id="gameResult">Цель — набрать ближе к 21, не превысив.</div></div>`);
}
function validBet(b){if(!Number.isFinite(b)||b<1||b>balance){$("#gameResult").innerHTML='<div class="result lose">Введите корректную ставку в пределах баланса.</div>';return false}return true}
function bjHit(){const bet=Math.floor(+$("input#bet").value);if(!validBet(bet))return;const d=deck();player.push(d[0]);if(score(player)>21){balance-=bet;setBalance(balance);$("#gameResult").innerHTML=`<div class="result lose">Перебор: ${score(player)}. -${fmt(bet)} RP</div>`}else{$(".table").innerHTML=`<p>Дилер</p>${cards([dealer[0],{r:"?",s:""}])}<p>Вы · ${score(player)}</p>${cards(player)}<div class="choices"><button onclick="bjHit()">Hit</button><button onclick="bjStand()">Stand</button></div>`}}
function bjStand(){const bet=Math.floor(+$("input#bet").value);if(!validBet(bet))return;while(score(dealer)<17)dealer.push(deck()[0]);let ps=score(player),ds=score(dealer);let win=ds>21||ps>ds,draw=ps===ds;balance-=bet;if(win)balance+=bet*2;if(draw)balance+=bet;setBalance(balance);$(".table").innerHTML=`<p>Дилер · ${ds}</p>${cards(dealer)}<p>Вы · ${ps}</p>${cards(player)}`;$("#gameResult").innerHTML=`<div class="result ${win?"win":draw?"":"lose"}">${win?"🎉 Победа! +"+fmt(bet)+" RP":draw?"🤝 Ничья. Ставка возвращена":"😕 Дилер выиграл. -"+fmt(bet)+" RP"}</div>`}
function slots(){show(`<div class="game-ui"><div class="eyebrow">NEON ARCADE</div><h2>🎰 Neon Slots</h2>${stakeBox(100)}<div class="slots"><span class="reel" id="r1">🍒</span><span class="reel" id="r2">7️⃣</span><span class="reel" id="r3">💎</span></div><button onclick="spinSlots()">Крутить барабаны</button><div id="gameResult">3 одинаковых символа = крупный выигрыш.</div></div>`)}
function spinSlots(){const bet=Math.floor(+$("input#bet").value);if(!validBet(bet))return;balance-=bet;const sy=["🍒","🍋","🔔","⭐","7️⃣","💎"],a=[...Array(3)].map(()=>sy[Math.floor(Math.random()*sy.length)]);["#r1","#r2","#r3"].forEach((x,i)=>$(x).textContent=a[i]);let mult=a[0]===a[1]&&a[1]===a[2]?(a[0]==="💎"?20:a[0]==="7️⃣"?15:8):a[0]===a[1]||a[1]===a[2]?2:0;balance+=bet*mult;setBalance(balance);$("#gameResult").innerHTML=`<div class="result ${mult>0?"win":"lose"}">${a.join(" ")}<br>${mult?`Выигрыш ×${mult}: +${fmt(bet*mult)} RP`:"Нет комбинации"}</div>`}
function dice(){show(`<div class="game-ui"><div class="eyebrow">HIGH DICE</div><h2>🎲 High Dice</h2>${stakeBox(150)}<div class="table"><div id="die" style="font-size:80px">🎲</div><p>Выберите: низ (1–3), высокий (4–6) или конкретное число.</p><div class="choices"><button onclick="rollDice('low')">1–3</button><button onclick="rollDice('high')">4–6</button>${[1,2,3,4,5,6].map(n=>`<button onclick="rollDice(${n})">${n}</button>`).join("")}</div></div><div id="gameResult"></div></div>`)}
function rollDice(choice){const bet=Math.floor(+$("input#bet").value);if(!validBet(bet))return;balance-=bet;const n=Math.floor(Math.random()*6)+1;let win=choice==="low"?n<=3:choice==="high"?n>=4:n===choice;let mult=(choice==="low"||choice==="high")?2:6;if(win)balance+=bet*mult;setBalance(balance);$("#die").textContent=["","⚀","⚁","⚂","⚃","⚄","⚅"][n];$("#gameResult").innerHTML=`<div class="result ${win?"win":"lose"}">Выпало ${n}. ${win?"Победа! +"+fmt(bet*mult)+" RP":"Проигрыш: -"+fmt(bet)+" RP"}</div>`}
function openProduct(name,price){show(`<div class="pay"><div class="eyebrow">ROYAL CHECKOUT</div><h2>${name}</h2><p style="color:#aaa">${price}</p><div class="pay-grid"><input class="card-input full" placeholder="Имя держателя карты" autocomplete="off"><input class="card-input full" placeholder="Номер карты •••• •••• •••• ••••" inputmode="numeric" autocomplete="off"><input class="card-input" placeholder="MM / YY" autocomplete="off"><input class="card-input" placeholder="CVC" type="password" autocomplete="off"><input class="card-input full" placeholder="Адрес доставки" autocomplete="off"></div><button class="pay-btn" onclick="fakePay('${name.replace(/'/g,"")}')">Оплатить ${price}</button><div class="secure">🔒 ДЕМО-ОПЛАТА • данные не отправляются и не обрабатываются</div></div>`)}
function fakePay(name){content.innerHTML=`<div class="game-ui"><div style="font-size:60px">✓</div><h2>Заказ оформлен</h2><p>Демонстрационная заявка на <b>${name}</b> создана.</p><div class="result win">Платёжная анимация завершена</div><button onclick="closeModal()">Вернуться в магазин</button></div>`}
document.querySelectorAll(".filter").forEach(f=>f.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));f.classList.add("active");const c=f.dataset.filter;document.querySelectorAll(".product").forEach(p=>p.style.display=c==="all"||p.dataset.cat===c?"":"none")});
modal.onclick=e=>{if(e.target===modal)closeModal()};
