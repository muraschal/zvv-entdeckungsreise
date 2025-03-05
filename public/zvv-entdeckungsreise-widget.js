/*! For license information please see zvv-entdeckungsreise-widget.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["React","ReactDOM"],t):"object"==typeof exports?exports.ZVVEntdeckungsreiseWidget=t(require("react"),require("react-dom")):e.ZVVEntdeckungsreiseWidget=t(e.React,e.ReactDOM)}(this,((e,t)=>(()=>{"use strict";var r={156:t=>{t.exports=e},318:e=>{e.exports=t}},a={};function n(e){var t=a[e];if(void 0!==t)return t.exports;var o=a[e]={exports:{}};return r[e](o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var o=n(156),i=n.n(o),c=n(318),m=n.n(c);function l(e){return l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(e)}function s(){s=function(){return t};var e,t={},r=Object.prototype,a=r.hasOwnProperty,n=Object.defineProperty||function(e,t,r){e[t]=r.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",m=o.toStringTag||"@@toStringTag";function u(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{u({},"")}catch(e){u=function(e,t,r){return e[t]=r}}function d(e,t,r,a){var o=t&&t.prototype instanceof g?t:g,i=Object.create(o.prototype),c=new P(a||[]);return n(i,"_invoke",{value:_(e,r,c)}),i}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}t.wrap=d;var v="suspendedStart",f="suspendedYield",h="executing",y="completed",b={};function g(){}function C(){}function G(){}var E={};u(E,i,(function(){return this}));var w=Object.getPrototypeOf,N=w&&w(w(T([])));N&&N!==r&&a.call(N,i)&&(E=N);var x=G.prototype=g.prototype=Object.create(E);function R(e){["next","throw","return"].forEach((function(t){u(e,t,(function(e){return this._invoke(t,e)}))}))}function O(e,t){function r(n,o,i,c){var m=p(e[n],e,o);if("throw"!==m.type){var s=m.arg,u=s.value;return u&&"object"==l(u)&&a.call(u,"__await")?t.resolve(u.__await).then((function(e){r("next",e,i,c)}),(function(e){r("throw",e,i,c)})):t.resolve(u).then((function(e){s.value=e,i(s)}),(function(e){return r("throw",e,i,c)}))}c(m.arg)}var o;n(this,"_invoke",{value:function(e,a){function n(){return new t((function(t,n){r(e,a,t,n)}))}return o=o?o.then(n,n):n()}})}function _(t,r,a){var n=v;return function(o,i){if(n===h)throw Error("Generator is already running");if(n===y){if("throw"===o)throw i;return{value:e,done:!0}}for(a.method=o,a.arg=i;;){var c=a.delegate;if(c){var m=S(c,a);if(m){if(m===b)continue;return m}}if("next"===a.method)a.sent=a._sent=a.arg;else if("throw"===a.method){if(n===v)throw n=y,a.arg;a.dispatchException(a.arg)}else"return"===a.method&&a.abrupt("return",a.arg);n=h;var l=p(t,r,a);if("normal"===l.type){if(n=a.done?y:f,l.arg===b)continue;return{value:l.arg,done:a.done}}"throw"===l.type&&(n=y,a.method="throw",a.arg=l.arg)}}}function S(t,r){var a=r.method,n=t.iterator[a];if(n===e)return r.delegate=null,"throw"===a&&t.iterator.return&&(r.method="return",r.arg=e,S(t,r),"throw"===r.method)||"return"!==a&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+a+"' method")),b;var o=p(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,b;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,b):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function k(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function j(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function P(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function T(t){if(t||""===t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function r(){for(;++n<t.length;)if(a.call(t,n))return r.value=t[n],r.done=!1,r;return r.value=e,r.done=!0,r};return o.next=o}}throw new TypeError(l(t)+" is not iterable")}return C.prototype=G,n(x,"constructor",{value:G,configurable:!0}),n(G,"constructor",{value:C,configurable:!0}),C.displayName=u(G,m,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===C||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,G):(e.__proto__=G,u(e,m,"GeneratorFunction")),e.prototype=Object.create(x),e},t.awrap=function(e){return{__await:e}},R(O.prototype),u(O.prototype,c,(function(){return this})),t.AsyncIterator=O,t.async=function(e,r,a,n,o){void 0===o&&(o=Promise);var i=new O(d(e,r,a,n),o);return t.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},R(x),u(x,m,"Generator"),u(x,i,(function(){return this})),u(x,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),r=[];for(var a in t)r.push(a);return r.reverse(),function e(){for(;r.length;){var a=r.pop();if(a in t)return e.value=a,e.done=!1,e}return e.done=!0,e}},t.values=T,P.prototype={constructor:P,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(j),!t)for(var r in this)"t"===r.charAt(0)&&a.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(a,n){return c.type="throw",c.arg=t,r.next=a,n&&(r.method="next",r.arg=e),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var m=a.call(i,"catchLoc"),l=a.call(i,"finallyLoc");if(m&&l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(m){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,b):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),b},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),j(r),b}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var a=r.completion;if("throw"===a.type){var n=a.arg;j(r)}return n}}throw Error("illegal catch attempt")},delegateYield:function(t,r,a){return this.delegate={iterator:T(t),resultName:r,nextLoc:a},"next"===this.method&&(this.arg=e),b}},t}function u(e,t,r,a,n,o,i){try{var c=e[o](i),m=c.value}catch(e){return void r(e)}c.done?t(m):Promise.resolve(m).then(a,n)}function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach((function(t){v(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function v(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=l(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var a=r.call(e,t||"default");if("object"!=l(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==l(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function f(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var a,n,o,i,c=[],m=!0,l=!1;try{if(o=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;m=!1}else for(;!(m=(a=o.call(r)).done)&&(c.push(a.value),c.length!==t);m=!0);}catch(e){l=!0,n=e}finally{try{if(!m&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(l)throw n}}return c}}(e,t)||function(e,t){if(e){if("string"==typeof e)return h(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?h(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,a=Array(t);r<t;r++)a[r]=e[r];return a}function y(e){var t=e.apiBaseUrl,r=void 0===t?"":t,a=f((0,o.useState)({code:"",school:"",studentCount:"",travelDate:"",additionalNotes:"",email:"",className:"",contactPerson:"",phoneNumber:"",accompanistCount:"",arrivalTime:""}),2),n=a[0],i=a[1],c=f((0,o.useState)(!1),2),m=c[0],l=c[1],d=f((0,o.useState)(""),2),h=d[0],y=d[1],b=f((0,o.useState)(!1),2),g=b[0],C=b[1],G=f((0,o.useState)(!1),2),E=G[0],w=G[1],N=function(e){var t=e.target,r=t.name,a=t.value;i((function(e){return p(p({},e),{},v({},r,a))}))},x=function(){var e,t=(e=s().mark((function e(t){var a,o,i,c;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),l(!0),y(""),!n.travelDate||(m=n.travelDate,s=void 0,u=void 0,s=new Date(m),(u=new Date).setHours(0,0,0,0),s>=u)){e.next=7;break}return y("Das Reisedatum muss in der Zukunft liegen."),l(!1),e.abrupt("return");case 7:return e.prev=7,e.next=10,fetch("".concat(r,"/api/validate"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:n.code})});case 10:return a=e.sent,e.next=13,a.json();case 13:if((o=e.sent).valid){e.next=18;break}return y(o.message||"Ungültiger Code"),l(!1),e.abrupt("return");case 18:return e.next=20,fetch("".concat(r,"/api/redeem"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:n.code,school:n.school,studentCount:parseInt(n.studentCount),travelDate:n.travelDate,additionalNotes:n.additionalNotes,email:n.email,className:n.className,contactPerson:n.contactPerson,phoneNumber:n.phoneNumber,accompanistCount:parseInt(n.accompanistCount||"0"),arrivalTime:n.arrivalTime})});case 20:return i=e.sent,e.next=23,i.json();case 23:c=e.sent,i.ok?C(!0):y(c.message||"Ein Fehler ist aufgetreten"),e.next=31;break;case 27:e.prev=27,e.t0=e.catch(7),y("Ein Fehler ist aufgetreten. Bitte versuche es später erneut."),console.error(e.t0);case 31:return e.prev=31,l(!1),e.finish(31);case 34:case"end":return e.stop()}var m,s,u}),e,null,[[7,27,31,34]])})),function(){var t=this,r=arguments;return new Promise((function(a,n){var o=e.apply(t,r);function i(e){u(o,a,n,i,c,"next",e)}function c(e){u(o,a,n,i,c,"throw",e)}i(void 0)}))});return function(e){return t.apply(this,arguments)}}();return g?React.createElement("div",{className:"max-w-md mx-auto p-4 bg-white rounded-lg shadow-md"},React.createElement("h1",{className:"text-2xl font-bold text-green-600 mb-4"},"Anmeldung erfolgreich!"),React.createElement("p",{className:"mb-4"},"Vielen Dank für deine Anmeldung zur ZVV-Entdeckungsreise."),React.createElement("p",{className:"mb-4"},"Wir haben deine Anfrage erhalten und eine Bestätigungs-E-Mail an dich gesendet."),React.createElement("button",{onClick:function(){return C(!1)},className:"cmp-button"},React.createElement("span",{className:"cmp-button__text"},"Zurück zum Formular"))):React.createElement("div",{className:"max-w-md mx-auto p-4 bg-white rounded-lg shadow-md"},h&&React.createElement("div",{className:"mb-4 p-3 bg-red-100 text-red-700 rounded"},h),React.createElement("form",{onSubmit:x},React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"code"},"Ticketcode")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"code",className:"cmp-form-text__text",placeholder:"Ticketcode eingeben",name:"code",value:n.code,onChange:N,required:!0,"aria-describedby":"code-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte geben Sie einen Ticketcode ein"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"school"},"Schule")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"school",className:"cmp-form-text__text",placeholder:"Name der Schule",name:"school",value:n.school,onChange:N,required:!0,"aria-describedby":"school-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte geben Sie den Namen der Schule ein"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"contactPerson"},"Kontaktperson")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"contactPerson",className:"cmp-form-text__text",placeholder:"Name der Kontaktperson",name:"contactPerson",value:n.contactPerson,onChange:N,required:!0,"aria-describedby":"contactPerson-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte geben Sie den Namen der Kontaktperson ein"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"email"},"E-Mail")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"email",className:"cmp-form-text__text",placeholder:"E-Mail-Adresse",name:"email",type:"email",value:n.email,onChange:N,required:!0,"aria-describedby":"email-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte geben Sie eine gültige E-Mail-Adresse ein"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"phoneNumber"},"Telefon")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"phoneNumber",className:"cmp-form-text__text",placeholder:"Telefonnummer",name:"phoneNumber",type:"tel",value:n.phoneNumber,onChange:N,required:!0,"aria-describedby":"phoneNumber-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte geben Sie eine Telefonnummer ein"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"className"},"Klasse")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-dropdown"},React.createElement("div",{tabIndex:0,className:"cmp-dropdown__label",onClick:function(){return w(!E)}},n.className||"Bitte wählen"),React.createElement("div",{className:"cmp-dropdown__options ".concat(E?"visible":"")},React.createElement("div",{className:"cmp-dropdown__option ".concat(n.className?"":"cmp-dropdown__option--selected"),"data-value":"",onClick:function(){i((function(e){return p(p({},e),{},{className:""})})),w(!1)}},"Bitte wählen"),React.createElement("div",{className:"cmp-dropdown__option ".concat("4. Klasse"===n.className?"cmp-dropdown__option--selected":""),"data-value":"klasse-4",onClick:function(){i((function(e){return p(p({},e),{},{className:"4. Klasse"})})),w(!1)}},"4."),React.createElement("div",{className:"cmp-dropdown__option ".concat("5. Klasse"===n.className?"cmp-dropdown__option--selected":""),"data-value":"klasse-5",onClick:function(){i((function(e){return p(p({},e),{},{className:"5. Klasse"})})),w(!1)}},"5."),React.createElement("div",{className:"cmp-dropdown__option ".concat("6. Klasse"===n.className?"cmp-dropdown__option--selected":""),"data-value":"klasse-6",onClick:function(){i((function(e){return p(p({},e),{},{className:"6. Klasse"})})),w(!1)}},"6.")),React.createElement("input",{type:"hidden",id:"className",name:"className",value:n.className,required:!0,"aria-describedby":"className-desc","data-cmprequiredmessage":"Bitte wählen Sie eine Klasse aus"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"studentCount"},"Anzahl Schüler")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"studentCount",className:"cmp-form-text__text",placeholder:"Anzahl der Schüler",name:"studentCount",type:"number",min:"1",value:n.studentCount,onChange:N,required:!0,"aria-describedby":"studentCount-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte geben Sie die Anzahl der Schüler ein"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"accompanistCount"},"Begleitpersonen")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"accompanistCount",className:"cmp-form-text__text",placeholder:"Anzahl der Begleitpersonen",name:"accompanistCount",type:"number",min:"1",value:n.accompanistCount,onChange:N,required:!0,"aria-describedby":"accompanistCount-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte geben Sie die Anzahl der Begleitpersonen ein"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"travelDate"},"Reisedatum")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"travelDate",className:"cmp-form-text__text",placeholder:"Reisedatum auswählen",name:"travelDate",type:"date",min:(new Date).toISOString().split("T")[0],value:n.travelDate,onChange:N,required:!0,"aria-describedby":"travelDate-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte wählen Sie ein Reisedatum aus"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"arrivalTime"},"Ankunftszeit")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("input",{id:"arrivalTime",className:"cmp-form-text__text",placeholder:"Ankunftszeit auswählen",name:"arrivalTime",type:"time",value:n.arrivalTime,onChange:N,required:!0,"aria-describedby":"arrivalTime-desc","data-cmphookformtext":"","data-cmprequiredmessage":"Bitte wählen Sie eine Ankunftszeit aus"})))),React.createElement("div",{className:"cmp-row-container aem-Grid cmp-row-container--spacing"},React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("label",{htmlFor:"additionalNotes"},"Anmerkungen")),React.createElement("div",{className:"aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--6 aem-GridColumn--vpm--6 aem-GridColumn--vpms--6"},React.createElement("div",{className:"cmp-form-text"},React.createElement("textarea",{id:"additionalNotes",className:"cmp-form-text__text",placeholder:"Zusätzliche Anmerkungen",name:"additionalNotes",rows:2,value:n.additionalNotes,onChange:N,"aria-describedby":"additionalNotes-desc","data-cmphookformtext":"","data-cmprequiredmessage":""})))),React.createElement("div",{className:"text-sm text-grey mb-4"},"* Alle Felder sind Pflichtfelder, außer Anmerkungen"),React.createElement("button",{className:"cmp-button",type:"submit",disabled:m},React.createElement("span",{className:"cmp-button__text"},m?"Wird verarbeitet...":"Anmeldung absenden"))))}function b(e){return b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},b(e)}function g(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function C(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=b(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var a=r.call(e,t||"default");if("object"!=b(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==b(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}return console.log("ZVV-Entdeckungsreise Widget v".concat("2.0.0"," - Build: ").concat("2025-03-05T10:43:15.784Z"," - GitHub: ").concat("local-build")),window.initZVVEntdeckungsreiseWidget=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=document.getElementById(e);if(r){var a=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?g(Object(r),!0).forEach((function(t){C(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):g(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({apiBaseUrl:t.apiBaseUrl||"https://entdeckungsreise.zvv.ch"},t);m().render(i().createElement(i().StrictMode,null,i().createElement(y,{apiBaseUrl:a.apiBaseUrl})),r)}else console.error('Container mit ID "'.concat(e,'" nicht gefunden.'))},{}})()));