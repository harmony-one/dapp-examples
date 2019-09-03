const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
    "expand essence language blind cash rose arctic power glass saddle cloud anxiety",
    "https://rinkeby.infura.io/QL9O9LNMipJsXdIDUBEd"
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(
        JSON.parse(compiledFactory.interface)
    )
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: "1000000", from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
};
deploy();

// minhs-mbp:ethereum minhdoan$ node deploy.js
// Attempting to deploy from account 0xEef3F0b6105BB40DE2070672d8c1658796327EaC
// Contract deployed to 0xf145135b42b7EB56A41f31949840fB42a4e149E5