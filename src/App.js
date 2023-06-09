import React, { useState, useEffect, useMemo } from 'react';
import skills from './data/skills.json';
import resources from './data/resources.json';
import generateName from './assets/barbarianNames.js'; 
import wildFeatures from './data/wildFeatures.json';
import './App.css'; 


function EventsApp() {
  const [level, setLevel] = useState(1);
  const [output, setOutput] = useState("");
  const [terrain, setTerrain] = useState('arctic');
  const [factions, setFactions] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState('');
  const [terrains] = useState(['arctic', 'desert']);
  const isMale = Math.random() < 0.55;
  const gender = isMale ? 'male' : 'female';
  const pronoun = isMale ? 'he' : 'she';
  const name = generateName(gender);

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
  { levelRange: [1, 4], dc: 14, tier: 1, xp: 25, title: "the least of" },
  { levelRange: [5, 8], dc: 16, tier: 2, xp:250, title: "a worthy of the" },
  { levelRange: [9, 12], dc: 18, tier: 3 , xp: 550, title: " a leader among the" },
  { levelRange: [13, 16], dc: 20, tier: 4, xp: 1100, title: " a paragon of the" },
  { levelRange: [17, 20], dc: 21, tier: 5, xp: 2000, title: "the most epic of the" },
];

const randomWildFeatureIndex = Math.floor(Math.random() * wildFeatures.wildFeature.length);
const wildFeature = wildFeatures.wildFeature[randomWildFeatureIndex];

const factionsByTerrain = useMemo(() => ({
  arctic: ["Suloise", "Northern Barbarians", "Wildthings", "Magma Dwellers", "Pale Wyrms", "Goblinkin", "Frostmourne", "Feyfrost", "Hodir Ordning"],
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

 // Add level variation
 let variedLevel = parseInt(level) + Math.floor(Math.random() * 9) - 4;  // Random number between -4 and +4
 // Ensure variedLevel is within 1-20 range
 variedLevel = Math.max(1, variedLevel);
 variedLevel = Math.min(20, variedLevel);

  // Calculate tier and DC here
  const currentTier = tiers.find(tier => variedLevel >= tier.levelRange[0] && variedLevel <= tier.levelRange[1]);
  const dc = currentTier.dc;
  const xp = currentTier.xp;
  const tierTitle = currentTier.title;

    // Randomize faction selection 10% of the time
    let faction = selectedFaction;
    if (Math.random() < 0.2) {
      const randomFactionIndex = Math.floor(Math.random() * factions.length);
      faction = factions[randomFactionIndex];
    }  
  
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

   // Calculate experience for success and failure
   const successExp = xp;
   const failureExp = xp / 2;

  let output;
  if (randomCheckType === "Simple Skill Check") {
    output = (
      <div style={{fontFamily: 'Merriweather, serif', margin: '0 auto', width: '75%', textAlign: 'left'}}>
       Near {wildFeature.name} you meet {name}, {pronoun} is {tierTitle} {faction}. 
       <br /> Make a <strong>Simple Skill Check</strong> DC {dc} {randomSkill.skill} ({randomSkill.stat}). Success provides {randomGainResource.name} {gainResourceDescription}. 
       <br />On failure you suffer {randomLossResource.name} {lossResourceDescription}.
       <br/> Success grants each participant {successExp} experience points, failure gives {failureExp} experience points.
      </div>
    );
  } else if (randomCheckType === "Resource Swap") {
    output = (
      <div style={{fontFamily: 'Merriweather, serif', margin: '0 auto', width: '75%', textAlign: 'left'}}>
        Near {wildFeature.name} you meet {name}, {pronoun} is {tierTitle} {faction}. 
        <br /> You strike a  bargain for a <strong>Resource Swap</strong>, make a Skill check DC {dc - 3} {randomSkill.skill} ({randomSkill.stat}). 
        <br />Success provides {randomGainResource.name} {gainResourceDescription} and costs {randomLossResource.name} {lossResourceDescription}. On failure you suffer an additional {randomLossResource2.name} {lossResourceDescription2}.
        <br/>Success grants each participant {successExp} experience points, failure gives {failureExp} experience points.
      </div>
    );
  } else { // Skill Challenge
    output = (
      <div style={{fontFamily: 'Merriweather, serif', margin: '0 auto', width: '75%', textAlign: 'left'}}>
       Near {wildFeature.name} you meet {name}, {pronoun} is {tierTitle} {faction}. <br /> You face a <strong>Skill Challenge</strong> DC {dc - 3} {randomSkill.skill} ({randomSkill.stat}). <br /> As a group you must achieve twice the number of successes as participants, before you have failures equal to the number of participants. 
       <br />  Success provides {randomGainResource.name} {gainResourceDescription}. On failure you suffer {randomLossResource.name} {lossResourceDescription}.
       <br/>Success grants each participant {successExp} experience points, failure gives {failureExp} experience points.
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
  height: '60vh',
  backgroundImage: `url("https://i.imgur.com/GPvqUjn.jpg")`,
  backgroundPosition: 'top',
  backgroundSize: '50%',
  backgroundRepeat: 'no-repeat' }}>
    <h1>D&D Skill Events</h1>

    <form onSubmit={handleSubmit}style={{ fontFamily: 'Merriweather, serif', margin: '0 auto', width: '75%' }}>
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
