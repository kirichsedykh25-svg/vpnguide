export function withMetrika(html,counterId){
 const id=Number(counterId);if(!Number.isSafeInteger(id)||id<=0)throw Error('Real Yandex Metrika counter id required');
 if(html.includes('mc.yandex.ru/metrika/tag.js?id='+id))return html;
 const tag=`<!-- Yandex.Metrika counter --><script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${id}','ym');ym(${id},'init',{ssr:true,clickmap:true,referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});</script><!-- /Yandex.Metrika counter -->`;
 const noscript=`<noscript><div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute;left:-9999px;" alt=""/></div></noscript>`;
 return html.replace('</head>',tag+'</head>').replace(/(<body\b[^>]*>)/i,'$1'+noscript);
}
