(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{215:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),c=t(29),o=t.n(c),u=(t(84),t(7)),s=t.n(u),l=t(18),i=t(11),p=t(5),m=t(6),f=t(39),b=t.n(f),d=t(40),E=t.n(d),h=t(30),v=t.n(h),k=t(3),y=t.n(k),g=t(74),j=t.n(g),O=t(75),x=t.n(O),w=t(41),S=t.n(w),A=function(){var e=Object(l.a)(s.a.mark(function e(n){var t,a,r,c,o,u,p;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.accessToken,a=n.apiServer,r=function(e){return j.a.get("https://cors-anywhere.herokuapp.com/".concat(a,"v1/").concat(e),{headers:{Authorization:"Bearer ".concat(t),"Access-Control-Allow-Origin":"*"}})},e.next=4,r("accounts");case 4:return c=e.sent,o=c.data.accounts,u={},p={},e.next=10,Promise.all(o.map(function(){var e=Object(l.a)(s.a.mark(function e(n){var t,a,c,o;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([r("accounts/".concat(n.number,"/positions")),r("accounts/".concat(n.number,"/balances"))]);case 2:t=e.sent,a=Object(i.a)(t,2),c=a[0],o=a[1],p[n.number]=x()(o.data.combinedBalances,{currency:"CAD"}),u[n.number]=S()(c.data.positions,function(e){return-e.currentMarketValue});case 8:case"end":return e.stop()}},e)}));return function(n){return e.apply(this,arguments)}}()));case 10:return e.abrupt("return",{accounts:S()(o,function(e){return-p[e.number].totalEquity}),balances:p,positions:u});case 11:case"end":return e.stop()}},e)}));return function(n){return e.apply(this,arguments)}}(),T={"VEQT.TO":{stocks:1,bonds:0},"VBAL.TO":{stocks:.6,bonds:.4},"VGRO.TO":{stocks:.8,bonds:.2}},_=function(e){return"$"+e.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")},C=function(e){return(100*e).toFixed(1)+"%"};function V(){var e=Object(p.a)(["\n  display: flex;\n  justify-content: space-between;\n"]);return V=function(){return e},e}function M(){var e=Object(p.a)(["\n  font-weight: bold;\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  border-bottom: 1px solid #ddd;\n  margin-bottom: 5px;\n  margin-top: 10px;\n"]);return M=function(){return e},e}var R=m.a.div(M()),B=m.a.div(V());function P(){var e=Object(p.a)(["\n  margin-top: 30px;\n  margin-bottom: 10px;\n"]);return P=function(){return e},e}var q=m.a.h2(P()),I=function(e){var n=e.account,t=e.balance,a=e.positions,c=e.postTaxAdjustment,o=y()(a,function(e){return e.currentMarketValue*T[e.symbol].stocks})*c,u=y()(a,function(e){return e.currentMarketValue*T[e.symbol].bonds})*c,s=t.cash*c,l=o+u+s;return r.a.createElement("div",{key:n.number},r.a.createElement(q,null,n.type),r.a.createElement(R,null,"Positions"),a.map(function(e){return r.a.createElement(B,{key:e.symbol},r.a.createElement("span",null,e.symbol),r.a.createElement("span",null,_(e.currentMarketValue*c)))}),r.a.createElement(B,null,r.a.createElement("span",null,"Cash"),r.a.createElement("span",null,_(t.cash*c))),r.a.createElement(R,null,"Asset Classes"),r.a.createElement(B,null,r.a.createElement("span",null,"Stocks"),r.a.createElement("span",null,C(o/l))),r.a.createElement(B,null,r.a.createElement("span",null,"Bonds"),r.a.createElement("span",null,C(u/l))),r.a.createElement(B,null,r.a.createElement("span",null,"Cash"),r.a.createElement("span",null,C(s/l))))};function J(){var e=Object(p.a)(["\n  margin-top: 0;\n"]);return J=function(){return e},e}function z(){var e=Object(p.a)(["\n  padding: 20px 30px;\n"]);return z=function(){return e},e}var Q=function(){if("/"===window.location.hash[1])return localStorage.getItem("questrade_access_token");var e=window.location.hash.substring(1).replace(/&/g,'","').replace(/=/g,'":"');if(!e)return localStorage.getItem("questrade_access_token");var n=JSON.parse('{"'+e+'"}',function(e,n){return""===e?n:decodeURIComponent(n)});return localStorage.setItem("questrade_access_token",n.access_token),{accessToken:n.access_token,apiServer:n.api_server}}()||{},U=Q.accessToken,D=Q.apiServer,F=m.a.div(z()),W=m.a.h1(J()),Y=function(){var e=Object(a.useState)(null),n=Object(i.a)(e,2),t=n[0],c=n[1],o=Object(a.useState)({}),u=Object(i.a)(o,2),p=u[0],m=u[1],f=Object(a.useState)({}),d=Object(i.a)(f,2),h=d[0],k=d[1],g=Object(a.useState)(!1),j=Object(i.a)(g,2),O=j[0],x=j[1];if(Object(a.useEffect)(function(){!function(){var e=Object(l.a)(s.a.mark(function e(){var n,t,a,r;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A({accessToken:U,apiServer:D});case 2:n=e.sent,t=n.accounts,a=n.balances,r=n.positions,k(r),m(a),c(t);case 9:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}()()},[]),!t)return r.a.createElement("a",{href:"https://login.questrade.com/oauth2/authorize?client_id=".concat("YCUSnajluQMAHR32DnJhupUYJddjZQ","&response_type=token&redirect_uri=").concat("https://tomcheng.github.io/allocation-reports")},"Authorize");var w=t.filter(function(e){return"RRSP"===e.type}).map(function(e){return e.number}),S=b()(Object.values(v()(h,function(e,n){return w.includes(n)}))),V=b()(Object.values(E()(h,function(e,n){return w.includes(n)}))),M=Object.values(v()(p,function(e,n){return w.includes(n)})),P=Object.values(E()(p,function(e,n){return w.includes(n)})),q=O?.8:1,J=y()(S,function(e){return e.currentMarketValue*T[e.symbol].stocks})*q,z=y()(V,function(e){return e.currentMarketValue*T[e.symbol].stocks}),Q=y()(S,function(e){return e.currentMarketValue*T[e.symbol].bonds})*q,Y=y()(V,function(e){return e.currentMarketValue*T[e.symbol].bonds}),$=y()(M,"cash")*q,G=y()(P,"cash"),H=J+z+Q+Y+$+G;return r.a.createElement(F,null,r.a.createElement(W,null,"Portfolio Allocations"),r.a.createElement("label",null,r.a.createElement("input",{type:"checkbox",checked:O,onChange:function(){x(!O)}})," ","Adjust for post tax amounts"),r.a.createElement(R,null,"Accounts"),t.map(function(e){return r.a.createElement(B,{key:e.number},r.a.createElement("span",null,e.type),r.a.createElement("span",null,_(p[e.number].totalEquity*("RRSP"===e.type?q:1))))}),r.a.createElement(B,{style:{justifyContent:"flex-end"}},r.a.createElement("span",{style:{borderTop:"1px solid #666",marginTop:2,paddingTop:2}},_(H))),r.a.createElement(R,null,"Asset Classes"),r.a.createElement(B,null,r.a.createElement("span",null,"Stocks"),r.a.createElement("span",null,C((J+z)/H))),r.a.createElement(B,null,r.a.createElement("span",null,"Bonds"),r.a.createElement("span",null,C((Q+Y)/H))),r.a.createElement(B,null,r.a.createElement("span",null,"Cash"),r.a.createElement("span",null,C(($+G)/H))),t.map(function(e){return r.a.createElement(I,{key:e.number,account:e,balance:p[e.number],positions:h[e.number],postTaxAdjustment:"RRSP"===e.type?q:1})}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(Y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},79:function(e,n,t){e.exports=t(215)},84:function(e,n,t){}},[[79,1,2]]]);
//# sourceMappingURL=main.4e86eaec.chunk.js.map