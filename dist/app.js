(function(){
  const views = Array.from(document.querySelectorAll('.view'));
  const homeButtons = document.querySelectorAll('.js-home');
  const goButtons = document.querySelectorAll('.js-go');

  function showView(name, pushState = true){
    const target = views.find(v => v.dataset.view === name) || views[0];
    views.forEach(v => v.classList.remove('active'));
    target.classList.add('active');
    const hash = name === 'inicio' ? '#inicio' : '#'+name;
    if(pushState){ history.pushState({view:name}, '', hash); }
    window.scrollTo({top:0, behavior:'smooth'});
  }

  goButtons.forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  homeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('inicio');
    });
  });

  window.addEventListener('popstate', () => {
    const current = location.hash.replace('#','') || 'inicio';
    showView(current, false);
  });

  const initial = location.hash.replace('#','') || 'inicio';
  showView(initial, false);
})();
