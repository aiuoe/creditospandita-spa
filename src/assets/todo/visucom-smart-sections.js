/* Swipe Box */ 
(function(w){ var ua = navigator.userAgent; if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf( "AppleWebKit" ) > -1 ) ){ return; } var doc = w.document; if( !doc.querySelector ){ return; } var meta = doc.querySelector( "meta[name=viewport]" ), initialContent = meta && meta.getAttribute( "content" ), disabledZoom = initialContent + ",maximum-scale=1", enabledZoom = initialContent + ",maximum-scale=10", enabled = true, x, y, z, aig; if( !meta ){ return; } function restoreZoom(){ meta.setAttribute( "content", enabledZoom ); enabled = true; } function disableZoom(){ meta.setAttribute( "content", disabledZoom ); enabled = false; } function checkTilt( e ){ aig = e.accelerationIncludingGravity; x = Math.abs( aig.x ); y = Math.abs( aig.y ); z = Math.abs( aig.z ); if( (!w.orientation || w.orientation === 180) && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){ if( enabled ){ disableZoom(); } } else if( !enabled ){ restoreZoom(); } } w.addEventListener( "orientationchange", restoreZoom, false ); w.addEventListener( "devicemotion", checkTilt, false ); })( this ); ;( function ( window, document, $, undefined ) { $.swipebox = function( elem, options ) { var ui, defaults = { useCSS : true, useSVG : true, initialIndexOnArray : 0, removeBarsOnMobile : false, hideCloseButtonOnMobile : false, hideBarsDelay : 3000, videoMaxWidth : 1140, vimeoColor : 'cccccc', beforeOpen: null, afterOpen: null, afterClose: null, afterMedia: null, nextSlide: null, prevSlide: null, loopAtEnd: false, autoplayVideos: false, queryStringData: {}, toggleClassOnLoad: '' },  plugin = this, elements = [], $elem, selector = elem.selector, isMobile = navigator.userAgent.match( /(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i ), isTouch = isMobile !== null || document.createTouch !== undefined || ( 'ontouchstart' in window ) || ( 'onmsgesturechange' in window ) || navigator.msMaxTouchPoints, supportSVG = !! document.createElementNS && !! document.createElementNS( 'http://www.w3.org/2000/svg', 'svg').createSVGRect, winWidth = window.innerWidth ? window.innerWidth : $( window ).width(), winHeight = window.innerHeight ? window.innerHeight : $( window ).height(), currentX = 0, html = '<div id="swipebox-overlay">\ <div id="swipebox-container">\ <div id="swipebox-slider"></div>\ <div id="swipebox-top-bar">\ <div id="swipebox-title"></div>\ </div>\ <div id="swipebox-bottom-bar">\ <div id="swipebox-arrows">\ <a id="swipebox-prev"></a>\ <a id="swipebox-next"></a>\ </div>\ </div>\ <a id="swipebox-close"></a>\ </div>\ </div>'; plugin.settings = {}; $.swipebox.close = function () { ui.closeSlide(); }; $.swipebox.extend = function () { return ui; }; plugin.init = function() { plugin.settings = $.extend( {}, defaults, options ); if ( $.isArray( elem ) ) { elements = elem; ui.target = $( window ); ui.init( plugin.settings.initialIndexOnArray ); } else { $( document ).on( 'click', selector, function( event ) { if ( event.target.parentNode.className === 'slide current' ) { return false; } if ( ! $.isArray( elem ) ) { ui.destroy(); $elem = $( selector ); ui.actions(); } elements = []; var index, relType, relVal; if ( ! relVal ) { relType = 'data-rel'; relVal = $( this ).attr( relType ); } if ( ! relVal ) { relType = 'rel'; relVal = $( this ).attr( relType ); } if ( relVal && relVal !== '' && relVal !== 'nofollow' ) { $elem = $( selector ).filter( '[' + relType + '="' + relVal + '"]' ); } else { $elem = $( selector ); } $elem.each( function() { var title = null, href = null; data = null; if ( $( this ).attr( 'title' ) ) { title = $( this ).attr( 'title' ); } if ( $( this ).attr( 'href' ) ) { href = $( this ).attr( 'href' ); } if ( $( this ).attr( 'data' ) ) { data = $( this ).attr( 'data' ); } elements.push( { href: href, title: title, data: data } ); } ); index = $elem.index( $( this ) ); event.preventDefault(); event.stopPropagation(); ui.target = $( event.target ); ui.init( index ); } ); } }; ui = { init : function( index ) { if ( plugin.settings.beforeOpen ) { plugin.settings.beforeOpen(); } this.target.trigger( 'swipebox-start' ); $.swipebox.isOpen = true; this.build(); this.openSlide( index ); this.openMedia( index ); this.preloadMedia( index+1 ); this.preloadMedia( index-1 ); if ( plugin.settings.afterOpen ) { plugin.settings.afterOpen(index); } }, build : function () { var $this = this, bg; $( 'body' ).append( html ); if ( supportSVG && plugin.settings.useSVG === true ) { bg = $( '#swipebox-close' ).css( 'background-image' ); bg = bg.replace( 'png', 'svg' ); $( '#swipebox-prev, #swipebox-next, #swipebox-close' ).css( { 'background-image' : bg } ); } if ( isMobile && plugin.settings.removeBarsOnMobile ) { $( '#swipebox-bottom-bar, #swipebox-top-bar' ).remove(); } $.each( elements, function() { $( '#swipebox-slider' ).append( '<div class="slide"></div>' ); } ); $this.setDim(); $this.actions(); if ( isTouch ) { $this.gesture(); } $this.keyboard(); $this.animBars(); $this.resize(); }, setDim : function () { var width, height, sliderCss = {}; if ( 'onorientationchange' in window ) { window.addEventListener( 'orientationchange', function() { if ( window.orientation === 0 ) { width = winWidth; height = winHeight; } else if ( window.orientation === 90 || window.orientation === -90 ) { width = winHeight; height = winWidth; } }, false ); } else { width = window.innerWidth ? window.innerWidth : $( window ).width(); height = window.innerHeight ? window.innerHeight : $( window ).height(); } sliderCss = { width : width, height : height }; $( '#swipebox-overlay' ).css( sliderCss ); }, resize : function () { var $this = this; $( window ).resize( function() { $this.setDim(); } ).resize(); }, supportTransition : function () { var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition'.split( ' ' ), i; for ( i = 0; i < prefixes.length; i++ ) { if ( document.createElement( 'div' ).style[ prefixes[i] ] !== undefined ) { return prefixes[i]; } } return false; }, doCssTrans : function () { if ( plugin.settings.useCSS && this.supportTransition() ) { return true; } }, gesture : function () { var $this = this, index, hDistance, vDistance, hDistanceLast, vDistanceLast, hDistancePercent, vSwipe = false, hSwipe = false, hSwipMinDistance = 10, vSwipMinDistance = 50, startCoords = {}, endCoords = {}, bars = $( '#swipebox-top-bar, #swipebox-bottom-bar' ), slider = $( '#swipebox-slider' ); bars.addClass( 'visible-bars' ); $this.setTimeout(); $( 'body' ).bind( 'touchstart', function( event ) { $( this ).addClass( 'touching' ); index = $( '#swipebox-slider .slide' ).index( $( '#swipebox-slider .slide.current' ) ); endCoords = event.originalEvent.targetTouches[0]; startCoords.pageX = event.originalEvent.targetTouches[0].pageX; startCoords.pageY = event.originalEvent.targetTouches[0].pageY; $( '#swipebox-slider' ).css( { '-webkit-transform' : 'translate3d(' + currentX +'%, 0, 0)', 'transform' : 'translate3d(' + currentX + '%, 0, 0)' } ); $( '.touching' ).bind( 'touchmove',function( event ) { event.preventDefault(); event.stopPropagation(); endCoords = event.originalEvent.targetTouches[0]; if ( ! hSwipe ) { vDistanceLast = vDistance; vDistance = endCoords.pageY - startCoords.pageY; if ( Math.abs( vDistance ) >= vSwipMinDistance || vSwipe ) { var opacity = 0.75 - Math.abs(vDistance) / slider.height(); slider.css( { 'top': vDistance + 'px' } ); slider.css( { 'opacity': opacity } ); vSwipe = true; } } hDistanceLast = hDistance; hDistance = endCoords.pageX - startCoords.pageX; hDistancePercent = hDistance * 100 / winWidth; if ( ! hSwipe && ! vSwipe && Math.abs( hDistance ) >= hSwipMinDistance ) { $( '#swipebox-slider' ).css( { '-webkit-transition' : '', 'transition' : '' } ); hSwipe = true; } if ( hSwipe ) { if ( 0 < hDistance ) { if ( 0 === index ) {     $( '#swipebox-overlay' ).addClass( 'leftSpringTouch' ); } else { $( '#swipebox-overlay' ).removeClass( 'leftSpringTouch' ).removeClass( 'rightSpringTouch' );   $( '#swipebox-slider' ).css( {    '-webkit-transform' : 'translate3d(' + ( currentX + hDistancePercent ) +'%, 0, 0)',     'transform' : 'translate3d(' + ( currentX + hDistancePercent ) + '%, 0, 0)'   } ); } } else if ( 0 > hDistance ) { if ( elements.length === index +1 ) {  $( '#swipebox-overlay' ).addClass( 'rightSpringTouch' ); } else {   $( '#swipebox-overlay' ).removeClass( 'leftSpringTouch' ).removeClass( 'rightSpringTouch' );  $( '#swipebox-slider' ).css( {    '-webkit-transform' : 'translate3d(' + ( currentX + hDistancePercent ) +'%, 0, 0)',     'transform' : 'translate3d(' + ( currentX + hDistancePercent ) + '%, 0, 0)'   } ); } } } } ); return false; } ).bind( 'touchend',function( event ) { event.preventDefault(); event.stopPropagation(); $( '#swipebox-slider' ).css( { '-webkit-transition' : '-webkit-transform 0.4s ease', 'transition' : 'transform 0.4s ease' } ); vDistance = endCoords.pageY - startCoords.pageY; hDistance = endCoords.pageX - startCoords.pageX; hDistancePercent = hDistance*100/winWidth; if ( vSwipe ) { vSwipe = false; if ( Math.abs( vDistance ) >= 2 * vSwipMinDistance && Math.abs( vDistance ) > Math.abs( vDistanceLast ) ) { var vOffset = vDistance > 0 ? slider.height() : - slider.height(); slider.animate( { top: vOffset + 'px', 'opacity': 0 }, 300, function () {  $this.closeSlide(); } ); } else { slider.animate( { top: 0, 'opacity': 1 }, 300 ); } } else if ( hSwipe ) { hSwipe = false; if( hDistance >= hSwipMinDistance && hDistance >= hDistanceLast) { $this.getPrev(); } else if ( hDistance <= -hSwipMinDistance && hDistance <= hDistanceLast) { $this.getNext(); } } else { if ( ! bars.hasClass( 'visible-bars' ) ) { $this.showBars(); $this.setTimeout(); } else { $this.clearTimeout(); $this.hideBars(); } } $( '#swipebox-slider' ).css( { '-webkit-transform' : 'translate3d(' + currentX + '%, 0, 0)', 'transform' : 'translate3d(' + currentX + '%, 0, 0)' } ); $( '#swipebox-overlay' ).removeClass( 'leftSpringTouch' ).removeClass( 'rightSpringTouch' ); $( '.touching' ).off( 'touchmove' ).removeClass( 'touching' ); } ); }, setTimeout: function () { if ( plugin.settings.hideBarsDelay > 0 ) { var $this = this; $this.clearTimeout(); $this.timeout = window.setTimeout( function() { $this.hideBars(); }, plugin.settings.hideBarsDelay ); } }, clearTimeout: function () { window.clearTimeout( this.timeout ); this.timeout = null; }, showBars : function () { var bars = $( '#swipebox-top-bar, #swipebox-bottom-bar' ); if ( this.doCssTrans() ) { bars.addClass( 'visible-bars' ); } else { $( '#swipebox-top-bar' ).animate( { top : 0 }, 500 ); $( '#swipebox-bottom-bar' ).animate( { bottom : 0 }, 500 ); setTimeout( function() { bars.addClass( 'visible-bars' ); }, 1000 ); } }, hideBars : function () { var bars = $( '#swipebox-top-bar, #swipebox-bottom-bar' ); if ( this.doCssTrans() ) { bars.removeClass( 'visible-bars' ); } else { $( '#swipebox-top-bar' ).animate( { top : '-50px' }, 500 ); $( '#swipebox-bottom-bar' ).animate( { bottom : '-50px' }, 500 ); setTimeout( function() { bars.removeClass( 'visible-bars' ); }, 1000 ); } }, animBars : function () { var $this = this, bars = $( '#swipebox-top-bar, #swipebox-bottom-bar' ); bars.addClass( 'visible-bars' ); $this.setTimeout(); $( '#swipebox-slider' ).click( function() { if ( ! bars.hasClass( 'visible-bars' ) ) { $this.showBars(); $this.setTimeout(); } } ); $( '#swipebox-bottom-bar' ).hover( function() { $this.showBars(); bars.addClass( 'visible-bars' ); $this.clearTimeout(); }, function() { if ( plugin.settings.hideBarsDelay > 0 ) { bars.removeClass( 'visible-bars' ); $this.setTimeout(); } } ); }, keyboard : function () { var $this = this; $( window ).bind( 'keyup', function( event ) { event.preventDefault(); event.stopPropagation(); if ( event.keyCode === 37 ) { $this.getPrev(); } else if ( event.keyCode === 39 ) { $this.getNext(); } else if ( event.keyCode === 27 ) { $this.closeSlide(); } } ); }, actions : function () { var $this = this, action = 'touchend click'; if ( elements.length < 2 ) { $( '#swipebox-bottom-bar' ).hide(); if ( undefined === elements[ 1 ] ) { $( '#swipebox-top-bar' ).hide(); } } else { $( '#swipebox-prev' ).bind( action, function( event ) { event.preventDefault(); event.stopPropagation(); $this.getPrev(); $this.setTimeout(); } ); $( '#swipebox-next' ).bind( action, function( event ) { event.preventDefault(); event.stopPropagation(); $this.getNext(); $this.setTimeout(); } ); } $( '#swipebox-close' ).bind( action, function() { $this.closeSlide(); } ); }, setSlide : function ( index, isFirst ) { isFirst = isFirst || false; var slider = $( '#swipebox-slider' ); currentX = -index*100; if ( this.doCssTrans() ) { slider.css( { '-webkit-transform' : 'translate3d(' + (-index*100)+'%, 0, 0)', 'transform' : 'translate3d(' + (-index*100)+'%, 0, 0)' } ); } else { slider.animate( { left : ( -index*100 )+'%' } ); } $( '#swipebox-slider .slide' ).removeClass( 'current' ); $( '#swipebox-slider .slide' ).eq( index ).addClass( 'current' ); this.setTitle( index ); if ( isFirst ) { slider.fadeIn(); } $( '#swipebox-prev, #swipebox-next' ).removeClass( 'disabled' ); if ( index === 0 ) { $( '#swipebox-prev' ).addClass( 'disabled' ); } else if ( index === elements.length - 1 && plugin.settings.loopAtEnd !== true ) { $( '#swipebox-next' ).addClass( 'disabled' ); } }, openSlide : function ( index ) { $( 'html' ).addClass( 'swipebox-html' ); if ( isTouch ) { $( 'html' ).addClass( 'swipebox-touch' ); if ( plugin.settings.hideCloseButtonOnMobile ) { $( 'html' ).addClass( 'swipebox-no-close-button' ); } } else { $( 'html' ).addClass( 'swipebox-no-touch' ); } $( window ).trigger( 'resize' ); this.setSlide( index, true ); }, preloadMedia : function ( index ) { var $this = this, src = null; if ( elements[ index ] !== undefined ) { src = elements[ index ].href; } if ( ! $this.isVideo( src ) ) { setTimeout( function() { $this.openMedia( index ); }, 1000); } else { $this.openMedia( index ); } }, openMedia : function ( index ) { var $this = this, src, slide; if ( elements[ index ] !== undefined ) { src = elements[ index ].href; } if ( index < 0 || index >= elements.length ) { return false; } slide = $( '#swipebox-slider .slide' ).eq( index ); if ( ! $this.isVideo( src ) ) { slide.addClass( 'slide-loading' ); $this.loadMedia( src, function() { slide.removeClass( 'slide-loading' ); slide.html( this ); if ( plugin.settings.afterMedia ) { plugin.settings.afterMedia( index ); } } ); } else { slide.html( $this.getVideo( src ) ); if ( plugin.settings.afterMedia ) { plugin.settings.afterMedia( index ); } } }, setTitle : function ( index ) { var title = null; var data = null; $( '#swipebox-title' ).empty(); if ( elements[ index ] !== undefined ) { title = elements[ index ].title; data = elements[ index ].data; } if ( title ) { $( '#swipebox-top-bar' ).show(); if ( data ) { $( '#swipebox-title' ).html('<a href="' + data +'">' + title + '</a>'); } else { $( '#swipebox-title' ).append( title ); } } else { $( '#swipebox-top-bar' ).hide(); } }, isVideo : function ( src ) { if ( src ) { if ( src.match( /(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || src.match( /vimeo\.com\/([0-9]*)/ ) || src.match( /youtu\.be\/([a-zA-Z0-9\-_]+)/ ) ) { return true; } if ( src.toLowerCase().indexOf( 'swipeboxvideo=1' ) >= 0 ) { return true; } } }, parseUri : function (uri, customData) { var a = document.createElement('a'), qs = {}; a.href = decodeURIComponent( uri ); if ( a.search ) { qs = JSON.parse( '{"' + a.search.toLowerCase().replace('?','').replace(/&/g,'","').replace(/=/g,'":"') + '"}' ); } if ( $.isPlainObject( customData ) ) { qs = $.extend( qs, customData, plugin.settings.queryStringData ); } return $ .map( qs, function (val, key) { if ( val && val > '' ) { return encodeURIComponent( key ) + '=' + encodeURIComponent( val ); } }) .join('&'); }, getVideo : function( url ) { var iframe = '', youtubeUrl = url.match( /((?:www\.)?youtube\.com|(?:www\.)?youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/ ), youtubeShortUrl = url.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9\-_]+)/), vimeoUrl = url.match( /(?:www\.)?vimeo\.com\/([0-9]*)/ ), qs = ''; if ( youtubeUrl || youtubeShortUrl) { if ( youtubeShortUrl ) { youtubeUrl = youtubeShortUrl; } qs = ui.parseUri( url, { 'autoplay' : ( plugin.settings.autoplayVideos ? '1' : '0' ), 'v' : '' }); iframe = '<iframe width="560" height="315" src="//' + youtubeUrl[1] + '/embed/' + youtubeUrl[2] + '?' + qs + '" frameborder="0" allowfullscreen></iframe>'; } else if ( vimeoUrl ) { qs = ui.parseUri( url, { 'autoplay' : ( plugin.settings.autoplayVideos ? '1' : '0' ), 'byline' : '0', 'portrait' : '0', 'color': plugin.settings.vimeoColor }); iframe = '<iframe width="560" height="315" src="//player.vimeo.com/video/' + vimeoUrl[1] + '?' + qs + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'; } else { iframe = '<iframe width="560" height="315" src="' + url + '" frameborder="0" allowfullscreen></iframe>'; } return '<div class="swipebox-video-container" style="max-width:' + plugin.settings.videoMaxWidth + 'px"><div class="swipebox-video">' + iframe + '</div></div>'; }, loadMedia : function ( src, callback ) { if ( src.trim().indexOf('#') === 0 ) { callback.call( $('<div>', { 'class' : 'swipebox-inline-container' }) .append( $(src) .clone() .toggleClass( plugin.settings.toggleClassOnLoad ) ) ); } else { if ( ! this.isVideo( src ) ) { var img = $( '<img>' ).on( 'load', function() { callback.call( img ); } ); img.attr( 'src', src ); } } }, getNext : function () { var $this = this, src, index = $( '#swipebox-slider .slide' ).index( $( '#swipebox-slider .slide.current' ) ); if ( index + 1 < elements.length ) { src = $( '#swipebox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src' ); $( '#swipebox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src', src ); index++; $this.setSlide( index ); $this.preloadMedia( index+1 ); if ( plugin.settings.nextSlide ) { plugin.settings.nextSlide(index); } } else { if ( plugin.settings.loopAtEnd === true ) { src = $( '#swipebox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src' ); $( '#swipebox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src', src ); index = 0; $this.preloadMedia( index ); $this.setSlide( index ); $this.preloadMedia( index + 1 ); if ( plugin.settings.nextSlide ) { plugin.settings.nextSlide(index); } } else { $( '#swipebox-overlay' ).addClass( 'rightSpring' ); setTimeout( function() { $( '#swipebox-overlay' ).removeClass( 'rightSpring' ); }, 500 ); } } }, getPrev : function () { var index = $( '#swipebox-slider .slide' ).index( $( '#swipebox-slider .slide.current' ) ), src; if ( index > 0 ) { src = $( '#swipebox-slider .slide' ).eq( index ).contents().find( 'iframe').attr( 'src' ); $( '#swipebox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src', src ); index--; this.setSlide( index ); this.preloadMedia( index-1 ); if ( plugin.settings.prevSlide ) { plugin.settings.prevSlide(index); } } else { $( '#swipebox-overlay' ).addClass( 'leftSpring' ); setTimeout( function() { $( '#swipebox-overlay' ).removeClass( 'leftSpring' ); }, 500 ); } }, nextSlide : function ( index ) { }, prevSlide : function ( index ) { }, closeSlide : function () { $( 'html' ).removeClass( 'swipebox-html' ); $( 'html' ).removeClass( 'swipebox-touch' ); $( window ).trigger( 'resize' ); this.destroy(); }, destroy : function () { $( window ).unbind( 'keyup' ); $( 'body' ).unbind( 'touchstart' ); $( 'body' ).unbind( 'touchmove' ); $( 'body' ).unbind( 'touchend' ); $( '#swipebox-slider' ).unbind(); $( '#swipebox-overlay' ).remove(); if ( ! $.isArray( elem ) ) { elem.removeData( '_swipebox' ); } if ( this.target ) { this.target.trigger( 'swipebox-destroy' ); } $.swipebox.isOpen = false; if ( plugin.settings.afterClose ) { plugin.settings.afterClose(); } } }; plugin.init(); }; $.fn.swipebox = function( options ) { if ( ! $.data( this, '_swipebox' ) ) { var swipebox = new $.swipebox( this, options ); this.data( '_swipebox', swipebox ); } return this.data( '_swipebox' ); }; }( window, document, jQuery ) ); 

/*! waitForImages jQuery Plugin 2017-02-20 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){var b="waitForImages",c=function(a){return a.srcset&&a.sizes}(new Image);a.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage","cursor"],hasImageAttributes:["srcset"]},a.expr[":"]["has-src"]=function(b){return a(b).is('img[src][src!=""]')},a.expr[":"].uncached=function(b){return!!a(b).is(":has-src")&&!b.complete},a.fn.waitForImages=function(){var d,e,f,g=0,h=0,i=a.Deferred(),j=this,k=[],l=a.waitForImages.hasImageProperties||[],m=a.waitForImages.hasImageAttributes||[],n=/url\(\s*(['"]?)(.*?)\1\s*\)/g;if(a.isPlainObject(arguments[0])?(f=arguments[0].waitForAll,e=arguments[0].each,d=arguments[0].finished):1===arguments.length&&"boolean"===a.type(arguments[0])?f=arguments[0]:(d=arguments[0],e=arguments[1],f=arguments[2]),d=d||a.noop,e=e||a.noop,f=!!f,!a.isFunction(d)||!a.isFunction(e))throw new TypeError("An invalid callback was supplied.");return this.each(function(){var b=a(this);f?b.find("*").addBack().each(function(){var b=a(this);b.is("img:has-src")&&!b.is("[srcset]")&&k.push({src:b.attr("src"),element:b[0]}),a.each(l,function(a,c){var d,e=b.css(c);if(!e)return!0;for(;d=n.exec(e);)k.push({src:d[2],element:b[0]})}),a.each(m,function(a,c){var d=b.attr(c);return!d||void k.push({src:b.attr("src"),srcset:b.attr("srcset"),element:b[0]})})}):b.find("img:has-src").each(function(){k.push({src:this.src,element:this})})}),g=k.length,h=0,0===g&&(d.call(j),i.resolveWith(j)),a.each(k,function(f,k){var l=new Image,m="load."+b+" error."+b;a(l).one(m,function b(c){var f=[h,g,"load"==c.type];if(h++,e.apply(k.element,f),i.notifyWith(k.element,f),a(this).off(m,b),h==g)return d.call(j[0]),i.resolveWith(j[0]),!1}),c&&k.srcset&&(l.srcset=k.srcset,l.sizes=k.sizes),l.src=k.src}),i.promise()}});

/* Sticky Columns */
(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0)-1,height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"initial"}),
a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);

/* Plugin Scripts */
jQuery(function ($) { 'use strict';
					 
jQuery(".gusta-sticky-column").stick_in_parent();

if (jQuery('body').hasClass('admin-bar')) {
  jQuery(window).on('load resize scroll',function(){
    var admBar = 0;
    var scwidth = jQuery( window ).width();
    if (scwidth<782) { admBar = 46; } else { admBar = 32; }
    var scrolled = jQuery(this).scrollTop();;
    if (scrolled<admBar) {
      if (scwidth<600) { 
        var toppos = admBar - scrolled;
        jQuery('.admin-bar div[class*="sticky-top"]').css('top', toppos + 'px');
      } else {
        jQuery('.admin-bar div[class*="sticky-top"]').css('top', admBar + 'px');
      }
    } else {
      if (scwidth<600) { jQuery('.admin-bar div[class*="sticky-top"]').css('top', '0px'); }
    }
  }); 
}

/* For the Second level Dropdown menu, highlight the parent */ 
(function () { $(".dropdown-menu") .mouseenter(function () { $(this).parent('li').addClass('active'); }) .mouseleave(function () { $(this).parent('li').removeClass('active'); }); }()); 

/* iOS Click Fix */
(function () { if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) { $('*').css('cursor', 'pointer'); } }()); 

/* Fix Full Width for Custom vc_row */
jQuery(function() { jQuery('.gusta-full-width').each(function() { jQuery(this).addClass('vc_row-full-width').attr( 'data-vc-full-width', 'true' ); jQuery(this).find('div').first().css('position','initial'); }); });

/* Section Toggle */
(function () { jQuery(".gusta-section-toggle:not(.gusta-toggle-on-hover)").on("click", function() { 
  var data_toggle = jQuery(this).data("toggle"); 
  if (jQuery(this).hasClass('active')) { 
    jQuery(".gusta-section-toggle").removeClass("active"); 
  } else { 
    jQuery(".gusta-section-toggle").removeClass("active"); 
    jQuery("[data-toggle='" + data_toggle + "']").addClass("active"); 
  } 
  if (jQuery("#" + data_toggle + "").hasClass("section-vertical")) {
    jQuery('body[class*="gusta-vertical-header"]').toggleClass('gusta-body-zero-margin');
  }
	window.dispatchEvent(new Event('resize'));
});
$( ".gusta-section-toggle.gusta-toggle-on-hover" ).mouseover(function() {
    var data_toggle = jQuery(this).data("toggle");
	var disable_scroll = jQuery(this).data('disable-scroll');
	jQuery('.hide-by-default, .gusta-show-section').addClass('gusta-hide-section').removeClass('gusta-show-section gusta-higher');
	jQuery("#" + data_toggle + "").removeClass('gusta-hide-section').addClass('gusta-show-section gusta-higher');
	if (disable_scroll) {
		jQuery('html,body').addClass('disable-scroll');
	} else {
		jQuery('html,body').removeClass('disable-scroll');
	}
	if (jQuery("#" + data_toggle + "").hasClass("section-vertical")) {
		jQuery('body[class*="gusta-vertical-header"]').addClass('gusta-body-zero-margin');
	}
	jQuery(".gusta-section-toggle").removeClass("active"); 
	jQuery("[data-toggle='" + data_toggle + "']").addClass("active");
	gusta_fix_vc_full_width();
  })
  .mouseout(function() {});
}());
					 
/*$(document).click(function(e) {
	$(".gusta-show-section").each(function() {
		var section_id = $(this).attr('id');
		if ($('[data-toggle="'+section_id+'"]').hasClass('.gusta-toggle-on-hover')) {
			if (!section_id.is(e.target) && section_id.has(e.target).length === 0) {
				jQuery(".gusta-section-toggle").removeClass("active"); 
				section_id.removeClass('gusta-show-section gusta-higher').addClass('gusta-hide-section hide-by-default');
				jQuery('body, html').removeClass('disable-scroll');
				if (jQuery(section_id).hasClass("section-vertical")) {
					jQuery('body[class*="gusta-vertical-header"]').toggleClass('gusta-body-zero-margin');
				}
			}
		}
	});
});*/

/* Close Button */
jQuery('.gusta-close-button').on('click', function() {
	var container = jQuery(this).closest('.gusta-show-section');
	jQuery(".gusta-section-toggle").removeClass("active"); 
	container.removeClass('gusta-show-section gusta-higher').addClass('gusta-hide-section hide-by-default');
	jQuery('body, html').removeClass('disable-scroll');
	if (jQuery(container).hasClass("section-vertical")) {
	    jQuery('body[class*="gusta-vertical-header"]').toggleClass('gusta-body-zero-margin');
	}
});

jQuery('.gusta-nav').find('select').on('change', function() { var selected = jQuery(this).find(':selected').val(); if (selected!='') { window.location.href = selected; } });

jQuery('p:empty').remove();

jQuery.fn.element_cover = function() {
	jQuery('.gusta-cover-row').each(function() { 
	  jQuery(this).parentsUntil('.wpb_row').css('position','initial');
	  jQuery(this).closest('.wpb_row').css({'position':'relative', 'z-index':'0'}); 
	});
	jQuery('.gusta-cover-column').each(function() { 
	  jQuery(this).parentsUntil('.wpb_column').css('position','initial');
	  jQuery(this).closest('.wpb_column').css({'position':'relative', 'z-index':'0'}); 
	});
};
jQuery(function() { jQuery('body').element_cover(); });
/*jQuery ('.gusta-mega-menu, .gusta-dropdown-menu').parentsUntil('.wpb_row').css('position','initial');*/
jQuery ('.gusta-mega-menu, .gusta-dropdown-menu').closest('.wpb_row').css({'position':'relative', 'overflow':'initial'});

(function () { jQuery(document).ready(function() { 
/* Swipe Box (Lightbox) */ 
jQuery( '.swipebox' ).swipebox(); 

jQuery('.post-listing-container').addClass('show-container'); }); }());

/* Smooth Scroll */
(function () { $(".smooth-scroll:not(body),.smooth-scroll:not(body) a").click(function(event){ event.preventDefault(); var dest=0; if($(this.hash).offset().top > $(document).height()-$(window).height()){ dest=$(document).height()-$(window).height(); } else { dest=$(this.hash).offset().top; } $('html,body').animate({scrollTop:dest}, 1000,'swing'); }); }());

(function () { $('.gusta-mega-menu-item').hover(function(e) { gusta_fix_vc_full_width() }); }());

(function() {
  $('.gusta-nav.horizontal:not(.no-child)').hover(function(){
    $(this).gusta_higher();
  });

  $('.gusta-search-form').hover(function(){
    $(this).gusta_higher();
  });
  
  $('.vertical .gusta-dropdown i').click(function(){
    $(this).parent().toggleClass('gusta-children-open');
    $(this).toggleClass('fa-minus fa-plus');
  });
  
  $(window).on('load resize scroll',function(){
    if ($(window).width() < 751) {
      $('.gusta-nav.gusta-nav-responsive').addClass('select').removeClass('horizontal');
    } else {
      $('.gusta-nav.gusta-nav-responsive').removeClass('select').addClass('horizontal');
    }
  });
}());

/* Mega Menu On Click 
(function () { jQuery(".gusta-mega-menu-on-click a").on("click", function() { if (jQuery(this).parent().hasClass('gusta-mega-menu-active')) { jQuery(this).parent().removeClass('gusta-mega-menu-active'); } else { jQuery(this).parent().addClass('gusta-mega-menu-active'); gusta_fix_vc_full_width(); } }); }());*/
$('.menu-item').click(function () {
if ($(this).parent().parent().find(".gusta-mega-menu").length > 0){ 
  var menu_item_id = $(this).attr('class');
	var mega_menu_id = '';
  var splitString = menu_item_id.split(" ");
  $.each(splitString, function( index, value ) {
 	if (value.indexOf("menu-item-") >= 0) {
 		mega_menu_id = 	value.replace('gusta-','');
		mega_menu_id = 	mega_menu_id.replace('menu-item-','gusta-mega-menu-');
	}
	});
  if( $('#' + mega_menu_id).length ) {
    if ($('#' + mega_menu_id).hasClass('gusta-trigger-on-click')) {
      $('#' + mega_menu_id).toggleClass('gusta-mega-menu-active');
      $(this).toggleClass('current-menu-item'); 
    }
  }
  }
}); 
$('.menu-item').hover(function () {
if ($(this).parent().parent().find(".gusta-mega-menu").length > 0){ 
  var menu_item_id = $(this).attr('class');
	var mega_menu_id = '';
  var splitString = menu_item_id.split(" ");
  $.each(splitString, function( index, value ) {
 	if (value.indexOf("menu-item-") >= 0) {
		mega_menu_id = 	value.replace('gusta-','');
		mega_menu_id = 	mega_menu_id.replace('menu-item-','gusta-mega-menu-');
	}
	});
  
  if( $('#' + mega_menu_id).length ) {
    if ($(this).parent().parent().find('#' + mega_menu_id).hasClass('gusta-trigger-on-hover')) {
      $(this).parent().parent().find('#' + mega_menu_id).addClass('gusta-mega-menu-active');
      $(this).addClass('current-menu-item');
		gusta_fix_vc_full_width();
    }
  }
  }
}, function() {
	if ($(this).parent().parent().find(".gusta-mega-menu").length > 0){ 
		$( '.gusta-trigger-on-hover' ).removeClass( "gusta-mega-menu-active" );
		$( this ).removeClass( "current-menu-item" );	
	}
});
$('.gusta-mega-menu.gusta-trigger-on-hover').hover(function () {
  var mega_menu_id = $(this).attr('id');
  var menu_item_id = mega_menu_id.replace('gusta-mega-menu-','menu-item-');
  $(this).addClass('gusta-mega-menu-active');
  $('#' + menu_item_id).addClass('current-menu-item');
}, function () {
  var mega_menu_id = $(this).attr('id');
  var menu_item_id = mega_menu_id.replace('gusta-mega-menu-','menu-item-');
    $(this).removeClass('gusta-mega-menu-active');
  $('#' + menu_item_id).removeClass('current-menu-item');
});
  
}); // JQuery end

jQuery(window).on('load resize', function(event) {
    setTimeout(
  function() 
  {
    jQuery('.owl-carousel').each(function() {
      var $this = jQuery(this);
    var theight = $this.find('.owl-item.active').height();
    
    $this.find('.owl-height').css('height', theight );
    });
  }, 100);
});

jQuery.fn.gusta_higher = function() {
  jQuery('.ss-element').removeClass('gusta-higher');
  jQuery('.vc_row').removeClass('gusta-higher');
  jQuery('.gusta-section').removeClass('gusta-higher');
  jQuery(this).addClass('gusta-higher');
  jQuery(this).closest('.vc_row').addClass('gusta-higher');
  jQuery(this).closest('.gusta-section').addClass('gusta-higher');
  jQuery(this).parent().parent().parent().parent().parent().closest('.vc_row').addClass('gusta-higher');
};

jQuery.fn.auto_suggest = function( options ) {
  
  var results = jQuery(this).find('.results');
  var search_term = jQuery(this).find('input').val();
  var post_types = jQuery(this).find('input').data('posttypes');
  var curr = 0;
  
  var auto_suggest = function(){ 
    jQuery.ajax({
      type       : 'post',
      data       : {
        search_term: search_term, 
        post_types: post_types,
        action: 'gusta_auto_suggest'
      },
      dataType   : 'html',
      url        : smart_sections.ajaxurl,
      success    : function(response){
        if (response) {
          var newItems = jQuery(response);
          results.html( newItems );
        } else {
          results.html( '' );
        }
      },
      error     : function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown);
      }
    });
  };
  auto_suggest();
  
  jQuery(document).mouseup(function(e) { 
    if (!jQuery('.results').parent().is(e.target) && jQuery('.results').parent().has(e.target).length === 0) { 
      jQuery('.results').html(''); 
    } 
  });
  
};

