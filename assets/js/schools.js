(function(){
  const LS=localStorage, J=(k,d)=>{try{return JSON.parse(LS.getItem(k))||d}catch(e){return d}};
  const key=id=>id==="main"?"cm_d":"cm_d__"+id;
  const TY=["حل کار در کلاس","فعالیت کلاسی","تمرین در خانه","سوالات امتحانی"];
  const SP=window.SP={
    TY,
    list(){const l=J("sp_schools",null);return l&&l.length?l:[{id:"main",name:"مدرسه اصلی"}]},
    active(){const a=LS.getItem("sp_active");return SP.list().some(s=>s.id===a)?a:SP.list()[0].id},
    data(id){return J(key(id||SP.active()),{})},
    name(s){const d=SP.data(s.id);return (d.school&&d.school.name)||s.name},
    add(name){const l=SP.list(),id="s"+Date.now().toString(36);l.push({id,name:name||"مدرسه جدید"});LS.setItem("sp_schools",JSON.stringify(l));LS.setItem("sp_active",id);return id},
    switch(id){LS.setItem("sp_schools",JSON.stringify(SP.list()));LS.setItem("sp_active",id)},
    today(){const p=new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn",{year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()).reduce((o,x)=>(o[x.type]=x.value,o),{});return p.year+"/"+p.month+"/"+p.day},
    stats(d){
      d=d||{};const cl=d.classes||[],st=d.students||[],sc=d.scores||[],ex=d.exams||[];
      const att={p:0,a:0,l:0,e:0,days:0,tp:0,ta:0,tl:0,te:0},today=SP.today();
      const walk=(v,f)=>{if(typeof v==="string"){if(att[v]!==undefined){att[v]++;if(f)att["t"+v]++}}else if(v&&typeof v==="object")Object.values(v).forEach(x=>walk(x,f))};
      Object.keys(d.att||{}).forEach(k=>{att.days++;walk(d.att[k],k.indexOf(today+"|")===0)});
      const inCls=(s,c)=>s.grade==c.grade&&(!c.sec||!s.sec||s.sec==c.sec);
      const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
      const types=TY.map((n,i)=>{const v=sc.filter(x=>x.type===i).map(x=>+x.val).filter(x=>!isNaN(x));return{n,c:v.length,avg:avg(v)}});
      const exv=ex.map(x=>+x.val).filter(x=>!isNaN(x));
      const classes=cl.map(c=>{const ids=new Set(st.filter(s=>inCls(s,c)).map(s=>s.id));
        const a={a:0,p:0};Object.keys(d.att||{}).filter(k=>k.split("|")[1]===String(c.id)).forEach(k=>{const w=v=>{if(typeof v==="string"){if(v==="a")a.a++;if(v==="p")a.p++}else if(v&&typeof v==="object")Object.values(v).forEach(w)};w(d.att[k])});
        const sv=sc.filter(x=>ids.has(x.sid)).map(x=>+x.val).filter(x=>!isNaN(x));
        return{n:c.name||"کلاس",students:ids.size,sessions:Object.keys(c.sched||{}).filter(k=>c.sched[k]).length,absent:a.a,present:a.p,avg:avg(sv)}});
      return{school:(d.school&&d.school.name)||"",principal:(d.school&&d.school.principal)||"",user:d.user,classes:cl.length,students:st.length,
        accounts:st.filter(s=>s.uname).length,sessions:classes.reduce((x,c)=>x+c.sessions,0),att,types,exams:{c:ex.length,avg:avg(exv)},scores:sc.length,perClass:classes}
    }
  };
  SP.fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
  SP.num=(n,f=1)=>SP.fa((Math.round(n*Math.pow(10,f))/Math.pow(10,f)).toString().replace(".","٫"));
})();
