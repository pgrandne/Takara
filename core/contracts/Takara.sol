// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC4626.sol";

/**
 * @title Takara
 * @author Perrin GRANDNE
 * @notice Contract for Takara Game
 * @custom:experimental This is an experimental contract.
 */

contract Takara is VRFConsumerBaseV2 {
    /*********************
     *** CHAINLINK VRF ***
     *********************/
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;
    uint256 public d20Value;

    /**
     * HARDCODED FOR GOERLI
     * COORDINATOR: 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D
     */

    struct player {
        bool ticket;
        uint256 lastDayPlayed;
    }

    address chainlinkAutomation;

    uint256 totalNbParticipants;
    uint256 public currentDayOfGame;
    uint256 totalAmount;
    uint256 private currentNbParticipants;
    uint256 currentDayPosition;
    uint256 ticketPrice;
    IERC20 daiToken;
    IERC4626 sdaiToken;

    mapping(uint256 => address[]) public dayLeaderboard;
    mapping(address => player) public playerStatus;

    constructor(
        // Chainlink VRF
        uint64 subscriptionId
    ) VRFConsumerBaseV2(0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D) {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D
        );
        s_subscriptionId = subscriptionId;

        chainlinkAutomation = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        currentDayOfGame = 1;
        totalNbParticipants = 5;
        currentNbParticipants = 0;
        daiToken = IERC20(0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844);
        sdaiToken = IERC4626(0xD8134205b0328F5676aaeFb3B2a0DC15f4029d8C);
        ticketPrice = 10 * 10 ** 18;
    }

    /*********************
     *** CHAINLINK VRF ***
     *********************/

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() external returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        d20Value = (_randomWords[0] % 100) + 1;

        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function validateYourDay() external {
        // require (playerStatus[msg.sender].qualified == true, "You are not qualified for this round!");
        require(
            playerStatus[msg.sender].lastDayPlayed != currentDayOfGame,
            "You already played"
        );
        playerStatus[msg.sender].lastDayPlayed = currentDayOfGame;
        dayLeaderboard[currentDayOfGame].push(msg.sender);
    }

    function closeTheDay() external returns (uint256) {
        require(chainlinkAutomation == msg.sender, "You are not the owner");

        if (dayLeaderboard[currentDayOfGame].length == currentNbParticipants) {
            dayLeaderboard[currentDayOfGame].pop();
        }
        currentNbParticipants = dayLeaderboard[currentDayOfGame].length;
        currentDayOfGame += 1;
        return currentDayOfGame;
    }

    function buyTicket() external {
        require(!playerStatus[msg.sender].ticket, "You already have a ticket!");
        require(
            daiToken.balanceOf(msg.sender) >= ticketPrice,
            "You don't have enough DAI"
        );
        require(
            daiToken.allowance(msg.sender, address(this)) >= ticketPrice,
            "Amount approved is too low!"
        );
        daiToken.transferFrom(msg.sender, address(this), ticketPrice);
        daiToken.approve(address(sdaiToken), ticketPrice);
        sdaiToken.deposit(ticketPrice, address(this));
        playerStatus[msg.sender].ticket = true;
        currentNbParticipants += 1;
    }

    function returnTicket() external {
        sdaiToken.withdraw(100, msg.sender, address(this));
    }

    function getNbParticipants() external view returns (uint256) {
        return currentNbParticipants;
    }

    function isPlayer(address _player) external view returns (bool) {
        return playerStatus[_player].ticket;
    }
}
