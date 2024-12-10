import{j as e}from"./mui-vendor-BMRJiz3v.js";import{r as t}from"./react-vendor-CYXGpHdp.js";import{a as s}from"./index-DxM4V5tE.js";import"./utils-BB-Y_vZ-.js";const a=()=>{t.useEffect((()=>{window.scrollTo(0,0)}),[]);const[a,r]=t.useState([]),[n,d]=t.useState([]),[l,i]=t.useState(""),[c,o]=t.useState(""),[x,m]=t.useState(null);t.useEffect((()=>{(async()=>{try{const e=await s.get("/users/user-info/");m(e.data),"student"===e.data.user_type&&i(e.data.username)}catch(e){}})()}),[]),t.useEffect((()=>{(async()=>{if("teacher"===(null==x?void 0:x.user_type))try{const e=(await s.get("/users/all-users/?user_type=student")).data.map((e=>e.username)).filter(Boolean);d(e),e.length>0&&!l&&i(e[0])}catch(e){}})()}),[x,l]),t.useEffect((()=>{(async()=>{if(l)try{const e=await s.get(`/api/grade-summary/?student=${l}`);r(e.data)}catch(e){r([])}})()}),[l]);const u=a.filter((e=>{var t,s;if(!l)return!0;const a=null==(t=e.student_name)?void 0:t.username,r=null==(s=e.send_to)?void 0:s.username;return"teacher"===(null==x?void 0:x.user_type)?a===l:"student"===(null==x?void 0:x.user_type)&&(a===l||r===l)})).sort(((e,t)=>{var s,a;if(!e.submission_date&&!t.submission_date)return 0;if(!e.submission_date)return 1;if(!t.submission_date)return-1;switch(c){case"Date (Newest to Oldest)":return new Date(t.submission_date)-new Date(e.submission_date);case"Date (Oldest to Newest)":return new Date(e.submission_date)-new Date(t.submission_date);case"Spanish Grade":return(t.grade_percent||0)-(e.grade_percent||0);case"Grade Awarded":return(t.grade_awarded||0)-(e.grade_awarded||0);case"Teacher Name":return((null==(s=e.send_to)?void 0:s.username)||"").localeCompare((null==(a=t.send_to)?void 0:a.username)||"");case"Task Type":return(e.task_type||"").localeCompare(t.task_type||"");default:return 0}})),p=()=>{if(0===u.length)return"0.00 (0%)";const e=u.reduce(((e,t)=>e+(t.grade_percent||0)),0),t=(e/u.length).toFixed(2);return`${(e/u.length/100*10).toFixed(2)} (${t}%)`};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:"\n          .decorated-header {\n            position: relative;\n          }\n          .decorated-header::before,\n          .decorated-header::after {\n            content: '';\n            position: absolute;\n            width: 20px;\n            height: 20px;\n            border: 2px solid rgba(255, 255, 255, 0.6);\n            pointer-events: none;\n          }\n          .decorated-header::before {\n            top: 10px;\n            left: 10px;\n            border-right: none;\n            border-bottom: none;\n          }\n          .decorated-header::after {\n            bottom: 10px;\n            right: 10px;\n            border-left: none;\n            border-top: none;\n          }\n        "}),e.jsxs("div",{className:"min-h-screen bg-gray-100 p-6",children:[e.jsxs("div",{className:"bg-green-800 text-white shadow-md rounded-lg p-6 mt-20 mb-4 flex justify-between items-center decorated-header",children:[e.jsxs("h1",{className:"text-2xl font-bold",children:["Feedback for",e.jsxs("span",{className:"text-blue-300",children:[" ",l]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"filterSelect",className:"block text-sm font-medium text-blue-300 mb-1",children:"Filter By:"}),e.jsxs("select",{id:"filterSelect",className:"block w-full pl-3 pr-10 py-2 text-base text-black border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md",value:c,onChange:e=>o(e.target.value),children:[e.jsx("option",{value:"",children:"None"}),e.jsx("option",{value:"Teacher Name",children:"Teacher Name"}),e.jsx("option",{value:"Date (Newest to Oldest)",children:"Date (Newest to Oldest)"}),e.jsx("option",{value:"Date (Oldest to Newest)",children:"Date (Oldest to Newest)"}),e.jsx("option",{value:"Task Type",children:"Task Type"}),e.jsx("option",{value:"Spanish Grade",children:"Spanish Grade"}),e.jsx("option",{value:"Grade Awarded",children:"Grade Awarded"})]})]})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{htmlFor:"studentSelect",className:"block text-sm font-medium text-gray-700",children:"student"===(null==x?void 0:x.user_type)?"Your Feedback:":"Select Student:"}),e.jsx("select",{id:"studentSelect",className:"mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-white shadow-sm",value:l||"",onChange:e=>i(e.target.value),disabled:"student"===(null==x?void 0:x.user_type),children:"student"===(null==x?void 0:x.user_type)?e.jsx("option",{value:x.username,children:x.username}):e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"",children:"Select a student"}),n.map(((t,s)=>e.jsx("option",{value:t,children:t},s)))]})})]}),e.jsx("div",{className:"bg-green-100 shadow-md rounded-lg overflow-x-auto",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"bg-green-300",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Student"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Teacher"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Submission Date"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Feedback Date"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Task Type"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Grade Awarded"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Total Grade"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Percentage"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Spanish Grade (out of 10)"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Teacher Notes"}),e.jsx("th",{className:"px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider",children:"Average Grade"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:u.map(((t,s)=>{var a,r,n,d;return e.jsxs("tr",{className:s%2==0?"bg-white":"bg-gray-50",children:[e.jsxs("td",{className:"px-6 py-4 text-sm text-gray-900",children:[(null==(a=t.student_name)?void 0:a.username)||"Unknown Student","student"===(null==x?void 0:x.user_type)&&e.jsx("span",{className:"ml-2 text-xs text-gray-500",children:(null==(r=t.student_name)?void 0:r.username)===x.username?"(Sent)":"(Received)"})]}),e.jsx("td",{className:"px-6 py-4 text-sm text-gray-900",children:(null==(n=t.send_to)?void 0:n.username)||"Unknown Teacher"}),e.jsx("td",{className:"px-6 py-4 text-sm text-gray-900",children:t.submission_date?new Date(t.submission_date).toLocaleDateString():"-"}),e.jsx("td",{className:"px-6 py-4 text-sm text-gray-900",children:t.feedback_date?new Date(t.feedback_date).toLocaleDateString():"-"}),e.jsx("td",{className:"px-6 py-4 text-sm text-gray-900",children:t.task_type||"-"}),e.jsx("td",{className:"px-6 py-4 text-sm font-semibold bg-blue-50",children:e.jsx("span",{className:"text-blue-700 text-base",children:t.grade_awarded||"-"})}),e.jsx("td",{className:"px-6 py-4 text-sm text-gray-900",children:t.grade_total||"-"}),e.jsx("td",{className:"px-6 py-4 text-sm text-gray-900",children:t.grade_percent?`${t.grade_percent}%`:"-"}),e.jsx("td",{className:"px-6 py-4 text-sm font-semibold bg-blue-50",children:e.jsx("span",{className:"text-blue-700 text-base",children:t.grade_percent?(d=t.grade_percent,(d/100*10).toFixed(2)):"-"})}),e.jsx("td",{className:"px-6 py-4 text-sm text-gray-900",children:t.teacher_notes||"-"}),0===s&&e.jsx("td",{rowSpan:u.length,className:"px-6 py-4 text-lg font-bold bg-green-100 border-l-4 border-green-500",children:e.jsxs("div",{className:"flex flex-col items-center justify-center h-full",children:[e.jsx("span",{className:"text-green-700",children:"Average Grade:"}),e.jsx("span",{className:"text-2xl text-green-800 mt-2",children:p()}),e.jsx("span",{className:"text-xs text-green-600 mt-1",children:"(Spanish Grade / Percentage)"})]})})]},s)}))})]})})]})]})};export{a as default};
