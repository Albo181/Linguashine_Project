const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-D8JDGEil.js","assets/mui-vendor-Ch3u1txE.js","assets/react-vendor-CYnrZ62f.js","assets/BlogComponent-oaoBVi_-.js","assets/blogData-B7N_o0I7.js","assets/BlogComponent-XeUb9FOm.css","assets/Contact-iQN8gpxp.js","assets/iconBase-B17HFHX6.js","assets/utils-Bon0u5qF.js","assets/Method-Bcb0Lt_h.js","assets/Sobre_Mi-BMSVXgg4.js","assets/LoginPage-CGDSeoNs.js","assets/StudentProfilePage-DPHMJMLF.js","assets/StudentLanding-Hq5QDNHV.js","assets/FileDashboard-CT6Xqu4D.css","assets/FileDashboard-weu9YRWk.js","assets/FileDashboard-Cea24b_e.css","assets/SharedDriveDashboard-B_E84E9E.js","assets/BlogDetails-CV2lgiHX.js","assets/FeedbackForm-BtjVuNAd.js","assets/TeacherHomeworkReview-3wLVyMkT.js","assets/StudentHomeworkSummary-C5X1Ngtd.js","assets/Delete-D9n07g4_.js","assets/GradeSummary-54sI_sxI.js","assets/HomeworkPage-d0Hzi5wd.js"])))=>i.map(i=>d[i]);
import{j as e}from"./mui-vendor-Ch3u1txE.js";import{d as t,r as s,b as r,u as n,f as o,L as l,O as a,N as i,h as c,i as d,j as x,k as h}from"./react-vendor-CYnrZ62f.js";import{a as u}from"./utils-Bon0u5qF.js";var m;!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var p=t;m=p.createRoot,p.hydrateRoot;const f={},j=function(e,t,s){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),s=(null==e?void 0:e.nonce)||(null==e?void 0:e.getAttribute("nonce"));r=Promise.allSettled(t.map((e=>{if((e=function(e){return"/"+e}(e))in f)return;f[e]=!0;const t=e.endsWith(".css"),r=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${r}`))return;const n=document.createElement("link");return n.rel=t?"stylesheet":"modulepreload",t||(n.as="script"),n.crossOrigin="",n.href=e,s&&n.setAttribute("nonce",s),document.head.appendChild(n),t?new Promise(((t,s)=>{n.addEventListener("load",t),n.addEventListener("error",(()=>s(new Error(`Unable to preload CSS for ${e}`))))})):void 0})))}function n(e){const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then((t=>{for(const e of t||[])"rejected"===e.status&&n(e.reason);return e().catch(n)}))},g=()=>e.jsxs("div",{className:"lights-container",style:{position:"absolute",bottom:"-32px",left:0,width:"100%",height:"40px",zIndex:10,overflow:"hidden"},children:[e.jsx("div",{className:"lights",style:{position:"relative",display:"flex",justifyContent:"space-between",padding:"0 20px"},children:[...Array(20)].map(((t,s)=>e.jsx("div",{className:"light light-"+s%4,style:{width:"12px",height:"12px",borderRadius:"50%",margin:"0 15px",animation:`glow-${s%4} 1.4s infinite alternate`,boxShadow:"0 0 10px 2px rgba(255, 255, 255, 0.5)"}},s)))}),e.jsx("style",{jsx:"true",children:"\n        @keyframes glow-0 {\n          from { background-color: #ff0000; box-shadow: 0 0 10px 2px #ff0000; }\n          to { background-color: #ff6666; box-shadow: 0 0 20px 5px #ff0000; }\n        }\n        @keyframes glow-1 {\n          from { background-color: #00ff00; box-shadow: 0 0 10px 2px #00ff00; }\n          to { background-color: #66ff66; box-shadow: 0 0 20px 5px #00ff00; }\n        }\n        @keyframes glow-2 {\n          from { background-color: #0000ff; box-shadow: 0 0 10px 2px #0000ff; }\n          to { background-color: #6666ff; box-shadow: 0 0 20px 5px #0000ff; }\n        }\n        @keyframes glow-3 {\n          from { background-color: #ffff00; box-shadow: 0 0 10px 2px #ffff00; }\n          to { background-color: #ffff66; box-shadow: 0 0 20px 5px #ffff00; }\n        }\n        .lights-container::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          height: 2px;\n          background: #2c3e50;\n          z-index: 1;\n        }\n        .light {\n          position: relative;\n        }\n        .light::before {\n          content: '';\n          position: absolute;\n          top: -15px;\n          left: 50%;\n          width: 2px;\n          height: 15px;\n          background: #2c3e50;\n          transform: translateX(-50%);\n        }\n      "})]}),b="https://linguashineproject-production.up.railway.app",y=u.create({baseURL:b,withCredentials:!0,headers:{"Content-Type":"application/json"}});let w=null;y.interceptors.request.use((async e=>{if(!w)try{const e=await u.get(`${b}/users/api/get-csrf-token/`,{withCredentials:!0});w=e.data.csrfToken}catch(t){}return w&&(e.headers["X-CSRFToken"]=w),e})),y.interceptors.response.use((e=>e),(async e=>{var t,s;if(403===(null==(t=e.response)?void 0:t.status)||401===(null==(s=e.response)?void 0:s.status)){w=null;try{const t=await u.get(`${b}/users/api/get-csrf-token/`,{withCredentials:!0});w=t.data.csrfToken;const s=e.config;return s.headers["X-CSRFToken"]=w,u(s)}catch(r){return Promise.reject(e)}}return Promise.reject(e)}));const _=s.createContext(null),v=()=>{const e=s.useContext(_);if(!e)throw new Error("useAuth must be used within an AuthProvider");return e},k=({children:t})=>{const[n,o]=s.useState(!1),[l,a]=s.useState(null),[i,c]=s.useState(!0),d=s.useCallback((async()=>{try{if((await y.get("/users/check-auth/")).data.logged_in){if(!l){const e=await y.get("/users/me/");a(e.data)}return o(!0),!0}o(!1),a(null)}catch(e){o(!1),a(null)}finally{c(!1)}return!1}),[l]),x=s.useCallback((async(e,t)=>{try{if(200===(await y.post("/users/login/",{username:e,password:t})).status){const e=await y.get("/users/me/");return a(e.data),o(!0),!0}return!1}catch(s){throw o(!1),a(null),s}}),[]),h=s.useCallback((async()=>{try{await y.post("/users/logout/")}catch(e){}finally{o(!1),a(null)}}),[]);return r.useEffect((()=>{n||l||d()}),[d,n,l]),e.jsx(_.Provider,{value:{isAuthenticated:n,user:l,isLoading:i,login:x,logout:h,checkAuth:d},children:t})},N=()=>{const{isAuthenticated:t,checkAuth:r}=v(),[a,i]=s.useState(!1),[c,d]=s.useState(!1),x=n();o();const h=async()=>{try{200===(await y.post("/users/logout/")).status&&(await r(),i(!1),x("/"))}catch(e){}};return e.jsxs("nav",{className:"bg-green-950 fixed w-full z-20 top-0 start-0 border-b-4 border-white-950",children:[e.jsxs("div",{className:"max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4",children:[e.jsx(l,{to:"/",className:"flex items-center space-x-3 rtl:space-x-reverse",children:e.jsx("span",{className:"self-center text-2xl ml-2 sm:ml-12 font-bold whitespace-nowrap bg-clip-text text-transparent drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]",style:{backgroundImage:"linear-gradient(to right, #ffffff, #d4f2ff, #ffffff)",textShadow:"0 0 1px rgba(255, 255, 255, 0.8), 0 0 5px rgba(0, 0, 0, 0.5)",letterSpacing:"0.3px"},children:"Linguashine"})}),e.jsxs("div",{className:"hidden md:flex items-center space-x-4",children:[e.jsx(l,{to:"/contacto",children:e.jsx("button",{type:"button",className:"text-white bg-blue-700 hover:bg-blue-800 border-2 border-grey py-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 text-center",children:"Contactar"})}),e.jsx("span",{className:"text-white text-md font-bold",children:"Teléfono: 633 971 070"}),t?e.jsx("button",{onClick:h,className:"text-white bg-red-500 border-2 border-grey hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center",children:"Logout"}):e.jsx(l,{to:"/login",children:e.jsx("button",{type:"button",className:"text-white bg-green-700 hover:bg-green-800 border-2 border-grey focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center",children:"Acceder"})})]}),e.jsx("div",{className:"flex md:hidden",children:e.jsx("button",{onClick:()=>d(!c),className:"text-white p-2",children:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:c?e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"}):e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 6h16M4 12h16M4 18h16"})})})})]}),e.jsx(g,{}),e.jsx("div",{className:(c?"block":"hidden")+" md:hidden bg-green-950 border-t border-green-800",children:e.jsxs("div",{className:"px-4 pt-2 pb-3 space-y-3",children:[e.jsx(l,{to:"/contacto",className:"block",children:e.jsx("button",{type:"button",className:"w-full text-white bg-blue-700 hover:bg-blue-800 border-2 border-grey py-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 text-center",children:"Contactar"})}),e.jsx("div",{className:"text-white text-md font-bold text-center py-2",children:"Teléfono: 633 971 070"}),t?e.jsx("button",{onClick:h,className:"w-full text-white bg-red-500 border-2 border-grey hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center",children:"Logout"}):e.jsx(l,{to:"/login",className:"block",children:e.jsx("button",{type:"button",className:"w-full text-white bg-green-700 hover:bg-green-800 border-2 border-grey focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center",children:"Acceder"})})]})}),a&&e.jsx("div",{className:"popup absolute top-16 right-16 p-4 bg-gray-800 text-white rounded-lg",children:"You have been logged out successfully!"})]})},E=()=>e.jsx("footer",{className:"bg-green-950 border-t",children:e.jsxs("div",{className:"mx-auto w-full max-w-screen-xl p-2 sm:p-4 py-2 sm:py-6 lg:py-8",children:[e.jsxs("div",{className:"md:flex md:justify-around",children:[e.jsx("div",{className:"mb-3 md:mb-0 text-center md:text-left",children:e.jsx(l,{to:"/",className:"flex items-center justify-center md:justify-start",children:e.jsx("span",{className:"self-center text-lg sm:text-2xl font-bold whitespace-nowrap text-white",children:"Linguashine"})})}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 sm:gap-8 sm:grid-cols-3 text-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"mb-2 sm:mb-6 text-sm font-semibold uppercase text-white text-center",children:"Recursos"}),e.jsxs("ul",{className:"text-white text-sm sm:text-base font-medium space-y-2 sm:space-y-4 text-center",children:[e.jsx("li",{children:e.jsx(l,{to:"/",className:"hover:underline",children:"Cursos grabados"})}),e.jsx("li",{children:e.jsx(l,{to:"/login",className:"hover:underline",children:"Zona de Estudiantes"})})]})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"mb-2 sm:mb-6 text-sm font-semibold text-white uppercase text-center",children:"Follow"}),e.jsxs("ul",{className:"text-white text-sm sm:text-base font-medium space-y-2 sm:space-y-4 text-center",children:[e.jsx("li",{children:e.jsx("a",{href:"https://github.com/yourusername",target:"_blank",rel:"noopener noreferrer",className:"hover:underline",children:"Github"})}),e.jsx("li",{children:e.jsx("a",{href:"https://discord.gg/yourinvite",target:"_blank",rel:"noopener noreferrer",className:"hover:underline",children:"Discord"})})]})]}),e.jsxs("div",{className:"col-span-2 sm:col-span-1 mt-3 sm:mt-0",children:[e.jsx("h2",{className:"mb-2 sm:mb-6 text-sm font-semibold text-white uppercase text-center",children:"Legal"}),e.jsxs("ul",{className:"text-white text-sm sm:text-base font-medium space-y-2 sm:space-y-4 text-center",children:[e.jsx("li",{children:e.jsx(l,{to:"/",className:"hover:underline",children:"Privacy Policy"})}),e.jsx("li",{children:e.jsx(l,{to:"/",className:"hover:underline",children:"Terms & Conditions"})})]})]})]})]}),e.jsx("hr",{className:"my-3 sm:my-6 border-gray-200 sm:mx-auto lg:my-8"}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-3 sm:space-y-0",children:[e.jsxs("span",{className:"text-xs sm:text-sm text-white text-center",children:[" 2025 ",e.jsx(l,{to:"/",className:"hover:underline",children:"LentonEducation"}),". All Rights Reserved."]}),e.jsxs("div",{className:"flex justify-center space-x-3 sm:space-x-5",children:[e.jsxs("a",{href:"https://facebook.com/yourusername",target:"_blank",rel:"noopener noreferrer",className:"text-white hover:text-gray-900",children:[e.jsx("svg",{className:"w-4 h-4","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 8 19",children:e.jsx("path",{fillRule:"evenodd",d:"M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z",clipRule:"evenodd"})}),e.jsx("span",{className:"sr-only",children:"Facebook page"})]}),e.jsxs("a",{href:"https://twitter.com/yourusername",target:"_blank",rel:"noopener noreferrer",className:"text-white hover:text-gray-900",children:[e.jsx("svg",{className:"w-4 h-4","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 20 17",children:e.jsx("path",{fillRule:"evenodd",d:"M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z",clipRule:"evenodd"})}),e.jsx("span",{className:"sr-only",children:"Twitter page"})]})]})]})]})}),L=()=>e.jsxs(e.Fragment,{children:[e.jsx(N,{}),e.jsx("main",{className:"min-h-screen",children:e.jsx(a,{})}),e.jsx(E,{})]}),S=({children:t})=>{const{isAuthenticated:s,isLoading:r}=v(),n=o();return r?e.jsx("div",{children:"Loading..."}):s?t:e.jsx(i,{to:"/login",state:{from:n},replace:!0})},A=()=>{const{pathname:e}=o();return s.useLayoutEffect((()=>{document.documentElement.scrollTo({top:0,left:0,behavior:"instant"})}),[e]),null},P=()=>e.jsxs(e.Fragment,{children:[e.jsx(A,{}),e.jsx(L,{})]}),R=s.lazy((()=>j((()=>import("./HomePage-D8JDGEil.js")),__vite__mapDeps([0,1,2,3,4,5])))),T=s.lazy((()=>j((()=>import("./Contact-iQN8gpxp.js")),__vite__mapDeps([6,1,2,7,8])))),C=s.lazy((()=>j((()=>import("./Method-Bcb0Lt_h.js")),__vite__mapDeps([9,1,2,7])))),D=s.lazy((()=>j((()=>import("./Sobre_Mi-BMSVXgg4.js")),__vite__mapDeps([10,1,2])))),I=s.lazy((()=>j((()=>import("./LoginPage-CGDSeoNs.js")),__vite__mapDeps([11,1,2,8])))),O=s.lazy((()=>j((()=>import("./StudentProfilePage-DPHMJMLF.js")),__vite__mapDeps([12,1,2,8])))),z=s.lazy((()=>j((()=>import("./StudentLanding-Hq5QDNHV.js")),__vite__mapDeps([13,1,2,8,14])))),V=s.lazy((()=>j((()=>import("./FileDashboard-weu9YRWk.js")),__vite__mapDeps([15,1,2,8,16,14])))),M=s.lazy((()=>j((()=>import("./SharedDriveDashboard-B_E84E9E.js")),__vite__mapDeps([17,1,2,8])))),F=s.lazy((()=>j((()=>import("./BlogComponent-oaoBVi_-.js")),__vite__mapDeps([3,1,2,4,5])))),H=s.lazy((()=>j((()=>import("./BlogDetails-CV2lgiHX.js")),__vite__mapDeps([18,1,2,4])))),B=s.lazy((()=>j((()=>import("./FeedbackForm-BtjVuNAd.js")),__vite__mapDeps([19,1,2,8])))),$=s.lazy((()=>j((()=>import("./TeacherHomeworkReview-3wLVyMkT.js")),__vite__mapDeps([20,1,2,8])))),q=s.lazy((()=>j((()=>import("./StudentHomeworkSummary-C5X1Ngtd.js")),__vite__mapDeps([21,1,2,22,8])))),W=s.lazy((()=>j((()=>import("./GradeSummary-54sI_sxI.js")),__vite__mapDeps([23,1,2,8])))),X=s.lazy((()=>j((()=>import("./HomeworkPage-d0Hzi5wd.js")),__vite__mapDeps([24,1,2,22,8])))),Z=()=>e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"},children:e.jsx("div",{style:{width:"50px",height:"50px",border:"5px solid #f3f3f3",borderTop:"5px solid #3498db",borderRadius:"50%",animation:"spin 1s linear infinite"}})}),G=()=>{const t=c(d(e.jsxs(h,{path:"/",element:e.jsx(P,{}),children:[e.jsx(h,{index:!0,element:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(R,{})})}),e.jsx(h,{path:"/contacto",element:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(T,{})})}),e.jsx(h,{path:"/metodo",element:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(C,{})})}),e.jsx(h,{path:"/sobre-mi",element:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(D,{})})}),e.jsx(h,{path:"/login",element:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(I,{})})}),e.jsx(h,{path:"/blog",element:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(F,{})})}),e.jsx(h,{path:"/blog/:id",element:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(H,{})})}),e.jsx(h,{path:"/profile",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(O,{})})})}),e.jsx(h,{path:"/landing",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(z,{})})})}),e.jsx(h,{path:"/dash/files",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(V,{})})})}),e.jsx(h,{path:"/dash-shared/files",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(M,{})})})}),e.jsx(h,{path:"/feedback",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(B,{})})})}),e.jsx(h,{path:"/homework",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(X,{})})})}),e.jsx(h,{path:"/teacher-homework",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx($,{})})})}),e.jsx(h,{path:"/student-homework",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(q,{})})})}),e.jsx(h,{path:"/grade-summary-page",element:e.jsx(S,{children:e.jsx(s.Suspense,{fallback:e.jsx(Z,{}),children:e.jsx(W,{})})})})]})),{basename:"/",future:{v7_normalizeFormMethod:!0}});return e.jsx(k,{children:e.jsx(x,{router:t})})};m(document.getElementById("root")).render(e.jsx(G,{}));export{y as a,v as u};
