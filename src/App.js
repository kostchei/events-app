import React, { useState, useEffect, useMemo } from 'react';
import skills from './data/skills.json';
import resources from './data/resources.json';

function EventsApp() {
  const [level, setLevel] = useState(1);
  const [output, setOutput] = useState("");
  const [terrain, setTerrain] = useState('');
  const [factions, setFactions] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState('');
  const [terrains] = useState(['arctic', 'desert']);


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

const factionsByTerrain = useMemo(() => ({
  arctic: ["Suloise", "Frost + Snow Barbarians", "Megafauna", "Magma Dwellers", "Pale Wyrms", "Goblinkin", "Frostmourne", "Feyfrost", "Hodir Ordning"],
  desert: ["Baklunish", "Rary-Bright Empire", "Old Sulm", "Tribal", "Azak-Zil Demihumans", "Elemental Fire", "Desert Fauna"],
}), []);

  // Update factions when terrain changes
  useEffect(() => {
    if (terrain && factionsByTerrain[terrain]) {
      setFactions(factionsByTerrain[terrain]);
      setSelectedFaction('');  // Reset selected faction
    }
  }, [terrain, factionsByTerrain]);  // This will run whenever `t

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
    const randomLossResource2 = resources.loss[Math.floor(Math.random() * resources.loss.length)];

    const gainResourceDescription = randomGainResource.tiers 
    ? `${randomGainResource.description} (${randomGainResource.tiers.find(tier => tier.tier === currentTier.tier).value})`
    : randomGainResource.description;

    const lossResourceDescription = randomLossResource.tiers 
    ? `${randomLossResource.description} (${randomLossResource.tiers.find(tier => tier.tier === currentTier.tier).value})`
    : randomLossResource.description;

    const lossResourceDescription2 = randomLossResource2.tiers 
  ? randomLossResource2.tiers.find(tier => tier.tier === currentTier.tier).value
  : randomLossResource2.description;

  let output;
  if (randomCheckType === "Simple Skill Check") {
    output = (
      <div style={{fontFamily: 'Helvetica Neue, Arial, sans-serif', margin: '0 auto', width: '80%', textAlign: 'center'}}>
        <strong>Simple Skill Check</strong> DC {dc} {randomSkill.skill} ({randomSkill.stat}). On success you gain {randomGainResource.name} ({gainResourceDescription}). On failure costs you {randomLossResource.name} ({lossResourceDescription}).
      </div>
    );
  } else if (randomCheckType === "Resource Swap") {
    output = (
      <div style={{fontFamily: 'Helvetica Neue, Arial, sans-serif', margin: '0 auto', width: '80%', textAlign: 'center'}}>
        <strong>Resource Swap</strong>, on a Skill check DC {dc - 3} {randomSkill.skill} ({randomSkill.stat}). On success you gain {randomGainResource.name} ({gainResourceDescription}) and costs {randomLossResource.name} ({lossResourceDescription}). Failure costs an additional {randomLossResource2.name} ({lossResourceDescription2}).
      </div>
    );
  } else { // Skill Challenge
    output = (
      <div style={{fontFamily: 'Helvetica Neue, Arial, sans-serif', margin: '0 auto', width: '75%', textAlign: 'center'}}>
        <strong>Skill Challenge</strong> DC {dc - 3} {randomSkill.skill} ({randomSkill.stat}). Get party size x2 successes before party size failures. On success you gain {randomGainResource.name} ({gainResourceDescription}). Failure costs an additional {randomLossResource2.name} ({lossResourceDescription2}).
      </div>
    );
  }

    setOutput(output); // Set the output state variable
  }

  // Call generateEvent
  generateEvent();
};

return (
  <div style={{    display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center', 
  height: '50vh',
  backgroundImage: `url("https://i.imgur.com/BaUKgO7.jpg")`,
  backgroundPosition: 'top',
  backgroundSize: '15%',
  backgroundRepeat: 'no-repeat' }}>
    <h1>Events App</h1>

    <form onSubmit={handleSubmit}style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', margin: '0 auto', width: '80%' }}>
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
