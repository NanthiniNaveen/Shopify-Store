(() => {
  let printrovePalette=[];try{printrovePalette=JSON.parse(document.getElementById('N2DPrintrovePalette')?.textContent||'[]')}catch{}
  const printroveNames=new Set(printrovePalette.map(colour=>colour.name));
  let plainColourImages={};try{plainColourImages=JSON.parse(document.getElementById('N2DPlainColourImages')?.textContent||'{}')}catch{}
  const bindProducts = scope => scope.querySelectorAll('[data-real-product]').forEach(root=>{
    if(root.dataset.productBound)return;root.dataset.productBound='true';
    let variants,chosen;try{variants=JSON.parse(root.dataset.variants);chosen=JSON.parse(root.dataset.currentOptions)}catch{return}
    const productHandle=location.pathname.split('/products/')[1]?.split(/[/?#]/)[0],isWomensTee=productHandle?.endsWith('-womens-tee'),womenSizes=new Set(['XS','S','M','L','XL','2XL','3XL','4XL','5XL']),womenColours=new Set(['White','Royal Blue','Red','Olive Green','Orange','Butter Yellow','Liril Green','Navy Blue','Mustard Yellow','Black','Charcoal Grey','Coffee Brown','Golden Yellow','Iris Lavender','Light Pink','Maroon','Sky Blue','Pink','Melange Grey']);
    if(isWomensTee){root.querySelectorAll('[data-native-size]').forEach(button=>{if(!womenSizes.has(button.dataset.optionValue))button.remove()});root.querySelectorAll('[data-native-colour]').forEach(button=>{if(!womenColours.has(button.dataset.optionValue))button.remove()});root.querySelectorAll('[data-native-option]').forEach(select=>{const sizeGroup=/size/i.test(select.closest('.native-option')?.querySelector('.native-option-label')?.textContent||'');[...select.options].forEach(option=>{if(!(sizeGroup?womenSizes:womenColours).has(option.value))option.remove()})});const fitLine=[...root.querySelectorAll('.details-list p')].find(p=>/Available in .* sizes:/i.test(p.textContent));if(fitLine)fitLine.innerHTML=`Available in 9 sizes: <strong>${[...womenSizes].join(', ')}</strong>`;const reorder=(selector,order)=>{[...root.querySelectorAll(selector)].sort((a,b)=>order.indexOf(a.dataset.optionValue)-order.indexOf(b.dataset.optionValue)).forEach(button=>button.parentElement.appendChild(button))};reorder('[data-native-size]',[...womenSizes]);reorder('[data-native-colour]',[...womenColours])}
    variants.forEach(variant=>{variant.displayTitle=variant.title||variant.options.join(' / ')});
    const cropImages=root.dataset.colourImages?JSON.parse(root.dataset.colourImages):{};
    const colourIndex=Number(root.querySelector('[data-native-colour]')?.dataset.optionIndex);
    const isPrintroveRegular=root.dataset.printroveColours==='true';
    const isRegularModel=root.dataset.regularModel==='true'||isPrintroveRegular;
    if(isPrintroveRegular&&!printroveNames.has(chosen[colourIndex]))chosen[colourIndex]='Black';
    const imageSource=variant=>{const data=variant?.featured_image||variant?.image;return typeof data==='string'?data:data?.src};
    const isGenericPhoto=url=>/d445dd71-d91c-45b9-8484-94c5fa23150b|a73bb79c-c96e-41c4-be18-3b029638edfe|6d14c15a-cabb-4e7e-be86-19ea303347a5|627dfb16-8432-4dbb-972a-0be6f02c8c78/.test(url||'');
    const colourPhoto=(variant,colour)=>{
      const direct=imageSource(variant);
      if(direct&&(!isRegularModel||!isGenericPhoto(direct)))return direct;
      if(!Number.isInteger(colourIndex))return;
      return variants.filter(item=>item.options[colourIndex]===colour).map(imageSource).find(url=>url&&(!isRegularModel||!isGenericPhoto(url)));
    };
    const imageUrl=(variant,colour,userSelected=true)=>{
      if(isRegularModel)return cropImages[colour]||colourPhoto(variant,colour)||root.dataset.referenceImage;
      return (!userSelected&&root.dataset.modelImage)||plainColourImages[productHandle]?.[colour]||cropImages[colour]||colourPhoto(variant,colour);
    };
    if(Number.isInteger(colourIndex)&&!isPrintroveRegular){const seen=new Set();variants.forEach(variant=>{const url=imageUrl(variant,variant.options[colourIndex]);if(url&&!seen.has(url)){seen.add(url);const preload=new Image();preload.src=url}})}
    const galleryReplacement=plainColourImages[productHandle]?.__galleryReplacement;
    if(galleryReplacement)root.querySelectorAll('[data-media-src*="627dfb16-8432-4dbb-972a-0be6f02c8c78"]').forEach(button=>{button.dataset.mediaSrc=galleryReplacement;button.dataset.mediaAlt='Model wearing the plain Regular Essential T-shirt';const image=button.querySelector('img');if(image){image.src=galleryReplacement;image.srcset='';image.alt=button.dataset.mediaAlt}});
    const colours={black:'#181a1b',white:'#f2eee4',ivory:'#e9e1d0',offwhite:'#e9e1d0',cream:'#e9e1d0',navy:'#263346',navyblue:'#263346',maroon:'#5c2837',burgundy:'#5c2837',wine:'#5c2837',forest:'#2e4439',forestgreen:'#2e4439',green:'#2e4439',charcoal:'#414347',charcoalgrey:'#414347',charcoalgray:'#414347',grey:'#717373',gray:'#717373',melangegrey:'#b0ada8',melangegray:'#b0ada8',ashgrey:'#9aa0a3',blue:'#34578a',royalblue:'#2d4fa3',skyblue:'#a8cbe8',smokeblue:'#7e93a8',slateblue:'#6a7f9a',red:'#963a35',brickred:'#a04433',brick:'#a04433',beige:'#c8b898',sand:'#c8b898',almond:'#e0cca6',brown:'#51372e',chocolate:'#51372e',chocolatebrown:'#51372e',coffeebrown:'#46332a',sage:'#9eada0',olivegreen:'#5a6247',lirilgreen:'#86a97d',dustyrose:'#c69b9d',pasteldusty:'#c9a9a8',lavender:'#b6a9ca',irislavender:'#b3a0d4',lightpink:'#f3c8d6',pink:'#f3c8d6',butteryellow:'#f4df8e',goldenyellow:'#f0b429',mustardyellow:'#d39e2a',orange:'#e08a3c'};
    printrovePalette.forEach(colour=>{colours[colour.name.toLowerCase().replace(/[^a-z]/g,'')]=colour.hex;});
    root.querySelectorAll('[data-native-colour]').forEach(button=>{const value=button.dataset.optionValue,key=value.toLowerCase().replace(/[^a-z]/g,'');if(!button.getAttribute('style')&&colours[key])button.style.setProperty('--option-colour',colours[key]);});
    const set=(index,value,userSelected)=>{
      chosen[index]=value;
      const variant=variants.find(v=>v.options.every((option,i)=>option===chosen[i]));
      root.querySelectorAll('[data-native-colour]').forEach(button=>button.setAttribute('aria-pressed',String(chosen[Number(button.dataset.optionIndex)]===button.dataset.optionValue)));
      root.querySelectorAll('[data-native-size]').forEach(button=>button.setAttribute('aria-pressed',String(chosen[Number(button.dataset.optionIndex)]===button.dataset.optionValue)));
      root.querySelectorAll('[data-native-option]').forEach(select=>select.value=chosen[Number(select.dataset.optionIndex)]);
      if(!variant){
        if(isRegularModel){
          const colour=chosen[colourIndex],image=document.getElementById(root.dataset.realImageId),url=cropImages[colour];
          if(url&&image){image.srcset='';image.src=url;image.alt=`${root.querySelector('h1').textContent.trim()} in ${colour}`;}
          const note=root.querySelector('[data-variant-image-note]');if(note)note.hidden=Boolean(url);
          root.querySelectorAll('[data-media-colour]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mediaColour===colour)));
          const variantSelect=root.querySelector('[data-variant-select]');if(variantSelect)variantSelect.value='';
          const current=new URL(location.href);current.searchParams.delete('variant');history.replaceState(null,'',current.toString());
        }
        const label=root.querySelector('[data-real-variant-label]'),button=root.querySelector('[data-add-button]'),price=root.querySelector('[data-product-price]');if(label)label.textContent='This colour and size combination is not available.';if(button){button.disabled=true;button.textContent='Unavailable'}if(price)price.textContent='—';return;}
      const select=root.querySelector('[data-variant-select]');if(select){select.value=String(variant.id);select.dispatchEvent(new Event('change',{bubbles:true}));}
      if(isPrintroveRegular){const add=root.querySelector('[data-add-button]');if(add){add.disabled=!variant.available;add.textContent=variant.available?'Add to bag':'Unavailable';}}
      const label=root.querySelector('[data-real-variant-label]');if(label)label.textContent=variant.displayTitle||variant.title;
      const image=document.getElementById(root.dataset.realImageId),note=root.querySelector('[data-variant-image-note]');
      const imageData=variant.featured_image||variant.image,colourButton=root.querySelector('[data-native-colour]'),colour=colourButton?chosen[Number(colourButton.dataset.optionIndex)]:null,url=imageUrl(variant,colour,userSelected);
      if(url&&image){
        image.srcset='';image.src=url;
        const showingModel=url===root.dataset.modelImage;
        image.alt=isRegularModel?`${root.querySelector('h1').textContent.trim()} in ${colour}`:showingModel?(root.dataset.modelAlt||image.alt)+(root.dataset.modelColour?' in '+root.dataset.modelColour:''):(imageData?.alt||variant.name||variant.title);
        if(note){
          const differentColour=isRegularModel&&showingModel&&root.dataset.modelColour.toLowerCase()!==String(colour).toLowerCase();
          note.hidden=!differentColour;
          if(differentColour)note.textContent=`Model shown in ${root.dataset.modelColour}. Selected: ${colour}. A photo of the selected colour is not available${colourPhoto(variant,colour)?' in this model view':''}.`;
          if(differentColour&&colourPhoto(variant,colour))note.textContent=`Model shown in ${root.dataset.modelColour}. Select ${colour} to view its colour photo.`;
        }
      }else{if(image&&root.dataset.referenceImage){image.srcset='';image.src=root.dataset.referenceImage;image.alt='Collection reference image'}if(note)note.hidden=false;}
      root.querySelectorAll('[data-media-colour]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mediaColour===colour)));
      const current=new URL(location.href);current.searchParams.set('variant',variant.id);history.replaceState(null,'',current.toString());
    };
    root.querySelectorAll('[data-native-colour]').forEach(button=>button.addEventListener('click',()=>set(Number(button.dataset.optionIndex),button.dataset.optionValue,true)));
    root.querySelectorAll('[data-native-size]').forEach(button=>button.addEventListener('click',()=>set(Number(button.dataset.optionIndex),button.dataset.optionValue,true)));
    root.querySelectorAll('[data-native-option]').forEach(select=>select.addEventListener('change',()=>set(Number(select.dataset.optionIndex),select.value,true)));
    const initialColour=root.querySelector('[data-native-colour]');if(initialColour)set(Number(initialColour.dataset.optionIndex),chosen[Number(initialColour.dataset.optionIndex)],new URL(location.href).searchParams.has('variant'));
    root.querySelector('form[action*="/cart/add"]')?.addEventListener('submit',event=>{const variant=variants.find(v=>v.options.every((option,i)=>option===chosen[i]));if(!variant?.available){event.preventDefault();const label=root.querySelector('[data-real-variant-label]');if(label)label.textContent='This colour and size combination is not available.'}});
  });
  const bind = root => {
    window.N2DGarments?.hydrate(root);bindProducts(root);
    root.querySelectorAll('.cart-row').forEach(row=>{const link=row.querySelector('h3 a'),image=row.querySelector('img'),variant=row.querySelector('.muted')?.textContent||'',handle=link?.getAttribute('href')?.split('/products/')[1]?.split(/[/?#]/)[0],colour=variant.split('/').pop()?.trim(),url=plainColourImages[handle]?.[colour];if(image&&url){image.src=url;image.srcset='';image.alt=`${link.textContent.trim()} in ${colour}`}});
    const menu=root.querySelector('[data-mobile-menu]');
    const toggle=root.querySelector('[data-menu-toggle]');
    const closer=root.querySelector('[data-menu-close]');
    if(menu&&toggle&&!toggle.dataset.bound){
      toggle.dataset.bound='true';
      const set=open=>{menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);if(open)closer.focus();else toggle.focus()};
      toggle.addEventListener('click',()=>set(true));closer.addEventListener('click',()=>set(false));
      menu.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
      document.addEventListener('keydown',e=>{if(menu.hidden)return;if(e.key==='Escape'){set(false);return}if(e.key==='Tab'){const items=[...menu.querySelectorAll('a,button')];const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
    }
    root.querySelectorAll('[data-media-src]').forEach(button=>{if(button.dataset.bound)return;button.dataset.bound='true';button.addEventListener('click',()=>{const productRoot=button.closest('[data-real-product]');if(button.dataset.mediaColour&&productRoot){const swatch=[...productRoot.querySelectorAll('[data-native-colour]')].find(item=>item.dataset.optionValue===button.dataset.mediaColour);if(swatch){swatch.click();return}}const target=document.getElementById(button.dataset.mediaTarget);if(target){target.srcset='';target.src=button.dataset.mediaSrc;target.alt=button.dataset.mediaAlt||'';const productRoot=button.closest('[data-real-product]'),note=productRoot?.querySelector('[data-variant-image-note]');if(note&&productRoot.dataset.regularModel==='true'){const model=button.dataset.mediaSrc===productRoot.dataset.modelImage;note.hidden=!model;if(model)note.textContent=`Model shown in ${productRoot.dataset.modelColour}. Use the colour buttons to select your T-shirt colour.`}}})});
    root.querySelectorAll('[data-sort-select]').forEach(select=>{if(select.dataset.bound)return;select.dataset.bound='true';select.addEventListener('change',()=>{const url=new URL(location.href);url.searchParams.set('sort_by',select.value);location.href=url.toString()})});
    root.querySelectorAll('[data-variant-select]').forEach(select=>{if(select.dataset.bound)return;select.dataset.bound='true';select.addEventListener('change',()=>{const form=select.closest('form'),option=select.selectedOptions[0],button=form.querySelector('[data-add-button]'),price=document.querySelector('[data-product-price]');if(button){const available=option.dataset.available==='true';button.disabled=!available;button.textContent=available?'Add to bag':'Unavailable'}if(price&&option.dataset.price){const cmp=option.dataset.compare;price.innerHTML=cmp?`<strong class="sale-price">${option.dataset.price}</strong> <span class="price-was">${cmp}</span> <span class="offer-badge">Diwali offer</span>`:option.dataset.price}})});
    root.querySelectorAll('[data-study-open]').forEach(button=>{if(button.dataset.bound)return;button.dataset.bound='true';button.addEventListener('click',()=>{const dialog=document.getElementById('study-dialog');if(dialog){dialog.querySelector('h2').textContent=button.dataset.studyTitle;const img=dialog.querySelector('img');img.src=button.dataset.studyImage;img.alt=button.dataset.studyTitle+' design study';img.style.backgroundColor=button.dataset.studyColour==='light'?'#e8dfcc':'transparent';dialog.showModal()}})});
    root.querySelectorAll('[data-dialog-close]').forEach(button=>{if(button.dataset.bound)return;button.dataset.bound='true';button.addEventListener('click',()=>button.closest('dialog').close())});
  };
  window.N2D={bind};document.addEventListener('DOMContentLoaded',()=>bind(document));document.addEventListener('shopify:section:load',event=>bind(event.target));
})();

/* Keep mobile colour selection compact, visible, and one-tap. */
(() => {
  const enhance = scope => scope.querySelectorAll('[data-real-product]').forEach(root => {
    if (root.dataset.mobileColourBound) return;
    const group = root.querySelector('.native-colours');
    const buttons = [...root.querySelectorAll('[data-native-colour]')];
    if (!group || !buttons.length) return;
    root.dataset.mobileColourBound = 'true';
    const current = document.createElement('strong');
    current.className = 'mobile-colour-current';
    const update = button => {
      current.textContent = button.dataset.optionValue;
      if(matchMedia('(max-width:720px)').matches)button.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'});
    };
    const selected = buttons.find(button => button.getAttribute('aria-pressed') === 'true') || buttons[0];
    current.textContent = selected.dataset.optionValue;
    const optionsRoot=group.closest('[data-native-options]');
    if(optionsRoot)optionsRoot.insertBefore(group.closest('.native-option'),optionsRoot.firstChild);
    buttons.forEach(button => {
      button.setAttribute('aria-label', button.dataset.optionValue);
      button.addEventListener('click', () => update(button));
    });
    group.insertAdjacentElement('beforebegin', current);
  });
  document.addEventListener('DOMContentLoaded', () => enhance(document));
  document.addEventListener('shopify:section:load', event => enhance(event.target));
})();

/* Keep product thumbnails in one compact, navigable rail at every viewport. */
(() => {
  const arrow = direction => direction === 'previous'
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  const enhance = scope => scope.querySelectorAll('.media-thumbs').forEach(rail => {
    if (rail.dataset.carouselBound) return;
    rail.dataset.carouselBound = 'true';
    const shell = document.createElement('div');
    shell.className = 'media-carousel-shell';
    rail.parentNode.insertBefore(shell, rail);
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'media-carousel-button';
    previous.setAttribute('aria-label', 'Previous product images');
    previous.innerHTML = arrow('previous');
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'media-carousel-button';
    next.setAttribute('aria-label', 'Next product images');
    next.innerHTML = arrow('next');
    shell.append(previous, rail, next);
    previous.addEventListener('click', () => rail.scrollBy({left:-Math.max(240,rail.clientWidth*.72),behavior:'smooth'}));
    next.addEventListener('click', () => rail.scrollBy({left:Math.max(240,rail.clientWidth*.72),behavior:'smooth'}));
  });
  document.addEventListener('DOMContentLoaded', () => enhance(document));
  document.addEventListener('shopify:section:load', event => enhance(event.target));
})();
