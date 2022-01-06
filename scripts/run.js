const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ["Kelly", "Mick", "TheOne", "Rob"],       // Names
    ["https://i.imgur.com/0sf5l9o.png", // Images
    "https://i.imgur.com/CAYQ12r.png", 
    "https://i.imgur.com/ivTFVPG.png",
    "https://i.imgur.com/kO2CaAd.png"],
    [100, 200, 500, 400],                    // HP values
    [100, 50, 400, 111],                       // Attack damage values
    "Laird", // Boss name
    "https://i.imgur.com/bLfQsCI.png", // Boss image
    10000, // Boss hp
    50 // Boss attack damage
  );

  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);


  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await gameContract.mintCharacterNFT(3);
  await txn.wait();

  // Get the value of the NFT's URI.
  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI:", returnedTokenUri);

  txn = await gameContract.attackBoss();
  await txn.wait();

};
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();
  