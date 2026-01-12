var gt=Object.defineProperty;var Le=t=>{throw TypeError(t)};var vt=(t,e,s)=>e in t?gt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var be=(t,e,s)=>vt(t,typeof e!="symbol"?e+"":e,s),we=(t,e,s)=>e.has(t)||Le("Cannot "+s);var n=(t,e,s)=>(we(t,e,"read from private field"),s?s.call(t):e.get(t)),d=(t,e,s)=>e.has(t)?Le("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),u=(t,e,s,r)=>(we(t,e,"write to private field"),r?r.call(t,s):e.set(t,s),s),y=(t,e,s)=>(we(t,e,"access private method"),s);import{a as U,p as bt}from"./chunk-EPOLDU6W-BUbbWhPN.js";var Be=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},Pt={setTimeout:(t,e)=>setTimeout(t,e),clearTimeout:t=>clearTimeout(t),setInterval:(t,e)=>setInterval(t,e),clearInterval:t=>clearInterval(t)},N,ze,Ze,wt=(Ze=class{constructor(){d(this,N,Pt);d(this,ze,!1)}setTimeoutProvider(t){u(this,N,t)}setTimeout(t,e){return n(this,N).setTimeout(t,e)}clearTimeout(t){n(this,N).clearTimeout(t)}setInterval(t,e){return n(this,N).setInterval(t,e)}clearInterval(t){n(this,N).clearInterval(t)}},N=new WeakMap,ze=new WeakMap,Ze),V=new wt;function St(t){setTimeout(t,0)}var te=typeof window>"u"||"Deno"in globalThis;function pe(){}function vs(t,e){return typeof t=="function"?t(e):t}function Ce(t){return typeof t=="number"&&t>=0&&t!==1/0}function rt(t,e){return Math.max(t+(e||0)-Date.now(),0)}function ne(t,e){return typeof t=="function"?t(e):t}function F(t,e){return typeof t=="function"?t(e):t}function bs(t,e){const{type:s="all",exact:r,fetchStatus:i,predicate:a,queryKey:c,stale:o}=t;if(c){if(r){if(e.queryHash!==Ct(c,e.options))return!1}else if(!Ge(e.queryKey,c))return!1}if(s!=="all"){const v=e.isActive();if(s==="active"&&!v||s==="inactive"&&v)return!1}return!(typeof o=="boolean"&&e.isStale()!==o||i&&i!==e.state.fetchStatus||a&&!a(e))}function Ps(t,e){const{exact:s,status:r,predicate:i,mutationKey:a}=t;if(a){if(!e.options.mutationKey)return!1;if(s){if(Ie(e.options.mutationKey)!==Ie(a))return!1}else if(!Ge(e.options.mutationKey,a))return!1}return!(r&&e.state.status!==r||i&&!i(e))}function Ct(t,e){return((e==null?void 0:e.queryKeyHashFn)||Ie)(t)}function Ie(t){return JSON.stringify(t,(e,s)=>Ee(s)?Object.keys(s).sort().reduce((r,i)=>(r[i]=s[i],r),{}):s)}function Ge(t,e){return t===e?!0:typeof t!=typeof e?!1:t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(e).every(s=>Ge(t[s],e[s])):!1}var It=Object.prototype.hasOwnProperty;function it(t,e){if(t===e)return t;const s=Qe(t)&&Qe(e);if(!s&&!(Ee(t)&&Ee(e)))return e;const i=(s?t:Object.keys(t)).length,a=s?e:Object.keys(e),c=a.length,o=s?new Array(c):{};let v=0;for(let m=0;m<c;m++){const P=s?m:a[m],p=t[P],S=e[P];if(p===S){o[P]=p,(s?m<i:It.call(t,P))&&v++;continue}if(p===null||S===null||typeof p!="object"||typeof S!="object"){o[P]=S;continue}const g=it(p,S);o[P]=g,g===p&&v++}return i===c&&v===i?t:o}function Re(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(const s in t)if(t[s]!==e[s])return!1;return!0}function Qe(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function Ee(t){if(!Ve(t))return!1;const e=t.constructor;if(e===void 0)return!0;const s=e.prototype;return!(!Ve(s)||!s.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(t)!==Object.prototype)}function Ve(t){return Object.prototype.toString.call(t)==="[object Object]"}function Rt(t){return new Promise(e=>{V.setTimeout(e,t)})}function De(t,e,s){return typeof s.structuralSharing=="function"?s.structuralSharing(t,e):s.structuralSharing!==!1?it(t,e):e}function ws(t){return t}function Ss(t,e,s=0){const r=[...t,e];return s&&r.length>s?r.slice(1):r}function Cs(t,e,s=0){const r=[e,...t];return s&&r.length>s?r.slice(0,-1):r}var at=Symbol();function Et(t,e){return!t.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!t.queryFn||t.queryFn===at?()=>Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`)):t.queryFn}function ot(t,e){return typeof t=="function"?t(...e):!!t}function Is(t,e,s){let r=!1,i;return Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(i??(i=e()),r||(r=!0,i.aborted?s():i.addEventListener("abort",s,{once:!0})),i)}),t}var W,$,re,Xe,Dt=(Xe=class extends Be{constructor(){super();d(this,W);d(this,$);d(this,re);u(this,re,e=>{if(!te&&window.addEventListener){const s=()=>e();return window.addEventListener("visibilitychange",s,!1),()=>{window.removeEventListener("visibilitychange",s)}}})}onSubscribe(){n(this,$)||this.setEventListener(n(this,re))}onUnsubscribe(){var e;this.hasListeners()||((e=n(this,$))==null||e.call(this),u(this,$,void 0))}setEventListener(e){var s;u(this,re,e),(s=n(this,$))==null||s.call(this),u(this,$,e(r=>{typeof r=="boolean"?this.setFocused(r):this.onFocus()}))}setFocused(e){n(this,W)!==e&&(u(this,W,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(s=>{s(e)})}isFocused(){var e;return typeof n(this,W)=="boolean"?n(this,W):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},W=new WeakMap,$=new WeakMap,re=new WeakMap,Xe),ut=new Dt;function _e(){let t,e;const s=new Promise((i,a)=>{t=i,e=a});s.status="pending",s.catch(()=>{});function r(i){Object.assign(s,i),delete s.resolve,delete s.reject}return s.resolve=i=>{r({status:"fulfilled",value:i}),t(i)},s.reject=i=>{r({status:"rejected",reason:i}),e(i)},s}var _t=St;function Ot(){let t=[],e=0,s=o=>{o()},r=o=>{o()},i=_t;const a=o=>{e?t.push(o):i(()=>{s(o)})},c=()=>{const o=t;t=[],o.length&&i(()=>{r(()=>{o.forEach(v=>{s(v)})})})};return{batch:o=>{let v;e++;try{v=o()}finally{e--,e||c()}return v},batchCalls:o=>(...v)=>{a(()=>{o(...v)})},schedule:a,setNotifyFunction:o=>{s=o},setBatchNotifyFunction:o=>{r=o},setScheduler:o=>{i=o}}}var Ne=Ot(),ie,M,ae,et,Tt=(et=class extends Be{constructor(){super();d(this,ie,!0);d(this,M);d(this,ae);u(this,ae,e=>{if(!te&&window.addEventListener){const s=()=>e(!0),r=()=>e(!1);return window.addEventListener("online",s,!1),window.addEventListener("offline",r,!1),()=>{window.removeEventListener("online",s),window.removeEventListener("offline",r)}}})}onSubscribe(){n(this,M)||this.setEventListener(n(this,ae))}onUnsubscribe(){var e;this.hasListeners()||((e=n(this,M))==null||e.call(this),u(this,M,void 0))}setEventListener(e){var s;u(this,ae,e),(s=n(this,M))==null||s.call(this),u(this,M,e(this.setOnline.bind(this)))}setOnline(e){n(this,ie)!==e&&(u(this,ie,e),this.listeners.forEach(r=>{r(e)}))}isOnline(){return n(this,ie)}},ie=new WeakMap,M=new WeakMap,ae=new WeakMap,et),ct=new Tt;function At(t){return Math.min(1e3*2**t,3e4)}function lt(t){return(t??"online")==="online"?ct.isOnline():!0}var Oe=class extends Error{constructor(t){super("CancelledError"),this.revert=t==null?void 0:t.revert,this.silent=t==null?void 0:t.silent}};function Ft(t){let e=!1,s=0,r;const i=_e(),a=()=>i.status!=="pending",c=w=>{var b;if(!a()){const C=new Oe(w);S(C),(b=t.onCancel)==null||b.call(t,C)}},o=()=>{e=!0},v=()=>{e=!1},m=()=>ut.isFocused()&&(t.networkMode==="always"||ct.isOnline())&&t.canRun(),P=()=>lt(t.networkMode)&&t.canRun(),p=w=>{a()||(r==null||r(),i.resolve(w))},S=w=>{a()||(r==null||r(),i.reject(w))},g=()=>new Promise(w=>{var b;r=C=>{(a()||m())&&w(C)},(b=t.onPause)==null||b.call(t)}).then(()=>{var w;r=void 0,a()||(w=t.onContinue)==null||w.call(t)}),E=()=>{if(a())return;let w;const b=s===0?t.initialPromise:void 0;try{w=b??t.fn()}catch(C){w=Promise.reject(C)}Promise.resolve(w).then(p).catch(C=>{var G;if(a())return;const O=t.retry??(te?0:3),x=t.retryDelay??At,l=typeof x=="function"?x(s,C):x,k=O===!0||typeof O=="number"&&s<O||typeof O=="function"&&O(s,C);if(e||!k){S(C);return}s++,(G=t.onFail)==null||G.call(t,s,C),Rt(l).then(()=>m()?void 0:g()).then(()=>{e?S(C):E()})})};return{promise:i,status:()=>i.status,cancel:c,continue:()=>(r==null||r(),i),cancelRetry:o,continueRetry:v,canStart:P,start:()=>(P()?E():g().then(E),i)}}var K,tt,Ut=(tt=class{constructor(){d(this,K)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),Ce(this.gcTime)&&u(this,K,V.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??(te?1/0:300*1e3))}clearGcTimeout(){n(this,K)&&(V.clearTimeout(n(this,K)),u(this,K,void 0))}},K=new WeakMap,tt),H,oe,A,Y,I,fe,J,j,z,st,Rs=(st=class extends Ut{constructor(e){super();d(this,j);d(this,H);d(this,oe);d(this,A);d(this,Y);d(this,I);d(this,fe);d(this,J);u(this,J,!1),u(this,fe,e.defaultOptions),this.setOptions(e.options),this.observers=[],u(this,Y,e.client),u(this,A,n(this,Y).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,u(this,H,Ke(this.options)),this.state=e.state??n(this,H),this.scheduleGc()}get meta(){return this.options.meta}get promise(){var e;return(e=n(this,I))==null?void 0:e.promise}setOptions(e){if(this.options={...n(this,fe),...e},this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const s=Ke(this.options);s.data!==void 0&&(this.setState(We(s.data,s.dataUpdatedAt)),u(this,H,s))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&n(this,A).remove(this)}setData(e,s){const r=De(this.state.data,e,this.options);return y(this,j,z).call(this,{data:r,type:"success",dataUpdatedAt:s==null?void 0:s.updatedAt,manual:s==null?void 0:s.manual}),r}setState(e,s){y(this,j,z).call(this,{type:"setState",state:e,setStateOptions:s})}cancel(e){var r,i;const s=(r=n(this,I))==null?void 0:r.promise;return(i=n(this,I))==null||i.cancel(e),s?s.then(pe).catch(pe):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(n(this,H))}isActive(){return this.observers.some(e=>F(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===at||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>ne(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!rt(this.state.dataUpdatedAt,e)}onFocus(){var s;const e=this.observers.find(r=>r.shouldFetchOnWindowFocus());e==null||e.refetch({cancelRefetch:!1}),(s=n(this,I))==null||s.continue()}onOnline(){var s;const e=this.observers.find(r=>r.shouldFetchOnReconnect());e==null||e.refetch({cancelRefetch:!1}),(s=n(this,I))==null||s.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),n(this,A).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.observers.includes(e)&&(this.observers=this.observers.filter(s=>s!==e),this.observers.length||(n(this,I)&&(n(this,J)?n(this,I).cancel({revert:!0}):n(this,I).cancelRetry()),this.scheduleGc()),n(this,A).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||y(this,j,z).call(this,{type:"invalidate"})}async fetch(e,s){var v,m,P,p,S,g,E,w,b,C,O,x;if(this.state.fetchStatus!=="idle"&&((v=n(this,I))==null?void 0:v.status())!=="rejected"){if(this.state.data!==void 0&&(s!=null&&s.cancelRefetch))this.cancel({silent:!0});else if(n(this,I))return n(this,I).continueRetry(),n(this,I).promise}if(e&&this.setOptions(e),!this.options.queryFn){const l=this.observers.find(k=>k.options.queryFn);l&&this.setOptions(l.options)}const r=new AbortController,i=l=>{Object.defineProperty(l,"signal",{enumerable:!0,get:()=>(u(this,J,!0),r.signal)})},a=()=>{const l=Et(this.options,s),G=(()=>{const Pe={client:n(this,Y),queryKey:this.queryKey,meta:this.meta};return i(Pe),Pe})();return u(this,J,!1),this.options.persister?this.options.persister(l,G,this):l(G)},o=(()=>{const l={fetchOptions:s,options:this.options,queryKey:this.queryKey,client:n(this,Y),state:this.state,fetchFn:a};return i(l),l})();(m=this.options.behavior)==null||m.onFetch(o,this),u(this,oe,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((P=o.fetchOptions)==null?void 0:P.meta))&&y(this,j,z).call(this,{type:"fetch",meta:(p=o.fetchOptions)==null?void 0:p.meta}),u(this,I,Ft({initialPromise:s==null?void 0:s.initialPromise,fn:o.fetchFn,onCancel:l=>{l instanceof Oe&&l.revert&&this.setState({...n(this,oe),fetchStatus:"idle"}),r.abort()},onFail:(l,k)=>{y(this,j,z).call(this,{type:"failed",failureCount:l,error:k})},onPause:()=>{y(this,j,z).call(this,{type:"pause"})},onContinue:()=>{y(this,j,z).call(this,{type:"continue"})},retry:o.options.retry,retryDelay:o.options.retryDelay,networkMode:o.options.networkMode,canRun:()=>!0}));try{const l=await n(this,I).start();if(l===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(l),(g=(S=n(this,A).config).onSuccess)==null||g.call(S,l,this),(w=(E=n(this,A).config).onSettled)==null||w.call(E,l,this.state.error,this),l}catch(l){if(l instanceof Oe){if(l.silent)return n(this,I).promise;if(l.revert){if(this.state.data===void 0)throw l;return this.state.data}}throw y(this,j,z).call(this,{type:"error",error:l}),(C=(b=n(this,A).config).onError)==null||C.call(b,l,this),(x=(O=n(this,A).config).onSettled)==null||x.call(O,this.state.data,l,this),l}finally{this.scheduleGc()}}},H=new WeakMap,oe=new WeakMap,A=new WeakMap,Y=new WeakMap,I=new WeakMap,fe=new WeakMap,J=new WeakMap,j=new WeakSet,z=function(e){const s=r=>{switch(e.type){case"failed":return{...r,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...r,fetchStatus:"paused"};case"continue":return{...r,fetchStatus:"fetching"};case"fetch":return{...r,...ht(r.data,this.options),fetchMeta:e.meta??null};case"success":const i={...r,...We(e.data,e.dataUpdatedAt),dataUpdateCount:r.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return u(this,oe,e.manual?i:void 0),i;case"error":const a=e.error;return{...r,error:a,errorUpdateCount:r.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:r.fetchFailureCount+1,fetchFailureReason:a,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...r,isInvalidated:!0};case"setState":return{...r,...e.state}}};this.state=s(this.state),Ne.batch(()=>{this.observers.forEach(r=>{r.onQueryUpdate()}),n(this,A).notify({query:this,type:"updated",action:e})})},st);function ht(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:lt(e.networkMode)?"fetching":"paused",...t===void 0&&{error:null,status:"pending"}}}function We(t,e){return{data:t,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function Ke(t){const e=typeof t.initialData=="function"?t.initialData():t.initialData,s=e!==void 0,r=s?typeof t.initialDataUpdatedAt=="function"?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:s?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:s?"success":"pending",fetchStatus:"idle"}}var D,h,me,R,Z,ue,B,L,ye,ce,le,X,ee,Q,he,f,de,Te,Ae,Fe,Ue,je,xe,qe,dt,nt,jt=(nt=class extends Be{constructor(e,s){super();d(this,f);d(this,D);d(this,h);d(this,me);d(this,R);d(this,Z);d(this,ue);d(this,B);d(this,L);d(this,ye);d(this,ce);d(this,le);d(this,X);d(this,ee);d(this,Q);d(this,he,new Set);this.options=s,u(this,D,e),u(this,L,null),u(this,B,_e()),this.bindMethods(),this.setOptions(s)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(n(this,h).addObserver(this),He(n(this,h),this.options)?y(this,f,de).call(this):this.updateResult(),y(this,f,Ue).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return ke(n(this,h),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return ke(n(this,h),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,y(this,f,je).call(this),y(this,f,xe).call(this),n(this,h).removeObserver(this)}setOptions(e){const s=this.options,r=n(this,h);if(this.options=n(this,D).defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof F(this.options.enabled,n(this,h))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");y(this,f,qe).call(this),n(this,h).setOptions(this.options),s._defaulted&&!Re(this.options,s)&&n(this,D).getQueryCache().notify({type:"observerOptionsUpdated",query:n(this,h),observer:this});const i=this.hasListeners();i&&Ye(n(this,h),r,this.options,s)&&y(this,f,de).call(this),this.updateResult(),i&&(n(this,h)!==r||F(this.options.enabled,n(this,h))!==F(s.enabled,n(this,h))||ne(this.options.staleTime,n(this,h))!==ne(s.staleTime,n(this,h)))&&y(this,f,Te).call(this);const a=y(this,f,Ae).call(this);i&&(n(this,h)!==r||F(this.options.enabled,n(this,h))!==F(s.enabled,n(this,h))||a!==n(this,Q))&&y(this,f,Fe).call(this,a)}getOptimisticResult(e){const s=n(this,D).getQueryCache().build(n(this,D),e),r=this.createResult(s,e);return qt(this,r)&&(u(this,R,r),u(this,ue,this.options),u(this,Z,n(this,h).state)),r}getCurrentResult(){return n(this,R)}trackResult(e,s){return new Proxy(e,{get:(r,i)=>(this.trackProp(i),s==null||s(i),i==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&n(this,B).status==="pending"&&n(this,B).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(r,i))})}trackProp(e){n(this,he).add(e)}getCurrentQuery(){return n(this,h)}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const s=n(this,D).defaultQueryOptions(e),r=n(this,D).getQueryCache().build(n(this,D),s);return r.fetch().then(()=>this.createResult(r,s))}fetch(e){return y(this,f,de).call(this,{...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),n(this,R)))}createResult(e,s){var Me;const r=n(this,h),i=this.options,a=n(this,R),c=n(this,Z),o=n(this,ue),m=e!==r?e.state:n(this,me),{state:P}=e;let p={...P},S=!1,g;if(s._optimisticResults){const T=this.hasListeners(),ge=!T&&He(e,s),se=T&&Ye(e,r,s,i);(ge||se)&&(p={...p,...ht(P.data,e.options)}),s._optimisticResults==="isRestoring"&&(p.fetchStatus="idle")}let{error:E,errorUpdatedAt:w,status:b}=p;g=p.data;let C=!1;if(s.placeholderData!==void 0&&g===void 0&&b==="pending"){let T;a!=null&&a.isPlaceholderData&&s.placeholderData===(o==null?void 0:o.placeholderData)?(T=a.data,C=!0):T=typeof s.placeholderData=="function"?s.placeholderData((Me=n(this,le))==null?void 0:Me.state.data,n(this,le)):s.placeholderData,T!==void 0&&(b="success",g=De(a==null?void 0:a.data,T,s),S=!0)}if(s.select&&g!==void 0&&!C)if(a&&g===(c==null?void 0:c.data)&&s.select===n(this,ye))g=n(this,ce);else try{u(this,ye,s.select),g=s.select(g),g=De(a==null?void 0:a.data,g,s),u(this,ce,g),u(this,L,null)}catch(T){u(this,L,T)}n(this,L)&&(E=n(this,L),g=n(this,ce),w=Date.now(),b="error");const O=p.fetchStatus==="fetching",x=b==="pending",l=b==="error",k=x&&O,G=g!==void 0,q={status:b,fetchStatus:p.fetchStatus,isPending:x,isSuccess:b==="success",isError:l,isInitialLoading:k,isLoading:k,data:g,dataUpdatedAt:p.dataUpdatedAt,error:E,errorUpdatedAt:w,failureCount:p.fetchFailureCount,failureReason:p.fetchFailureReason,errorUpdateCount:p.errorUpdateCount,isFetched:p.dataUpdateCount>0||p.errorUpdateCount>0,isFetchedAfterMount:p.dataUpdateCount>m.dataUpdateCount||p.errorUpdateCount>m.errorUpdateCount,isFetching:O,isRefetching:O&&!x,isLoadingError:l&&!G,isPaused:p.fetchStatus==="paused",isPlaceholderData:S,isRefetchError:l&&G,isStale:$e(e,s),refetch:this.refetch,promise:n(this,B),isEnabled:F(s.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){const T=ve=>{q.status==="error"?ve.reject(q.error):q.data!==void 0&&ve.resolve(q.data)},ge=()=>{const ve=u(this,B,q.promise=_e());T(ve)},se=n(this,B);switch(se.status){case"pending":e.queryHash===r.queryHash&&T(se);break;case"fulfilled":(q.status==="error"||q.data!==se.value)&&ge();break;case"rejected":(q.status!=="error"||q.error!==se.reason)&&ge();break}}return q}updateResult(){const e=n(this,R),s=this.createResult(n(this,h),this.options);if(u(this,Z,n(this,h).state),u(this,ue,this.options),n(this,Z).data!==void 0&&u(this,le,n(this,h)),Re(s,e))return;u(this,R,s);const r=()=>{if(!e)return!0;const{notifyOnChangeProps:i}=this.options,a=typeof i=="function"?i():i;if(a==="all"||!a&&!n(this,he).size)return!0;const c=new Set(a??n(this,he));return this.options.throwOnError&&c.add("error"),Object.keys(n(this,R)).some(o=>{const v=o;return n(this,R)[v]!==e[v]&&c.has(v)})};y(this,f,dt).call(this,{listeners:r()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&y(this,f,Ue).call(this)}},D=new WeakMap,h=new WeakMap,me=new WeakMap,R=new WeakMap,Z=new WeakMap,ue=new WeakMap,B=new WeakMap,L=new WeakMap,ye=new WeakMap,ce=new WeakMap,le=new WeakMap,X=new WeakMap,ee=new WeakMap,Q=new WeakMap,he=new WeakMap,f=new WeakSet,de=function(e){y(this,f,qe).call(this);let s=n(this,h).fetch(this.options,e);return e!=null&&e.throwOnError||(s=s.catch(pe)),s},Te=function(){y(this,f,je).call(this);const e=ne(this.options.staleTime,n(this,h));if(te||n(this,R).isStale||!Ce(e))return;const r=rt(n(this,R).dataUpdatedAt,e)+1;u(this,X,V.setTimeout(()=>{n(this,R).isStale||this.updateResult()},r))},Ae=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(n(this,h)):this.options.refetchInterval)??!1},Fe=function(e){y(this,f,xe).call(this),u(this,Q,e),!(te||F(this.options.enabled,n(this,h))===!1||!Ce(n(this,Q))||n(this,Q)===0)&&u(this,ee,V.setInterval(()=>{(this.options.refetchIntervalInBackground||ut.isFocused())&&y(this,f,de).call(this)},n(this,Q)))},Ue=function(){y(this,f,Te).call(this),y(this,f,Fe).call(this,y(this,f,Ae).call(this))},je=function(){n(this,X)&&(V.clearTimeout(n(this,X)),u(this,X,void 0))},xe=function(){n(this,ee)&&(V.clearInterval(n(this,ee)),u(this,ee,void 0))},qe=function(){const e=n(this,D).getQueryCache().build(n(this,D),this.options);if(e===n(this,h))return;const s=n(this,h);u(this,h,e),u(this,me,e.state),this.hasListeners()&&(s==null||s.removeObserver(this),e.addObserver(this))},dt=function(e){Ne.batch(()=>{e.listeners&&this.listeners.forEach(s=>{s(n(this,R))}),n(this,D).getQueryCache().notify({query:n(this,h),type:"observerResultsUpdated"})})},nt);function xt(t,e){return F(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&e.retryOnMount===!1)}function He(t,e){return xt(t,e)||t.state.data!==void 0&&ke(t,e,e.refetchOnMount)}function ke(t,e,s){if(F(e.enabled,t)!==!1&&ne(e.staleTime,t)!=="static"){const r=typeof s=="function"?s(t):s;return r==="always"||r!==!1&&$e(t,e)}return!1}function Ye(t,e,s,r){return(t!==e||F(r.enabled,t)===!1)&&(!s.suspense||t.state.status!=="error")&&$e(t,s)}function $e(t,e){return F(e.enabled,t)!==!1&&t.isStaleByTime(ne(e.staleTime,t))}function qt(t,e){return!Re(t.getCurrentResult(),e)}var pt=U.createContext(void 0),kt=t=>{const e=U.useContext(pt);if(!e)throw new Error("No QueryClient set, use QueryClientProvider to set one");return e},Es=({client:t,children:e})=>(U.useEffect(()=>(t.mount(),()=>{t.unmount()}),[t]),bt.jsx(pt.Provider,{value:t,children:e})),ft=U.createContext(!1),zt=()=>U.useContext(ft);ft.Provider;function Bt(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}var Gt=U.createContext(Bt()),Nt=()=>U.useContext(Gt),$t=(t,e,s)=>{const r=s!=null&&s.state.error&&typeof t.throwOnError=="function"?ot(t.throwOnError,[s.state.error,s]):t.throwOnError;(t.suspense||t.experimental_prefetchInRender||r)&&(e.isReset()||(t.retryOnMount=!1))},Mt=t=>{U.useEffect(()=>{t.clearReset()},[t])},Lt=({result:t,errorResetBoundary:e,throwOnError:s,query:r,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&r&&(i&&t.data===void 0||ot(s,[t.error,r])),Qt=t=>{if(t.suspense){const s=i=>i==="static"?i:Math.max(i??1e3,1e3),r=t.staleTime;t.staleTime=typeof r=="function"?(...i)=>s(r(...i)):s(r),typeof t.gcTime=="number"&&(t.gcTime=Math.max(t.gcTime,1e3))}},Vt=(t,e)=>t.isLoading&&t.isFetching&&!e,Wt=(t,e)=>(t==null?void 0:t.suspense)&&e.isPending,Je=(t,e,s)=>e.fetchOptimistic(t).catch(()=>{s.clearReset()});function Kt(t,e,s){var S,g,E,w;const r=zt(),i=Nt(),a=kt(),c=a.defaultQueryOptions(t);(g=(S=a.getDefaultOptions().queries)==null?void 0:S._experimental_beforeQuery)==null||g.call(S,c);const o=a.getQueryCache().get(c.queryHash);c._optimisticResults=r?"isRestoring":"optimistic",Qt(c),$t(c,i,o),Mt(i);const v=!a.getQueryCache().get(c.queryHash),[m]=U.useState(()=>new e(a,c)),P=m.getOptimisticResult(c),p=!r&&t.subscribed!==!1;if(U.useSyncExternalStore(U.useCallback(b=>{const C=p?m.subscribe(Ne.batchCalls(b)):pe;return m.updateResult(),C},[m,p]),()=>m.getCurrentResult(),()=>m.getCurrentResult()),U.useEffect(()=>{m.setOptions(c)},[c,m]),Wt(c,P))throw Je(c,m,i);if(Lt({result:P,errorResetBoundary:i,throwOnError:c.throwOnError,query:o,suspense:c.suspense}))throw P.error;if((w=(E=a.getDefaultOptions().queries)==null?void 0:E._experimental_afterQuery)==null||w.call(E,c,P),c.experimental_prefetchInRender&&!te&&Vt(P,r)){const b=v?Je(c,m,i):o==null?void 0:o.promise;b==null||b.catch(pe).finally(()=>{m.updateResult()})}return c.notifyOnChangeProps?P:m.trackResult(P)}function Ds(t,e){return Kt(t,jt)}const Ht={};var Se={};const Yt="https://ly-budget-gql-prod-702918025200.asia-east1.run.app/api/graphql",Jt="https://ly-budget-gql-dev-702918025200.asia-east1.run.app/api/graphql",Zt=()=>typeof process<"u"?Se.VITE_GQL_ENDPOINT??Se.GQL_ENDPOINT??Se.GRAPHQL_ENDPOINT??null:null,Xt=()=>typeof import.meta<"u"&&typeof Ht<"u"||typeof process<"u"?"production":null,es=Zt(),mt=Xt();console.log({mode:mt});const yt=es??(mt==="production"?Yt:Jt);console.log({GQL_ENDPOINTS:yt});const _s="/";async function Os(t,...[e]){const s=await fetch(yt,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/graphql-response+json"},body:JSON.stringify({query:t,variables:e})});if(!s.ok)throw new Error("Network response was not ok");return(await s.json()).data}var ts=(t=>(t.Asc="asc",t.Desc="desc",t))(ts||{}),ss=(t=>(t.Freeze="freeze",t.Other="other",t.Reduce="reduce",t))(ss||{});class _ extends String{constructor(s,r){super(s);be(this,"__apiType");be(this,"value");be(this,"__meta__");this.value=s,this.__meta__=r}toString(){return this.value}}const Ts=new _(`
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
    `,{fragmentName:"VisualizationProposalBase"}),As=new _(`
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
}`,{fragmentName:"VisualizationProposalWithContext"}),ns=new _(`
    query GetLatestBudgetYear($skip: Int!, $take: Int!) {
  budgetYears(orderBy: [{year: desc}], skip: $skip, take: $take) {
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),rs=new _(`
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
    `),is=new _(`
    query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
    `),as=new _(`
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
    `),os=new _(`
    query RecognitionImages {
  recognitionImages(where: {verificationStatus: {equals: "verified"}}) {
    result
  }
  recognitionImagesCount
}
    `),us=new _(`
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
    `),cs=new _(`
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
    `),ls=new _(`
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
    `),hs=new _(`
    query GetProposalYears {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),ds=new _(`
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
    `),ps=new _(`
    mutation UPDATE_PROPOSAL_REACTS($where: ProposalWhereUniqueInput!, $data: ProposalUpdateInput!) {
  updateProposal(where: $where, data: $data) {
    id
    react_angry
    react_disappoint
    react_good
    react_whatever
  }
}
    `),fs=new _(`
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
}`),ms={"\n  query GetLatestBudgetYear($skip: Int!, $take: Int!) {\n    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":ns,"\n  query GetBudgetsWithGovernment {\n    budgets {\n      id\n      type\n      year\n      projectName\n      projectDescription\n      budgetAmount\n      majorCategory\n      mediumCategory\n      minorCategory\n      description\n      government {\n        id\n        name\n        category\n      }\n    }\n    budgetsCount\n  }\n":rs,"\n  query GetGovernments {\n    governments {\n      id\n      name\n      category\n      description\n    }\n  }\n":is,"\n  query GetPeopleList {\n    peopleList(orderBy: [{ name: asc }]) {\n      id\n      name\n      type\n      description\n      party {\n        id\n        name\n      }\n    }\n  }\n":as,'\n  query RecognitionImages {\n    recognitionImages(where: { verificationStatus: { equals: "verified" } }) {\n      result\n    }\n    recognitionImagesCount\n  }\n':os,"\n  query People($where: PeopleWhereUniqueInput!) {\n    people(where: $where) {\n      id\n      name\n      description\n      party {\n        id\n        color\n        name\n      }\n      term {\n        termNumber\n        id\n      }\n      termCount\n      committees {\n        id\n        name\n        session\n        term {\n          id\n          startDate\n          termNumber\n        }\n      }\n    }\n  }\n":us,"\n  query GetProposalsOrderedByIdDesc {\n    proposals(orderBy: [{ id: desc }]) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        budgetAmount\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n    }\n    proposalsCount\n  }\n":cs,"\n  query GetProposalById($id: ID!) {\n    proposal(where: { id: $id }) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      budgetImageUrl\n      historicalParentProposals {\n        id\n      }\n      mergedParentProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n      }\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        projectDescription\n        budgetAmount\n        budgetUrl\n        lastYearSettlement\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n        description\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n      meetings(orderBy: [{ meetingDate: desc }]) {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      mergedProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n        meetings {\n          id\n        }\n        proposers {\n          id\n          name\n        }\n      }\n    }\n  }\n":ls,"\n  query GetProposalYears {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":hs,"\n  query GetPaginatedProposals(\n    $skip: Int!\n    $take: Int!\n    $orderBy: [ProposalOrderByInput!]!\n    $where: ProposalWhereInput!\n  ) {\n    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {\n      id\n      description\n      year {\n        id\n        year\n      }\n      unfreezeStatus\n      meetings {\n        id\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      reason\n      result\n      freezeAmount\n      reductionAmount\n      proposalTypes\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      government {\n        id\n        name\n      }\n      budget {\n        id\n        budgetAmount\n      }\n      proposers {\n        id\n        name\n      }\n    }\n    proposalsCount(where: $where)\n  }\n":ds,"\n  mutation UPDATE_PROPOSAL_REACTS(\n    $where: ProposalWhereUniqueInput!\n    $data: ProposalUpdateInput!\n  ) {\n    updateProposal(where: $where, data: $data) {\n      id\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n    }\n  }\n":ps,"\n  query GetVisualizationProposals($where: ProposalWhereInput!) {\n    proposals(where: $where) {\n      ...VisualizationProposalWithContext\n    }\n  }\n\n  fragment VisualizationProposalWithContext on Proposal {\n    ...VisualizationProposalBase\n    government {\n      name\n      category\n    }\n    year {\n      year\n    }\n  }\n\n  fragment VisualizationProposalBase on Proposal {\n    id\n    freezeAmount\n    reductionAmount\n    proposalTypes\n    proposers {\n      id\n      name\n      party {\n        name\n        color\n      }\n    }\n  }\n":fs};function Fs(t){return ms[t]??{}}export{_s as E,ts as O,ss as P,Rs as Q,Ut as R,Be as S,As as V,Cs as a,Ss as b,Is as c,pe as d,Et as e,bs as f,ut as g,Ct as h,vs as i,Ie as j,Os as k,Es as l,Ps as m,Ne as n,ct as o,Ge as p,ws as q,ne as r,at as s,Ts as t,Ds as u,Fs as v,Re as w,kt as x,ot as y,Ft as z};
