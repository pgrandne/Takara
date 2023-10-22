// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

/**
 * @title Takara
 * @dev Store & retrieve value in a variable
 */
contract Takara {
    struct player {
        bool qualified;
        uint256 lastDayPlayed;
    }

    address chainlinkAutomation;

    uint256 totalNbParticipants;
    uint256 public currentDayOfGame;
    uint256 totalAmount;
    uint256 public currentNbParticipants;
    uint256 currentDayPosition;

    mapping(uint256 => address[]) public dayLeaderboard;
    mapping(address => player) public playerStatus;

    constructor() {
        chainlinkAutomation = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        currentDayOfGame = 1;
        totalNbParticipants = 5;
        currentNbParticipants = 5;

        //    DAI : 0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844
        //    sDAI : 0xD8134205b0328F5676aaeFb3B2a0DC15f4029d8C
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
}

// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract VRFv2Consumer is VRFConsumerBaseV2 {
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
    constructor(
        uint64 subscriptionId
    ) VRFConsumerBaseV2(0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D) {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D
        );
        s_subscriptionId = subscriptionId;
    }

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
}
