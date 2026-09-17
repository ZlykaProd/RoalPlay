let balance=10000;
const balanceEl=document.querySelector("#balance"),modal=document.querySelector("#modal"),content=document.querySelector("#modalContent");
function money(n){return n.toLocaleString("ru-RU")}
function setBalance(n){balance=n;balanceEl.textContent=money(balance)}
document.querySelectorAll(".play").forEach(btn=>btn.addEventListener("click",e=>{
 const game=e.target.closest(".game").dataset.game;
 const bets={roulette:100,blackjack:250,slots:100,dice:150}; const bet=bets[game];
 if(balance<bet){show("Недостаточно RP","Пополните виртуальный баланс для продолжения.","lose");return}
 balance-=bet;
 let win=false, prize=0;
 if(game==="slots"){win=Math.random()<.35;prize=win?bet*5:0}
 else if(game==="roulette"){win=Math.random()<.48;prize=win?bet*2:0}
 else if(game==="blackjack"){win=Math.random()<.49;prize=win?bet*2.2:0}
 else {win=Math.random()<.48;prize=win?bet*2:0}
 prize=Math.floor(prize); balance+=prize; setBalance(balance);
 show(game==="slots"?"NEON SLOTS":game==="roulette"?"ROYAL ROULETTE":game==="blackjack"?"BLACKJACK":"HIGH DICE",
      win?`🎉 Вы выиграли <b class="win">${money(prize)} RP</b>`:`😕 В этот раз без выигрыша. Ставка: ${money(bet)} RP`,win?"win":"lose");
}));
function show(title,text,cls){content.innerHTML=`<div class="eyebrow">DEMO GAME</div><h2>${title}</h2><div class="result ${cls}">${cls==="win"?"WIN":"TRY AGAIN"}</div><p>${text}</p>`;modal.classList.add("show")}
document.querySelector(".close").onclick=()=>modal.classList.remove("show");
modal.onclick=e=>{if(e.target===modal)modal.classList.remove("show")};
document.querySelectorAll(".filter").forEach(f=>f.onclick=()=>{
 document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));f.classList.add("active");
 const cat=f.dataset.filter;document.querySelectorAll(".product").forEach(p=>p.style.display=cat==="all"||p.dataset.cat===cat?"":"none");
});
document.querySelectorAll(".product button").forEach(b=>b.onclick=()=>show("ROYAL MARKET","Заявка на просмотр товара создана. Это демонстрационная витрина — реальные сделки здесь не проводятся.","win"));
