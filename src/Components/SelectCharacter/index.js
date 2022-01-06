import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from "../../artifacts/contracts/MyEpicGame.sol/MyEpicGame.json";
import './SelectCharacter.css';
import LoadingIndicator from './../LoadingIndicator';

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT, setMintingCharacter, mintingCharacter }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    useEffect(() => {
        const { ethereum } = window;
      
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const gameContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            myEpicGame.abi,
            signer
          );
      
          /*
           * This is the big difference. Set our gameContract in state.
           */
          setGameContract(gameContract);
        } else {
          console.log('Ethereum object not found');
        }
    }, []);

    // Actions
    const mintCharacterNFTAction = (characterId) => async () => {
        try {
        if (gameContract) {
          setMintingCharacter(true);
          console.log('Minting character in progress...');
          const mintTxn = await gameContract.mintCharacterNFT(characterId);
          await mintTxn.wait();
          console.log('mintTxn:', mintTxn);
          setMintingCharacter(false);
        }
        } catch (error) {
        console.warn('MintCharacterAction Error:', error);
        setMintingCharacter(false);
        }
    };

    useEffect(() => {
        const getCharacters = async () => {
          try {
            console.log('Getting contract characters to mint');
      
            /*
             * Call contract to get all mint-able characters
             */
            const charactersTxn = await gameContract.getAllDefaultCharacters();
            console.log('charactersTxn:', charactersTxn);
      
            /*
             * Go through all of our characters and transform the data
             */
            const characters = charactersTxn.map((characterData) =>
              transformCharacterData(characterData)
            );
      
            /*
             * Set all mint-able characters in state
             */
            setCharacters(characters);
          } catch (error) {
            console.error('Something went wrong fetching characters:', error);
          }
        };

        /*
        * Add a callback method that will fire when this event is received
        */
        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
            `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );

            /*
            * Once our character NFT is minted we can fetch the metadata from our contract
            * and set it in state to move onto the Arena
            */
            if (gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log('CharacterNFT: ', characterNFT);
                setCharacterNFT(transformCharacterData(characterNFT));
                alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
            }
        };

        if (gameContract) {
            getCharacters();
        
            /*
             * Setup NFT Minted Listener
             */
            gameContract.on('CharacterNFTMinted', onCharacterMint);
          }
        
          return () => {
            /*
             * When your component unmounts, let's make sure to clean up this listener
             */
            if (gameContract) {
              gameContract.off('CharacterNFTMinted', onCharacterMint);
            }
          };
        }, [gameContract]);

    const renderCharacters = () =>
        characters.map((character, index) => (
        <div className="character-item" key={character.name}>
            <div className="name-container">
                <p>{character.name}</p>
            </div>
        <img src={character.imageURI} alt={character.name} />
        <button
            type="button"
            className="character-mint-button"
            onClick={mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
        </div>
    ));

    return (
        <div className="select-character-container">
          <h2>Mint Your Surfer. Choose wisely.</h2>
          {characters.length > 0 && (
          <div className="character-grid">{renderCharacters()}</div>
          )}
          {/* Only show our loading state if mintingCharacter is true */}
          {mintingCharacter && (
            <div className="loading">
              <div className="indicator">
                <LoadingIndicator />
                <p>Minting In Progress...</p>
              </div>
                <img
                src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
                alt="Minting loading indicator"
                />
            </div>
          )}
        </div>
    );
};

export default SelectCharacter;