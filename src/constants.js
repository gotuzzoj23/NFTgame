const CONTRACT_ADDRESS = '0xBD61D478c349d77401681f1B7E171c28b846dFD9';
//local - 0x5FbDB2315678afecb367f032d93F642f64180aa3

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
    };
};

export { CONTRACT_ADDRESS, transformCharacterData };