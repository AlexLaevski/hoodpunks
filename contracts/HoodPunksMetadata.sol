// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

library HoodPunksMetadata {
    using Strings for uint256;

    function tokenURI(
        uint256 tokenId,
        bytes32 sourceHash,
        string memory collectionExternalLink
    ) external pure returns (string memory) {
        string memory image = _buildImage(sourceHash);
        string memory sourceHashString = Strings.toHexString(uint256(sourceHash), 32);
        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name":"HOODPUNK #',
                    tokenId.toString(),
                    '","description":"A fully on-chain HOODPUNK born from a unique Robinhood Chain transaction hash. The source hash is immutable, the SVG is generated fully on-chain, and the metadata survives without IPFS or external render servers.","external_url":"',
                    collectionExternalLink,
                    '","image":"',
                    image,
                    '","background_color":"040506","attributes":[',
                    '{"trait_type":"Source Hash","value":"',
                    sourceHashString,
                    '"},',
                    '{"trait_type":"Archetype","value":"',
                    _archetypeName(sourceHash),
                    '"},',
                    '{"trait_type":"Hoodie","value":"',
                    _hoodieName(sourceHash),
                    '"},',
                    '{"trait_type":"Corruption","value":"',
                    _corruptionName(sourceHash),
                    '"},',
                    '{"trait_type":"Signal Pressure","value":"',
                    _signalPressureName(sourceHash),
                    '"},',
                    '{"trait_type":"Static Noise","value":"',
                    _staticNoiseName(sourceHash),
                    '"},',
                    '{"trait_type":"Prestige","value":"',
                    _prestigeName(sourceHash),
                    '"}',
                    "]}"
                )
            )
        );

        return string.concat("data:application/json;base64,", json);
    }

    function contractURI(
        string memory contractMetadataURI,
        string memory collectionExternalLink,
        string memory collectionImageURI,
        string memory collectionBannerURI,
        string memory royaltyBps,
        string memory royaltyRecipient
    ) external pure returns (string memory) {
        if (bytes(contractMetadataURI).length != 0) {
            return contractMetadataURI;
        }

        string memory image = bytes(collectionImageURI).length != 0
            ? collectionImageURI
            : _buildImage(bytes32(uint256(0x545850554e4b53)));
        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name":"HOODPUNKS","description":"HOODPUNKS are chain-born identities anchored by unique Robinhood Chain transaction hashes. Each token is fully on-chain, with SVG art and metadata generated directly from contract state.","image":"',
                    image,
                    '","banner_image":"',
                    collectionBannerURI,
                    '","external_link":"',
                    collectionExternalLink,
                    '","seller_fee_basis_points":"',
                    royaltyBps,
                    '","fee_recipient":"',
                    royaltyRecipient,
                    '"}'
                )
            )
        );

        return string.concat("data:application/json;base64,", json);
    }

    function _buildImage(bytes32 sourceHash) private pure returns (string memory) {
        string memory svg = _buildSvg(sourceHash);
        return string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(svg)));
    }

    function _buildSvg(bytes32 sourceHash) private pure returns (string memory) {
        string memory background = _backgroundColor(sourceHash);
        uint8 archetype = uint8(sourceHash[0]) % 9;
        string memory skin = _skinColor(sourceHash, archetype);
        string memory frame = _frameColor(sourceHash);
        string memory hair = _hairColor(sourceHash);
        string memory accent = _accentColor(sourceHash);
        string memory damage = _damageColor(sourceHash);
        uint8 corruption = uint8(sourceHash[1]) % 3;
        bool prestige = uint8(sourceHash[2]) > 210;

        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">',
            _rect(0, 0, 24, 24, background),
            _rect(2, 2, 20, 20, "#0d1514"),
            _baseFace(frame, skin),
            _hairLayer(archetype, hair, accent),
            _featureLayer(archetype, accent),
            _hoodieLayer(sourceHash),
            _corruptionLayer(corruption, damage),
            prestige ? _prestigeLayer() : "",
            "</svg>"
        );
    }

    function _baseFace(string memory frame, string memory skin) private pure returns (string memory) {
        return string.concat(
            _rect(6, 8, 1, 6, frame),
            _rect(7, 6, 1, 12, frame),
            _rect(8, 5, 1, 1, frame),
            _rect(9, 4, 1, 1, frame),
            _rect(10, 3, 6, 1, frame),
            _rect(16, 4, 1, 1, frame),
            _rect(17, 5, 1, 12, frame),
            _rect(16, 17, 1, 1, frame),
            _rect(15, 18, 1, 1, frame),
            _rect(14, 19, 1, 1, frame),
            _rect(10, 20, 4, 1, frame),
            _rect(10, 21, 1, 3, frame),
            _rect(13, 21, 1, 3, frame),
            _rect(8, 4, 8, 16, skin),
            _rect(7, 7, 1, 11, skin),
            _rect(16, 5, 1, 12, skin),
            _rect(15, 18, 1, 1, skin),
            _rect(14, 19, 1, 1, skin),
            _rect(11, 21, 2, 3, skin),
            _rect(9, 10, 1, 1, "#050608"),
            _rect(13, 10, 1, 1, "#050608"),
            _rect(12, 13, 1, 2, "#050608")
        );
    }

    function _hairLayer(uint8 archetype, string memory hair, string memory accent) private pure returns (string memory) {
        if (archetype == 0) {
            return string.concat(_rect(8, 3, 8, 1, hair), _rect(8, 4, 4, 2, hair));
        }
        if (archetype == 1) {
            return string.concat(_rect(10, 0, 2, 1, "#020202"), _rect(11, 1, 2, 1, "#020202"), _rect(12, 2, 1, 6, "#020202"), _rect(11, 1, 1, 6, accent));
        }
        if (archetype == 2) {
            return string.concat(_rect(6, 4, 10, 3, accent), _rect(5, 5, 2, 1, accent), _rect(11, 7, 2, 4, hair));
        }
        if (archetype == 3) {
            return string.concat(_rect(10, 0, 2, 1, "#020202"), _rect(11, 1, 2, 1, "#020202"), _rect(12, 2, 1, 6, "#020202"), _rect(11, 1, 1, 6, hair));
        }
        if (archetype == 4) {
            return string.concat(_rect(11, 2, 2, 1, "#020202"), _rect(12, 3, 1, 5, hair));
        }
        if (archetype == 5) {
            return string.concat(_rect(9, 3, 3, 1, "#020202"), _rect(10, 2, 3, 1, "#020202"), _rect(11, 2, 1, 5, hair), _rect(12, 2, 1, 5, "#020202"));
        }
        if (archetype == 7) {
            return string.concat(_rect(8, 3, 8, 1, "#050505"), _rect(8, 4, 4, 2, "#050505"));
        }
        if (archetype == 8) {
            return "";
        }
        return string.concat(_rect(6, 4, 9, 3, accent), _rect(5, 5, 2, 1, accent), _rect(7, 7, 2, 1, accent));
    }

    function _hoodieVariant(bytes32 sourceHash) private pure returns (uint8) {
        return uint8(sourceHash[10]) % 6;
    }

    function _hoodieName(bytes32 sourceHash) private pure returns (string memory) {
        uint8 variant = _hoodieVariant(sourceHash);
        if (variant == 0) return "Hoodie";
        if (variant == 1) return "Robinhood Hoodie";
        if (variant == 2) return "Shadow Hoodie";
        if (variant == 3) return "Royal Hoodie";
        if (variant == 4) return "Violet Hoodie";
        return "Ember Hoodie";
    }

    function _hoodieHoodColor(bytes32 sourceHash) private pure returns (string memory) {
        uint8 variant = _hoodieVariant(sourceHash);
        if (variant == 0) return "#648596";
        if (variant == 1) return "#00C805";
        if (variant == 2) return "#2b3137";
        if (variant == 3) return "#3460ff";
        if (variant == 4) return "#6b2d82";
        return "#a56e2a";
    }

    function _hoodieShadowColor(bytes32 sourceHash) private pure returns (string memory) {
        uint8 variant = _hoodieVariant(sourceHash);
        if (variant == 0) return "#555555";
        if (variant == 1) return "#00A004";
        if (variant == 2) return "#15181c";
        if (variant == 3) return "#2349d9";
        if (variant == 4) return "#3d1f4a";
        return "#4a3520";
    }

    function _hoodieLayer(bytes32 sourceHash) private pure returns (string memory) {
        return string.concat(
            _rect(10, 0, 4, 5, _hoodieShadowColor(sourceHash)),
            _rect(8, 2, 2, 3, _hoodieShadowColor(sourceHash)),
            _rect(14, 2, 3, 3, _hoodieShadowColor(sourceHash)),
            _rect(6, 3, 2, 4, _hoodieShadowColor(sourceHash)),
            _rect(17, 3, 1, 4, _hoodieShadowColor(sourceHash)),
            _rect(5, 4, 1, 4, _hoodieShadowColor(sourceHash)),
            _rect(18, 4, 1, 4, _hoodieShadowColor(sourceHash)),
            _rect(4, 5, 1, 6, _hoodieShadowColor(sourceHash)),
            _rect(19, 5, 2, 6, _hoodieShadowColor(sourceHash)),
            _rect(3, 9, 1, 4, _hoodieShadowColor(sourceHash)),
            _rect(21, 9, 1, 4, _hoodieShadowColor(sourceHash)),
            _rect(2, 13, 1, 6, _hoodieShadowColor(sourceHash)),
            _rect(22, 13, 1, 6, _hoodieShadowColor(sourceHash)),
            _rect(3, 19, 1, 3, _hoodieShadowColor(sourceHash)),
            _rect(21, 19, 1, 2, _hoodieShadowColor(sourceHash)),
            _rect(19, 21, 2, 1, _hoodieShadowColor(sourceHash)),
            _rect(4, 22, 1, 2, _hoodieShadowColor(sourceHash)),
            _rect(18, 22, 1, 1, _hoodieShadowColor(sourceHash)),
            _rect(14, 23, 4, 1, _hoodieShadowColor(sourceHash)),
            _rect(0, 0, 8, 2, _hoodieHoodColor(sourceHash)),
            _rect(17, 0, 7, 2, _hoodieHoodColor(sourceHash)),
            _rect(0, 2, 6, 1, _hoodieHoodColor(sourceHash)),
            _rect(18, 2, 6, 1, _hoodieHoodColor(sourceHash)),
            _rect(0, 3, 5, 1, _hoodieHoodColor(sourceHash)),
            _rect(19, 3, 5, 1, _hoodieHoodColor(sourceHash)),
            _rect(0, 4, 4, 1, _hoodieHoodColor(sourceHash)),
            _rect(21, 4, 3, 1, _hoodieHoodColor(sourceHash)),
            _rect(0, 5, 3, 4, _hoodieHoodColor(sourceHash)),
            _rect(22, 5, 2, 4, _hoodieHoodColor(sourceHash)),
            _rect(0, 9, 2, 4, _hoodieHoodColor(sourceHash)),
            _rect(23, 9, 1, 4, _hoodieHoodColor(sourceHash)),
            _rect(0, 19, 2, 5, _hoodieHoodColor(sourceHash)),
            _rect(23, 19, 1, 5, _hoodieHoodColor(sourceHash)),
            _rect(22, 21, 1, 3, _hoodieHoodColor(sourceHash)),
            _rect(2, 22, 1, 2, _hoodieHoodColor(sourceHash)),
            _rect(21, 22, 1, 2, _hoodieHoodColor(sourceHash)),
            _rect(19, 23, 2, 1, _hoodieHoodColor(sourceHash)),
            _rect(8, 0, 2, 2, "#000000"),
            _rect(14, 0, 3, 2, "#000000"),
            _rect(6, 2, 2, 1, "#000000"),
            _rect(17, 2, 1, 1, "#000000"),
            _rect(5, 3, 1, 1, "#000000"),
            _rect(18, 3, 1, 1, "#000000"),
            _rect(4, 4, 1, 1, "#000000"),
            _rect(19, 4, 2, 1, "#000000"),
            _rect(3, 5, 1, 4, "#000000"),
            _rect(8, 5, 9, 2, "#000000"),
            _rect(21, 5, 1, 4, "#000000"),
            _rect(6, 7, 2, 1, "#000000"),
            _rect(9, 7, 9, 1, "#000000"),
            _rect(5, 8, 1, 3, "#000000"),
            _rect(18, 8, 1, 14, "#000000"),
            _rect(2, 9, 1, 4, "#000000"),
            _rect(22, 9, 1, 4, "#000000"),
            _rect(4, 11, 1, 11, "#000000"),
            _rect(19, 11, 2, 10, "#000000"),
            _rect(0, 13, 2, 6, "#000000"),
            _rect(3, 13, 1, 6, "#000000"),
            _rect(5, 13, 1, 11, "#000000"),
            _rect(21, 13, 1, 6, "#000000"),
            _rect(23, 13, 1, 6, "#000000"),
            _rect(8, 18, 1, 3, "#000000"),
            _rect(10, 18, 7, 1, "#000000"),
            _rect(2, 19, 1, 3, "#000000"),
            _rect(22, 19, 1, 2, "#000000"),
            _rect(9, 21, 1, 1, "#000000"),
            _rect(17, 21, 1, 2, "#000000"),
            _rect(21, 21, 1, 1, "#000000"),
            _rect(3, 22, 1, 2, "#000000"),
            _rect(10, 22, 7, 1, "#000000"),
            _rect(19, 22, 2, 1, "#000000"),
            _rect(10, 23, 4, 1, "#000000"),
            _rect(18, 23, 1, 1, "#000000")
        );
    }

    function _featureLayer(uint8 archetype, string memory accent) private pure returns (string memory) {
        if (archetype == 2 || archetype == 6) {
            return string.concat(_rect(11, 9, 1, 3, accent), _rect(13, 16, 3, 1, "#8d1f1f"));
        }
        if (archetype == 3) {
            return string.concat(_rect(8, 12, 1, 1, "#f0c232"), _rect(15, 15, 4, 1, "#050505"), _rect(19, 15, 3, 1, "#dadada"), _rect(22, 15, 1, 1, "#ea5325"));
        }
        if (archetype == 4) {
            return string.concat(_rect(11, 10, 1, 1, "#587f43"), _rect(13, 16, 3, 1, "#8d1f1f"));
        }
        if (archetype == 5) {
            return _rect(12, 16, 3, 1, "#d10bd6");
        }
        if (archetype == 7) {
            return string.concat(_rect(11, 10, 1, 1, "#314126"), _rect(14, 10, 1, 1, "#314126"), _rect(13, 16, 3, 1, "#4d261f"));
        }
        if (archetype == 8) {
            return string.concat(_rect(11, 10, 1, 1, "#66ff7a"), _rect(14, 10, 1, 1, "#66ff7a"), _rect(13, 16, 3, 1, "#6f7177"));
        }
        return _rect(13, 16, 3, 1, "#871818");
    }

    function _corruptionLayer(uint8 corruption, string memory damage) private pure returns (string memory) {
        if (corruption == 0) {
            return string.concat(_rect(8, 18, 7, 1, "#66ff7a"), _rect(8, 5, 8, 1, "#66ff7a"));
        }
        if (corruption == 1) {
            return string.concat(_rect(3, 8, 18, 1, "#7ed8ff"), _rect(2, 14, 20, 1, "#7ed8ff"));
        }
        return string.concat(_rect(9, 8, 2, 1, damage), _rect(14, 9, 1, 2, damage), _rect(8, 18, 4, 1, damage));
    }

    function _prestigeLayer() private pure returns (string memory) {
        return string.concat(_rect(8, 3, 8, 1, "#e4b84b"), _rect(12, 1, 1, 2, "#f5da7a"));
    }

    function _archetypeName(bytes32 sourceHash) private pure returns (string memory) {
        uint8 archetype = uint8(sourceHash[0]) % 9;
        if (archetype == 0) return "OG Default";
        if (archetype == 1) return "Mohawk Ember";
        if (archetype == 2) return "Azure Femme";
        if (archetype == 3) return "Classic Cigarette";
        if (archetype == 4) return "Iron Crest";
        if (archetype == 5) return "Terminal Addict";
        if (archetype == 6) return "Hacker Glitch";
        if (archetype == 7) return "Zombie Rot";
        return "Hooded Wraith";
    }

    function _corruptionName(bytes32 sourceHash) private pure returns (string memory) {
        uint8 corruption = uint8(sourceHash[1]) % 3;
        if (corruption == 0) return "stable";
        if (corruption == 1) return "strained";
        return "corrupted";
    }

    function _signalPressureName(bytes32 sourceHash) private pure returns (string memory) {
        uint8 value = uint8(sourceHash[2]);
        if (value < 86) return "low";
        if (value < 172) return "medium";
        return "high";
    }

    function _staticNoiseName(bytes32 sourceHash) private pure returns (string memory) {
        uint8 value = uint8(sourceHash[3]);
        if (value < 86) return "quiet";
        if (value < 172) return "scanline";
        return "fractured";
    }

    function _prestigeName(bytes32 sourceHash) private pure returns (string memory) {
        return uint8(sourceHash[2]) > 210 ? "crowned" : "street";
    }

    function _backgroundColor(bytes32 sourceHash) private pure returns (string memory) {
        uint8 corruption = uint8(sourceHash[1]) % 3;
        if (corruption == 0) return "#06090a";
        if (corruption == 1) return "#071015";
        return "#090605";
    }

    function _skinColor(bytes32 sourceHash, uint8 archetype) private pure returns (string memory) {
        if (archetype == 7) return "#7fa65a";
        uint8 tone = uint8(sourceHash[4]) % 4;
        if (tone == 0) return "#b99667";
        if (tone == 1) return "#bb9870";
        if (tone == 2) return "#e1bb8e";
        return "#9d9d9d";
    }

    function _frameColor(bytes32 sourceHash) private pure returns (string memory) {
        return uint8(sourceHash[5]) % 2 == 0 ? "#1e2326" : "#232323";
    }

    function _hairColor(bytes32 sourceHash) private pure returns (string memory) {
        uint8 tone = uint8(sourceHash[6]) % 4;
        if (tone == 0) return "#020202";
        if (tone == 1) return "#a56e2a";
        if (tone == 2) return "#3460ff";
        return "#dfdfdf";
    }

    function _accentColor(bytes32 sourceHash) private pure returns (string memory) {
        uint8 tone = uint8(sourceHash[7]) % 4;
        if (tone == 0) return "#00C805";
        if (tone == 1) return "#2349d9";
        if (tone == 2) return "#d10bd6";
        return "#7ed8ff";
    }

    function _damageColor(bytes32 sourceHash) private pure returns (string memory) {
        return uint8(sourceHash[8]) % 2 == 0 ? "#f16f40" : "#ea5325";
    }

    function _rect(uint256 x, uint256 y, uint256 w, uint256 h, string memory fill) private pure returns (string memory) {
        return string.concat(
            '<rect x="',
            x.toString(),
            '" y="',
            y.toString(),
            '" width="',
            w.toString(),
            '" height="',
            h.toString(),
            '" fill="',
            fill,
            '"/>'
        );
    }
}
