// scripts/deploy.ts
import { ethers } from 'hardhat';

async function main() {
  const AssetToken = await ethers.getContractFactory('AssetToken');
  const assetToken = await AssetToken.deploy('AssetToken', 'ASTK');
  await assetToken.deployed();
  console.log('AssetToken deployed to:', assetToken.address);

  const AttestationContract = await ethers.getContractFactory('AttestationContract');
  const attestationContract = await AttestationContract.deploy();
  await attestationContract.deployed();
  console.log('AttestationContract deployed to:', attestationContract.address);

  const Marketplace = await ethers.getContractFactory('Marketplace');
  const usdcTokenAddress = '0xYourUSDCContractAddress'; // Replace with actual USDC address on Gnosis
  const marketplace = await Marketplace.deploy(assetToken.address, attestationContract.address, usdcTokenAddress);
  await marketplace.deployed();
  console.log('Marketplace deployed to:', marketplace.address);

  const RWAProcess = await ethers.getContractFactory('RWAProcess');
  const oracleAddress = '0xYourOracleAddress';
  const jobId = '0xYourJobId';
  const fee = ethers.utils.parseEther('0.1'); // Example fee
  const linkTokenAddress = '0xYourLinkTokenAddress';
  const rwaProcess = await RWAProcess.deploy(assetToken.address, marketplace.address, oracleAddress, jobId, fee, linkTokenAddress);
  await rwaProcess.deployed();
  console.log('RWAProcess deployed to:', rwaProcess.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
