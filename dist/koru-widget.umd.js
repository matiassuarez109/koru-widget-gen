(function(i){typeof define=="function"&&define.amd?define(i):i()})((function(){"use strict";const i=`
:root { --kcd-bg: #000; --kcd-text: #FFF; --kcd-timer-bg: #333; --kcd-timer-text: #FFF; }
#koru-widget-countdown {
    position: fixed; left: 0; width: 100%; background: var(--kcd-bg); color: var(--kcd-text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
    z-index: 99999; display: flex; justify-content: center;
    align-items: center; padding: 10px 20px; box-sizing: border-box; transition: transform 0.3s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
#koru-widget-countdown.top-sticky { top: 0; }
.kcd-content { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; justify-content: center; }
.kcd-message-text { font-weight: 600; font-size: 16px; }
.kcd-timer { display: flex; gap: 5px; align-items: center; }
.kcd-unit { background: var(--kcd-timer-bg); color: var(--kcd-timer-text); padding: 4px 8px; border-radius: 4px; min-width: 2.2em; text-align: center; font-weight: bold; font-variant-numeric: tabular-nums; }
.kcd-sep { font-weight: bold; }
.kcd-btn { background: #ff4757; color: #fff; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 0.9em; white-space: nowrap; cursor: pointer; }
.kcd-btn:hover { opacity: 0.9; }
.kcd-close { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: inherit; font-size: 1.5em; cursor: pointer; opacity: 0.7; }
@media (max-width: 600px) {
    .kcd-content { gap: 10px; }
    .kcd-message-text { width: 100%; text-align: center; font-size: 14px; }
    .kcd-close { top: 5px; right: 5px; transform: none; font-size: 1.2em; }
}
`;class s{constructor(t){this.config=t}getTargetTime(){const t=Date.now();return this.config.timer_type==="to-date"&&this.config.end_date?new Date(this.config.end_date).getTime():t}getTimeBreakdown(t){if(t<=0)return{d:"00",h:"00",m:"00",s:"00"};const e=n=>n<10?"0"+n:n;return{d:e(Math.floor(t/864e5)),h:e(Math.floor(t/36e5%24)),m:e(Math.floor(t/6e4%60)),s:e(Math.floor(t/1e3%60))}}}class o{constructor(){this.interval=null,this.els={},this.container=null}init(){console.log("🚀 Iniciando Widget Standalone (Sin SDK)...");const t=document.currentScript||document.querySelector('script[src*="koru-widget"]');if(!t){console.error("No se encontró el script.");return}const e=t.dataset;this.config={position:"top-sticky",timer_type:"to-date",show_days:!0,bg_color:"#000",text_color:"#fff",...e,close_button:e.closeButton==="true",show_days:e.showDays!=="false"},this.engine=new s(this.config),this.render()}render(){if(sessionStorage.getItem("koru_standalone_closed"))return;this.injectStyles();const t=this.engine.getTargetTime();if(Date.now()>=t){this.renderFinished();return}this.renderUI(),this.updateTick(t),this.interval=setInterval(()=>this.updateTick(t),1e3)}renderUI(){this.container=document.createElement("div"),this.container.id="koru-widget-countdown",this.container.className=this.config.position||"top-sticky",this.config.backgroundColor&&this.container.style.setProperty("--kcd-bg",this.config.backgroundColor),this.config.textColor&&this.container.style.setProperty("--kcd-text",this.config.textColor);const t=this.config;this.container.innerHTML=`
            <div class="kcd-content">
                <div class="kcd-message-text">${t.messageText||"¡Oferta!"}</div>
                <div class="kcd-timer">
                    <div class="kcd-unit"><span id="kcd-d">00</span>d</div> <span class="kcd-sep">:</span>
                    <div class="kcd-unit"><span id="kcd-h">00</span>h</div> <span class="kcd-sep">:</span>
                    <div class="kcd-unit"><span id="kcd-m">00</span>m</div> <span class="kcd-sep">:</span>
                    <div class="kcd-unit"><span id="kcd-s">00</span>s</div>
                </div>
                ${t.buttonText?`<a href="${t.buttonLink||"#"}" class="kcd-btn">${t.buttonText}</a>`:""}
            </div>
             ${t.closeButton?'<button class="kcd-close">&times;</button>':""}
        `,document.body.prepend(this.container),this.els={d:this.container.querySelector("#kcd-d"),h:this.container.querySelector("#kcd-h"),m:this.container.querySelector("#kcd-m"),s:this.container.querySelector("#kcd-s")},t.closeButton&&(this.container.querySelector(".kcd-close").onclick=()=>{this.container.remove(),sessionStorage.setItem("koru_standalone_closed","true"),clearInterval(this.interval),document.body.style.marginTop="0"}),this.adjustBodyPush()}updateTick(t){const e=t-Date.now();if(e<=0)clearInterval(this.interval),this.renderFinished();else{const n=this.engine.getTimeBreakdown(e);this.els.d&&(this.els.d.innerText=n.d),this.els.h.innerText=n.h,this.els.m.innerText=n.m,this.els.s.innerText=n.s}}renderFinished(){this.container||this.renderUI(),this.container.innerHTML=`<div class="kcd-content"><div class="kcd-message-text">${this.config.finishMessage||"Oferta Terminada"}</div></div>`}injectStyles(){if(!document.getElementById("kcd-styles")){const t=document.createElement("style");t.id="kcd-styles",t.textContent=i,document.head.appendChild(t)}}adjustBodyPush(){this.container&&(this.config.position==="top-sticky"||!this.config.position)&&(document.body.style.marginTop=this.container.offsetHeight+"px")}}new o().init()}));
