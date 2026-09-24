/* ============================================================
   VALUE & BUDAYA — scroll-pinned controller
   Murni JS (nggak nyentuh global scope selain 1 IIFE), dari prototype
   yang dikasih user, id/class-nya udah disamain ke versi vc- prefix.
   ============================================================ */

/* =========================================================
   GENERIC SCROLL CONTROLLER
   Each section owns its own 01 -> 08 timeline.
   ========================================================= */

(() => {

  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));

  // Di HP: langsung tampil final state semua, TANPA pasang scroll listener
  // sama sekali (ini yang paling berat -- ngitung getBoundingClientRect
  // tiap scroll event). Permintaan performa, bukan cuma matiin animasinya.
  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  function createController(config){

    const section = document.querySelector(config.section);
    const items = [...document.querySelectorAll(config.items)];
    const numbers = config.numbers
      ? [...document.querySelectorAll(config.numbers)]
      : [];
    const segments = config.segments
      ? [...document.querySelectorAll(config.segments)]
      : [];

    const progress = document.querySelector(config.progress);
    const label = document.querySelector(config.label);
    const header = config.header
      ? document.querySelector(config.header)
      : null;
    const hint = config.hint
      ? document.querySelector(config.hint)
      : null;

    if (isMobile) {
      items.forEach((item) => item.classList.add("vc-visible"));
      numbers.forEach((item) => item.classList.add("vc-active"));
      segments.forEach((item) => item.classList.add("vc-active"));
      if (progress) progress.style.height = "100%";
      if (label) label.textContent = "08 / 08";
      if (hint) hint.style.opacity = "0";
      return; // nggak pasang scroll/resize listener sama sekali
    }

    function getProgress(){

      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;

      if(distance <= 0) return 0;

      return clamp(-rect.top / distance,0,1);
    }

    function render(){

      const p = getProgress();

      /* First 5% is the introduction. */
      const intro = .05;
      const usable = 1 - intro;

      let step = 0;

      if(p > intro){
        step = Math.ceil(((p-intro)/usable)*8);
      }

      step = clamp(step,0,8);

      /*
       * IMPORTANT:
       * The scroll position controls the state.
       * No setTimeout and no autoplay.
       */
      items.forEach((item,index)=>{
        item.classList.toggle("vc-visible",index < step);
      });

      numbers.forEach((item,index)=>{
        item.classList.toggle("vc-active",index < step);
      });

      segments.forEach((item,index)=>{
        item.classList.toggle("vc-active",index < step);
      });

      if(progress){
        progress.style.height = `${p*100}%`;
      }

      if(label){
        label.textContent =
          step === 0
          ? "INTRO"
          : `${String(step).padStart(2,"0")} / 08`;
      }

      if(header){
        header.classList.toggle("vc-moved",step > 0);
      }

      if(hint){
        hint.style.opacity = p > .035 ? "0" : "1";
      }
    }

    let raf = 0;

    function request(){

      if(raf) return;

      raf = requestAnimationFrame(()=>{
        render();
        raf = 0;
      });
    }

    window.addEventListener("scroll",request,{passive:true});
    window.addEventListener("resize",request);

    render();
  }


  /* Section 1 controller */
  createController({
    section:"#vcBudaya",
    items:".vc-budaya .vc-card",
    numbers:".vc-budaya .vc-number",
    segments:".vc-budaya .vc-ring-segment",
    progress:"#vcP1",
    label:"#vcPl1",
    header:"#vcBudayaHeader",
    hint:"#vcHint1"
  });


  /* Section 2 controller */
  createController({
    section:"#vcValues",
    items:".vc-values .vc-value-item",
    progress:"#vcP2",
    label:"#vcPl2",
    hint:"#vcHint2"
  });

})();