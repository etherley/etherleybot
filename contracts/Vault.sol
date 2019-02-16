pragma solidity >=0.4.21 <0.6.0;

import "node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Vault is Ownable {

    struct Wallet {
        bytes32 _alias;
        bytes32 mnemonic;
        bytes32 privateKey;
    }

    mapping(bytes32 => mapping(address => Wallet)) private walletsByUserID;
    mapping(bytes32 => address[]) private walletAddressesByUserID;

    function getWallet(
        bytes32 UID, 
        address _wallet
    ) 
    public 
    view 
    onlyOwner 
    returns (
        bytes32 _alias,
        bytes32 _mnemonic,
        bytes32 _privateKey
    ) {
        return (
            walletsByUserID[UID][_wallet]._alias,
            walletsByUserID[UID][_wallet].mnemonic,
            walletsByUserID[UID][_wallet].privateKey
        );
    }

    function storeWallet(
        bytes32 UID, 
        address _wallet, 
        bytes32 _alias, 
        bytes32 _mnemonic,
        bytes32 _privateKey
    ) 
    public 
    onlyOwner 
    returns (bool) {
        walletsByUserID[UID][_wallet]._alias = _alias;
        walletsByUserID[UID][_wallet].mnemonic = _mnemonic;
        walletsByUserID[UID][_wallet].privateKey = _privateKey;
        return true;
    }

    function getWalletsByUserID(
        bytes32 UID
    ) 
    public 
    view 
    onlyOwner 
    returns(address[] memory wallets) {
        return walletAddressesByUserID[UID];
    }
}