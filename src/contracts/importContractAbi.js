import { readFileSync } from 'fs';
export default function(smartContractName) {
    const contract = JSON.parse(readFileSync(`./build/contracts/${smartContractName}.json`, 'utf8'));
    console.log(contract.abi)
    return JSON.stringify(contract.abi);
}