pragma solidity >=0.4.21 <0.6.0;

import "node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Vault is Ownable {

    struct Wallet {
        string _alias;
        string mnemonic;
        string privateKey;
    }

    mapping(uint256 => mapping(address => Wallet)) private walletsByUserID;
    mapping(uint256 => address[]) private walletAddressesByUserID;

    function getWallet(
        uint256 UID,
        address _wallet
    )
    public
    view
    onlyOwner
    returns (
        string memory alias,
        string memory mnemonic,
        string memory privateKey
    ) {
        return (
            walletsByUserID[UID][_wallet]._alias,
            walletsByUserID[UID][_wallet].mnemonic,
            walletsByUserID[UID][_wallet].privateKey
        );
    }

    function storeWallet(
        uint256 UID,
        address _wallet,
        string memory _alias,
        string memory _mnemonic,
        string memory _privateKey
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
        uint256 UID
    )
    public
    view
    onlyOwner
    returns(address[] memory wallets) {
        return walletAddressesByUserID[UID];
    }
}
