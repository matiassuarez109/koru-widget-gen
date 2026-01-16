// AQUI NO IMPORTAMOS NADA DEL SDK PARA EVITAR ERRORES DE RED

// ==========================================
// 1. ESTILOS (Mismos estilos)
// ==========================================
const WIDGET_STYLES = `
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
`;

// ==========================================
// 2. ENGINE DE TIEMPO (Lógica de negocio pura)
// ==========================================
class TimeEngine {
    constructor(config) { this.config = config; }
    getTargetTime() {
        const NOW = Date.now();
        if (this.config.timer_type === 'to-date') return this.config.end_date ? new Date(this.config.end_date).getTime() : NOW;
        // ... (resto de lógica igual) ...
        return NOW;
    }
    getTimeBreakdown(ms) {
        if (ms <= 0) return { d: '00', h: '00', m: '00', s: '00' };
        const pad = n => n < 10 ? '0' + n : n;
        return {
            d: pad(Math.floor(ms / 86400000)),
            h: pad(Math.floor((ms / 3600000) % 24)),
            m: pad(Math.floor((ms / 60000) % 60)),
            s: pad(Math.floor((ms / 1000) % 60))
        };
    }
}

// ==========================================
// 3. WIDGET STANDALONE (Sin herencia de SDK)
// ==========================================
class KoruCountdownStandalone {
    constructor() {
        this.interval = null;
        this.els = {};
        this.container = null;
    }

    // Inicialización manual leyendo atributos del HTML
    init() {
        console.log("🚀 Iniciando Widget Standalone (Sin SDK)...");
        const scriptEl = document.currentScript || document.querySelector('script[src*="koru-widget"]');

        if (!scriptEl) {
            console.error("No se encontró el script.");
            return;
        }

        const ds = scriptEl.dataset;
        this.config = {
            // Valores por defecto
            position: 'top-sticky',
            timer_type: 'to-date',
            show_days: true,
            bg_color: '#000',
            text_color: '#fff',
            // Valores del HTML (Sobreescriben)
            ...ds,
            // Corrección de tipos
            close_button: ds.closeButton === 'true',
            show_days: ds.showDays !== 'false'
        };

        this.engine = new TimeEngine(this.config);
        this.render();
    }

    render() {
        // Verificar si ya se cerró
        if (sessionStorage.getItem('koru_standalone_closed')) return;

        this.injectStyles();

        // Calcular tiempo
        const targetTime = this.engine.getTargetTime();
        if (Date.now() >= targetTime) {
            this.renderFinished();
            return;
        }

        this.renderUI();
        this.updateTick(targetTime);
        this.interval = setInterval(() => this.updateTick(targetTime), 1000);
    }

    renderUI() {
        this.container = document.createElement('div');
        this.container.id = 'koru-widget-countdown';
        this.container.className = this.config.position || 'top-sticky';

        // Colores
        if (this.config.backgroundColor) this.container.style.setProperty('--kcd-bg', this.config.backgroundColor);
        if (this.config.textColor) this.container.style.setProperty('--kcd-text', this.config.textColor);

        const c = this.config;

        this.container.innerHTML = `
            <div class="kcd-content">
                <div class="kcd-message-text">${c.messageText || '¡Oferta!'}</div>
                <div class="kcd-timer">
                    <div class="kcd-unit"><span id="kcd-d">00</span>d</div> <span class="kcd-sep">:</span>
                    <div class="kcd-unit"><span id="kcd-h">00</span>h</div> <span class="kcd-sep">:</span>
                    <div class="kcd-unit"><span id="kcd-m">00</span>m</div> <span class="kcd-sep">:</span>
                    <div class="kcd-unit"><span id="kcd-s">00</span>s</div>
                </div>
                ${c.buttonText ? `<a href="${c.buttonLink || '#'}" class="kcd-btn">${c.buttonText}</a>` : ''}
            </div>
             ${c.closeButton ? '<button class="kcd-close">&times;</button>' : ''}
        `;

        document.body.prepend(this.container);

        // Referencias
        this.els = {
            d: this.container.querySelector('#kcd-d'),
            h: this.container.querySelector('#kcd-h'),
            m: this.container.querySelector('#kcd-m'),
            s: this.container.querySelector('#kcd-s')
        };

        // Eventos
        if (c.closeButton) {
            this.container.querySelector('.kcd-close').onclick = () => {
                this.container.remove();
                sessionStorage.setItem('koru_standalone_closed', 'true');
                clearInterval(this.interval);
                document.body.style.marginTop = '0';
            };
        }

        this.adjustBodyPush();
    }

    updateTick(targetTime) {
        const remaining = targetTime - Date.now();
        if (remaining <= 0) {
            clearInterval(this.interval);
            this.renderFinished();
        } else {
            const t = this.engine.getTimeBreakdown(remaining);
            if (this.els.d) this.els.d.innerText = t.d;
            this.els.h.innerText = t.h;
            this.els.m.innerText = t.m;
            this.els.s.innerText = t.s;
        }
    }

    renderFinished() {
        if (!this.container) this.renderUI();
        this.container.innerHTML = `<div class="kcd-content"><div class="kcd-message-text">${this.config.finishMessage || 'Oferta Terminada'}</div></div>`;
    }

    injectStyles() {
        if (!document.getElementById('kcd-styles')) {
            const s = document.createElement('style'); s.id = 'kcd-styles'; s.textContent = WIDGET_STYLES;
            document.head.appendChild(s);
        }
    }

    adjustBodyPush() {
        if (this.container && (this.config.position === 'top-sticky' || !this.config.position)) {
            document.body.style.marginTop = this.container.offsetHeight + 'px';
        }
    }
}

// ARRANQUE AUTOMÁTICO INMEDIATO
new KoruCountdownStandalone().init();