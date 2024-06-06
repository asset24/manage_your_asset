// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyAsset {
    struct Asset {
        address owner;
        string title;
        string description;
        uint256 quantity;
        uint256 price;
        uint256 available;
        string image;
        address[] buyers;
        uint256[] boughtUnits;
        address[] sellers;
        uint256[] sellPrices;
        uint256[] sellQuantities;
    }

    struct Buy {
        address owner;
        string title;
        string description;
        uint256 quantity;
        uint256 pricePerUnit;
        uint256 buyQuantityAvailable;
        uint256 amountCollected;
        string image;
    }

    struct Profile {
        string name;
        string image;
    }

    mapping(uint256 => Asset) public assets;
    mapping(address => Buy[]) public purchases;
    mapping(address => Profile) public profiles;

    uint256 public assetCount = 0;

    function createAsset(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _quantity,
        uint256 _price,
        string memory _image
    ) public returns (uint256) {
        Asset storage newAsset = assets[assetCount];
        newAsset.owner = _owner;
        newAsset.title = _title;
        newAsset.description = _description;
        newAsset.quantity = _quantity;
        newAsset.price = _price;
        newAsset.available = _quantity;
        newAsset.image = _image;

        assetCount++;
        return assetCount - 1;
    }

    function getAssetBuyers(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        Asset storage asset = assets[_id];
        return (asset.buyers, asset.boughtUnits);
    }

    function getAssets() public view returns (Asset[] memory) {
        Asset[] memory allAssets = new Asset[](assetCount);
        for (uint256 i = 0; i < assetCount; i++) {
            allAssets[i] = assets[i];
        }
        return allAssets;
    }

    function getPurchases() public view returns (Buy[] memory) {
        return purchases[msg.sender];
    }

    function buyAsset(uint256 _id, uint256 _quantity) public payable {
        Asset storage asset = assets[_id];
        uint256 totalCost = _quantity * asset.price;

        require(msg.value >= totalCost, "Insufficient payment");
        require(asset.available >= _quantity, "Insufficient available units");

        asset.available -= _quantity;
        asset.buyers.push(msg.sender);
        asset.boughtUnits.push(_quantity);

        (bool sent,)= payable(asset.owner).call{value:totalCost}("");
        if(sent){
            Buy memory newPurchase;
            newPurchase.owner = msg.sender;
            newPurchase.title = asset.title;
            newPurchase.description = asset.description;
            newPurchase.quantity = _quantity;
            newPurchase.pricePerUnit = asset.price;
            newPurchase.buyQuantityAvailable = _quantity;
            newPurchase.amountCollected = totalCost;
            newPurchase.image = asset.image;
            purchases[msg.sender].push(newPurchase);
        }
    }

    function sellAsset(uint256 _purchaseId, uint256 _quantity, uint256 _price) public returns (uint256){
        require(_quantity > 0, "Quantity must be greater than zero");

        // Ensure the seller has enough purchased quantity to sell
        Buy[] storage userPurchases = purchases[msg.sender];
        uint256 totalOwned = userPurchases[_purchaseId].buyQuantityAvailable;
        require(totalOwned >= _quantity, "Insufficient quantity to sell");

        // Create a sale record in the asset
        Asset storage asset = assets[ assetCount];
        asset.owner=msg.sender;
        asset.title=userPurchases[_purchaseId].title;
        asset.description=userPurchases[_purchaseId].description;
        asset.quantity=_quantity;
        asset.price = _price;
        asset.available = _quantity;
        asset.image = userPurchases[_purchaseId].image;
        userPurchases[_purchaseId].buyQuantityAvailable-=_quantity;

        assetCount++;
        return assetCount-1;
    }

    function setUserProfile(string memory _name, string memory _image) public {
        profiles[msg.sender] = Profile(_name, _image);
    }

    function getUserProfile(address _user) public view returns (string memory, string memory) {
        Profile storage profile = profiles[_user];
        return (profile.name, profile.image);
    }
}