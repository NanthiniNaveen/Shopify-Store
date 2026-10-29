(() => {
 const labels={model:'Model',front:'Front',back:'Back',side:'Side · fit reference',sleeve:'Sleeve · fit reference',zoom:'Print zoom'};
 const keys=Object.keys(labels);
 const src=value=>/^(https?:|data:|\/\/|assets\/|file:)/.test(value)?value:'assets/'+value;
 const esc=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function image(root,key){
  const g=window.N2DGarments,s=g.study(root.dataset.studyId),fit=root.dataset.fit,colour=key==='model'&&s.kind!=='artwork'?(s.worn?.[fit]?.[root.dataset.colour]?root.dataset.colour:g.palette(s).find(k=>s.worn?.[fit]?.[k])||root.dataset.colour):root.dataset.colour;
  if(key==='side'||key==='sleeve'){const file=window.N2D_GALLERY_DETAILS?.[fit]?.[key];return file?`<img class="garment-finished-photo gallery-reference-photo" src="${esc(src(file))}" alt="${fit==='regular'?'Regular':'Oversized'} black T-shirt ${esc(labels[key])}">`:''}
  const mode=key==='model'?'model':'tshirt',view=key==='front'||key==='back'?key:g.printedSide(fit);
  const native=key==='model'?s:{...s,mockups:undefined,worn:undefined};
  const holder=document.createElement('div');holder.innerHTML=g.render(native,{fit,colour,view,mode,controls:false});
  const stage=holder.querySelector('.garment-stage');
  if(key==='zoom'){
   const svg=stage.querySelector('svg'),box=g.getPlacement(fit,s.id),ratio=(g.colours[colour].ink==='light'&&s.light_image?s.light_art_ratio:s.art_ratio)||1,width=Math.min(box.w,box.h*ratio),height=width/ratio,pad=Math.max(width,height)*.08;
   if(svg){svg.setAttribute('viewBox',`${box.x+(box.w-width)/2-pad} ${box.y+(box.h-height)/2-pad} ${width+pad*2} ${height+pad*2}`);svg.classList.add('garment-print-zoom');svg.setAttribute('aria-label',`${s.title} print close-up on ${g.colours[colour].name} ${fit} T-shirt`)}
  }
  return stage.innerHTML;
 }
 function hasModel(root){const s=window.N2DGarments.study(root.dataset.studyId);return s?.kind==='artwork'?Boolean(window.N2D_MODEL_PHOTOS?.[root.dataset.fit]?.photo):Boolean(s?.worn?.[root.dataset.fit]?.[root.dataset.colour])}
 function refresh(root){
  let key=root.dataset.gallerySelection|| (root.dataset.mode==='model'?'model':root.dataset.view);
  if(key==='zoom'&&window.N2DGarments.study(root.dataset.studyId)?.kind==='plain')key=root.dataset.view;
  if(key==='model'&&!hasModel(root))key=root.dataset.view;
  root.dataset.gallerySelection=key;
  root.querySelectorAll('[data-gallery-picture]').forEach(button=>{
   const kind=button.dataset.galleryPicture;button.setAttribute('aria-pressed',String(kind===key));
   button.querySelector('.gallery-thumb-picture').innerHTML=image(root,kind);
   if(kind==='model')button.disabled=!hasModel(root)
  });
  root.querySelector('.garment-stage').innerHTML=image(root,key);
  const caption=root.querySelector('[data-garment-side-label]');
  if(caption){const fitLabel=root.dataset.fit==='regular'?'Regular':'Oversized',plain=window.N2DGarments.study(root.dataset.studyId)?.kind==='plain';caption.textContent=key==='side'||key==='sleeve'?`${fitLabel} · black ${labels[key].toLowerCase()}`:key==='zoom'?`${fitLabel} · print zoom · ${window.N2DGarments.colours[root.dataset.colour].name}`:`${fitLabel} · ${!plain&&root.dataset.view===window.N2DGarments.printedSide(root.dataset.fit)?'printed':'plain'} ${root.dataset.view}`}
 }
 function select(root,key){
  if(key==='model')root.querySelector('[data-garment-mode="model"]')?.click();
  else if(key==='front'||key==='back')root.querySelector(`[data-garment-view="${key}"]`)?.click();
  root.dataset.gallerySelection=key;refresh(root);
  root.dispatchEvent(new CustomEvent('n2d:gallerychange',{bubbles:true,detail:{photo:key,colour:root.dataset.colour,fit:root.dataset.fit}}));
 }
 function mount(root,selection){
  if(!root||root.dataset.galleryMounted)return;root.dataset.galleryMounted='true';root.dataset.gallerySelection=keys.includes(selection)?selection:root.dataset.mode==='model'?'model':root.dataset.view;
  const stage=root.querySelector('.garment-stage'),layout=document.createElement('div');layout.className='product-picture-gallery';
  const rail=document.createElement('div');rail.className='product-thumbnail-rail';rail.setAttribute('role','group');rail.setAttribute('aria-label','Product photographs');
  const choices=window.N2DGarments.study(root.dataset.studyId)?.kind==='plain'?keys.filter(key=>key!=='zoom'):keys;
  rail.innerHTML=choices.map(key=>`<button type="button" class="product-picture-thumb" data-gallery-picture="${key}" aria-label="View ${labels[key]}" aria-pressed="false"><span class="gallery-thumb-picture"></span><span class="gallery-thumb-label">${labels[key]}</span></button>`).join('');
  stage.before(layout);layout.append(rail,stage);
  rail.addEventListener('click',event=>{const button=event.target.closest('[data-gallery-picture]');if(button&&!button.disabled)select(root,button.dataset.galleryPicture)});
  rail.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const buttons=[...rail.querySelectorAll('button:not(:disabled)')],index=buttons.indexOf(event.target);if(index<0)return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(['ArrowUp','ArrowLeft'].includes(event.key)?-1:1)+buttons.length)%buttons.length;buttons[next].focus();select(root,buttons[next].dataset.galleryPicture)});
  root.addEventListener('n2d:colourchange',()=>refresh(root));root.addEventListener('n2d:viewchange',event=>{root.dataset.gallerySelection=event.detail.view;refresh(root)});
  refresh(root);
 }
 window.N2DGallery={mount};
})();
