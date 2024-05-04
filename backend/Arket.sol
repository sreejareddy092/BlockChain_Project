// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Arket {
    struct Item {
        string name;
        string desc;
        uint256 price;
        address seller;
        address buyer;
    }

    Item[] public items;

    constructor() {}

    function list_item(string memory name, string memory desc, uint256 price) external  {
        require(address(0) != msg.sender, "Are you really the address(0)?");

        items.push(Item({
            name: name,
            desc: desc,
            price: price,
            seller: msg.sender,
            buyer: address(0)
        }));
    }

    function get_item_count() view external returns(uint256) {
        return items.length;
    }

    function get_item(uint256 idx) view external returns(Item memory) {
        require(idx < items.length, "Illegal transaction index");
        return items[idx];
    }

    function buy(uint256 idx) external payable {
        require(idx < items.length, "Illegal transaction index");
        require(address(0) != msg.sender, "Are you really the address(0)?");

        Item storage item = items[idx];

        require(address(0) == item.buyer, "Item already purchased");
        require(msg.value >= item.price, "You can't buy for lesser price than listed Radhika!");

        item.buyer = msg.sender;

        payable(item.seller).transfer(item.price);
    }
}
