import RestartSpell from './Restart'

const SPELLS = {
    'restart': new RestartSpell(),
    // 'heal': new HealSpell(), ...
};

const Spellbook = {
    spells: SPELLS
}

export default Spellbook