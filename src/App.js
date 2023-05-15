import React, { useState, useEffect } from 'react';
import skills from './data/skills.json';
import resources from './data/resources.json';

function EventsApp() {
  const [level, setLevel] = useState(1);
  const [output, setOutput] = useState("");
  const [terrain, setTerrain] = useState('');
  const [factions, setFactions] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState('');
  const [terrains, setTerrains] = useState(['arctic', 'desert']); 


const skillsByStat = skills.reduce((groups, skill) => {
  const stat = skill.stat.toLowerCase();
  if (!groups[stat]) {
    groups[stat] = [];
  }
  groups[stat].push(skill);
  return groups;
}, {});

const statWeights = {
  strength: 2,
  intelligence: 15,
  wisdom: 5,
  dexterity: 4,
  charisma: 4,
};

const weightedStatList = [];

for (const [stat, weight] of Object.entries(statWeights)) {
  for (let i = 0; i < weight; i++) {
    weightedStatList.push(stat);
  }
}

const tiers = [
  { levelRange: [1, 4], dc: 14, tier: 1 },
  { levelRange: [5, 8], dc: 16, tier: 2 },
  { levelRange: [9, 12], dc: 18, tier: 3 },
  { levelRange: [13, 16], dc: 20, tier: 4 },
  { levelRange: [17, 20], dc: 21, tier: 5 },
];

const factionsByTerrain = {
  arctic: [
    "Suloise",
    "Frost + Snow Barbarians", 
    "Megafauna",
    "Magma Dwellers", 
    "Pale Wyrms", 
    "Goblinkin", 
    "Frostmourne",
    "Feyfrost",
    "Hodir Ordning"
  ],
  desert: [
    "Baklunish", 
    "Rary-Bright Empire",
    "Old Sulm", 
    "Tribal",
    "Azak-Zil Demihumans",
    "Elemental Fire",
    "Desert Fauna"
  ]
};

  // Update factions when terrain changes
  useEffect(() => {
    if (terrain && factionsByTerrain[terrain]) {
      setFactions(factionsByTerrain[terrain]);
      setSelectedFaction('');  // Reset selected faction
    }
  }, [terrain]);  // This will run whenever `terrain` changes

const handleSubmit = (event) => {
  event.preventDefault();

  // Calculate tier and DC here
  const currentTier = tiers.find(tier => level >= tier.levelRange[0] && level <= tier.levelRange[1]);
  const dc = currentTier.dc;

  // Define generateEvent here
  function generateEvent() {
    const randomStatIndex = Math.floor(Math.random() * weightedStatList.length);
    const randomStat = weightedStatList[randomStatIndex];

    const statSkills = skillsByStat[randomStat];

    const randomSkillIndex = Math.floor(Math.random() * statSkills.length);
    const randomSkill = statSkills[randomSkillIndex];

    const checkTypes = ["Simple Skill Check", "Resource Swap", "Skill Challenge"];
    const randomCheckType = checkTypes[Math.floor(Math.random() * checkTypes.length)];

    const randomGainResource = resources.gain[Math.floor(Math.random() * resources.gain.length)];
    const randomLossResource = resources.loss[Math.floor(Math.random() * resources.loss.length)];

    const gainResourceDescription = randomGainResource.tiers 
    ? `${randomGainResource.description} (${randomGainResource.tiers.find(tier => tier.tier === currentTier.tier).value})`
    : randomGainResource.description;

    const lossResourceDescription = randomLossResource.tiers 
    ? `${randomLossResource.description} (${randomLossResource.tiers.find(tier => tier.tier === currentTier.tier).value})`
    : randomLossResource.description;

    let output;
    if (randomCheckType === "Simple Skill Check") {
      output = `Simple Skill Check DC ${dc} ${randomSkill.skill} (${randomSkill.stat}). On success you gain ${randomGainResource.name} (${gainResourceDescription}). On failure you lose ${randomLossResource.name} (${lossResourceDescription}).`;
    } else if (randomCheckType === "Resource Swap") {
      output = `Resource Swap, on a Skill check DC ${dc - 3} ${randomSkill.skill} (${randomSkill.stat}). On success you gain ${randomGainResource.name} (${gainResourceDescription}) and lose ${randomLossResource.name} (${lossResourceDescription}). On a failure you lose an additional ${randomLossResource.name} (${lossResourceDescription}).`;
    } else { // Skill Challenge
      output = `Skill Challenge DC ${dc - 3} ${randomSkill.skill} (${randomSkill.stat}). Get party size x2 successes before party size failures. On success you gain ${randomGainResource.name} (${gainResourceDescription}). On failure you lose ${randomLossResource.name} (${lossResourceDescription}).`;
    }

    setOutput(output); // Set the output state variable
  }

  // Call generateEvent
  generateEvent();
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
          <select value={terrain} onChange={(e) => setTerrain(e.target.value)}>
            <option value=''>Select terrain</option>
            {terrains.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <label>
          Faction:
          <select value={selectedFaction} onChange={(e) => setSelectedFaction(e.target.value)}>
            <option value=''>Select faction</option>
            {factions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>

      <button type="submit">Generate Event</button>
    </form>

    <p>{output}</p>
  </div>
);
}

export default EventsApp;
