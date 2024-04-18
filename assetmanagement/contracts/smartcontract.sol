// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Myasset {
    struct Asset{
        address owner;
        string title;
        string description;
        uint256 quantity;
        uint256 price;
        uint256 available;
        string image;
        address[] buyer;
        uint[] boughtunit;
    }
    mapping(uint => Asset ) public assets;
    uint256 public numberofassets =0;
    
    
    function createAsset(address _owner,string memory _title,string memory _description, uint256 _quantity,uint256 _price,string memory _image) public returns (uint256){
        Asset storage asset=assets[numberofassets];
        
        // require(asset.deadline < block.timestamp,"The deadline should be a date in the future");
        
        asset.owner=_owner;
        asset.title=_title;
        asset.description=_description;
        asset.quantity=_quantity;
        asset.price=_price;
        asset.available=_quantity;
        asset.image=_image;
           numberofassets++;
           return numberofassets-1;
    }

 
        
      

    function getAssetBuyer(uint256 _id) view public returns (address[] memory,uint256[] memory) {
        return (assets[_id].buyer, assets[_id].boughtunit);
    }

    function getAssets() public view returns (Asset[] memory){
        Asset[] memory allassets=new Asset[](numberofassets);
        for(uint i=0;i<numberofassets;i++){
            // allassets[i] =assets[i];
            Asset storage item = assets[i];
            allassets[i]=item;

        }
        return allassets;
    }
     
        struct Buy{
        address owner;
        string title;
        string description;
        uint256 quantity;
        uint256 priceperunit;
        uint256 buyquantityavailable;
        uint256 amountCollected;
        string image;
        
    }
    //  mapping(uint => asset ) public assets;
    mapping(address => Buy[] ) public buys;
    uint256 public numberofbuys =0;
    
    

    
    function getBuyer() view public returns (Buy[] memory) {
       address buers=msg.sender;
        return buys[buers];
    }
     

     function toBuyAsset(uint256 _id)public payable{
        

        Asset storage asset=assets[_id];
        uint256 buyquantity=msg.value;
        // require(asset.deadline < block.timestamp,"The deadline should be a date in the future");
        require(buyquantity > 0, "Invalid buy quantity");
        require(asset.available >= buyquantity, "Insufficient available units");
        uint256 amount=buyquantity*asset.price;
        asset.available=asset.available-buyquantity;
        asset.buyer.push(msg.sender);
        asset.boughtunit.push(buyquantity);

        (bool sent,)= payable(asset.owner).call{value:amount}("");
        if(sent)
      {  Buy memory buyer;
        buyer.owner=msg.sender;
        buyer.title=asset.title;
        buyer.description=asset.description;
        buyer.quantity=buyquantity;
        buyer.priceperunit=asset.price;
        buyer.buyquantityavailable=buyquantity;
        buyer.image=asset.image;
        buys[msg.sender].push(buyer);
        }

    }



    
}
