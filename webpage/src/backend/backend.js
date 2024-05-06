import Web3 from 'web3';

const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idx",
				"type": "uint256"
			}
		],
		"name": "buy",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idx",
				"type": "uint256"
			}
		],
		"name": "get_item",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "desc",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "buyer",
						"type": "address"
					}
				],
				"internalType": "struct Arket.Item",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "get_item_count",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "items",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "desc",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "desc",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "list_item",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const contractAddress = "0xb931e1e67f16438d8e7ea8082db6b23d5de309a2";

export async function ConnectToMetaMask() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    let web3 = new Web3(window.ethereum);
		let accounts = await web3.eth.getAccounts();
    let contract = new web3.eth.Contract(contractABI, contractAddress);
    let userAccount = accounts[0];

    return [ contract, userAccount ];
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    alert('Cannot find MetaMask.');
    return [ undefined, undefined ];
  }
}

export async function GetCount(contract) {
	return await contract.methods.get_item_count().call();
}

export async function GetItem(contract, idx) {
	return await contract.methods.get_item(idx).call();
}

export async function ListItem(contract, userAccount, name, desc, price) {
	return await contract.methods.list_item(name, desc, price).send({ from: userAccount });
}

export async function BuyItem(contract, userAccount, idx, payingPrice) {
	return await contract.methods.buy(idx).send({ from: userAccount, value: payingPrice });
}
