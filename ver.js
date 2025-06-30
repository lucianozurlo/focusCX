      <script>
         const intervalTime = 4000; // ms entre cada avance posterior
         const swipeThreshold = 40; // px para swipe
         const PERSPECTIVE = 1800; // profundidad 3D
         const ANGLE = 25; // inclinación lateral

         /* ---------- Elementos principales ----------------------------- */
         const sectionCX = document.getElementById('serviciox-cx');
         const carousel = sectionCX.querySelector('.carousel');
         const slider = carousel.querySelector('.carousel__slider');
         const items = [...carousel.querySelectorAll('.carousel__slider__item')];
         const prevBtn = carousel.querySelector('.carousel__prev');
         const nextBtn = carousel.querySelector('.carousel__next');

         /* ---------- Estado -------------------------------------------- */
         let currIndex = 1; // 1-based
         let itemWidth = 0;
         let autoPlay = null;
         let startX = null;

         /* ---------- Helpers ------------------------------------------- */
         const resize = () => {
            itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(slider).gap);
            slider.style.width = `${itemWidth * items.length}px`;
            move(currIndex, false); // coloca sin animación
         };

         const move = (index, animate = true) => {
            if (index < 1) index = items.length;
            if (index > items.length) index = 1;
            currIndex = index;

            items.forEach((item, i) => {
               const box = item.querySelector('.item__3d-frame');
               item.classList.toggle('carousel__slider__item--active', i === index - 1);
               box.style.transform =
                  i === index - 1
                     ? `perspective(${PERSPECTIVE}px)`
                     : `perspective(${PERSPECTIVE}px) rotateY(${i < index - 1 ? ANGLE : -ANGLE}deg)`;
            });

            const offset = index * -itemWidth + itemWidth / 2 + carousel.clientWidth / 2;
            if (!animate) slider.style.transition = 'none';
            requestAnimationFrame(() => {
               slider.style.transform = `translate3d(${offset}px,0,0)`;
            });
            if (!animate) setTimeout(() => (slider.style.transition = ''), 17);
         };

         const startAutoplay = (immediate = false) => {
            stopAutoplay();
            if (immediate) move(currIndex + 1); // avanza YA
            autoPlay = setInterval(() => move(currIndex + 1), intervalTime);
         };
         const stopAutoplay = () => clearInterval(autoPlay);

         const prev = () => {
            move(currIndex - 1);
            startAutoplay();
         };
         const next = () => {
            move(currIndex + 1);
            startAutoplay();
         };

         /* ---------- Listeners ----------------------------------------- */
         prevBtn.addEventListener('click', prev);
         nextBtn.addEventListener('click', next);

         items.forEach((item, i) => {
            item.addEventListener('click', () => {
               if (i + 1 !== currIndex) {
                  move(i + 1);
                  startAutoplay();
               }
            });
         });

         /* teclado */
         document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
         });

         /* swipe touch */
         carousel.addEventListener('pointerdown', (e) => (startX = e.clientX));
         carousel.addEventListener('pointerup', (e) => {
            if (startX === null) return;
            const dx = e.clientX - startX;
            if (dx > swipeThreshold) prev();
            if (dx < -swipeThreshold) next();
            startX = null;
         });

         /* responsive */
         new ResizeObserver(resize).observe(carousel);

         /* motion-safe */
         const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
         const updateMotion = () =>
            (slider.style.transitionDuration = reduced.matches ? '0ms' : '1000ms');
         reduced.addEventListener('change', updateMotion);
         updateMotion();

         /* ---------- IntersectionObserver -------------------------------- */
         let isPlaying = false;

         new IntersectionObserver(
            (entries) => {
               entries.forEach((entry) => {
                  if (entry.isIntersecting && !isPlaying) {
                     currIndex = 1; // garantizamos que arrancamos desde 1
                     move(1, true); // animamos al slide 1 (rápido)
                     startAutoplay(true); // avanza INMEDIATO al slide 2 y sigue
                     isPlaying = true;
                  } else if (!entry.isIntersecting && isPlaying) {
                     stopAutoplay(); // pausa fuera de pantalla
                     isPlaying = false;
                  }
               });
            },
            { threshold: 0.35 }
         ).observe(sectionCX);

         /* ---------- Init ---------------------------------------------- */
         resize(); // calcula tamaños sin arrancar animación hasta ser visible
      </script>
