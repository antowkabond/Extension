!function(e){e.fn.tableExport=function(t){function n(){var e=r.find("thead th"),t=[];return e.each(function(e,n){i.length?i.forEach(function(o){o==e+1&&t.push(n.innerText)}):-1==c.indexOf((e+1).toString())&&t.push(n.innerText)}),t}function o(){var t=r.find("tbody tr"),n=[];return t.each(function(t,o){var a=[];if(i.length)i.forEach(function(t){a.push(e(o).find("td:nth-child("+t+")").text())}),n.push(a);else{e(o).find("td").each(function(e,t){-1==c.indexOf((e+1).toString())&&a.push(t.innerText)}),n.push(a)}}),n}function a(e,t,n){var o=document.createElement("a"),a=new Blob(["\ufeff",e],{type:l[n]});o.href=URL.createObjectURL(a);var r=new Date;["DD:"+r.getDate(),"MM:"+(r.getMonth()+1),"YY:"+r.getFullYear(),"hh:"+r.getHours(),"mm:"+r.getMinutes(),"ss:"+r.getSeconds()].forEach(function(e){var n=e.split(":")[0],o=e.split(":")[1],a=new RegExp("%"+n+"%","g");t=t.replace(a,o)}),o.download=t+"."+n,o.click(),navigator.userAgent.toLowerCase().match(/firefox/)||o.remove()}var t=e.extend({filename:"table",format:"csv",cols:"",excludeCols:"",head_delimiter:",",column_delimiter:",",quote:!0,onBefore:function(e){},onAfter:function(e){}},t),r=e(this),i=t.cols?t.cols.split(","):[],c=t.excludeCols?t.excludeCols.split(","):[],f="",l={csv:"text/csv",txt:"text/plain",xls:"application/vnd.ms-excel",json:"application/json"};if(!("function"==typeof t.onBefore&&"function"==typeof t.onAfter&&t.format&&t.head_delimiter&&t.column_delimiter&&t.filename))return console.error("One of the parameters is incorrect."),!1;switch(t.onBefore(r),t.format){case"csv":var u=n(),s=o();if(!0===t.quote){var h=!0===t.quote?'"':null;u.forEach(function(e,t){u[t]=h+e+h}),s.forEach(function(e,t){e.forEach(function(t,n){e[n]=h+t+h})})}f+=u.join(t.head_delimiter)+"\n",s.forEach(function(e,n){f+=e.join(t.column_delimiter)+"\n"});break;case"txt":var u=n(),s=o();f+=u.join(t.head_delimiter)+"\n",s.forEach(function(e,n){f+=e.join(t.column_delimiter)+"\n"});break;case"xls":var u=n(),s=o();template="<table><thead>%thead%</thead><tbody>%tbody%</tbody></table>";var d="";u.forEach(function(e,t){d+="<th>"+e+"</th>"}),template=template.replace("%thead%",d),d="",s.forEach(function(e,t){d+="<tr>",e.forEach(function(e,t){d+="<td>"+e+"</td>"}),d+="</tr>"}),template=template.replace("%tbody%",d),f=template;break;case"sql":var u=n(),s=o();s.forEach(function(e,t){f+="INSERT INTO table ("+u.join(",")+") VALUES ('"+e.join("','")+"');\n"});break;case"json":var u=n(),s=o();f=JSON.stringify({header:u,items:s})}a(f,t.filename,t.format),t.onAfter(r)}}(jQuery);
