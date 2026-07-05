var It=Object.defineProperty;var We=t=>{throw TypeError(t)};var Rt=(t,e,n)=>e in t?It(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Ce=(t,e,n)=>Rt(t,typeof e!="symbol"?e+"":e,n),Ie=(t,e,n)=>e.has(t)||We("Cannot "+n);var s=(t,e,n)=>(Ie(t,e,"read from private field"),n?n.call(t):e.get(t)),d=(t,e,n)=>e.has(t)?We("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),u=(t,e,n,r)=>(Ie(t,e,"write to private field"),r?r.call(t,n):e.set(t,n),n),b=(t,e,n)=>(Ie(t,e,"access private method"),n);import{r as G,j as Dt}from"./jsx-runtime-BXy8TQFj.js";var Qe=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},K,Q,re,nt,Et=(nt=class extends Qe{constructor(){super();d(this,K);d(this,Q);d(this,re);u(this,re,e=>{if(typeof window<"u"&&window.addEventListener){const n=()=>e();return window.addEventListener("visibilitychange",n,!1),()=>{window.removeEventListener("visibilitychange",n)}}})}onSubscribe(){s(this,Q)||this.setEventListener(s(this,re))}onUnsubscribe(){var e;this.hasListeners()||((e=s(this,Q))==null||e.call(this),u(this,Q,void 0))}setEventListener(e){var n;u(this,re,e),(n=s(this,Q))==null||n.call(this),u(this,Q,e(r=>{typeof r=="boolean"?this.setFocused(r):this.onFocus()}))}setFocused(e){s(this,K)!==e&&(u(this,K,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(n=>{n(e)})}isFocused(){var e;return typeof s(this,K)=="boolean"?s(this,K):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},K=new WeakMap,Q=new WeakMap,re=new WeakMap,nt),ut=new Et,_t={setTimeout:(t,e)=>setTimeout(t,e),clearTimeout:t=>clearTimeout(t),setInterval:(t,e)=>setInterval(t,e),clearInterval:t=>clearInterval(t)},L,$e,rt,Ot=(rt=class{constructor(){d(this,L,_t);d(this,$e,!1)}setTimeoutProvider(t){u(this,L,t)}setTimeout(t,e){return s(this,L).setTimeout(t,e)}clearTimeout(t){s(this,L).clearTimeout(t)}setInterval(t,e){return s(this,L).setInterval(t,e)}clearInterval(t){s(this,L).clearInterval(t)}},L=new WeakMap,$e=new WeakMap,rt),W=new Ot;function Ft(t){setTimeout(t,0)}var Tt=typeof window>"u"||"Deno"in globalThis;function me(){}function An(t,e){return typeof t=="function"?t(e):t}function De(t){return typeof t=="number"&&t>=0&&t!==1/0}function ct(t,e){return Math.max(t+(e||0)-Date.now(),0)}function ne(t,e){return typeof t=="function"?t(e):t}function q(t,e){return typeof t=="function"?t(e):t}function Un(t,e){const{type:n="all",exact:r,fetchStatus:i,predicate:a,queryKey:l,stale:o}=t;if(l){if(r){if(e.queryHash!==At(l,e.options))return!1}else if(!Le(e.queryKey,l))return!1}if(n!=="all"){const m=e.isActive();if(n==="active"&&!m||n==="inactive"&&m)return!1}return!(typeof o=="boolean"&&e.isStale()!==o||i&&i!==e.state.fetchStatus||a&&!a(e))}function qn(t,e){const{exact:n,status:r,predicate:i,mutationKey:a}=t;if(a){if(!e.options.mutationKey)return!1;if(n){if(Ee(e.options.mutationKey)!==Ee(a))return!1}else if(!Le(e.options.mutationKey,a))return!1}return!(r&&e.state.status!==r||i&&!i(e))}function At(t,e){return((e==null?void 0:e.queryKeyHashFn)||Ee)(t)}function Ee(t){return JSON.stringify(t,(e,n)=>Oe(n)?Object.keys(n).sort().reduce((r,i)=>(r[i]=n[i],r),{}):n)}function Le(t,e){return t===e?!0:typeof t!=typeof e?!1:t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(e).every(n=>Le(t[n],e[n])):!1}var Ut=Object.prototype.hasOwnProperty;function lt(t,e,n=0){if(t===e)return t;if(n>500)return e;const r=Ke(t)&&Ke(e);if(!r&&!(Oe(t)&&Oe(e)))return e;const a=(r?t:Object.keys(t)).length,l=r?e:Object.keys(e),o=l.length,m=r?new Array(o):{};let I=0;for(let g=0;g<o;g++){const h=r?g:l[g],S=t[h],f=e[h];if(S===f){m[h]=S,(r?g<a:Ut.call(t,h))&&I++;continue}if(S===null||f===null||typeof S!="object"||typeof f!="object"){m[h]=f;continue}const R=lt(S,f,n+1);m[h]=R,R===S&&I++}return a===o&&I===a?t:m}function _e(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(t[n]!==e[n])return!1;return!0}function Ke(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function Oe(t){if(!Ye(t))return!1;const e=t.constructor;if(e===void 0)return!0;const n=e.prototype;return!(!Ye(n)||!n.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(t)!==Object.prototype)}function Ye(t){return Object.prototype.toString.call(t)==="[object Object]"}function qt(t){return new Promise(e=>{W.setTimeout(e,t)})}function Fe(t,e,n){return typeof n.structuralSharing=="function"?n.structuralSharing(t,e):n.structuralSharing!==!1?lt(t,e):e}function jn(t){return t}function jt(t,e,n=0){const r=[...t,e];return n&&r.length>n?r.slice(1):r}function Gt(t,e,n=0){const r=[e,...t];return n&&r.length>n?r.slice(0,-1):r}var ht=Symbol();function dt(t,e){return!t.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!t.queryFn||t.queryFn===ht?()=>Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`)):t.queryFn}function pt(t,e){return typeof t=="function"?t(...e):!!t}function Bt(t,e,n){let r=!1,i;return Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(i??(i=e()),r||(r=!0,i.aborted?n():i.addEventListener("abort",n,{once:!0})),i)}),t}var ye=(()=>{let t=()=>Tt;return{isServer(){return t()},setIsServer(e){t=e}}})();function Te(){let t,e;const n=new Promise((i,a)=>{t=i,e=a});n.status="pending",n.catch(()=>{});function r(i){Object.assign(n,i),delete n.resolve,delete n.reject}return n.resolve=i=>{r({status:"fulfilled",value:i}),t(i)},n.reject=i=>{r({status:"rejected",reason:i}),e(i)},n}var Nt=Ft;function kt(){let t=[],e=0,n=o=>{o()},r=o=>{o()},i=Nt;const a=o=>{e?t.push(o):i(()=>{n(o)})},l=()=>{const o=t;t=[],o.length&&i(()=>{r(()=>{o.forEach(m=>{n(m)})})})};return{batch:o=>{let m;e++;try{m=o()}finally{e--,e||l()}return m},batchCalls:o=>(...m)=>{a(()=>{o(...m)})},schedule:a,setNotifyFunction:o=>{n=o},setBatchNotifyFunction:o=>{r=o},setScheduler:o=>{i=o}}}var Me=kt(),se,M,ie,st,zt=(st=class extends Qe{constructor(){super();d(this,se,!0);d(this,M);d(this,ie);u(this,ie,e=>{if(typeof window<"u"&&window.addEventListener){const n=()=>e(!0),r=()=>e(!1);return window.addEventListener("online",n,!1),window.addEventListener("offline",r,!1),()=>{window.removeEventListener("online",n),window.removeEventListener("offline",r)}}})}onSubscribe(){s(this,M)||this.setEventListener(s(this,ie))}onUnsubscribe(){var e;this.hasListeners()||((e=s(this,M))==null||e.call(this),u(this,M,void 0))}setEventListener(e){var n;u(this,ie,e),(n=s(this,M))==null||n.call(this),u(this,M,e(this.setOnline.bind(this)))}setOnline(e){s(this,se)!==e&&(u(this,se,e),this.listeners.forEach(r=>{r(e)}))}isOnline(){return s(this,se)}},se=new WeakMap,M=new WeakMap,ie=new WeakMap,st),ft=new zt;function $t(t){return Math.min(1e3*2**t,3e4)}function mt(t){return(t??"online")==="online"?ft.isOnline():!0}var Ae=class extends Error{constructor(t){super("CancelledError"),this.revert=t==null?void 0:t.revert,this.silent=t==null?void 0:t.silent}};function Qt(t){let e=!1,n=0,r;const i=Te(),a=()=>i.status!=="pending",l=y=>{var P;if(!a()){const w=new Ae(y);S(w),(P=t.onCancel)==null||P.call(t,w)}},o=()=>{e=!0},m=()=>{e=!1},I=()=>ut.isFocused()&&(t.networkMode==="always"||ft.isOnline())&&t.canRun(),g=()=>mt(t.networkMode)&&t.canRun(),h=y=>{a()||(r==null||r(),i.resolve(y))},S=y=>{a()||(r==null||r(),i.reject(y))},f=()=>new Promise(y=>{var P;r=w=>{(a()||I())&&y(w)},(P=t.onPause)==null||P.call(t)}).then(()=>{var y;r=void 0,a()||(y=t.onContinue)==null||y.call(t)}),R=()=>{if(a())return;let y;const P=n===0?t.initialPromise:void 0;try{y=P??t.fn()}catch(w){y=Promise.reject(w)}Promise.resolve(y).then(h).catch(w=>{var B;if(a())return;const E=t.retry??(ye.isServer()?0:3),C=t.retryDelay??$t,c=typeof C=="function"?C(n,w):C,O=E===!0||typeof E=="number"&&n<E||typeof E=="function"&&E(n,w);if(e||!O){S(w);return}n++,(B=t.onFail)==null||B.call(t,n,w),qt(c).then(()=>I()?void 0:f()).then(()=>{e?S(w):R()})})};return{promise:i,status:()=>i.status,cancel:l,continue:()=>(r==null||r(),i),cancelRetry:o,continueRetry:m,canStart:g,start:()=>(g()?R():f().then(R),i)}}var Y,it,Lt=(it=class{constructor(){d(this,Y)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),De(this.gcTime)&&u(this,Y,W.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??(ye.isServer()?1/0:300*1e3))}clearGcTimeout(){s(this,Y)!==void 0&&(W.clearTimeout(s(this,Y)),u(this,Y,void 0))}},Y=new WeakMap,it);function Mt(t){return{onFetch:(e,n)=>{var g,h,S,f,R;const r=e.options,i=(S=(h=(g=e.fetchOptions)==null?void 0:g.meta)==null?void 0:h.fetchMore)==null?void 0:S.direction,a=((f=e.state.data)==null?void 0:f.pages)||[],l=((R=e.state.data)==null?void 0:R.pageParams)||[];let o={pages:[],pageParams:[]},m=0;const I=async()=>{let y=!1;const P=C=>{Bt(C,()=>e.signal,()=>y=!0)},w=dt(e.options,e.fetchOptions),E=async(C,c,O)=>{if(y)return Promise.reject(e.signal.reason);if(c==null&&C.pages.length)return Promise.resolve(C);const de=(()=>{const $={client:e.client,queryKey:e.queryKey,pageParam:c,direction:O?"backward":"forward",meta:e.options.meta};return P($),$})(),N=await w(de),{maxPages:pe}=e.options,F=O?Gt:jt;return{pages:F(C.pages,N,pe),pageParams:F(C.pageParams,c,pe)}};if(i&&a.length){const C=i==="backward",c=C?xt:He,O={pages:a,pageParams:l},B=c(r,O);o=await E(O,B,C)}else{const C=t??a.length;do{const c=m===0?l[0]??r.initialPageParam:He(r,o);if(m>0&&c==null)break;o=await E(o,c),m++}while(m<C)}return o};e.options.persister?e.fetchFn=()=>{var y,P;return(P=(y=e.options).persister)==null?void 0:P.call(y,I,{client:e.client,queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},n)}:e.fetchFn=I}}}function He(t,{pages:e,pageParams:n}){const r=e.length-1;return e.length>0?t.getNextPageParam(e[r],e,n[r],n):void 0}function xt(t,{pages:e,pageParams:n}){var r;return e.length>0?(r=t.getPreviousPageParam)==null?void 0:r.call(t,e[0],e,n[0],n):void 0}var ae,H,oe,j,J,D,ge,Z,U,yt,k,at,Gn=(at=class extends Lt{constructor(e){super();d(this,U);d(this,ae);d(this,H);d(this,oe);d(this,j);d(this,J);d(this,D);d(this,ge);d(this,Z);u(this,Z,!1),u(this,ge,e.defaultOptions),this.setOptions(e.options),this.observers=[],u(this,J,e.client),u(this,j,s(this,J).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,u(this,H,Ze(this.options)),this.state=e.state??s(this,H),this.scheduleGc()}get meta(){return this.options.meta}get queryType(){return s(this,ae)}get promise(){var e;return(e=s(this,D))==null?void 0:e.promise}setOptions(e){if(this.options={...s(this,ge),...e},e!=null&&e._type&&u(this,ae,e._type),this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const n=Ze(this.options);n.data!==void 0&&(this.setState(Je(n.data,n.dataUpdatedAt)),u(this,H,n))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&s(this,j).remove(this)}setData(e,n){const r=Fe(this.state.data,e,this.options);return b(this,U,k).call(this,{data:r,type:"success",dataUpdatedAt:n==null?void 0:n.updatedAt,manual:n==null?void 0:n.manual}),r}setState(e){b(this,U,k).call(this,{type:"setState",state:e})}cancel(e){var r,i;const n=(r=s(this,D))==null?void 0:r.promise;return(i=s(this,D))==null||i.cancel(e),n?n.then(me).catch(me):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}get resetState(){return s(this,H)}reset(){this.destroy(),this.setState(this.resetState)}isActive(){return this.observers.some(e=>q(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===ht||!this.isFetched()}isFetched(){return this.state.dataUpdateCount+this.state.errorUpdateCount>0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>ne(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!ct(this.state.dataUpdatedAt,e)}onFocus(){var n;const e=this.observers.find(r=>r.shouldFetchOnWindowFocus());e==null||e.refetch({cancelRefetch:!1}),(n=s(this,D))==null||n.continue()}onOnline(){var n;const e=this.observers.find(r=>r.shouldFetchOnReconnect());e==null||e.refetch({cancelRefetch:!1}),(n=s(this,D))==null||n.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),s(this,j).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.observers.includes(e)&&(this.observers=this.observers.filter(n=>n!==e),this.observers.length||(s(this,D)&&(s(this,Z)||b(this,U,yt).call(this)?s(this,D).cancel({revert:!0}):s(this,D).cancelRetry()),this.scheduleGc()),s(this,j).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||b(this,U,k).call(this,{type:"invalidate"})}async fetch(e,n){var I,g,h,S,f,R,y,P,w,E,C;if(this.state.fetchStatus!=="idle"&&((I=s(this,D))==null?void 0:I.status())!=="rejected"){if(this.state.data!==void 0&&(n!=null&&n.cancelRefetch))this.cancel({silent:!0});else if(s(this,D))return s(this,D).continueRetry(),s(this,D).promise}if(e&&this.setOptions(e),!this.options.queryFn){const c=this.observers.find(O=>O.options.queryFn);c&&this.setOptions(c.options)}const r=new AbortController,i=c=>{Object.defineProperty(c,"signal",{enumerable:!0,get:()=>(u(this,Z,!0),r.signal)})},a=()=>{const c=dt(this.options,n),B=(()=>{const de={client:s(this,J),queryKey:this.queryKey,meta:this.meta};return i(de),de})();return u(this,Z,!1),this.options.persister?this.options.persister(c,B,this):c(B)},o=(()=>{const c={fetchOptions:n,options:this.options,queryKey:this.queryKey,client:s(this,J),state:this.state,fetchFn:a};return i(c),c})(),m=s(this,ae)==="infinite"?Mt(this.options.pages):this.options.behavior;m==null||m.onFetch(o,this),u(this,oe,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((g=o.fetchOptions)==null?void 0:g.meta))&&b(this,U,k).call(this,{type:"fetch",meta:(h=o.fetchOptions)==null?void 0:h.meta}),u(this,D,Qt({initialPromise:n==null?void 0:n.initialPromise,fn:o.fetchFn,onCancel:c=>{c instanceof Ae&&c.revert&&this.setState({...s(this,oe),fetchStatus:"idle"}),r.abort()},onFail:(c,O)=>{b(this,U,k).call(this,{type:"failed",failureCount:c,error:O})},onPause:()=>{b(this,U,k).call(this,{type:"pause"})},onContinue:()=>{b(this,U,k).call(this,{type:"continue"})},retry:o.options.retry,retryDelay:o.options.retryDelay,networkMode:o.options.networkMode,canRun:()=>!0}));try{const c=await s(this,D).start();if(c===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(c),(f=(S=s(this,j).config).onSuccess)==null||f.call(S,c,this),(y=(R=s(this,j).config).onSettled)==null||y.call(R,c,this.state.error,this),c}catch(c){if(c instanceof Ae){if(c.silent)return s(this,D).promise;if(c.revert){if(this.state.data===void 0)throw c;return this.state.data}}throw b(this,U,k).call(this,{type:"error",error:c}),(w=(P=s(this,j).config).onError)==null||w.call(P,c,this),(C=(E=s(this,j).config).onSettled)==null||C.call(E,this.state.data,c,this),c}finally{this.scheduleGc()}}},ae=new WeakMap,H=new WeakMap,oe=new WeakMap,j=new WeakMap,J=new WeakMap,D=new WeakMap,ge=new WeakMap,Z=new WeakMap,U=new WeakSet,yt=function(){return this.state.fetchStatus==="paused"&&this.state.status==="pending"},k=function(e){const n=r=>{switch(e.type){case"failed":return{...r,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...r,fetchStatus:"paused"};case"continue":return{...r,fetchStatus:"fetching"};case"fetch":return{...r,...gt(r.data,this.options),fetchMeta:e.meta??null};case"success":const i={...r,...Je(e.data,e.dataUpdatedAt),dataUpdateCount:r.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return u(this,oe,e.manual?i:void 0),i;case"error":const a=e.error;return{...r,error:a,errorUpdateCount:r.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:r.fetchFailureCount+1,fetchFailureReason:a,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...r,isInvalidated:!0};case"setState":return{...r,...e.state}}};this.state=n(this.state),Me.batch(()=>{this.observers.forEach(r=>{r.onQueryUpdate()}),s(this,j).notify({query:this,type:"updated",action:e})})},at);function gt(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:mt(e.networkMode)?"fetching":"paused",...t===void 0&&{error:null,status:"pending"}}}function Je(t,e){return{data:t,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function Ze(t){const e=typeof t.initialData=="function"?t.initialData():t.initialData,n=e!==void 0,r=n?typeof t.initialDataUpdatedAt=="function"?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:n?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:n?"success":"pending",fetchStatus:"idle"}}var A,p,ve,T,X,ue,z,x,be,ce,le,ee,te,V,he,v,fe,Ue,qe,je,Ge,Be,Ne,ke,vt,ot,Vt=(ot=class extends Qe{constructor(e,n){super();d(this,v);d(this,A);d(this,p);d(this,ve);d(this,T);d(this,X);d(this,ue);d(this,z);d(this,x);d(this,be);d(this,ce);d(this,le);d(this,ee);d(this,te);d(this,V);d(this,he,new Set);this.options=n,u(this,A,e),u(this,x,null),u(this,z,Te()),this.bindMethods(),this.setOptions(n)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(s(this,p).addObserver(this),Xe(s(this,p),this.options)?b(this,v,fe).call(this):this.updateResult(),b(this,v,Ge).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return ze(s(this,p),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return ze(s(this,p),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,b(this,v,Be).call(this),b(this,v,Ne).call(this),s(this,p).removeObserver(this)}setOptions(e){const n=this.options,r=s(this,p);if(this.options=s(this,A).defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof q(this.options.enabled,s(this,p))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");b(this,v,ke).call(this),s(this,p).setOptions(this.options),n._defaulted&&!_e(this.options,n)&&s(this,A).getQueryCache().notify({type:"observerOptionsUpdated",query:s(this,p),observer:this});const i=this.hasListeners();i&&et(s(this,p),r,this.options,n)&&b(this,v,fe).call(this),this.updateResult(),i&&(s(this,p)!==r||q(this.options.enabled,s(this,p))!==q(n.enabled,s(this,p))||ne(this.options.staleTime,s(this,p))!==ne(n.staleTime,s(this,p)))&&b(this,v,Ue).call(this);const a=b(this,v,qe).call(this);i&&(s(this,p)!==r||q(this.options.enabled,s(this,p))!==q(n.enabled,s(this,p))||a!==s(this,V))&&b(this,v,je).call(this,a)}getOptimisticResult(e){const n=s(this,A).getQueryCache().build(s(this,A),e),r=this.createResult(n,e);return Kt(this,r)&&(u(this,T,r),u(this,ue,this.options),u(this,X,s(this,p).state)),r}getCurrentResult(){return s(this,T)}trackResult(e,n){return new Proxy(e,{get:(r,i)=>(this.trackProp(i),n==null||n(i),i==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&s(this,z).status==="pending"&&s(this,z).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(r,i))})}trackProp(e){s(this,he).add(e)}getCurrentQuery(){return s(this,p)}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const n=s(this,A).defaultQueryOptions(e),r=s(this,A).getQueryCache().build(s(this,A),n);return r.fetch().then(()=>this.createResult(r,n))}fetch(e){return b(this,v,fe).call(this,{...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),s(this,T)))}createResult(e,n){var pe;const r=s(this,p),i=this.options,a=s(this,T),l=s(this,X),o=s(this,ue),I=e!==r?e.state:s(this,ve),{state:g}=e;let h={...g},S=!1,f;if(n._optimisticResults){const F=this.hasListeners(),$=!F&&Xe(e,n),Pe=F&&et(e,r,n,i);($||Pe)&&(h={...h,...gt(g.data,e.options)}),n._optimisticResults==="isRestoring"&&(h.fetchStatus="idle")}let{error:R,errorUpdatedAt:y,status:P}=h;f=h.data;let w=!1;if(n.placeholderData!==void 0&&f===void 0&&P==="pending"){let F;a!=null&&a.isPlaceholderData&&n.placeholderData===(o==null?void 0:o.placeholderData)?(F=a.data,w=!0):F=typeof n.placeholderData=="function"?n.placeholderData((pe=s(this,le))==null?void 0:pe.state.data,s(this,le)):n.placeholderData,F!==void 0&&(P="success",f=Fe(a==null?void 0:a.data,F,n),S=!0)}if(n.select&&f!==void 0&&!w)if(a&&f===(l==null?void 0:l.data)&&n.select===s(this,be))f=s(this,ce);else try{u(this,be,n.select),f=n.select(f),f=Fe(a==null?void 0:a.data,f,n),u(this,ce,f),u(this,x,null)}catch(F){u(this,x,F)}s(this,x)&&(R=s(this,x),f=s(this,ce),y=Date.now(),P="error");const E=h.fetchStatus==="fetching",C=P==="pending",c=P==="error",O=C&&E,B=f!==void 0,N={status:P,fetchStatus:h.fetchStatus,isPending:C,isSuccess:P==="success",isError:c,isInitialLoading:O,isLoading:O,data:f,dataUpdatedAt:h.dataUpdatedAt,error:R,errorUpdatedAt:y,failureCount:h.fetchFailureCount,failureReason:h.fetchFailureReason,errorUpdateCount:h.errorUpdateCount,isFetched:e.isFetched(),isFetchedAfterMount:h.dataUpdateCount>I.dataUpdateCount||h.errorUpdateCount>I.errorUpdateCount,isFetching:E,isRefetching:E&&!C,isLoadingError:c&&!B,isPaused:h.fetchStatus==="paused",isPlaceholderData:S,isRefetchError:c&&B,isStale:xe(e,n),refetch:this.refetch,promise:s(this,z),isEnabled:q(n.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){const F=N.data!==void 0,$=N.status==="error"&&!F,Pe=Se=>{$?Se.reject(N.error):F&&Se.resolve(N.data)},Ve=()=>{const Se=u(this,z,N.promise=Te());Pe(Se)},we=s(this,z);switch(we.status){case"pending":e.queryHash===r.queryHash&&Pe(we);break;case"fulfilled":($||N.data!==we.value)&&Ve();break;case"rejected":(!$||N.error!==we.reason)&&Ve();break}}return N}updateResult(){const e=s(this,T),n=this.createResult(s(this,p),this.options);if(u(this,X,s(this,p).state),u(this,ue,this.options),s(this,X).data!==void 0&&u(this,le,s(this,p)),_e(n,e))return;u(this,T,n);const r=()=>{if(!e)return!0;const{notifyOnChangeProps:i}=this.options,a=typeof i=="function"?i():i;if(a==="all"||!a&&!s(this,he).size)return!0;const l=new Set(a??s(this,he));return this.options.throwOnError&&l.add("error"),Object.keys(s(this,T)).some(o=>{const m=o;return s(this,T)[m]!==e[m]&&l.has(m)})};b(this,v,vt).call(this,{listeners:r()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&b(this,v,Ge).call(this)}},A=new WeakMap,p=new WeakMap,ve=new WeakMap,T=new WeakMap,X=new WeakMap,ue=new WeakMap,z=new WeakMap,x=new WeakMap,be=new WeakMap,ce=new WeakMap,le=new WeakMap,ee=new WeakMap,te=new WeakMap,V=new WeakMap,he=new WeakMap,v=new WeakSet,fe=function(e){b(this,v,ke).call(this);let n=s(this,p).fetch(this.options,e);return e!=null&&e.throwOnError||(n=n.catch(me)),n},Ue=function(){b(this,v,Be).call(this);const e=ne(this.options.staleTime,s(this,p));if(ye.isServer()||s(this,T).isStale||!De(e))return;const r=ct(s(this,T).dataUpdatedAt,e)+1;u(this,ee,W.setTimeout(()=>{s(this,T).isStale||this.updateResult()},r))},qe=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(s(this,p)):this.options.refetchInterval)??!1},je=function(e){b(this,v,Ne).call(this),u(this,V,e),!(ye.isServer()||q(this.options.enabled,s(this,p))===!1||!De(s(this,V))||s(this,V)===0)&&u(this,te,W.setInterval(()=>{(this.options.refetchIntervalInBackground||ut.isFocused())&&b(this,v,fe).call(this)},s(this,V)))},Ge=function(){b(this,v,Ue).call(this),b(this,v,je).call(this,b(this,v,qe).call(this))},Be=function(){s(this,ee)!==void 0&&(W.clearTimeout(s(this,ee)),u(this,ee,void 0))},Ne=function(){s(this,te)!==void 0&&(W.clearInterval(s(this,te)),u(this,te,void 0))},ke=function(){const e=s(this,A).getQueryCache().build(s(this,A),this.options);if(e===s(this,p))return;const n=s(this,p);u(this,p,e),u(this,ve,e.state),this.hasListeners()&&(n==null||n.removeObserver(this),e.addObserver(this))},vt=function(e){Me.batch(()=>{e.listeners&&this.listeners.forEach(n=>{n(s(this,T))}),s(this,A).getQueryCache().notify({query:s(this,p),type:"observerResultsUpdated"})})},ot);function Wt(t,e){return q(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&q(e.retryOnMount,t)===!1)}function Xe(t,e){return Wt(t,e)||t.state.data!==void 0&&ze(t,e,e.refetchOnMount)}function ze(t,e,n){if(q(e.enabled,t)!==!1&&ne(e.staleTime,t)!=="static"){const r=typeof n=="function"?n(t):n;return r==="always"||r!==!1&&xe(t,e)}return!1}function et(t,e,n,r){return(t!==e||q(r.enabled,t)===!1)&&(!n.suspense||t.state.status!=="error")&&xe(t,n)}function xe(t,e){return q(e.enabled,t)!==!1&&t.isStaleByTime(ne(e.staleTime,t))}function Kt(t,e){return!_e(t.getCurrentResult(),e)}var bt=G.createContext(void 0),Yt=t=>{const e=G.useContext(bt);if(!e)throw new Error("No QueryClient set, use QueryClientProvider to set one");return e},Bn=({client:t,children:e})=>(G.useEffect(()=>(t.mount(),()=>{t.unmount()}),[t]),Dt.jsx(bt.Provider,{value:t,children:e})),Pt=G.createContext(!1),Ht=()=>G.useContext(Pt);Pt.Provider;function Jt(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}var Zt=G.createContext(Jt()),Xt=()=>G.useContext(Zt),en=(t,e,n)=>{const r=n!=null&&n.state.error&&typeof t.throwOnError=="function"?pt(t.throwOnError,[n.state.error,n]):t.throwOnError;(t.suspense||t.experimental_prefetchInRender||r)&&(e.isReset()||(t.retryOnMount=!1))},tn=t=>{G.useEffect(()=>{t.clearReset()},[t])},nn=({result:t,errorResetBoundary:e,throwOnError:n,query:r,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&r&&(i&&t.data===void 0||pt(n,[t.error,r])),rn=t=>{if(t.suspense){const n=i=>i==="static"?i:Math.max(i??1e3,1e3),r=t.staleTime;t.staleTime=typeof r=="function"?(...i)=>n(r(...i)):n(r),typeof t.gcTime=="number"&&(t.gcTime=Math.max(t.gcTime,1e3))}},sn=(t,e)=>t.isLoading&&t.isFetching&&!e,an=(t,e)=>(t==null?void 0:t.suspense)&&e.isPending,tt=(t,e,n)=>e.fetchOptimistic(t).catch(()=>{n.clearReset()});function on(t,e,n){var f,R,y,P;const r=Ht(),i=Xt(),a=Yt(),l=a.defaultQueryOptions(t);(R=(f=a.getDefaultOptions().queries)==null?void 0:f._experimental_beforeQuery)==null||R.call(f,l);const o=a.getQueryCache().get(l.queryHash),m=t.subscribed!==!1;l._optimisticResults=r?"isRestoring":m?"optimistic":void 0,rn(l),en(l,i,o),tn(i);const I=!a.getQueryCache().get(l.queryHash),[g]=G.useState(()=>new e(a,l)),h=g.getOptimisticResult(l),S=!r&&m;if(G.useSyncExternalStore(G.useCallback(w=>{const E=S?g.subscribe(Me.batchCalls(w)):me;return g.updateResult(),E},[g,S]),()=>g.getCurrentResult(),()=>g.getCurrentResult()),G.useEffect(()=>{g.setOptions(l)},[l,g]),an(l,h))throw tt(l,g,i);if(nn({result:h,errorResetBoundary:i,throwOnError:l.throwOnError,query:o,suspense:l.suspense}))throw h.error;if((P=(y=a.getDefaultOptions().queries)==null?void 0:y._experimental_afterQuery)==null||P.call(y,l,h),l.experimental_prefetchInRender&&!ye.isServer()&&sn(h,r)){const w=I?tt(l,g,i):o==null?void 0:o.promise;w==null||w.catch(me).finally(()=>{g.updateResult()})}return l.notifyOnChangeProps?h:g.trackResult(h)}function Nn(t,e){return on(t,Vt)}const wt={};var Re={};const un="https://ly-budget-gql-prod-702918025200.asia-east1.run.app/api/graphql",cn="https://ly-budget-gql-dev-702918025200.asia-east1.run.app/api/graphql",ln=()=>typeof import.meta<"u"&&typeof wt<"u"?"https://ly-budget-gql-dev-702918025200.asia-east1.run.app/api/graphql":typeof process<"u"?Re.VITE_GQL_ENDPOINT??Re.GQL_ENDPOINT??Re.GRAPHQL_ENDPOINT??null:null,hn=()=>typeof import.meta<"u"&&typeof wt<"u"||typeof process<"u"?"production":null,dn=ln(),St=hn();console.log({mode:St});const Ct=dn??(St==="production"?un:cn);console.log({GQL_ENDPOINTS:Ct});const kn="/";async function zn(t,...[e]){const n=await fetch(Ct,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/graphql-response+json"},body:JSON.stringify({query:t,variables:e})});if(!n.ok)throw new Error("Network response was not ok");return(await n.json()).data}var pn=(t=>(t.Asc="asc",t.Desc="desc",t))(pn||{}),fn=(t=>(t.Freeze="freeze",t.Other="other",t.Reduce="reduce",t))(fn||{});class _ extends String{constructor(n,r){super(n);Ce(this,"__apiType");Ce(this,"value");Ce(this,"__meta__");this.value=n,this.__meta__=r}toString(){return this.value}}const $n=new _(`
    fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}
    `,{fragmentName:"VisualizationProposalBase"}),Qn=new _(`
    fragment VisualizationProposalWithContext on Proposal {
  ...VisualizationProposalBase
  government {
    name
    category
  }
  year {
    year
  }
}
    fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}`,{fragmentName:"VisualizationProposalWithContext"}),mn=new _(`
    query GetLatestBudgetYear($skip: Int!, $take: Int!) {
  budgetYears(orderBy: [{year: desc}], skip: $skip, take: $take) {
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),yn=new _(`
    query GetBudgetYearsList {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
  }
}
    `),gn=new _(`
    query GetBudgetsWithGovernment {
  budgets {
    id
    type
    year
    projectName
    projectDescription
    budgetAmount
    majorCategory
    mediumCategory
    minorCategory
    description
    government {
      id
      name
      category
    }
  }
  budgetsCount
}
    `),vn=new _(`
    query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
    `),bn=new _(`
    query GetProposalGovernments($where: ProposalWhereInput!) {
  proposals(where: $where) {
    government {
      id
      name
      category
      description
    }
  }
}
    `),Pn=new _(`
    query GetPeopleList {
  peopleList(orderBy: [{name: asc}]) {
    id
    name
    type
    description
    party {
      id
      name
    }
  }
}
    `),wn=new _(`
    query RecognitionImages {
  recognitionImages(where: {verificationStatus: {equals: "verified"}}) {
    result
  }
  recognitionImagesCount
}
    `),Sn=new _(`
    query People($where: PeopleWhereUniqueInput!) {
  people(where: $where) {
    id
    name
    description
    party {
      id
      color
      name
    }
    term {
      termNumber
      id
    }
    termCount
    committees {
      id
      name
      session
      term {
        id
        startDate
        termNumber
      }
    }
  }
}
    `),Cn=new _(`
    query GetProposalsOrderedByIdDesc {
  proposals(orderBy: [{id: desc}]) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      budgetAmount
      year
      type
      majorCategory
      mediumCategory
      minorCategory
    }
    proposers {
      id
      name
      type
      description
    }
    coSigners {
      id
      name
      type
    }
  }
  proposalsCount
}
    `),In=new _(`
    query GetProposalById($id: ID!) {
  proposal(where: {id: $id}) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    unfreezeReport
    react_angry
    react_disappoint
    react_good
    react_whatever
    budgetImageUrl
    historicalParentProposals {
      id
    }
    mergedParentProposals {
      id
      proposers {
        id
        name
      }
    }
    historicalProposals {
      id
    }
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      projectDescription
      budgetAmount
      budgetUrl
      lastYearSettlement
      year
      type
      majorCategory
      mediumCategory
      minorCategory
      description
    }
    proposers {
      id
      name
      type
      description
    }
    coSigners {
      id
      name
      type
    }
    meetings(orderBy: [{meetingDate: desc}]) {
      id
      displayName
      meetingDate
      description
      location
      meetingRecordUrl
      type
      committee {
        displayName
        name
        endDate
        startDate
      }
    }
    unfreezeHistory {
      id
      displayName
      meetingDate
      description
      location
      meetingRecordUrl
      type
      committee {
        displayName
        name
        endDate
        startDate
      }
    }
    mergedProposals {
      id
      proposers {
        id
        name
      }
    }
    historicalProposals {
      id
      meetings {
        id
      }
      proposers {
        id
        name
      }
    }
  }
}
    `),Rn=new _(`
    query GetProposalYears {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),Dn=new _(`
    query GetPaginatedProposals($skip: Int!, $take: Int!, $orderBy: [ProposalOrderByInput!]!, $where: ProposalWhereInput!) {
  proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
    id
    description
    year {
      id
      year
    }
    unfreezeStatus
    meetings {
      id
      type
      committee {
        displayName
        name
        endDate
        startDate
      }
    }
    reason
    result
    freezeAmount
    reductionAmount
    proposalTypes
    react_angry
    react_disappoint
    react_good
    react_whatever
    government {
      id
      name
    }
    budget {
      id
      budgetAmount
    }
    proposers {
      id
      name
    }
  }
  proposalsCount(where: $where)
}
    `),En=new _(`
    mutation UPDATE_PROPOSAL_REACTS($where: ProposalWhereUniqueInput!, $data: ProposalUpdateInput!) {
  updateProposal(where: $where, data: $data) {
    id
    react_angry
    react_disappoint
    react_good
    react_whatever
  }
}
    `),_n=new _(`
    query GetVisualizationProposals($where: ProposalWhereInput!) {
  proposals(where: $where) {
    ...VisualizationProposalWithContext
  }
}
    fragment VisualizationProposalWithContext on Proposal {
  ...VisualizationProposalBase
  government {
    name
    category
  }
  year {
    year
  }
}
fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}`),On={"\n  query GetLatestBudgetYear($skip: Int!, $take: Int!) {\n    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":mn,"\n  query GetBudgetYearsList {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n    }\n  }\n":yn,"\n  query GetBudgetsWithGovernment {\n    budgets {\n      id\n      type\n      year\n      projectName\n      projectDescription\n      budgetAmount\n      majorCategory\n      mediumCategory\n      minorCategory\n      description\n      government {\n        id\n        name\n        category\n      }\n    }\n    budgetsCount\n  }\n":gn,"\n  query GetGovernments {\n    governments {\n      id\n      name\n      category\n      description\n    }\n  }\n":vn,"\n  query GetProposalGovernments($where: ProposalWhereInput!) {\n    proposals(where: $where) {\n      government {\n        id\n        name\n        category\n        description\n      }\n    }\n  }\n":bn,"\n  query GetPeopleList {\n    peopleList(orderBy: [{ name: asc }]) {\n      id\n      name\n      type\n      description\n      party {\n        id\n        name\n      }\n    }\n  }\n":Pn,'\n  query RecognitionImages {\n    recognitionImages(where: { verificationStatus: { equals: "verified" } }) {\n      result\n    }\n    recognitionImagesCount\n  }\n':wn,"\n  query People($where: PeopleWhereUniqueInput!) {\n    people(where: $where) {\n      id\n      name\n      description\n      party {\n        id\n        color\n        name\n      }\n      term {\n        termNumber\n        id\n      }\n      termCount\n      committees {\n        id\n        name\n        session\n        term {\n          id\n          startDate\n          termNumber\n        }\n      }\n    }\n  }\n":Sn,"\n  query GetProposalsOrderedByIdDesc {\n    proposals(orderBy: [{ id: desc }]) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        budgetAmount\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n    }\n    proposalsCount\n  }\n":Cn,"\n  query GetProposalById($id: ID!) {\n    proposal(where: { id: $id }) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      unfreezeReport\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      budgetImageUrl\n      historicalParentProposals {\n        id\n      }\n      mergedParentProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n      }\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        projectDescription\n        budgetAmount\n        budgetUrl\n        lastYearSettlement\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n        description\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n      meetings(orderBy: [{ meetingDate: desc }]) {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      unfreezeHistory {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      mergedProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n        meetings {\n          id\n        }\n        proposers {\n          id\n          name\n        }\n      }\n    }\n  }\n":In,"\n  query GetProposalYears {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":Rn,"\n  query GetPaginatedProposals(\n    $skip: Int!\n    $take: Int!\n    $orderBy: [ProposalOrderByInput!]!\n    $where: ProposalWhereInput!\n  ) {\n    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {\n      id\n      description\n      year {\n        id\n        year\n      }\n      unfreezeStatus\n      meetings {\n        id\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      reason\n      result\n      freezeAmount\n      reductionAmount\n      proposalTypes\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      government {\n        id\n        name\n      }\n      budget {\n        id\n        budgetAmount\n      }\n      proposers {\n        id\n        name\n      }\n    }\n    proposalsCount(where: $where)\n  }\n":Dn,"\n  mutation UPDATE_PROPOSAL_REACTS(\n    $where: ProposalWhereUniqueInput!\n    $data: ProposalUpdateInput!\n  ) {\n    updateProposal(where: $where, data: $data) {\n      id\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n    }\n  }\n":En,"\n  query GetVisualizationProposals($where: ProposalWhereInput!) {\n    proposals(where: $where) {\n      ...VisualizationProposalWithContext\n    }\n  }\n\n  fragment VisualizationProposalWithContext on Proposal {\n    ...VisualizationProposalBase\n    government {\n      name\n      category\n    }\n    year {\n      year\n    }\n  }\n\n  fragment VisualizationProposalBase on Proposal {\n    id\n    freezeAmount\n    reductionAmount\n    proposalTypes\n    proposers {\n      id\n      name\n      party {\n        name\n        color\n      }\n    }\n  }\n":_n};function Ln(t){return On[t]??{}}export{kn as E,pn as O,fn as P,Gn as Q,Lt as R,Qe as S,Qn as V,me as a,Un as b,An as c,Ee as d,zn as e,ut as f,Bn as g,At as h,Ln as i,$n as j,jn as k,_e as l,qn as m,Me as n,ft as o,Le as p,Yt as q,ne as r,ht as s,pt as t,Nn as u,Qt as v};
