import React, { useState, useMemo, useEffect } from 'react';
import './App.css';

// JSON data (replace with correct paths)
import skills from './data/skills.json';
import resources from './data/resources.json';
import wildFeatures from './data/wildFeatures.json';
import alignmentsJSON from './data/alignments.json';
import planesJSON from './data/planes.json';
import speciesJSON from './data/species.json';
import traitsJSON from './data/traits.json';
import classesJSON from './data/classes.json';
import tarotJSON from './data/tarot.json';

import generateName from './assets/barbarianNames.js';

function App() {
  /******************************************************
   * State for the "Skill Events"
   ******************************************************/
  const [level, setLevel] = useState(1);
  const [output, setOutput] = useState("");
  const [terrain, setTerrain] = useState('arctic');
  const [factions, setFactions] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState('');
  const [terrains] = useState(['arctic', 'desert']);

  // Barbarian name snippet
  const isMale = Math.random() < 0.55;
  const gender = isMale ? 'male' : 'female';
  const pronoun = isMale ? 'he' : 'she';
  const name = generateName(gender);

  /******************************************************
   * "Skill Events" Data and Logic
   ******************************************************/
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
    { levelRange: [1, 4],  dc: 14, tier: 1, xp: 25,   title: "the least of" },
    { levelRange: [5, 8],  dc: 16, tier: 2, xp: 250,  title: "a worthy of the" },
    { levelRange: [9, 12], dc: 18, tier: 3, xp: 550,  title: " a leader among the" },
    { levelRange: [13,16], dc: 20, tier: 4, xp: 1100, title: " a paragon of the" },
    { levelRange: [17,20], dc: 21, tier: 5, xp: 2000, title: "the most epic of the" },
  ];

  const randomWildFeatureIndex = Math.floor(Math.random() * wildFeatures.wildFeature.length);
  const wildFeature = wildFeatures.wildFeature[randomWildFeatureIndex];

  // Factions by terrain
  const factionsByTerrain = useMemo(() => ({
    arctic: [
      "Suloise", "Northern Barbarians", "Wildthings", "Magma Dwellers",
      "Pale Wyrms", "Goblinkin", "Frostmourne", "Feyfrost", "Hodir Ordning"
    ],
    desert: [
      "Baklunish", "Rary-Bright Empire", "Old Sulm", "Tribal",
      "Azak-Zil Demihumans", "Elemental Fire", "Desert Fauna"
    ],
  }), []);

  // Update factions on terrain change
  useEffect(() => {
    if (terrain && factionsByTerrain[terrain]) {
      setFactions(factionsByTerrain[terrain]);
      setSelectedFaction('');
    }
  }, [terrain, factionsByTerrain]);

  /******************************************************
   * Generate Event
   ******************************************************/
  const handleSubmitEventForm = (event) => {
    event.preventDefault();

    // Random variation to the chosen level: -4..+4
    let variedLevel = parseInt(level, 10) + Math.floor(Math.random() * 9) - 4;
    if (variedLevel < 1) variedLevel = 1;
    if (variedLevel > 20) variedLevel = 20;

    // Find the tier
    const currentTier = tiers.find(
      (t) => variedLevel >= t.levelRange[0] && variedLevel <= t.levelRange[1]
    );
    const { dc, xp, title: tierTitle } = currentTier;

    // 20% chance to pick a random faction instead of user selection
    let faction = selectedFaction;
    if (Math.random() < 0.2 && factions.length > 0) {
      faction = factions[Math.floor(Math.random() * factions.length)];
    }

    function generateEvent() {
      const randomStat = weightedStatList[Math.floor(Math.random() * weightedStatList.length)];
      const statSkills = skillsByStat[randomStat];
      const randomSkill = statSkills[Math.floor(Math.random() * statSkills.length)];

      const checkTypes = ["Simple Skill Check", "Resource Swap", "Skill Challenge"];
      const randomCheckType = checkTypes[Math.floor(Math.random() * checkTypes.length)];

      const randomGainResource = resources.gain[Math.floor(Math.random() * resources.gain.length)];
      const randomLossResource = resources.loss[Math.floor(Math.random() * resources.loss.length)];
      const randomLossResource2 = resources.loss[Math.floor(Math.random() * resources.loss.length)];

      // Possibly show tier-based resource amounts
      const gainResourceDescription = randomGainResource.tiers
        ? `${randomGainResource.description} (${randomGainResource.tiers.find(t => t.tier === currentTier.tier).value})`
        : randomGainResource.description;

      const lossResourceDescription = randomLossResource.tiers
        ? `${randomLossResource.description} (${randomLossResource.tiers.find(t => t.tier === currentTier.tier).value})`
        : randomLossResource.description;

      const lossResourceDescription2 = randomLossResource2.tiers
        ? randomLossResource2.tiers.find(t => t.tier === currentTier.tier).value
        : randomLossResource2.description;

      const successExp = xp;
      const failureExp = xp / 2;

      let eventOutput;
      if (randomCheckType === "Simple Skill Check") {
        eventOutput = (
          <div className="event-text">
            Near <strong>{wildFeature.name}</strong> you meet <strong>{name}</strong>, {pronoun} is {tierTitle} {faction}.<br/>
            Make a <strong>Simple Skill Check</strong> DC {dc} {randomSkill.skill} ({randomSkill.stat}). 
            Success provides <strong>{randomGainResource.name}</strong> {gainResourceDescription}.<br/>
            On failure you suffer <strong>{randomLossResource.name}</strong> {lossResourceDescription}.<br/>
            Success grants each participant <strong>{successExp} XP</strong>, 
            failure grants <strong>{failureExp} XP</strong>.
          </div>
        );
      } else if (randomCheckType === "Resource Swap") {
        eventOutput = (
          <div className="event-text">
            Near <strong>{wildFeature.name}</strong> you meet <strong>{name}</strong>, {pronoun} is {tierTitle} {faction}.<br/>
            You strike a bargain for a <strong>Resource Swap</strong>, 
            make a Skill check DC {dc - 3} {randomSkill.skill} ({randomSkill.stat}).<br/>
            Success provides <strong>{randomGainResource.name}</strong> {gainResourceDescription} and costs
            <strong> {randomLossResource.name}</strong> {lossResourceDescription}.<br/>
            On failure you suffer an additional <strong>{randomLossResource2.name}</strong> {lossResourceDescription2}.<br/>
            Success grants each participant <strong>{successExp} XP</strong>, 
            failure grants <strong>{failureExp} XP</strong>.
          </div>
        );
      } else {
        // Skill Challenge
        eventOutput = (
          <div className="event-text">
            Near <strong>{wildFeature.name}</strong> you meet <strong>{name}</strong>, {pronoun} is {tierTitle} {faction}.<br/>
            You face a <strong>Skill Challenge</strong> DC {dc - 3} {randomSkill.skill} ({randomSkill.stat}).<br/>
            As a group you must achieve twice the number of successes as participants, 
            before you have failures equal to the number of participants.<br/>
            Success provides <strong>{randomGainResource.name}</strong> {gainResourceDescription}. 
            On failure you suffer <strong>{randomLossResource.name}</strong> {lossResourceDescription}.<br/>
            Success grants each participant <strong>{successExp} XP</strong>, 
            failure grants <strong>{failureExp} XP</strong>.
          </div>
        );
      }

      setOutput(eventOutput);
    }

    generateEvent();
  };

  /******************************************************
   * NPC Generation Logic
   ******************************************************/
  const [npcOutput, setNpcOutput] = useState('');
  const [npcType, setNpcType] = useState("bastionLeaders");

  // Generate NPC
  const handleGenerateNpc = () => {
    const { alignmentDisplay, alignmentFlavor, plane } = generateAlignment(npcType);
    const chosenTraits  = pickThreeTraits(alignmentFlavor);
    const chosenClass   = pickClass();
    const chosenSpecies = pickSpecies();
    const chosenTarot   = randomFromArray(tarotJSON);

    const result = {
      npcType,
      alignment: alignmentDisplay,
      plane,
      traits: chosenTraits,
      class: chosenClass,
      species: chosenSpecies,
      tarot: chosenTarot
    };

    setNpcOutput(JSON.stringify(result, null, 2));
  };

  /******************************************************
   * NPC Helper Functions
   ******************************************************/
  function generateAlignment(npcType) {
    let alignmentDisplay, alignmentFlavor, plane;
    const scenarioRoll = Math.random();

    if (scenarioRoll < 0.5 && alignmentsJSON[npcType]) {
      // scenario-based
      const scenarioData = alignmentsJSON[npcType];
      alignmentDisplay = pickScenarioAlignment(scenarioData);
      alignmentFlavor = deriveFlavor(alignmentDisplay);
      plane = "Scenario-based (no specific plane)";
    } else {
      // random plane
      const planeChoice = randomFromArray(planesJSON);
      plane = planeChoice.plane;
      alignmentDisplay = randomFromArray(planeChoice.alignment);
      alignmentFlavor = deriveFlavor(alignmentDisplay);
    }
    return { alignmentDisplay, alignmentFlavor, plane };
  }

  function pickScenarioAlignment(scenarioData) {
    const ethicRoll = Math.random() * 100;
    let ethic = 'Neutral';
    if (ethicRoll < scenarioData.good) ethic = 'Good';
    else if (ethicRoll < scenarioData.good + scenarioData.neutral) ethic = 'Neutral';
    else ethic = 'Evil';

    const moralRoll = Math.random() * 100;
    let moral = 'Neutral';
    if (moralRoll < scenarioData.lawful) moral = 'Lawful';
    else if (moralRoll < scenarioData.lawful + scenarioData.neutralEthic) moral = 'Neutral';
    else moral = 'Chaotic';

    // True Neutral
    if (moral === 'Neutral' && ethic === 'Neutral') {
      return 'True Neutral';
    }
    return `${moral} ${ethic}`;
  }

  function deriveFlavor(fullString) {
    const lc = fullString.toLowerCase();
    if (lc.includes("evil")) return "evil";
    if (lc.includes("good")) return "good";
    return "neutral";
  }

  function pickThreeTraits(flavor) {
    if (!Array.isArray(traitsJSON)) return [];

    let numVirtues = 0, numVices = 0, numRandom = 0;

    if (flavor === "good") {
      numVirtues = 2;
      numVices = 1;
    } else if (flavor === "evil") {
      numVirtues = 1;
      numVices = 2;
    } else {
      // neutral
      numVirtues = 1;
      numVices = 1;
      numRandom = 1;
    }

    const pool = [...traitsJSON];
    shuffleArray(pool);

    const chosenPairs = pool.slice(0, 3);
    const finalTraits = [];

    for (let i = 0; i < chosenPairs.length; i++) {
      const pairStr = chosenPairs[i];
      const [virtueSide, viceSide] = pairStr.split("/").map(s => s.trim());
      const pairsRemaining = chosenPairs.length - i;

      // Force correct number of virtues/vices
      if (numVirtues === pairsRemaining) {
        finalTraits.push(virtueSide);
        numVirtues--;
        continue;
      }
      if (numVices === pairsRemaining) {
        finalTraits.push(viceSide);
        numVices--;
        continue;
      }
      if (numRandom > 0) {
        if (Math.random() < 0.5) {
          finalTraits.push(Math.random() < 0.5 ? virtueSide : viceSide);
          numRandom--;
          continue;
        }
      }
      if (numVirtues > 0) {
        finalTraits.push(virtueSide);
        numVirtues--;
        continue;
      }
      if (numVices > 0) {
        finalTraits.push(viceSide);
        numVices--;
        continue;
      }
      // fallback
      finalTraits.push(virtueSide);
    }

    return finalTraits;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function pickClass() {
    const roll = Math.random() * 100;
    if (roll < 30) {
      return randomFromArray(classesJSON.combat);
    } else if (roll < 60) {
      return randomFromArray(classesJSON.stealth);
    } else if (roll < 90) {
      return randomFromArray(classesJSON.knowledge);
    } else {
      // sub-roll for the type of spellcaster
      const subRoll = Math.random() * 100;
      if (subRoll < 30) {
        return randomFromArray(classesJSON.spellcasting.int);
      } else if (subRoll < 60) {
        return randomFromArray(classesJSON.spellcasting.wis);
      } else if (subRoll < 90) {
        return randomFromArray(classesJSON.spellcasting.cha);
      } else {
        return randomFromArray(classesJSON.spellcasting.multi);
      }
    }
  }

  function pickSpecies() {
    let roll = Math.random() * 100;
    let cumulative = 0;

    cumulative += speciesJSON.human;
    if (roll < cumulative) return "Human";

    cumulative += speciesJSON.dwarf;
    if (roll < cumulative) return "Dwarf";

    cumulative += speciesJSON.orc;
    if (roll < cumulative) return "Orc";

    cumulative += speciesJSON.halfling;
    if (roll < cumulative) return "Halfling";

    cumulative += speciesJSON.phbSpellcastersPercent;
    if (roll < cumulative) {
      return randomFromArray(speciesJSON.phbSpellcasters);
    }
    return randomFromArray(speciesJSON.weirdShapechanged);
  }

  function randomFromArray(arr) {
    if (!arr || arr.length === 0) return null;
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }

  /******************************************************
   * Render
   ******************************************************/
  return (
    <div className="main-container">
      <header className="header">
        <h1 className="title">D&D Skill Events</h1>
      </header>

      <section className="content-section">
        {/* SKILL EVENT FORM */}
        <fieldset className="event-form">
          <legend>Generate a Skill Event</legend>
          <form onSubmit={handleSubmitEventForm} className="form-grid">
            <div className="form-group">
              <label htmlFor="levelInput">Level:</label>
              <input
                id="levelInput"
                type="number"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                min="1"
                max="20"
                placeholder="Character level 1-20"
              />
            </div>

            <div className="form-group">
              <label htmlFor="terrainSelect">Terrain:</label>
              <select
                id="terrainSelect"
                value={terrain}
                onChange={(e) => setTerrain(e.target.value)}
              >
                <option value="">Select terrain</option>
                {terrains.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="factionSelect">Faction:</label>
              <select
                id="factionSelect"
                value={selectedFaction}
                onChange={(e) => setSelectedFaction(e.target.value)}
              >
                <option value="">Select faction</option>
                {factions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-generate">Generate Event</button>
          </form>
        </fieldset>

        {/* Display the generated Event */}
        {output && (
          <article className="result-card">
            {output}
          </article>
        )}
      </section>

      <section className="content-section">
        {/* NPC GENERATION FORM */}
        <fieldset className="npc-form">
          <legend>D&D NPC Generator</legend>
          <div className="npc-radios">
            <p>Select an NPC type:</p>
            <label>
              <input
                type="radio"
                name="npcType"
                value="bastionLeaders"
                checked={npcType === "bastionLeaders"}
                onChange={(e) => setNpcType(e.target.value)}
              />
              Settlement Leader / Friendly
            </label>
            <label>
              <input
                type="radio"
                name="npcType"
                value="questGiversFriendly"
                checked={npcType === "questGiversFriendly"}
                onChange={(e) => setNpcType(e.target.value)}
              />
              Quest Giver / Neutral
            </label>
            <label>
              <input
                type="radio"
                name="npcType"
                value="enemiesEncounters"
                checked={npcType === "enemiesEncounters"}
                onChange={(e) => setNpcType(e.target.value)}
              />
              Enemy / Encounter
            </label>
          </div>

          {/* Separate button (in the same or separate <form>) */}
          <button type="button" onClick={handleGenerateNpc} className="btn-generate">
            Generate NPC
          </button>
        </fieldset>

        {/* Display the generated NPC */}
        {npcOutput && (
          <article className="result-card">
            <pre>{npcOutput}</pre>
          </article>
        )}
      </section>
    </div>
  );
}

export default App;
