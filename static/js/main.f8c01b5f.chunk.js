(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{202:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),c=t(25),o=t.n(c),u=(t(75),t(6)),s=t.n(u),l=t(17),i=t(9),p=t(4),m=t(5),b=t(35),d=t.n(b),f=t(8),E=t.n(f),v=t(65),h=t.n(v),k=t(66),g=t.n(k),y=t(36),w=t.n(y),O=function(){var e=Object(l.a)(s.a.mark(function e(n){var t,a,r,c,o,u,p;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.accessToken,a=n.apiServer,r=function(e){return h.a.get("https://cors-anywhere.herokuapp.com/".concat(a,"v1/").concat(e),{headers:{Authorization:"Bearer ".concat(t),"Access-Control-Allow-Origin":"*"}})},e.next=4,r("accounts");case 4:return c=e.sent,o=c.data.accounts,u={},p={},e.next=10,Promise.all(o.map(function(){var e=Object(l.a)(s.a.mark(function e(n){var t,a,c,o;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([r("accounts/".concat(n.number,"/positions")),r("accounts/".concat(n.number,"/balances"))]);case 2:t=e.sent,a=Object(i.a)(t,2),c=a[0],o=a[1],p[n.number]=g()(o.data.combinedBalances,{currency:"CAD"}),u[n.number]=w()(c.data.positions,function(e){return-e.currentMarketValue});case 8:case"end":return e.stop()}},e)}));return function(n){return e.apply(this,arguments)}}()));case 10:return e.abrupt("return",{accounts:w()(o,function(e){return-p[e.number].totalEquity}),balances:p,positions:u});case 11:case"end":return e.stop()}},e)}));return function(n){return e.apply(this,arguments)}}(),j={"VEQT.TO":{stocks:1,bonds:0},"VBAL.TO":{stocks:.6,bonds:.4},"VGRO.TO":{stocks:.8,bonds:.2}},x=function(e){return"$"+e.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")},S=function(e){return(100*e).toFixed(1)+"%"};function _(){var e=Object(p.a)(["\n  display: flex;\n  justify-content: space-between;\n"]);return _=function(){return e},e}function T(){var e=Object(p.a)(["\n  font-weight: bold;\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  border-bottom: 1px solid #ddd;\n  margin-bottom: 5px;\n  margin-top: 10px;\n"]);return T=function(){return e},e}var A=m.a.div(T()),C=m.a.div(_());function V(){var e=Object(p.a)(["\n  margin-top: 30px;\n  margin-bottom: 10px;\n"]);return V=function(){return e},e}var B=m.a.h2(V()),M=function(e){var n=e.account,t=e.balance,a=e.positions,c=E()(a,function(e){return e.currentMarketValue*j[e.symbol].stocks}),o=E()(a,function(e){return e.currentMarketValue*j[e.symbol].bonds}),u=t.cash,s=c+o+u;return r.a.createElement("div",{key:n.number},r.a.createElement(B,null,n.type),r.a.createElement(A,null,"Positions"),a.map(function(e){return r.a.createElement(C,{key:e.symbol},r.a.createElement("span",null,e.symbol),r.a.createElement("span",null,x(e.currentMarketValue)))}),r.a.createElement(C,null,r.a.createElement("span",null,"Cash"),r.a.createElement("span",null,x(u))),r.a.createElement(A,null,"Asset Classes"),r.a.createElement(C,null,r.a.createElement("span",null,"Stocks"),r.a.createElement("span",null,S(c/s))),r.a.createElement(C,null,r.a.createElement("span",null,"Bonds"),r.a.createElement("span",null,S(o/s))),r.a.createElement(C,null,r.a.createElement("span",null,"Cash"),r.a.createElement("span",null,S(u/s))))};function q(){var e=Object(p.a)(["\n  margin-top: 0;\n"]);return q=function(){return e},e}function I(){var e=Object(p.a)(["\n  padding: 20px 30px;\n"]);return I=function(){return e},e}var J=function(){if("/"===window.location.hash[1])return localStorage.getItem("questrade_access_token");var e=window.location.hash.substring(1).replace(/&/g,'","').replace(/=/g,'":"');if(!e)return localStorage.getItem("questrade_access_token");var n=JSON.parse('{"'+e+'"}',function(e,n){return""===e?n:decodeURIComponent(n)});return localStorage.setItem("questrade_access_token",n.access_token),{accessToken:n.access_token,apiServer:n.api_server}}()||{},z=J.accessToken,F=J.apiServer,P=m.a.div(I()),Q=m.a.h1(q()),R=function(){var e=Object(a.useState)(null),n=Object(i.a)(e,2),t=n[0],c=n[1],o=Object(a.useState)({}),u=Object(i.a)(o,2),p=u[0],m=u[1],b=Object(a.useState)({}),f=Object(i.a)(b,2),v=f[0],h=f[1];Object(a.useEffect)(function(){!function(){var e=Object(l.a)(s.a.mark(function e(){var n,t,a,r;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,O({accessToken:z,apiServer:F});case 2:n=e.sent,t=n.accounts,a=n.balances,r=n.positions,h(r),m(a),c(t);case 9:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}()()},[]);var k=!!t,g=E()(d()(Object.values(v)),function(e){return e.currentMarketValue*j[e.symbol].stocks}),y=E()(d()(Object.values(v)),function(e){return e.currentMarketValue*j[e.symbol].bonds}),w=E()(Object.values(p),"cash"),_=g+y+w;return r.a.createElement(P,null,k?r.a.createElement(a.Fragment,null,r.a.createElement(Q,null,"Overall"),r.a.createElement(A,null,"Accounts"),t.map(function(e){return r.a.createElement(C,{key:e.number},r.a.createElement("span",null,e.type),r.a.createElement("span",null,x(p[e.number].totalEquity)))}),r.a.createElement(C,{style:{justifyContent:"flex-end"}},r.a.createElement("span",{style:{borderTop:"1px solid #666",marginTop:2,paddingTop:2}},x(_))),r.a.createElement(A,null,"Asset Classes"),r.a.createElement(C,null,r.a.createElement("span",null,"Stocks"),r.a.createElement("span",null,S(g/_))),r.a.createElement(C,null,r.a.createElement("span",null,"Bonds"),r.a.createElement("span",null,S(y/_))),r.a.createElement(C,null,r.a.createElement("span",null,"Cash"),r.a.createElement("span",null,S(w/_))),t.map(function(e){return r.a.createElement(M,{key:e.number,account:e,balance:p[e.number],positions:v[e.number]})})):r.a.createElement("a",{href:"https://login.questrade.com/oauth2/authorize?client_id=".concat("YCUSnajluQMAHR32DnJhupUYJddjZQ","&response_type=token&redirect_uri=").concat("https://tomcheng.github.io/allocation-reports")},"Authorize"))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(R,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},70:function(e,n,t){e.exports=t(202)},75:function(e,n,t){}},[[70,1,2]]]);
//# sourceMappingURL=main.f8c01b5f.chunk.js.map