import{j as e}from"./mui-vendor-Ch3u1txE.js";import{r as t}from"./react-vendor-CYnrZ62f.js";import{a as r}from"./index-z-z7bop-.js";import"./utils-Bon0u5qF.js";const s=()=>{const[s,a]=t.useState("student"),[n,l]=t.useState([]),[o,i]=t.useState([]),[d,c]=t.useState(""),[u,m]=t.useState("");t.useEffect((()=>{window.scrollTo(0,0)}),[]),t.useEffect((()=>{(async()=>{var e;try{const t=await r.get("/users/me/");200===t.status?a((null==(e=t.data.user_type)?void 0:e.toLowerCase())||"student"):a("student")}catch(t){a("student")}})()}),[]);const h=()=>{const e=document.cookie.split(";");for(let t of e)if(t=t.trim(),t.startsWith("csrftoken="))return t.substring(10);return null};t.useEffect((()=>{(async()=>{try{const e=await r.get("/files/shared-files/");l(e.data)}catch(e){}})()}),[]),t.useEffect((()=>{(async()=>{try{const e=await r.get("/files/announcements/");e.data&&e.data.length,i(e.data)}catch(e){}})()}),[]);return e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 mt-24",children:[e.jsxs("div",{className:"container mx-auto space-y-8 max-w-6xl",children:[e.jsx("h1",{className:"text-4xl font-bold text-center text-gray-800 mb-12 relative",children:e.jsxs("span",{className:"relative inline-block",children:["teacher"===s?"Teacher's":"Student"," shared files",e.jsx("div",{className:"absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform -skew-x-12"})]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[e.jsxs("section",{className:"backdrop-blur-sm bg-gradient-to-br from-emerald-100/95 via-white/90 to-green-100/95 rounded-lg p-6 shadow-xl border border-white/50",children:[e.jsxs("h2",{className:"text-2xl font-semibold text-gray-800 mb-6 flex items-center",children:[e.jsx("span",{className:"text-3xl mr-2",children:"📢"}),e.jsx("span",{children:"Announcements"})]}),"teacher"===s&&e.jsxs("form",{onSubmit:async e=>{if(e.preventDefault(),d.trim())try{const e={...(await r.post("/files/announcements/",{title:u,content:d,posted_at:(new Date).toISOString()},{headers:{"X-CSRFToken":h()}})).data,posted_at:(new Date).toISOString()};i([e,...o]),c(""),m("")}catch(t){}},className:"mb-8 space-y-3",children:[e.jsx("input",{type:"text",placeholder:"Title",value:u,onChange:e=>m(e.target.value),className:"w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80"}),e.jsx("textarea",{placeholder:"Write your announcement...",value:d,onChange:e=>c(e.target.value),className:"w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] bg-white/80"}),e.jsxs("button",{type:"submit",className:"w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2",children:[e.jsx("span",{children:"Post Announcement"}),e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})})]})]}),e.jsx("div",{className:"space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar",children:o.map((t=>e.jsxs("div",{className:"bg-yellow-100/90 p-4 rounded-lg shadow-sm border-b-4 border-yellow-200 hover:shadow-md transition-all duration-200",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("h3",{className:"font-semibold text-gray-800",children:t.title}),"teacher"===s&&e.jsx("button",{onClick:()=>(async e=>{try{await r.delete(`/files/announcements/${e}/`,{headers:{"X-CSRFToken":h()}}),i(o.filter((t=>t.id!==e))),alert("Announcement deleted successfully!")}catch(t){}})(t.id),className:"text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})})})]}),e.jsx("p",{className:"text-gray-600 whitespace-pre-wrap",children:t.content}),e.jsx("p",{className:"text-sm text-gray-400 mt-2",children:t.posted_at?new Date(t.posted_at).toLocaleString("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}):"Recently added"})]},t.id)))})]}),e.jsxs("section",{className:"backdrop-blur-sm bg-gradient-to-br from-teal-100/95 via-white/90 to-emerald-100/95 rounded-lg p-6 shadow-xl border border-white/50",children:[e.jsxs("h2",{className:"text-2xl font-semibold text-gray-800 mb-6 flex items-center",children:[e.jsx("span",{className:"text-3xl mr-2",children:"📁"}),e.jsx("span",{children:"Shared Files"})]}),"teacher"===s&&e.jsxs("form",{onSubmit:async e=>{var t,s;e.preventDefault();const a=e.target.file.files[0];if(!a)return;const n=new FormData;n.append("file",a),n.append("title",e.target.title.value);try{await r.post("/files/shared-files/",n,{headers:{"Content-Type":"multipart/form-data","X-CSRFToken":h()}}),alert("File uploaded successfully!"),window.location.reload()}catch(l){alert("Error uploading file: "+((null==(s=null==(t=l.response)?void 0:t.data)?void 0:s.error)||"Unknown error"))}},className:"mb-8 space-y-3",children:[e.jsx("input",{type:"text",name:"title",placeholder:"File title",className:"w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80",required:!0}),e.jsx("input",{type:"file",name:"file",className:"w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80",required:!0}),e.jsxs("button",{type:"submit",className:"w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2",children:[e.jsx("span",{children:"Upload File"}),e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"})})]})]}),e.jsx("div",{className:"space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar",children:n.map((t=>e.jsxs("div",{className:"bg-white/60 p-4 rounded-lg shadow-sm border border-white/50 hover:shadow-md transition-all duration-200",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("h3",{className:"font-semibold text-gray-800",children:t.title}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsx("button",{onClick:()=>(async(e,t)=>{try{const s=await r.get(`/files/shared-files/${e}/`,{responseType:"blob"});let a=t;t.includes("/")&&(a=t.split("/").pop(),a=decodeURIComponent(a));const n=s.headers["content-type"],l=s.headers["content-disposition"],o=/filename="(.+)"/.exec(l),i=o&&o[1]?o[1]:a,d=window.URL.createObjectURL(new Blob([s.data],{type:n})),c=document.createElement("a");c.href=d,c.setAttribute("download",i),document.body.appendChild(c),c.click(),document.body.removeChild(c),window.URL.revokeObjectURL(d)}catch(s){alert("Error downloading file. Please try again.")}})(t.id,t.file),className:"text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"})})}),"teacher"===s&&e.jsx("button",{onClick:()=>(async e=>{try{await r.delete(`/files/shared-files/${e}/`,{headers:{"X-CSRFToken":h()}}),l(n.filter((t=>t.id!==e))),alert("File deleted successfully!")}catch(t){}})(t.id),className:"text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})})})]})]}),e.jsx("p",{className:"text-sm text-gray-400 mt-2",children:new Date(t.uploaded_at).toLocaleDateString()})]},t.id)))})]})]})]}),e.jsx("div",{className:"custom-scrollbar-styles"}),e.jsx("style",{dangerouslySetInnerHTML:{__html:"\n          .custom-scrollbar::-webkit-scrollbar {\n            width: 8px;\n          }\n          .custom-scrollbar::-webkit-scrollbar-track {\n            background: rgba(255, 255, 255, 0.1);\n            border-radius: 4px;\n          }\n          .custom-scrollbar::-webkit-scrollbar-thumb {\n            background: rgba(0, 0, 0, 0.2);\n            border-radius: 4px;\n          }\n          .custom-scrollbar::-webkit-scrollbar-thumb:hover {\n            background: rgba(0, 0, 0, 0.3);\n          }\n        "}})]})};export{s as default};
