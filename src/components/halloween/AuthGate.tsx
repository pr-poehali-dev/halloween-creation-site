import { useState, useEffect } from "react";

const AUTH_URL = "https://functions.poehali.dev/08432f89-1d3c-42ad-99b3-b9096ed06ddf";
const TOKEN_KEY = "mh_token";
const ADMIN_KEY = "mh_admin_pass";

async function api(body: object) {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ── Экран ввода инвайт-кода ─────────────────────────────────────────────────
function InviteScreen({ onSuccess }: { onSuccess: (name: string) => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const data = await api({ action: "use_invite", code: code.trim() });
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      onSuccess(data.name);
    } else {
      setError(data.error || "Ошибка");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--dark-bg)" }}>
      <div className="w-full max-w-sm text-center">
        <div className="text-7xl mb-6 animate-float inline-block" style={{ filter: "drop-shadow(0 0 20px #FF6B00)" }}>🎃</div>
        <h1 className="font-creepster text-4xl md:text-5xl mb-2" style={{ background: "linear-gradient(135deg,#FF6B00,#39FF14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Monster Holidays
        </h1>
        <p className="text-white/50 font-nunito mb-8 text-sm">Только для своих 🦇</p>

        <div className="card-halloween p-6 rounded-3xl" style={{ border: "1px solid rgba(255,107,0,0.4)" }}>
          <p className="font-creepster text-xl neon-orange mb-4">Введи код приглашения</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="ABCD1234"
            maxLength={16}
            className="w-full rounded-xl p-3 text-center text-lg font-bold tracking-widest font-nunito text-white placeholder-white/20 focus:outline-none mb-4"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,107,0,0.4)", letterSpacing: "0.2em" }}
          />
          {error && <p className="text-sm font-nunito mb-3" style={{ color: "#ff6b6b" }}>⚠️ {error}</p>}
          <button className="btn-primary w-full" onClick={submit} disabled={loading || !code.trim()} style={{ opacity: loading || !code.trim() ? 0.6 : 1 }}>
            {loading ? "⏳ Проверяю..." : "👻 Войти"}
          </button>
        </div>

        <p className="text-white/20 text-xs font-nunito mt-6">
          Нет кода? Попроси у автора 🎃
        </p>
      </div>
    </div>
  );
}

// ── Панель администратора ────────────────────────────────────────────────────
function AdminPanel({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState(localStorage.getItem(ADMIN_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [invites, setInvites] = useState<{ id: string; code: string; name: string; used_at: string | null; is_active: boolean }[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const login = async () => {
    setLoading(true);
    const data = await api({ action: "admin_login", password });
    if (data.admin_token) {
      localStorage.setItem(ADMIN_KEY, password);
      setAuthed(true);
      loadInvites();
    } else {
      setLoginError("Неверный пароль");
    }
    setLoading(false);
  };

  const loadInvites = async () => {
    const data = await api({ action: "list_invites", admin_password: password });
    if (data.invites) setInvites(data.invites);
  };

  const createInvite = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const data = await api({ action: "create_invite", admin_password: password, name: newName.trim() });
    if (data.code) {
      setNewName("");
      loadInvites();
    }
    setCreating(false);
  };

  const deactivate = async (id: string) => {
    await api({ action: "deactivate_invite", admin_password: password, invite_id: id });
    loadInvites();
  };

  const shareLink = (code: string) => {
    const url = `${window.location.origin}?invite=${code}`;
    navigator.clipboard?.writeText(url);
    alert(`Скопировано! Отправь ссылку:\n${url}`);
  };

  if (!authed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(13,5,21,0.97)" }}>
        <div className="w-full max-w-sm">
          <div className="card-halloween p-6 rounded-3xl" style={{ border: "1px solid rgba(191,0,255,0.5)" }}>
            <div className="flex justify-between items-center mb-4">
              <p className="font-creepster text-xl neon-purple">Панель автора 👑</p>
              <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Пароль администратора"
              className="w-full rounded-xl p-3 text-sm font-nunito text-white placeholder-white/30 focus:outline-none mb-3"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(191,0,255,0.4)" }}
            />
            {loginError && <p className="text-sm text-red-400 font-nunito mb-3">⚠️ {loginError}</p>}
            <button className="btn-primary w-full" onClick={login} disabled={loading}>
              {loading ? "⏳..." : "Войти"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-8" style={{ background: "rgba(13,5,21,0.97)" }}>
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-creepster text-3xl neon-purple">Панель автора 👑</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">✕</button>
        </div>

        {/* Создать инвайт */}
        <div className="card-halloween p-5 rounded-2xl mb-5" style={{ border: "1px solid rgba(57,255,20,0.4)" }}>
          <p className="font-creepster text-lg neon-green mb-3">Пригласить гостя</p>
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createInvite()}
              placeholder="Имя гостя (например: Маша)"
              className="flex-1 rounded-xl p-3 text-sm font-nunito text-white placeholder-white/30 focus:outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(57,255,20,0.3)" }}
            />
            <button className="btn-primary px-5" onClick={createInvite} disabled={creating || !newName.trim()}>
              {creating ? "⏳" : "➕"}
            </button>
          </div>
        </div>

        {/* Список инвайтов */}
        <div className="flex flex-col gap-3">
          {invites.length === 0 && (
            <p className="text-white/40 font-nunito text-sm text-center py-6">Ещё нет приглашений</p>
          )}
          {invites.map((inv) => (
            <div key={inv.id} className="card-halloween p-4 rounded-2xl"
              style={{ border: `1px solid ${inv.is_active ? "rgba(255,107,0,0.4)" : "rgba(255,255,255,0.1)"}`, opacity: inv.is_active ? 1 : 0.5 }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-creepster text-base" style={{ color: inv.is_active ? "#FF6B00" : "rgba(255,255,255,0.4)" }}>
                    {inv.name}
                  </div>
                  <div className="font-nunito text-xs text-white/40 mt-0.5">
                    Код: <span className="tracking-widest text-white/70 font-bold">{inv.code}</span>
                    {inv.used_at ? " · использован ✅" : " · не использован"}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {inv.is_active && (
                    <button onClick={() => shareLink(inv.code)} className="btn-secondary text-xs px-3 py-2">
                      📤 Ссылка
                    </button>
                  )}
                  {inv.is_active && (
                    <button onClick={() => deactivate(inv.id)}
                      className="text-xs px-3 py-2 rounded-xl font-nunito font-bold transition-all hover:scale-105"
                      style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", color: "#ff6b6b" }}>
                      🚫
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Главный компонент-обёртка ────────────────────────────────────────────────
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "invite" | "ok">("loading");
  const [guestName, setGuestName] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Проверяем invite-код из URL
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get("invite");
    if (inviteCode) {
      api({ action: "use_invite", code: inviteCode.toUpperCase() }).then((data) => {
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          setGuestName(data.name);
          setStatus("ok");
          window.history.replaceState({}, "", window.location.pathname);
        } else {
          setStatus("invite");
        }
      });
      return;
    }

    // Проверяем сохранённую сессию
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setStatus("invite"); return; }

    api({ action: "check_session", token }).then((data) => {
      if (data.valid) {
        setGuestName(data.name);
        setStatus("ok");
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setStatus("invite");
      }
    });
  }, []);

  // Секретный жест: тройной клик на лого открывает панель админа
  const [logoClicks, setLogoClicks] = useState(0);
  const handleLogoClick = () => {
    setLogoClicks((n) => {
      const next = n + 1;
      if (next >= 5) { setShowAdmin(true); return 0; }
      setTimeout(() => setLogoClicks(0), 2000);
      return next;
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--dark-bg)" }}>
        <div className="text-6xl animate-float" style={{ filter: "drop-shadow(0 0 20px #FF6B00)" }}>🎃</div>
      </div>
    );
  }

  if (status === "invite") {
    return (
      <>
        <InviteScreen onSuccess={(name) => { setGuestName(name); setStatus("ok"); }} />
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
        <button onClick={handleLogoClick} className="fixed bottom-4 right-4 text-2xl opacity-10 hover:opacity-30 transition-opacity">🎃</button>
      </>
    );
  }

  return (
    <>
      {children}
      {/* Кнопка для показа панели админа (5 кликов по тыкве внизу) */}
      <button onClick={handleLogoClick} className="fixed bottom-4 right-4 text-2xl opacity-10 hover:opacity-30 transition-opacity z-40" title="">🎃</button>
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      {guestName && (
        <div className="fixed top-16 right-4 z-40 text-xs font-nunito font-bold px-3 py-1.5 rounded-full"
          style={{ background: "rgba(13,5,21,0.8)", border: "1px solid rgba(255,107,0,0.3)", color: "rgba(255,107,0,0.8)" }}>
          👻 {guestName}
        </div>
      )}
    </>
  );
}
