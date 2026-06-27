document.addEventListener('DOMContentLoaded',function(){
  const ownerMode = new URLSearchParams(window.location.search).get('owner') === 'demangan2026' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const ownerTools = document.getElementById('owner-tools');
  const fileInput = document.getElementById('img-file-input');
  let currentTarget = null;

  if(ownerTools){
    ownerTools.hidden = !ownerMode;
  }

  if(ownerMode){
    document.querySelectorAll('.owner-trigger').forEach(button=>{
      button.addEventListener('click', ()=>{
        currentTarget = button.dataset.target;
        fileInput.click();
      });
    });
  }

  fileInput.addEventListener('change', e=>{
    const file = e.target.files && e.target.files[0];
    if(!file || !currentTarget) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      const dataUrl = ev.target.result;
      const targetElement = document.querySelector(`[data-image-key="${currentTarget}"]`) || document.getElementById(currentTarget);
      if(targetElement){
        targetElement.src = dataUrl;
      }
      localStorage.setItem(`ecoEnzimAsset:${currentTarget}`, dataUrl);
    };
    reader.readAsDataURL(file);
    fileInput.value='';
  });

  document.querySelectorAll('.editable-image').forEach(img=>{
    const key = img.getAttribute('data-image-key');
    if(!key) return;
    const savedValue = localStorage.getItem(`ecoEnzimAsset:${key}`);
    if(savedValue){
      img.src = savedValue;
    }
    // if this image later fails to load (corrupt), remove local override
    img.addEventListener('error', ()=>{
      try{ localStorage.removeItem(`ecoEnzimAsset:${key}`); }catch(e){}
      // fallback to original asset path if possible (keep existing src)
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));

  const changeVideoBtn = document.getElementById('change-video');
  const iframe = document.getElementById('video-iframe');
  if(changeVideoBtn){
    changeVideoBtn.addEventListener('click',()=>{
      const url = prompt('Tempelkan URL YouTube (mis. https://www.youtube.com/watch?v=VIDEO_ID):');
      if(!url) return;
      const idMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
      const vid = idMatch ? idMatch[1] : null;
      if(vid && iframe) iframe.src = `https://www.youtube.com/embed/${vid}`;
      else alert('URL tidak dikenali. Gunakan URL YouTube yang valid.');
    })
  }

  const waBtn = document.getElementById('whatsapp-btn');
  if(waBtn){
    waBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      const phone = waBtn.dataset.phone || '+628xxxxxxxxxx';
      const text = encodeURIComponent('Halo, Lopyu ‪‪❤︎‬.');
      const link = `https://wa.me/${phone.replace(/[^0-9+]/g,'')}?text=${text}`;
      window.open(link,'_blank');
    })
  }

  // Clear preview (owner mode)
  const clearBtn = document.getElementById('clear-preview');
  if(clearBtn){
    clearBtn.addEventListener('click', ()=>{
      const keys = Object.keys(localStorage).filter(k=>k.startsWith('ecoEnzimAsset:'));
      keys.forEach(k=>localStorage.removeItem(k));
      alert('Preview lokal berhasil dihapus. Halaman akan dimuat ulang.');
      location.reload();
    })
  }
})
