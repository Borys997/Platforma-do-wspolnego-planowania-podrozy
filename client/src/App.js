import "./App.css";
import { useEffect, useState } from "react";

function App() {

  const [trips, setTrips] = useState([]);

  const [form, setForm] = useState({
    owner: "",
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: ""
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    fetch("http://localhost:5000/api/trips")
      .then(res => res.json())
      .then(data => setTrips(data));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addTrip = () => {
    fetch("http://localhost:5000/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {

        setForm({
          owner: "",
          name: "",
          destination: "",
          startDate: "",
          endDate: "",
          budget: "",
          description: ""
        });

        loadTrips();
      });
  };

  const deleteTrip = (id) => {
    fetch(`http://localhost:5000/api/trips/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        loadTrips();
      });
  };

  const voteTrip = (id) => {
    fetch(`http://localhost:5000/api/trips/${id}/vote`, {
      method: "PATCH"
    })
      .then(res => res.json())
      .then(() => {
        loadTrips();
      });
  };

  return (
    <div className="container">

      <h1>TravelPlanner</h1>

      {/* FORMULARZ */}
      <div className="form">

        <input
          name="owner"
          placeholder="Twoje imię"
          value={form.owner}
          onChange={handleChange}
        />

        <input
          name="name"
          placeholder="Nazwa podróży"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="destination"
          placeholder="Cel podróży"
          value={form.destination}
          onChange={handleChange}
        />

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />

        <input
          type="number"
          name="budget"
          placeholder="Budżet (PLN)"
          value={form.budget}
          onChange={handleChange}
          min="0"
        />

        <textarea
          name="description"
          placeholder="Dodatkowe informacje..."
          value={form.description}
          onChange={handleChange}
        />

        <button onClick={addTrip}>
          Dodaj
        </button>

      </div>

      {/* LISTA PODRÓŻY */} 
      {[...trips]
        .sort((a, b) => b.votes - a.votes)
        .map((trip, index) => (

        <div className="card" key={trip.id}>

          <div>
            

            <h3>
              #{index + 1} 🏆 {trip.name}
            </h3>

            <p>📍 {trip.destination}</p>

            <p>👤 {trip.owner}</p>

            <p>💰 {trip.budget} PLN</p>

            <p>📅 {trip.startDate} → {trip.endDate}</p>

            <p>📝 {trip.description}</p>

            <p>👍 Głosy: {trip.votes}</p>

          </div>

          <div className="buttons">

            <button onClick={() => voteTrip(trip.id)}>
              👍 Głosuj
            </button>

            <button onClick={() => deleteTrip(trip.id)}>
              Usuń
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}

export default App;