import React, { useState } from 'react';
import skills from './data/skills.json';
import resources from './data/resources.json';

// Define skill list and resources
const skills = [
  { skill: "Skill 1", stat: "Stat 1" },
  { skill: "Skill 2", stat: "Stat 2" },
  // Add more here
];

const resources = [
  // Add resources here
];

const tiers = [
  { levelRange: [1, 4], dc: 14, tier: 1 },
  { levelRange: [5, 8], dc: 16, tier: 2 },
  { levelRange: [9, 12], dc: 18, tier: 3 },
  { levelRange: [13, 16], dc: 20, tier: 4 },
  { levelRange: [17, 20], dc: 21, tier: 5 },
];

function EventsApp() {
  const [level, setLevel] = useState(1);
  const [terrain, setTerrain] = useState("");
  const [faction, setFaction] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Calculate tier and DC here

    // Generate event here
  };

  return (
    <div>
      <h1>Events App</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Level:
          <input type="number" value={level} onChange={(e) => setLevel(e.target.value)} min="1" max="20" />
        </label>

        <label>
          Terrain:
          <input type="text" value={terrain} onChange={(e) => setTerrain(e.target.value)} />
        </label>

        <label>
          Faction:
          <input type="text" value={faction} onChange={(e) => setFaction(e.target.value)} />
        </label>

        <button type="submit">Generate Event</button>
      </form>

      {/* Output goes here */}
    </div>
  );
}

export default EventsApp;