jQuery.fn.update_cart = function( options ) {
  var results = jQuery(this);
  var current_cart_count = jQuery(this).find('.gusta-cart-count').html();
  var cart_type = jQuery(this).data('.cart-type');
  var update_cart = function(){ 
    jQuery.ajax({
      type       : 'post',
      data       : {
      	current_cart_count: current_cart_count,
      	cart_type: cart_type,
        action: 'gusta_update_cart'
      },
      dataType   : 'html',
      url        : smart_sections.ajaxurl,
      success    : function(response){
        if (response) {
          var newItems = jQuery(response);
          results.html( newItems );
        }
      },
      error     : function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown);
      }
    });
  };
  update_cart();
  
};

jQuery.fn.update_cart_count = function( options ) {
  var results = jQuery(this);
  var update_cart_count = function(){ 
    jQuery.ajax({
      type       : 'post',
      data       : {
        action: 'gusta_update_cart_count'
      },
      dataType   : 'html',
      url        : smart_sections.ajaxurl,
      success    : function(response){
        if (response) {
          results.html( response );
        }
      },
      error     : function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown);
      }
    });
  };
  update_cart_count();
  
};

window.setInterval(function(){
	jQuery('.gusta-cart-icon').each(function() {
		jQuery(this).find('.gusta-cart-count').update_cart_count();
		jQuery(this).find('.gusta-shopping-cart').update_cart();
	});
  }, 10000);

jQuery('.gusta-section-toggle:not(.gusta-toggle-on-hover)').click(function(){
  var section = '#' + jQuery(this).data('toggle');
  var disable_scroll = jQuery(this).data('disable-scroll');

  if (jQuery(this).hasClass('active')) {
    jQuery('.hide-by-default').addClass('gusta-hide-section').removeClass('gusta-show-section gusta-higher');
    jQuery(section).addClass('gusta-hide-section').removeClass('gusta-show-section gusta-higher');
    jQuery('html,body').removeClass('disable-scroll');
  } else { 
    jQuery('.hide-by-default').addClass('gusta-hide-section').removeClass('gusta-show-section gusta-higher');
    jQuery(section).toggleClass('gusta-hide-section').toggleClass('gusta-show-section gusta-higher');
    if (disable_scroll) {
      jQuery('html,body').addClass('disable-scroll');
    } else {
      jQuery('html,body').removeClass('disable-scroll');
    }
  }
  gusta_fix_vc_full_width();
});