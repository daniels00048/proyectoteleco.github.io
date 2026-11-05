
(function(){
var $=function(i){return document.getElementById(i)};
/* pestañas */
[].forEach.call(document.querySelectorAll('[role=tablist]'),function(list){
  var tabs=[].slice.call(list.querySelectorAll('[role=tab]'));
  tabs.forEach(function(t,i){t.addEventListener('click',function(){tabs.forEach(function(x){x.setAttribute('aria-selected',x===t);$(x.getAttribute('aria-controls')).hidden=x!==t})});
    t.addEventListener('keydown',function(e){var n=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(n){var j=(i+n+tabs.length)%tabs.length;tabs[j].focus();tabs[j].click()}})})});
/* abrir destino de un enlace (pestaña o tarjeta) */
window.reveal=function(h){var el=document.querySelector(h);if(!el)return null;
  var tp=el.closest('.tabpanel')||(el.classList.contains('tabpanel')?el:null);
  if(tp&&tp.hidden){var t=$(tp.getAttribute('aria-labelledby'));if(t)t.click()}
  if(el.classList.contains('word')){var dd=el.querySelector('details');if(dd)dd.open=true}
  return el};
if(location.hash){var el0=reveal(location.hash);if(el0)setTimeout(function(){el0.scrollIntoView()},60)}
/* ampliar imágenes */
document.addEventListener('click',function(e){var im=e.target.closest('.fig img,.shots img');if(!im)return;
  var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','Imagen ampliada');lb.tabIndex=-1;
  var c=document.createElement('img');c.src=im.getAttribute('data-full')||im.src;c.alt=im.alt;lb.appendChild(c);document.body.appendChild(lb);lb.focus();
  function close(){lb.remove();document.removeEventListener('keydown',k)}function k(ev){if(ev.key==='Escape')close()}
  lb.addEventListener('click',close);document.addEventListener('keydown',k)});
/* progreso y volver arriba */
var pr=$('progress'),tt=$('totop');
function onScroll(){var h=document.documentElement,m=h.scrollHeight-h.clientHeight;pr.style.width=(m>0?h.scrollTop/m*100:0)+'%';tt.classList.toggle('on',h.scrollTop>900)}
addEventListener('scroll',onScroll,{passive:true});onScroll();
tt.addEventListener('click',function(){scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});
/* escuchar resumen (síntesis de voz del navegador) */
if('speechSynthesis' in window){[].forEach.call(document.querySelectorAll('.listen'),function(b){b.hidden=false;
  b.addEventListener('click',function(){var ss=speechSynthesis;
    if(b.getAttribute('aria-pressed')==='true'){ss.cancel();return}
    var parts=[document.querySelector('h1').textContent,document.querySelector('.hero .question').textContent];
    [].forEach.call(document.querySelectorAll('section.panel'),function(sec){var h=sec.querySelector('h2'),t=sec.querySelector('.tldr,.clsum');if(h)parts.push(h.textContent+'.');if(t)parts.push(t.textContent)});
    var u=new SpeechSynthesisUtterance(parts.join(' ').replace(/·/g,','));u.lang='es-ES';u.rate=1;
    var v=ss.getVoices().filter(function(x){return /^es/i.test(x.lang)})[0];if(v)u.voice=v;
    u.onend=u.onerror=function(){b.setAttribute('aria-pressed','false');b.textContent='🔊 Escuchar resumen'};
    ss.cancel();ss.speak(u);b.setAttribute('aria-pressed','true');b.textContent='⏹ Detener audio'})})}
/* formulario (Netlify Forms) */
var fb=$('fb');if(fb)fb.addEventListener('submit',function(e){e.preventDefault();var out=$('fb-ok');
  if(!fb.querySelector('input[name=valoracion]:checked')){out.style.color='#A6192E';out.textContent='Elija una valoración antes de enviar.';return}
  fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(fb)).toString()}).then(function(r){
    if(!r.ok)throw 0;out.style.color='';out.textContent='¡Gracias! Su comentario llegó al equipo.';fb.reset()}).catch(function(){
    out.style.color='#A6192E';out.textContent='No se pudo enviar desde esta vista. El formulario funciona en el sitio publicado en Netlify.'})});
})();
