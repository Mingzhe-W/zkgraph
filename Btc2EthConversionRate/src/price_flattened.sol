// SPDX-License-Identifier: GPL-3.0
// File: @chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol


pragma solidity ^0.8.0;

interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(
    uint80 _roundId
  ) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

  function latestRoundData()
    external
    view
    returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

// File: contracts/price.sol


pragma solidity ^0.8.0;


contract Price {
    AggregatorV3Interface public ethPriceFeed ;
    AggregatorV3Interface public btcPriceFeed ;

    constructor(
    ) {
        ethPriceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        btcPriceFeed = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43);
        // address i got on chainlin's website, just for demo purpose 
        //-feeds/price-feeds/addresses/?network=ethereum&page=1
    }


    event Pricelist(int ethPrice, int btcPrice);

    function emitEvent() public {
        (, int btcPrice, , ,) = btcPriceFeed.latestRoundData();
        (, int ethPrice, , ,) = ethPriceFeed.latestRoundData();

        emit Pricelist(ethPrice, btcPrice);
    }
}
