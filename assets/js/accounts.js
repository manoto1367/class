(function(){
  const $=i=>document.getElementById(i),fa=SP.fa,d=SP.data(),st=d.students||[];
  const has=st.filter(s=>s.uname).length;
  $("a-total").textContent=fa(st.length);$("a-has").textContent=fa(has);$("a-no").textContent=fa(st.length-has);
  $("a-pct").textContent=fa(st.length?Math.round(has/st.length*100):0)+"٪";
  $("a-school").textContent=(d.school&&d.school.name)||SP.name(SP.list().find(s=>s.id===SP.active()));
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rows=[...st].sort((a,b)=>(b.uname?1:0)-(a.uname?1:0)||String(a.ln).localeCompare(String(b.ln),"fa"));
  const draw=()=>{
    const q=$("a-q").value.trim(),f=$("a-f").value;
    const r=rows.filter(s=>(!f||(f==="1")===!!s.uname)&&(!q||((s.fn||"")+" "+(s.ln||"")+" "+(s.uname||"")).includes(q)));
    $("a-body").innerHTML=r.length?r.map(s=>`<tr data-status="${s.uname?1:0}"><td data-label="دانش‌آموز">${esc(s.fn)} ${esc(s.ln)}</td><td data-label="پایه / شعبه">${fa(esc(s.grade))}${s.sec?" / "+esc(s.sec):""}</td><td data-label="نام کاربری" dir="ltr" style="text-align:right">${s.uname?esc(s.uname):"—"}</td><td data-label="وضعیت"><span class="badge ${s.uname?"success":"warning"}">${s.uname?"حساب فعال":"بدون حساب"}</span></td></tr>`).join(""):'<tr><td colspan="4" class="empty-note">دانش‌آموزی یافت نشد.</td></tr>';
  };
  $("a-q").addEventListener("input",draw);$("a-f").addEventListener("change",draw);draw();
})();
