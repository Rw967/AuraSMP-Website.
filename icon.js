const AURA_ICON = 'assets/media/aura-logo.png';

function setAuraIcon(){
  let icon = document.querySelector('link[rel="icon"]');
  if(!icon){
    icon = document.createElement('link');
    icon.rel = 'icon';
    document.head.appendChild(icon);
  }
  icon.href = AURA_ICON;
}

setAuraIcon();
