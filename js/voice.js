/* ═══════════ Ferreproxim · Voz (TTS + STT) ES/GL/EN · M/F ═══════════ */
const Voice = {
  lang: localStorage.getItem('vx_lang') || LANG,
  gender: localStorage.getItem('vx_gender') || 'female',
  voiceName: localStorage.getItem('vx_voice') || '',
  voices: [],

  init(){
    const vl = document.getElementById('voiceLang');
    const sel = () => { this.lang = vl.value; localStorage.setItem('vx_lang', vl.value); this.refreshVoices(); };
    vl.value = this.lang; vl.addEventListener('change', sel);

    document.querySelectorAll('.gender-row .btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        document.querySelectorAll('.gender-row .btn').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        this.gender = b.dataset.gender;
        localStorage.setItem('vx_gender', this.gender);
        this.lang = vl.value; saveCfg(); this.refreshVoices(); this.speak(t(this.gender==='female'?'tts_test_female':'tts_test_male'));
      });
    });
    document.getElementById('btnTestVoice').addEventListener('click', ()=>{
      this.lang = vl.value; saveCfg(); this.speak(t(this.gender==='female'?'tts_test_female':'tts_test_male'));
    });
    if('speechSynthesis' in window){
      const load = () => { this.voices = speechSynthesis.getVoices(); this.refreshVoices(); };
      load(); speechSynthesis.onvoiceschanged = load;
    }
  },

  langCode(){ return this.lang==='en' ? 'en-US' : this.lang==='gl' ? 'gl-ES' : 'es-ES'; },

  refreshVoices(){
    const pick = document.getElementById('voicePick');
    if(!pick) return;
    const code = this.langCode();
    let list = this.voices.filter(v=>v.lang.toLowerCase().startsWith(code.substring(0,2)));
    if(!list.length) list = this.voices.filter(v=>v.lang.toLowerCase().startsWith((this.lang==='en'?'en':'es')));
    pick.innerHTML = '<option value="">– '+t('voice_none')+' –</option>' + list.map(v=>`<option value="${v.name}">${v.name} (${v.lang})</option>`).join('');
    if(this.voiceName && list.some(v=>v.name===this.voiceName)) pick.value = this.voiceName;
  },

  pickVoice(){
    const pickEl = document.getElementById('voicePick');
    this.voiceName = pickEl?.value || '';
    localStorage.setItem('vx_voice', this.voiceName);
    if(this.voiceName){
      const v = this.voices.find(v=>v.name===this.voiceName);
      if(v) return v;
    }
    const pref = this.langCode();
    const candidates = this.voices.filter(v=>v.lang.toLowerCase().startsWith(pref.slice(0,2)))
      .concat(this.voices.filter(v=>v.lang.toLowerCase().startsWith(this.lang==='en'?'en':'es')));
    const femaleHints = ['female','mujer','femenina','monica','paulina','helena','laura','elvira','sabina','aria','zira','eva','marisol','lucia','estrella','ximena','alice','samantha','victoria','karen','tessa','hormis','feminina','sabela'];
    const maleHints = ['male','hombre','masculino','jorge','diego','pablo','carlos','juan','daniel','alvaro','rishi','david','mark','tom','alex','davis','liam','masculina','xove'];
    const fuzzy = (v)=> v.name.toLowerCase() + ' ' + (v.voiceURI||'');
    const scored = candidates
      .map(v=>{
        const n = fuzzy(v); let score = 0;
        if(this.gender==='female'){ if(femaleHints.some(h=>n.includes(h))) score+=10; if(maleHints.some(h=>v.name.toLowerCase().includes(h))) score-=10; }
        else { if(maleHints.some(h=>n.includes(h))) score+=10; if(femaleHints.some(h=>v.name.toLowerCase().includes(h))) score-=10; }
        if(n.includes('google')) score+=3;
        if(n.includes('natural')||n.includes('neural')) score+=2;
        return {v,score};
      })
      .sort((a,b)=>b.score-a.score);
    return scored.length ? scored[0].v : null;
  },

  speak(text){
    if(!('speechSynthesis' in window)){ toast(t('tts_unsupported')); return; }
    speechSynthesis.cancel();
    const plain = text.replace(/<[^>]+>/g,'').replace(/[#*_`>\|]/g,'').replace(/€/g,' euros ').slice(0,600);
    const u = new SpeechSynthesisUtterance(plain);
    const v = this.pickVoice();
    if(v) u.voice = v;
    u.lang = v?.lang || this.langCode();
    u.rate = 1; u.pitch = this.gender==='male' ? .8 : 1.05;
    speechSynthesis.speak(u);
  },
  stop(){ if('speechSynthesis' in window) speechSynthesis.cancel(); },

  listen(btn, onResult, onEnd){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ toast(t('stt_unsupported')); onEnd && onEnd(); return null; }
    const rec = new SR();
    rec.lang = this.langCode();
    rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
    rec.onresult = e=>{
      let txt = '';
      for(const r of e.results) txt += r[0].transcript;
      onResult(txt, e.results[e.results.length-1].isFinal);
    };
    rec.onerror = ()=>{ btn?.classList.remove('listening'); onEnd && onEnd(); };
    rec.onend = ()=>{ btn?.classList.remove('listening'); onEnd && onEnd(); };
    btn?.classList.add('listening');
    try{ rec.start(); }catch(_){ btn?.classList.remove('listening'); onEnd && onEnd(); }
    return rec;
  },

  pickVoiceFromModal(){
    const pickEl = document.getElementById('voicePick');
    this.voiceName = pickEl?.value || '';
    localStorage.setItem('vx_voice', this.voiceName);
    this.speak(t(this.gender==='female'?'tts_test_female':'tts_test_male'));
  }
};
function saveCfg(){ localStorage.setItem('vx_lang', Voice.lang); localStorage.setItem('vx_gender', Voice.gender); }
