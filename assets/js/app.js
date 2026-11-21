(function(){try{document.documentElement.dataset.theme=localStorage.getItem("sp_theme")||"dark"}catch(e){document.documentElement.dataset.theme="dark"}})();
const SCHOOL_TABS = ["مدیریت مدرسه", "مدیریت کلاس", "دانش‌آموزان", "برنامه هفتگی", "حضور و غیاب", "نمرات", "آزمون ماهانه", "میانگین نمرات", "کارنامه ماهانه", "داشبورد کلاس", "کارنامه دانش‌آموز", "حساب دانش‌آموزان", "مقایسه نمرات ماهانه", "روند معدل دانش‌آموز", "رتبه‌بندی معدل کلاس", "پیامک به والدین", "گزارش حضور و غیاب"];
(() => {
  "use strict";

  if (document.body.dataset.appInitialized === "true" || document.querySelector(".app-main")) {
    return;
  }
  document.body.dataset.appInitialized = "true";

  const body = document.body;
  const root = body.dataset.root || "";
  const page = body.dataset.page === "school" ? "school-tab-" + (new URLSearchParams(location.search).get("tab") || 0) : (body.dataset.page || "dashboard");
  const title = body.dataset.page === "school" ? SCHOOL_TABS[+(new URLSearchParams(location.search).get("tab") || 0)] || "مدیریت کلاس" : (body.dataset.title || "داشبورد مدیریت");
  const subtitle = body.dataset.subtitle || "مرکز کنترل و مدیریت فروشگاه";

  const nav = [
    { id: "dashboard", label: "داشبورد", icon: "fa-tachometer-alt", href: `${root}index.html` },
    { id: "accounts", label: "حساب دانش‌آموزان", icon: "fa-key", href: `${root}pages/accounts/index.html` },
    { id: "school", label: "مدیریت کلاس", icon: "fa-chalkboard-teacher", children:
      SCHOOL_TABS.map((t, n) => [`school-tab-${n}`, t, `${root}pages/school/index.html?tab=${n}`]) }
  ];

  const activeGroup = nav.find(item => item.children?.some(child => child[0] === page))?.id;
  const navMarkup = nav.map(item => {
    if (item.href) {
      return `<a class="nav-link ${item.id === page ? "active" : ""}" href="${item.href}">
        <i class="fas ${item.icon}" aria-hidden="true"></i><span>${item.label}</span>
      </a>`;
    }
    const open = activeGroup === item.id;
    return `<div class="nav-group ${open ? "open" : ""}">
      <button class="nav-group-toggle" type="button" aria-expanded="${open}" data-nav-group="${item.id}">
        <i class="fas ${item.icon}" aria-hidden="true"></i><span>${item.label}</span>
        <i class="fas fa-chevron-down chevron" aria-hidden="true"></i>
      </button>
      <div class="nav-submenu"><div>
        ${item.children.map(child => `<a class="nav-link ${child[0] === page ? "active" : ""}" href="${child[2]}">${child[1]}</a>`).join("")}
      </div></div>
    </div>`;
  }).join("");

  const shell = document.querySelector("[data-app-shell]");
  if (shell) {
    shell.insertAdjacentHTML("beforebegin", `
      <button class="menu-button" type="button" aria-label="باز کردن منو" aria-controls="app-sidebar" aria-expanded="false">
        <i class="fas fa-bars" aria-hidden="true"></i>
      </button>
      <div class="sidebar-overlay" data-close-sidebar></div>
      <aside class="app-sidebar" id="app-sidebar" aria-label="منوی اصلی">
        <a class="brand" href="${root}index.html">
          <span class="brand-mark"><i class="fas fa-graduation-cap" aria-hidden="true"></i></span>
          <span><strong>پنل مدرسه</strong><small data-school-name>مدیریت هوشمند کلاس</small></span>
        </a>
        <nav class="sidebar-nav">${navMarkup}</nav>
        <div class="sidebar-profile">
          <img src="${root}assets/images/avatar.svg" alt="تصویر ادمین">
          <span class="profile"><strong data-user-name>کاربر مهمان</strong><small data-user-sub>مدیر مدرسه</small></span>
          <span class="profile-status" title="آنلاین"></span>
        </div>
      </aside>
      <div class="app-main">
        <header class="app-header">
          <div class="page-title"><h1>${title}</h1><p>${subtitle}</p></div>
          <div class="header-actions">
            <select class="school-select" id="school-switch" aria-label="انتخاب مدرسه"></select>
            <button class="icon-button" type="button" id="theme-toggle" aria-label="تغییر تم روشن/تاریک"><i class="fas fa-moon" aria-hidden="true"></i></button>
            <button class="icon-button" type="button" data-cloud hidden aria-label="حساب ابری و منوی برنامه"><i class="fas fa-cloud" aria-hidden="true"></i></button>
            <a class="btn btn-primary header-profile" href="${root}pages/school/index.html?tab=0"><i class="fas fa-school" aria-hidden="true"></i><span>مدیریت کلاس</span></a>
          </div>
        </header>
      </div>
      <div class="toast-stack" aria-live="polite" aria-atomic="true"></div>
    `);
    document.querySelector(".app-main").append(shell);
  }

  const menuButton = document.querySelector(".menu-button");
  const closeSidebar = () => {
    body.classList.remove("sidebar-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };
  menuButton?.addEventListener("click", () => {
    const open = body.classList.toggle("sidebar-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  document.querySelector("[data-close-sidebar]")?.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSidebar();
      document.querySelectorAll(".modal-backdrop.open").forEach(modal => closeModal(modal));
    }
  });

  document.querySelectorAll("[data-nav-group]").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest(".nav-group");
      const willOpen = !group.classList.contains("open");
      document.querySelectorAll(".nav-group.open").forEach(openGroup => {
        if (openGroup !== group) {
          openGroup.classList.remove("open");
          openGroup.querySelector("[data-nav-group]")?.setAttribute("aria-expanded", "false");
        }
      });
      group.classList.toggle("open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });
  });
  document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", closeSidebar));

  function toPersianDigits(value) {
    return String(value).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);
  }
  document.querySelectorAll("[data-persian-number]").forEach(node => {
    node.textContent = toPersianDigits(node.textContent);
  });

  window.showToast = (message, type = "success") => {
    const stack = document.querySelector(".toast-stack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fas ${type === "danger" ? "fa-exclamation-circle" : "fa-check-circle"}" aria-hidden="true"></i><span>${message}</span>`;
    stack.append(toast);
    setTimeout(() => toast.remove(), 3600);
  };
  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-toast-message]");
    if (trigger) showToast(trigger.dataset.toastMessage);
  });

  function closeModal(modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.querySelectorAll("[data-modal-open]").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const modal = document.getElementById(trigger.dataset.modalOpen);
      if (!modal) return;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      modal.querySelector("button, input, select, textarea")?.focus();
    });
  });
  document.querySelectorAll("[data-modal-close]").forEach(trigger => {
    trigger.addEventListener("click", () => closeModal(trigger.closest(".modal-backdrop")));
  });
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closeModal(backdrop);
    });
  });

  document.querySelectorAll("form[data-demo-form]").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      showToast(form.dataset.success || "تغییرات با موفقیت ذخیره شد");
      form.querySelectorAll("[data-clear-after-submit]").forEach(input => { input.value = ""; });
    });
  });

  document.querySelectorAll("[data-table-search]").forEach(input => {
    const table = document.querySelector(input.dataset.tableSearch);
    if (!table) return;
    input.addEventListener("input", () => {
      const query = input.value.trim().toLocaleLowerCase("fa");
      table.querySelectorAll("tbody tr").forEach(row => {
        row.hidden = query && !row.textContent.toLocaleLowerCase("fa").includes(query);
      });
    });
  });
  document.querySelectorAll("[data-table-filter]").forEach(select => {
    const table = document.querySelector(select.dataset.tableFilter);
    if (!table) return;
    select.addEventListener("change", () => {
      table.querySelectorAll("tbody tr").forEach(row => {
        row.hidden = select.value && row.dataset.status !== select.value;
      });
    });
  });

  document.querySelectorAll("[data-confirm]").forEach(button => {
    button.addEventListener("click", () => {
      if (window.confirm(button.dataset.confirm)) {
        button.closest("tr, .list-item")?.remove();
        showToast("عملیات انجام شد");
      }
    });
  });

  // ---- theme, profile, embedded school app ----
  const html = document.documentElement;
  const frame = document.getElementById("school-frame");
  const send = msg => frame && frame.contentWindow && frame.contentWindow.postMessage(msg, "*");
  const themeIcon = () => document.querySelector("#theme-toggle i").className = "fas " + (html.dataset.theme === "light" ? "fa-sun" : "fa-moon");
  themeIcon();
  document.getElementById("theme-toggle").addEventListener("click", () => {
    html.dataset.theme = html.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("sp_theme", html.dataset.theme); } catch (e) {}
    themeIcon(); send({ type: "cm-theme", theme: html.dataset.theme });
  });
  const setProfile = (school, user, sub) => {
    if (school) document.querySelectorAll("[data-school-name]").forEach(n => n.textContent = school);
    if (user) document.querySelectorAll("[data-user-name]").forEach(n => n.textContent = user);
    if (sub) document.querySelectorAll("[data-user-sub]").forEach(n => n.textContent = sub);
  };
  try {
    const d = SP.data();
    if (d) setProfile(d.school && d.school.name, d.user && (d.user.f + " " + d.user.l), d.user && d.user.s);
  } catch (e) {}
  if (frame) {
    let tab = +(new URLSearchParams(location.search).get("tab") || 0);
    frame.src = `${root}class/index.html?embed=1&theme=${html.dataset.theme}#tab=${tab}`;
    frame.addEventListener("load", () => { send({ type: "cm-tab", tab }); send({ type: "cm-theme", theme: html.dataset.theme }); });
    const cloud = document.querySelector("[data-cloud]");
    cloud.hidden = false;
    cloud.addEventListener("click", () => send({ type: "cm-menu" }));
    document.addEventListener("click", event => {
      const link = event.target.closest("a.nav-link");
      const m = link && /pages\/school\/index\.html\?tab=(\d+)/.exec(link.getAttribute("href") || "");
      if (!m) return;
      event.preventDefault();
      tab = +m[1];
      send({ type: "cm-tab", tab });
      history.replaceState(null, "", "?tab=" + tab);
      document.querySelectorAll(".nav-link").forEach(a => {
        const mm = /pages\/school\/index\.html\?tab=(\d+)/.exec(a.getAttribute("href") || "");
        if (mm) a.classList.toggle("active", +mm[1] === tab);
      });
      const h1 = document.querySelector(".page-title h1"); if (h1) h1.textContent = SCHOOL_TABS[tab];
    });
    window.addEventListener("message", e => {
      const d = e.data || {};
      if (d.type === "cm-state") setProfile(d.school, d.user, d.subject);
    });
  }

  // ---- multi-school switcher ----
  const sw = document.getElementById("school-switch");
  const fillSchools = () => {
    sw.innerHTML = SP.list().map(s => `<option value="${s.id}" ${s.id === SP.active() ? "selected" : ""}>${SP.name(s)}</option>`).join("") + '<option value="__new">＋ افزودن مدرسه جدید</option>';
  };
  fillSchools();
  sw.addEventListener("change", () => {
    if (sw.value === "__new") {
      const name = prompt("نام مدرسه‌ی جدید را وارد کنید:");
      if (!name || !name.trim()) { fillSchools(); return; }
      SP.add(name.trim());
    } else SP.switch(sw.value);
    location.reload();
  });
})();
