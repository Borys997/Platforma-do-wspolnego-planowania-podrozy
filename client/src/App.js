import "./App.css";
import { useEffect, useState } from "react";

// ==========================================
// SVG ICONS HELPERS
// ==========================================
const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const CashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const ThumbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', right: '15px', top: '15px', color: '#64748b'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const ExtLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);
const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
);

function App() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem("tp_token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("tp_user")) || null);
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");

  // Rooms state
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomNameInput, setRoomNameInput] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  // Trips state
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [currentTab, setCurrentTab] = useState("itinerary");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("votes");
  const [showAddModal, setShowAddModal] = useState(false);

  // Forms for Trips and details
  const [tripForm, setTripForm] = useState({
    owner: "",
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: ""
  });

  // Details data for selected trip
  const [itinerary, setItinerary] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [checklist, setChecklist] = useState([]);

  // Detail Sub-forms
  const [itineraryForm, setItineraryForm] = useState({ dayNumber: 1, time: "", title: "", description: "", cost: "", location: "" });
  const [expenseForm, setExpenseForm] = useState({ category: "Transport", amount: "", description: "", payer: "" });
  const [expenseFilter, setExpenseFilter] = useState("Wszystkie");
  const [suggestionForm, setSuggestionForm] = useState({ category: "Atrakcja", name: "", description: "", link: "", suggestedBy: "" });
  const [checklistForm, setChecklistForm] = useState({ task: "", assignee: "" });

  // Custom fetch wrapping to inject JWT headers and handle session expiry
  const apiFetch = (path, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers
    };
    return fetch(`http://localhost:5000${path}`, { ...options, headers })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error("Sesja wygasła. Zaloguj się ponownie.");
        }
        return res;
      });
  };

  useEffect(() => {
    if (token) {
      loadRooms();
    }
  }, [token]);

  useEffect(() => {
    if (selectedRoom) {
      loadTrips();
    } else {
      setTrips([]);
      setSelectedTrip(null);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (selectedTrip) {
      loadTripDetails(selectedTrip.id);
    }
  }, [selectedTrip]);

  // Auth Operations
  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    const path = authMode === "login" ? "/api/auth/login" : "/api/auth/register";

    fetch(`http://localhost:5000${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm)
    })
      .then(res => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status >= 400) {
          setAuthError(data.message || "Wystąpił błąd autoryzacji");
        } else {
          localStorage.setItem("tp_token", data.token);
          localStorage.setItem("tp_user", JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          setAuthForm({ username: "", password: "" });
        }
      })
      .catch(err => {
        setAuthError("Nie można połączyć się z serwerem.");
        console.error(err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("tp_token");
    localStorage.removeItem("tp_user");
    setToken(null);
    setUser(null);
    setRooms([]);
    setSelectedRoom(null);
    setSelectedTrip(null);
  };

  // Rooms Operations
  const loadRooms = () => {
    apiFetch("/api/rooms")
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error("Error loading rooms:", err));
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!roomNameInput) return;

    apiFetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify({ name: roomNameInput })
    })
      .then(res => res.json())
      .then(newRoom => {
        setRoomNameInput("");
        loadRooms();
        setSelectedRoom(newRoom);
      })
      .catch(err => console.error(err));
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomCodeInput) return;

    apiFetch("/api/rooms/join", {
      method: "POST",
      body: JSON.stringify({ code: roomCodeInput })
    })
      .then(res => {
        if (res.status === 404) {
          alert("Pokój o podanym kodzie nie istnieje.");
          return null;
        }
        return res.json();
      })
      .then(joinedRoom => {
        if (joinedRoom) {
          setRoomCodeInput("");
          loadRooms();
          setSelectedRoom(joinedRoom);
        }
      })
      .catch(err => console.error(err));
  };

  const copyRoomCode = () => {
    if (selectedRoom) {
      navigator.clipboard.writeText(selectedRoom.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Trips CRUD
  const loadTrips = () => {
    if (!selectedRoom) return;
    apiFetch(`/api/trips?roomId=${selectedRoom.id}`)
      .then(res => res.json())
      .then(data => setTrips(data))
      .catch(err => console.error(err));
  };

  const loadTripDetails = (tripId) => {
    apiFetch(`/api/trips/${tripId}/itinerary`).then(res => res.json()).then(data => setItinerary(data));
    apiFetch(`/api/trips/${tripId}/expenses`).then(res => res.json()).then(data => setExpenses(data));
    apiFetch(`/api/trips/${tripId}/suggestions`).then(res => res.json()).then(data => setSuggestions(data));
    apiFetch(`/api/trips/${tripId}/checklist`).then(res => res.json()).then(data => setChecklist(data));
  };

  const handleTripChange = (e) => {
    setTripForm({ ...tripForm, [e.target.name]: e.target.value });
  };

  const handleAddTrip = (e) => {
    e.preventDefault();
    apiFetch("/api/trips", {
      method: "POST",
      body: JSON.stringify({ ...tripForm, roomId: selectedRoom.id })
    })
      .then(res => res.json())
      .then(() => {
        setTripForm({ owner: "", name: "", destination: "", startDate: "", endDate: "", budget: "", description: "" });
        setShowAddModal(false);
        loadTrips();
      })
      .catch(err => console.error(err));
  };

  const handleDeleteTrip = (id, name) => {
    if (window.confirm(`Czy na pewno chcesz usunąć podróż "${name}"? Usunie to wszystkie przypisane plany i koszty.`)) {
      apiFetch(`/api/trips/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
          if (selectedTrip && selectedTrip.id === id) {
            setSelectedTrip(null);
          }
          loadTrips();
        })
        .catch(err => console.error(err));
    }
  };

  const handleVoteTrip = (e, id) => {
    e.stopPropagation();
    apiFetch(`/api/trips/${id}/vote`, { method: "PATCH" })
      .then(res => res.json())
      .then(updatedTrip => {
        setTrips(prev => prev.map(t => t.id === id ? updatedTrip : t));
        if (selectedTrip && selectedTrip.id === id) {
          setSelectedTrip(updatedTrip);
        }
      })
      .catch(err => console.error(err));
  };

  // ==========================================
  // ITINERARY
  // ==========================================
  const handleAddItinerary = (e) => {
    e.preventDefault();
    apiFetch(`/api/trips/${selectedTrip.id}/itinerary`, {
      method: "POST",
      body: JSON.stringify(itineraryForm)
    })
      .then(res => res.json())
      .then(() => {
        setItineraryForm({ dayNumber: 1, time: "", title: "", description: "", cost: "", location: "" });
        loadTripDetails(selectedTrip.id);
      });
  };

  const handleDeleteItinerary = (id) => {
    apiFetch(`/api/trips/${selectedTrip.id}/itinerary/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => loadTripDetails(selectedTrip.id));
  };

  // ==========================================
  // EXPENSES
  // ==========================================
  const handleAddExpense = (e) => {
    e.preventDefault();
    apiFetch(`/api/trips/${selectedTrip.id}/expenses`, {
      method: "POST",
      body: JSON.stringify(expenseForm)
    })
      .then(res => res.json())
      .then(() => {
        setExpenseForm({ category: "Transport", amount: "", description: "", payer: "" });
        loadTripDetails(selectedTrip.id);
      });
  };

  const handleDeleteExpense = (id) => {
    apiFetch(`/api/trips/${selectedTrip.id}/expenses/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => loadTripDetails(selectedTrip.id));
  };

  // ==========================================
  // SUGGESTIONS
  // ==========================================
  const handleAddSuggestion = (e) => {
    e.preventDefault();
    apiFetch(`/api/trips/${selectedTrip.id}/suggestions`, {
      method: "POST",
      body: JSON.stringify(suggestionForm)
    })
      .then(res => res.json())
      .then(() => {
        setSuggestionForm({ category: "Atrakcja", name: "", description: "", link: "", suggestedBy: "" });
        loadTripDetails(selectedTrip.id);
      });
  };

  const handleDeleteSuggestion = (id) => {
    apiFetch(`/api/trips/${selectedTrip.id}/suggestions/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => loadTripDetails(selectedTrip.id));
  };

  const handleVoteSuggestion = (id) => {
    apiFetch(`/api/trips/${selectedTrip.id}/suggestions/${id}/vote`, { method: "PATCH" })
      .then(res => res.json())
      .then(() => loadTripDetails(selectedTrip.id));
  };

  // ==========================================
  // CHECKLIST
  // ==========================================
  const handleAddChecklist = (e) => {
    e.preventDefault();
    apiFetch(`/api/trips/${selectedTrip.id}/checklist`, {
      method: "POST",
      body: JSON.stringify(checklistForm)
    })
      .then(res => res.json())
      .then(() => {
        setChecklistForm({ task: "", assignee: "" });
        loadTripDetails(selectedTrip.id);
      });
  };

  const handleToggleChecklist = (id) => {
    apiFetch(`/api/trips/${selectedTrip.id}/checklist/${id}/toggle`, { method: "PATCH" })
      .then(res => res.json())
      .then(() => loadTripDetails(selectedTrip.id));
  };

  const handleDeleteChecklist = (id) => {
    apiFetch(`/api/trips/${selectedTrip.id}/checklist/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => loadTripDetails(selectedTrip.id));
  };

  // Calculations for Expense progress bar
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetLimit = selectedTrip ? selectedTrip.budget : 0;
  const budgetPercentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
  
  const getProgressBarClass = () => {
    if (budgetPercentage >= 100) return "progress-bar red";
    if (budgetPercentage >= 70) return "progress-bar orange";
    return "progress-bar green";
  };

  const filteredExpenses = expenses.filter(exp => 
    expenseFilter === "Wszystkie" ? true : exp.category === expenseFilter
  );

  const filteredTrips = trips.filter(trip => {
    const query = searchQuery.toLowerCase();
    return (
      trip.name.toLowerCase().includes(query) ||
      trip.destination.toLowerCase().includes(query) ||
      (trip.owner && trip.owner.toLowerCase().includes(query)) ||
      (trip.description && trip.description.toLowerCase().includes(query))
    );
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "budget") return b.budget - a.budget;
    if (sortBy === "startDate") {
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(a.startDate) - new Date(b.startDate);
    }
    return 0;
  });

  // ==========================================================================
  // VIEW RENDER FLOW
  // ==========================================================================
  if (!token) {
    /* -------------------------------------------------------------
       1. EKRAN AUTORYZACJI (LOGOWANIE / REJESTRACJA)
       ------------------------------------------------------------- */
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
        <header>
          <h1>TravelPlanner</h1>
          <p>Zaplanuj wspaniałą podróż grupową ze znajomymi</p>
        </header>

        <div className="auth-container">
          <div className="auth-card glass-panel">
            <h2>{authMode === "login" ? "Logowanie" : "Rejestracja"}</h2>
            <p className="subtitle">Udostępniaj koszty, harmonogramy i listy zadań</p>

            {authError && <div className="auth-error">{authError}</div>}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label>Nazwa użytkownika</label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="Podaj login"
                  value={authForm.username}
                  onChange={handleAuthChange}
                  required
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left' }}>
                <label>Hasło</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Podaj hasło"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
                {authMode === "login" ? "Zaloguj się" : "Zarejestruj się"}
              </button>
            </form>

            <div className="auth-toggle">
              {authMode === "login" ? (
                <>Nie masz jeszcze konta? <span onClick={() => { setAuthMode("register"); setAuthError(""); }}>Zarejestruj się</span></>
              ) : (
                <>Masz już konto? <span onClick={() => { setAuthMode("login"); setAuthError(""); }}>Zaloguj się</span></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedRoom) {
    /* -------------------------------------------------------------
       2. WIDOK WYBORU POKOJU (WORKSPACE SELECTION)
       ------------------------------------------------------------- */
    return (
      <div className="container">
        <div className="top-bar">
          <span className="user-tag">👤 {user?.username}</span>
          <button className="btn-logout" onClick={handleLogout}>Wyloguj się</button>
        </div>

        <header>
          <h1>Moje Pokoje Podróży</h1>
          <p>Wybierz przestrzeń podróży lub stwórz nową dla swojej ekipy</p>
        </header>

        <div className="rooms-view">
          <h2>Twoje aktywne pokoje</h2>
          {rooms.length > 0 ? (
            <div className="rooms-grid">
              {rooms.map(room => (
                <div 
                  key={room.id} 
                  className="room-card glass-panel"
                  onClick={() => setSelectedRoom(room)}
                >
                  <div>
                    <h3 className="room-name">{room.name}</h3>
                    <p className="room-info">Organizator: <strong>{room.ownerName || "Ty"}</strong></p>
                  </div>
                  <div className="room-info" style={{ marginTop: '15px' }}>
                    Kod pokoju: <span className="room-code-tag">{room.code}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel empty-state" style={{ marginBottom: '35px' }}>
              Nie należysz jeszcze do żadnego pokoju. Stwórz pokój lub dołącz do istniejącego!
            </div>
          )}

          <div className="rooms-actions">
            {/* Tworzenie pokoju */}
            <div className="room-action-box glass-panel">
              <h3><PlusIcon /> Stwórz nowy pokój</h3>
              <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label>Nazwa pokoju</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="np. Sopot 2026 ze znajomymi"
                    value={roomNameInput}
                    onChange={(e) => setRoomNameInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                  Utwórz przestrzeń
                </button>
              </form>
            </div>

            {/* Dołączanie do pokoju */}
            <div className="room-action-box glass-panel">
              <h3><KeyIcon /> Dołącz do pokoju</h3>
              <form onSubmit={handleJoinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label>Wpisz 6-cyfrowy kod pokoju</label>
                  <input
                    type="text"
                    maxLength="6"
                    className="form-input"
                    style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '2px', fontSize: '18px', textAlign: 'center' }}
                    placeholder="np. AB3D5F"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                  Wejdź do pokoju
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     3. WIDOK PODRÓŻY WEWNĄTRZ WYBRANEGO POKOJU
     ------------------------------------------------------------- */
  return (
    <div className="container">
      {/* GÓRNY PASEK LOGOWANIA */}
      <div className="top-bar">
        <span className="user-tag">👤 Zalogowany: {user?.username}</span>
        <button className="btn-back" style={{ padding: '6px 14px' }} onClick={() => setSelectedRoom(null)}>
          Zmień pokój
        </button>
        <button className="btn-logout" onClick={handleLogout}>Wyloguj się</button>
      </div>

      <header>
        <h1>TravelPlanner</h1>
        <p>Planowanie i organizacja podróży grupowych</p>
      </header>

      {/* BELKA WYBRANEGO POKOJU */}
      <div className="room-header-bar">
        <div className="room-title-code">
          <h2>Pokój: {selectedRoom.name}</h2>
          <div className="room-code-badge">
            Kod zaproszenia: <strong>{selectedRoom.code}</strong>
            <button className="btn-copy" onClick={copyRoomCode}>
              {copiedCode ? "Skopiowano!" : "📋 Kopiuj kod"}
            </button>
          </div>
        </div>
        <button className="btn-back" onClick={() => setSelectedRoom(null)}>
          <BackIcon /> Wybierz inny pokój
        </button>
      </div>

      {/* DASHBOARD GŁÓWNY POKOJU */}
      {!selectedTrip ? (
        <>
          <div className="actions-bar">
            <div className="search-wrapper">
              <input
                className="search-input"
                placeholder="Wyszukaj podróż w tym pokoju..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="votes">Sortuj wg głosów</option>
                <option value="startDate">Sortuj wg daty</option>
                <option value="budget">Sortuj wg budżetu</option>
              </select>

              <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                <PlusIcon /> Nowa Podróż
              </button>
            </div>
          </div>

          {/* LISTA PODRÓŻY W POKOJU */}
          {sortedTrips.length > 0 ? (
            <div className="trips-grid">
              {sortedTrips.map((trip, idx) => (
                <div 
                  className="trip-card glass-panel" 
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="trip-badge">#{idx + 1} Miejsce</div>
                  <div className="trip-card-header">
                    <h3 className="trip-title">{trip.name}</h3>
                    <div className="trip-dest">
                      <PinIcon /> {trip.destination}
                    </div>
                  </div>

                  <div className="trip-card-details">
                    <div className="detail-item">
                      <UserIcon /> <span>{trip.owner || "Anonim"}</span>
                    </div>
                    <div className="detail-item">
                      <CashIcon /> <span>{trip.budget ? `${trip.budget} PLN` : "Brak limitu"}</span>
                    </div>
                    <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                      <CalendarIcon /> <span>{trip.startDate ? `${trip.startDate} → ${trip.endDate || '...'}` : "Brak dat"}</span>
                    </div>
                    {trip.description && (
                      <div className="trip-desc">
                        {trip.description}
                      </div>
                    )}
                  </div>

                  <div className="trip-card-footer" onClick={(e) => e.stopPropagation()}>
                    <div className="votes-counter">
                      <button 
                        className={`btn-vote ${trip.hasVoted ? "active" : ""}`} 
                        onClick={(e) => handleVoteTrip(e, trip.id)}
                      >
                        <ThumbIcon />
                      </button>
                      <span>{trip.votes} głosów</span>
                    </div>

                    <div className="trip-card-actions">
                      <button 
                        className="btn-icon btn-manage" 
                        onClick={() => setSelectedTrip(trip)}
                        title="Zarządzaj"
                      >
                        📂
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => handleDeleteTrip(trip.id, trip.name)}
                        title="Usuń"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel empty-state" style={{ padding: '60px 20px' }}>
              <p>W tym pokoju nie ma jeszcze żadnych podróży.</p>
              <button className="btn-primary" style={{ margin: '20px auto 0 auto' }} onClick={() => setShowAddModal(true)}>
                Stwórz pierwszą podróż
              </button>
            </div>
          )}
        </>
      ) : (
        /* ==========================================================================
           SZCZEGÓŁOWY PANEL PODRÓŻY W WYBRANYM POKOJU
           ========================================================================== */
        <div className="trip-dashboard">
          <div className="dashboard-header">
            <div className="dashboard-meta">
              <h2>{selectedTrip.name}</h2>
              <p>
                <span>📍 {selectedTrip.destination}</span> |
                <span>👤 Organizator: {selectedTrip.owner || "Anonim"}</span> |
                <span>📅 {selectedTrip.startDate ? `${selectedTrip.startDate} do ${selectedTrip.endDate}` : "Nieustalone daty"}</span>
              </p>
            </div>

            <button className="btn-back" onClick={() => setSelectedTrip(null)}>
              <BackIcon /> Wróć do listy
            </button>
          </div>

          {/* TABS NAVIGATION */}
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${currentTab === "itinerary" ? "active" : ""}`}
              onClick={() => setCurrentTab("itinerary")}
            >
              📅 Plan Podróży
            </button>
            <button 
              className={`tab-btn ${currentTab === "expenses" ? "active" : ""}`}
              onClick={() => setCurrentTab("expenses")}
            >
              💰 Budżet i Koszty
            </button>
            <button 
              className={`tab-btn ${currentTab === "suggestions" ? "active" : ""}`}
              onClick={() => setCurrentTab("suggestions")}
            >
              📍 Propozycje Miejsc
            </button>
            <button 
              className={`tab-btn ${currentTab === "checklist" ? "active" : ""}`}
              onClick={() => setCurrentTab("checklist")}
            >
              📝 Lista Zadań
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="tab-contents">
            {/* 1. PLAN PODRÓŻY */}
            {currentTab === "itinerary" && (
              <div className="tab-content-grid">
                <div className="tab-panel-main glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px', fontSize: '20px' }}>
                    Harmonogram Wyjazdu
                  </h3>
                  
                  {itinerary.length > 0 ? (
                    <div className="timeline">
                      {itinerary.map((item) => (
                        <div className="timeline-item" key={item.id}>
                          <div className="timeline-header">
                            <div className="timeline-time-title">
                              <span className="timeline-day-badge">Dzień {item.dayNumber}</span>
                              {item.time && <span className="timeline-time">{item.time}</span>}
                              <h4 className="timeline-title">{item.title}</h4>
                            </div>
                            <button className="btn-mini-delete" onClick={() => handleDeleteItinerary(item.id)}>
                              <TrashIcon />
                            </button>
                          </div>

                          {item.location && <div className="timeline-location">📍 {item.location}</div>}
                          {item.description && <p className="timeline-desc">{item.description}</p>}
                          {item.cost > 0 && <div className="timeline-cost">Szacowany koszt: {item.cost} PLN</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>Brak zaplanowanych punktów programu. Dodaj pierwszy plan w panelu bocznym.</p>
                    </div>
                  )}
                </div>

                <div className="side-panel">
                  <div className="glass-panel sidebar-card">
                    <h3><PlusIcon /> Dodaj Punkt Planu</h3>
                    <form onSubmit={handleAddItinerary} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-group">
                        <label>Dzień wyjazdu</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          min="1" 
                          value={itineraryForm.dayNumber} 
                          onChange={(e) => setItineraryForm({ ...itineraryForm, dayNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Godzina (opcjonalnie)</label>
                        <input 
                          type="time" 
                          className="form-input" 
                          value={itineraryForm.time} 
                          onChange={(e) => setItineraryForm({ ...itineraryForm, time: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Nazwa atrakcji / wydarzenia</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="np. Zwiedzanie Koloseum" 
                          value={itineraryForm.title} 
                          onChange={(e) => setItineraryForm({ ...itineraryForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Lokalizacja (opcjonalnie)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="np. Rzym, Piazza del Colosseo" 
                          value={itineraryForm.location} 
                          onChange={(e) => setItineraryForm({ ...itineraryForm, location: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Szacowany koszt (PLN)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="0" 
                          min="0"
                          value={itineraryForm.cost} 
                          onChange={(e) => setItineraryForm({ ...itineraryForm, cost: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Dodatkowy opis</label>
                        <textarea 
                          className="form-input" 
                          style={{ minHeight: '60px' }}
                          placeholder="np. Kupić bilety online z wyprzedzeniem..." 
                          value={itineraryForm.description} 
                          onChange={(e) => setItineraryForm({ ...itineraryForm, description: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                        Zapisz w planie
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 2. WYDATKI I BUDŻET */}
            {currentTab === "expenses" && (
              <div className="tab-content-grid">
                <div className="tab-panel-main">
                  {/* Podsumowanie Budżetu */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div className="budget-summary">
                      <div className="budget-stats">
                        <span>Wydano: <strong>{totalSpent} PLN</strong></span>
                        <span>Całkowity budżet: <strong>{budgetLimit ? `${budgetLimit} PLN` : "Nielimitowany"}</strong></span>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className={getProgressBarClass()} 
                          style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                        ></div>
                      </div>
                      {budgetLimit > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
                          <span>Wykorzystano {Math.round(budgetPercentage)}% limitu</span>
                          {budgetLimit - totalSpent >= 0 ? (
                            <span style={{ color: '#10b981' }}>Pozostało do wydania: {budgetLimit - totalSpent} PLN</span>
                          ) : (
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Przekroczono budżet o: {Math.abs(budgetLimit - totalSpent)} PLN!</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lista wydatków */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                      <h3 style={{ fontSize: '20px' }}>Księga Wydatków</h3>
                      
                      <div className="category-filter-bar">
                        {["Wszystkie", "Nocleg", "Transport", "Jedzenie", "Atrakcja", "Inne"].map(cat => (
                          <button 
                            key={cat}
                            className={`cat-filter-btn ${expenseFilter === cat ? "active" : ""}`}
                            onClick={() => setExpenseFilter(cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredExpenses.length > 0 ? (
                      <div className="expense-list">
                        {filteredExpenses.map((exp) => (
                          <div className="expense-item glass-panel" key={exp.id}>
                            <div className="expense-info">
                              <div className="expense-title-cat">
                                <span className={`badge badge-${exp.category.toLowerCase()}`}>{exp.category}</span>
                                <span className="expense-title">{exp.description || "Brak opisu"}</span>
                              </div>
                              <span className="expense-payer">Płacił(a): {exp.payer}</span>
                            </div>

                            <div className="expense-val-actions">
                              <span className="expense-amount">-{exp.amount} PLN</span>
                              <button className="btn-mini-delete" onClick={() => handleDeleteExpense(exp.id)}>
                                <TrashIcon />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>Brak wprowadzonych wydatków w wybranej kategorii.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="side-panel">
                  <div className="glass-panel sidebar-card">
                    <h3><PlusIcon /> Dodaj Wydatek</h3>
                    <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-group">
                        <label>Kwota (PLN)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="0.00" 
                          min="0"
                          step="0.01"
                          value={expenseForm.amount} 
                          onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Kategoria</label>
                        <select 
                          className="form-input" 
                          value={expenseForm.category} 
                          onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        >
                          <option value="Nocleg">Nocleg 🏨</option>
                          <option value="Transport">Transport ✈️</option>
                          <option value="Jedzenie">Jedzenie 🍔</option>
                          <option value="Atrakcja">Atrakcja 🎟️</option>
                          <option value="Inne">Inne 📦</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Krótki opis</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="np. Obiad w restauracji rybnej" 
                          value={expenseForm.description} 
                          onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Kto płacił? (opcjonalnie)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="np. Tomek (domyślnie Ty)" 
                          value={expenseForm.payer} 
                          onChange={(e) => setExpenseForm({ ...expenseForm, payer: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                        Zapisz wydatek
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PROPOZYCJE MIEJSC */}
            {currentTab === "suggestions" && (
              <div className="tab-content-grid">
                <div className="tab-panel-main">
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px', fontSize: '20px', marginBottom: '20px' }}>
                      Tablica Propozycji Uczestników
                    </h3>

                    {suggestions.length > 0 ? (
                      <div className="suggestions-grid">
                        {suggestions.map((sugg) => (
                          <div className="suggestion-card glass-panel" key={sugg.id}>
                            <div className="suggestion-header">
                              <div className="sugg-cat-info">
                                <span className={`badge badge-${sugg.category.toLowerCase()}`}>{sugg.category}</span>
                                <h4 className="suggestion-name">{sugg.name}</h4>
                              </div>
                              <button className="btn-mini-delete" onClick={() => handleDeleteSuggestion(sugg.id)}>
                                <TrashIcon />
                              </button>
                            </div>

                            {sugg.description && <p className="suggestion-desc">{sugg.description}</p>}
                            
                            {sugg.link && (
                              <a href={sugg.link} target="_blank" rel="noreferrer" className="suggestion-link">
                                <ExtLinkIcon /> Zobacz stronę www
                              </a>
                            )}

                            <div className="suggestion-by">
                              Zaproponowane przez: <strong>{sugg.suggestedBy}</strong>
                            </div>

                            <div className="suggestion-footer">
                              <div className="votes-counter">
                                <button 
                                  className={`btn-vote ${sugg.hasVoted ? "active" : ""}`} 
                                  onClick={() => handleVoteSuggestion(sugg.id)}
                                >
                                  <ThumbIcon />
                                </button>
                                <span>{sugg.votes} głosów</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>Brak zgłoszonych propozycji. Zaproponuj nocleg lub restaurację znajomym!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="side-panel">
                  <div className="glass-panel sidebar-card">
                    <h3><PlusIcon /> Zaproponuj Miejsce</h3>
                    <form onSubmit={handleAddSuggestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-group">
                        <label>Nazwa obiektu</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="np. Hotel Hilton, Trattoria Romana" 
                          value={suggestionForm.name} 
                          onChange={(e) => setSuggestionForm({ ...suggestionForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Kategoria</label>
                        <select 
                          className="form-input" 
                          value={suggestionForm.category} 
                          onChange={(e) => setSuggestionForm({ ...suggestionForm, category: e.target.value })}
                        >
                          <option value="Nocleg">Nocleg 🏨</option>
                          <option value="Restauracja">Restauracja 🍔</option>
                          <option value="Atrakcja">Atrakcja 🎟️</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Link / Strona internetowa (opcjonalnie)</label>
                        <input 
                          type="url" 
                          className="form-input" 
                          placeholder="http://booking.com/..." 
                          value={suggestionForm.link} 
                          onChange={(e) => setSuggestionForm({ ...suggestionForm, link: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Twoje Imię (opcjonalnie)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="np. Ania (domyślnie Ty)" 
                          value={suggestionForm.suggestedBy} 
                          onChange={(e) => setSuggestionForm({ ...suggestionForm, suggestedBy: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Opis / Rekomendacja</label>
                        <textarea 
                          className="form-input" 
                          style={{ minHeight: '60px' }}
                          placeholder="Dlaczego polecasz to miejsce?" 
                          value={suggestionForm.description} 
                          onChange={(e) => setSuggestionForm({ ...suggestionForm, description: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                        Wyślij propozycję
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 4. LISTA ZADAŃ */}
            {currentTab === "checklist" && (
              <div className="tab-content-grid">
                <div className="tab-panel-main glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px', fontSize: '20px', marginBottom: '20px' }}>
                    Sprawy do Ogarnięcia (Checklista)
                  </h3>

                  {checklist.length > 0 ? (
                    <div className="checklist-container">
                      {checklist.map((item) => (
                        <div className={`checklist-item glass-panel ${item.isCompleted ? "completed" : ""}`} key={item.id}>
                          <div className="checklist-left" onClick={() => handleToggleChecklist(item.id)}>
                            <div className={`custom-checkbox ${item.isCompleted ? "checked" : ""}`}></div>
                            <span className="task-text">
                              {item.task}
                              <span className="assignee-badge">Osoba: {item.assignee}</span>
                            </span>
                          </div>

                          <button className="btn-mini-delete" onClick={() => handleDeleteChecklist(item.id)}>
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>Brak zadań na liście. Dodaj zadania takie jak "Kupić ubezpieczenie" czy "Spakować dokumenty".</p>
                    </div>
                  )}
                </div>

                <div className="side-panel">
                  <div className="glass-panel sidebar-card">
                    <h3><PlusIcon /> Nowe Zadanie</h3>
                    <form onSubmit={handleAddChecklist} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-group">
                        <label>Treść zadania</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="np. Kupić bilety na prom" 
                          value={checklistForm.task} 
                          onChange={(e) => setChecklistForm({ ...checklistForm, task: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Osoba odpowiedzialna</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="np. Wszyscy, Tomek, Kasia" 
                          value={checklistForm.assignee} 
                          onChange={(e) => setChecklistForm({ ...checklistForm, assignee: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                        Dodaj do listy
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FORMULARZ DODAWANIA PODRÓŻY (MODAL) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3 className="modal-title">Zaplanuj Nowy Wyjazd</h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddTrip} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Twoje Imię (Organizator)</label>
                  <input
                    name="owner"
                    className="form-input"
                    placeholder="np. Robert (domyślnie Ty)"
                    value={tripForm.owner}
                    onChange={handleTripChange}
                  />
                </div>

                <div className="form-group">
                  <label>Nazwa Wyjazdu *</label>
                  <input
                    name="name"
                    className="form-input"
                    placeholder="np. Wakacje w Toskanii"
                    value={tripForm.name}
                    onChange={handleTripChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cel Podróży *</label>
                  <input
                    name="destination"
                    className="form-input"
                    placeholder="np. Florencja, Włochy"
                    value={tripForm.destination}
                    onChange={handleTripChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Maksymalny Budżet (PLN)</label>
                  <input
                    type="number"
                    name="budget"
                    className="form-input"
                    placeholder="np. 4500"
                    min="0"
                    value={tripForm.budget}
                    onChange={handleTripChange}
                  />
                </div>

                <div className="form-group">
                  <label>Data Rozpoczęcia</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-input"
                    value={tripForm.startDate}
                    onChange={handleTripChange}
                  />
                </div>

                <div className="form-group">
                  <label>Data Zakończenia</label>
                  <input
                    type="date"
                    name="endDate"
                    className="form-input"
                    value={tripForm.endDate}
                    onChange={handleTripChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Dodatkowe Informacje / Opis</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    placeholder="Krótki opis podróży, planowany dojazd, zarys atrakcji..."
                    value={tripForm.description}
                    onChange={handleTripChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px' }}>
                <button type="button" className="btn-back" style={{ transform: 'none' }} onClick={() => setShowAddModal(false)}>
                  Anuluj
                </button>
                <button type="submit" className="btn-primary">
                  Zapisz podróż
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;