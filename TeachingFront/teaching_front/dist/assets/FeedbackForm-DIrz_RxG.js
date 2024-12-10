import{j as e,B as t,C as a,T as l,a as s,b as n,M as r}from"./mui-vendor-BMRJiz3v.js";import{u as i,r as o}from"./react-vendor-CYXGpHdp.js";import{a as d}from"./index-DxM4V5tE.js";import"./utils-BB-Y_vZ-.js";const u=()=>{const u=i(),[c,p]=o.useState(null),[m,h]=o.useState(""),[x,f]=o.useState([]),[v,g]=o.useState(""),[b,y]=o.useState(""),[j]=o.useState([{value:"Cambridge",label:"Cambridge"},{value:"Aptis",label:"Aptis"},{value:"EOI",label:"Escuela Oficial de Idiomas"},{value:"IELTS",label:"Ielts"},{value:"Trinity",label:"Trinity"},{value:"(Homework task)",label:"Homework Task"},{value:"(Essay)",label:"Essay"},{value:"(Project)",label:"Project"},{value:"*Other*",label:"Other"}]),[w,S]=o.useState(""),[_,C]=o.useState(""),[k,E]=o.useState(null),[F,P]=o.useState(null),[W,T]=o.useState(""),[D,I]=o.useState(""),[O,U]=o.useState(null),[B,H]=o.useState(null),[A,z]=o.useState(null),[G,L]=o.useState(""),[R,M]=o.useState(null),[q,N]=o.useState(!0),[$,X]=o.useState(null);o.useEffect((()=>{(async()=>{var e;try{(await d.get("/users/check-auth/")).data.logged_in||u("/login")}catch(t){401===(null==(e=t.response)?void 0:e.status)&&u("/login")}})()}),[u]);o.useEffect((()=>{(async()=>{try{N(!0);const e=(await d.get("/users/me/")).data;M(e.id),p(e),h(e.username||""),L(e.name||e.username||"Unknown Student")}catch(e){X("Failed to load user profile")}finally{N(!1)}})()}),[]),o.useEffect((()=>{c&&(async()=>{try{const e=(await d.get("/users/all-users/")).data.map((e=>({id:e.id,username:e.username,name:e.first_name?`${e.first_name} ${e.last_name}`:e.username,user_type:e.user_type}))),t=e.filter((e=>"student"===e.user_type)),a=e.filter((e=>"teacher"===e.user_type));f("teacher"===(null==c?void 0:c.user_type)?t:a)}catch(e){X("Failed to load users list")}})()}),[c]),o.useEffect((()=>{if(w&&_){const e=w/_*100;E(e.toFixed(2)),P((e/10).toFixed(1))}}),[w,_]);return q?e.jsx(t,{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"60vh",children:e.jsx(a,{})}):$?e.jsx(t,{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"60vh",children:e.jsx(l,{color:"error",children:$})}):e.jsxs(t,{sx:{width:"100%",maxWidth:"100vw",overflow:"hidden",p:{xs:2,sm:4,md:6},mt:"80px"},children:[e.jsx(s,{onClick:()=>{u("/landing")},variant:"outlined",sx:{mb:2},children:"Back to Landing Page"}),e.jsx(l,{variant:"h4",component:"h1",gutterBottom:!0,sx:{mb:4},children:"teacher"===(null==c?void 0:c.user_type)?"Teacher Feedback Form":"Student Assignment Upload"}),e.jsxs(t,{sx:{display:"flex",flexDirection:{xs:"column",sm:"row"},gap:4,maxWidth:"1400px",mx:"auto",px:{xs:1,sm:2,md:4}},children:[e.jsxs(t,{component:"form",onSubmit:async e=>{var t,a,l,s,n,r,i;if(e.preventDefault(),R)try{const e=new FormData;if(!O)throw new Error("Please upload a document.");if(e.append("document_area",O),!b)throw new Error("Please select a task type.");e.append("task_type",b);if(!x.find((e=>e.id===parseInt(v)))&&"teacher"===(null==c?void 0:c.user_type))throw new Error("Selected student not found");if("teacher"===(null==c?void 0:c.user_type)?e.append("student_name",v):e.append("student_name",R.toString()),"teacher"===(null==c?void 0:c.user_type)){if(!v)throw new Error("Please select a student to send feedback to.");e.append("send_to",String(v)),e.append("teacher_notes",D||""),w&&e.append("grade_awarded",w),_&&e.append("grade_total",_)}else{if(!v)throw new Error("Please select a teacher to send to.");e.append("send_to",String(v)),e.append("student_notes",W||"")}for(let[t,l]of e.entries())File;const a=await d.post("/api/upload/",e);(null==(t=a.data)?void 0:t.id)&&(z(a.data.id),alert("Work submitted successfully!"),y(""),g(""),S(""),C(""),I(""),T(""),U(null),H(null))}catch(o){const e=(null==(l=null==(a=o.response)?void 0:a.data)?void 0:l.detail)||(null==(n=null==(s=o.response)?void 0:s.data)?void 0:n.error)||(null==(i=null==(r=o.response)?void 0:r.data)?void 0:i.message)||o.message||"Error submitting work. Please try again.";alert(e)}else alert("User ID not found. Please log in again.")},sx:{flex:1,minWidth:{xs:"100%",sm:"380px"},maxWidth:{sm:"45%"}},children:[e.jsx(n,{select:!0,label:"teacher"===(null==c?void 0:c.user_type)?"Select Student":"Select Teacher",value:v,onChange:e=>g(e.target.value),fullWidth:!0,required:!0,sx:{mb:2.5},children:x.map((t=>e.jsx(r,{value:t.id,children:t.username},t.id)))}),e.jsx(n,{select:!0,label:"Task Type",value:b,onChange:e=>y(e.target.value),fullWidth:!0,required:!0,sx:{mb:2.5},children:j.map((t=>e.jsx(r,{value:t.value,children:t.label},t.value)))}),"teacher"===(null==c?void 0:c.user_type)&&e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Grade Awarded",type:"number",value:w,onChange:e=>S(e.target.value),fullWidth:!0,sx:{mb:2.5}}),e.jsx(n,{label:"Total Grade",type:"number",value:_,onChange:e=>C(e.target.value),fullWidth:!0,sx:{mb:2.5}}),w&&_&&e.jsxs(t,{sx:{mb:2.5,p:2,bgcolor:"background.paper",borderRadius:1,border:"1px solid",borderColor:"divider"},children:[e.jsxs(l,{variant:"body1",gutterBottom:!0,children:["Grade Percentage: ",k,"%"]}),e.jsxs(l,{variant:"body1",children:["Spanish Grade: ",F," / 10"]})]}),e.jsx(n,{label:"Teacher Notes",multiline:!0,rows:4,value:D,onChange:e=>I(e.target.value),fullWidth:!0,sx:{mb:2.5}})]}),"student"===(null==c?void 0:c.user_type)&&e.jsx(n,{label:"Student Notes",multiline:!0,rows:4,value:W,onChange:e=>T(e.target.value),fullWidth:!0,sx:{mb:2.5}}),e.jsxs(t,{sx:{mb:2.5},children:[e.jsx("input",{accept:".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",style:{display:"none"},id:"document-upload",type:"file",onChange:e=>{const t=e.target.files[0];if(t){if(t.size>26214400)return alert("File size too large. Maximum size allowed is 25MB."),void(e.target.value="");if(!["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(t.type))return alert("Invalid file type. Please upload a PDF, DOC, or DOCX file."),void(e.target.value="");U(t),"application/pdf"===t.type?H(URL.createObjectURL(t)):H(null)}}}),e.jsx("label",{htmlFor:"document-upload",children:e.jsx(s,{variant:"contained",component:"span",children:"Upload Document"})}),O&&e.jsxs(l,{variant:"body2",sx:{mt:1},children:["Selected file: ",O.name]})]}),e.jsx(s,{type:"submit",variant:"contained",color:"primary",size:"large",fullWidth:!0,children:"Submit"})]}),e.jsx(t,{sx:{flex:1,minWidth:{xs:"100%",sm:"380px"},maxWidth:{sm:"45%"},border:"2px dashed",borderColor:"divider",borderRadius:2,p:3,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"500px",bgcolor:"background.paper"},children:O?"application/pdf"===O.type&&B?e.jsx("iframe",{src:B,width:"100%",height:"100%",style:{border:"none",minHeight:"500px"},title:"Document Preview"}):e.jsxs(t,{sx:{textAlign:"center",p:3},children:[e.jsxs(l,{variant:"h6",gutterBottom:!0,children:["File Selected: ",O.name]}),e.jsx(l,{color:"text.secondary",children:"Preview not available for this file type. File will be uploaded when you submit."})]}):e.jsx(l,{color:"text.secondary",children:"Upload a document to see preview"})})]})]})};export{u as default};
