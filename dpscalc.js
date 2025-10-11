const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const { getPriority } = require('os');
const {characterEmoji, matriceEmoji, skillEmoji} = require('./storage');
const stringSimilarity = require('string-similarity');
const Fuse = require('fuse.js');

// Step 1: Read the JSON Data
const jsonCharacterFilePath = 'data/raw/characters.json';
const jsonMatriceFilePath = 'data/raw/matrices.json';
const jsonTraitFilePath = 'data/raw/traits.json';
const jsonSkillFilePath = 'data/raw/fiona.json';

// Read the JSON file synchronously (you can use asynchronous methods as well)
const characterData = fs.readFileSync(jsonCharacterFilePath, 'utf-8');
const matriceData = fs.readFileSync(jsonMatriceFilePath, 'utf-8');
const traitData = fs.readFileSync(jsonTraitFilePath, 'utf-8');
const skillsData = fs.readFileSync(jsonSkillFilePath, 'utf-8');

// Step 2: Parse the JSON Data
const parsedCharacterData = JSON.parse(characterData);
const parsedMatriceData = JSON.parse(matriceData);
const parsedTraitData = JSON.parse(traitData);
const parsedSkillsData = JSON.parse(skillsData);

// Step 3: Data Storage
const characterSelections = {
    "shiro": parsedCharacterData.characters["Shiro"],
    "shiro1": parsedCharacterData.characters["Shiro ☆1"],
    "shiro3": parsedCharacterData.characters["Shiro ☆3"],
    "shiro6": parsedCharacterData.characters["Shiro ☆6"],

    "samir": parsedCharacterData.characters["Samir"],
    "samir1": parsedCharacterData.characters["Samir ☆1"],
    "samir3": parsedCharacterData.characters["Samir ☆3"],
    "samir5": parsedCharacterData.characters["Samir ☆5"],
    "samir6": parsedCharacterData.characters["Samir ☆6"],

    "zero": parsedCharacterData.characters["Zero"],
    "zero3": parsedCharacterData.characters["Zero ☆3"],

    "king": parsedCharacterData.characters["King"],
    "king1": parsedCharacterData.characters["King ☆1"],
    "king3_1enemy": parsedCharacterData.characters["King ☆3, 1 enemy"],
    "king3_3enemies": parsedCharacterData.characters["King ☆3, 3 enemies"],

    "meryl": parsedCharacterData.characters["Meryl"],
    "meryl5": parsedCharacterData.characters["Meryl ☆5"],

    "nemesis": parsedCharacterData.characters["Nemesis"],
    "nemesis1": parsedCharacterData.characters["Nemesis ☆1"],
    "nemesis3": parsedCharacterData.characters["Nemesis ☆3"],
    "nemesis5": parsedCharacterData.characters["Nemesis ☆5"],
    "nemesis6": parsedCharacterData.characters["Nemesis ☆6"],

    "humashield": parsedCharacterData.characters["Huma (Shield)"],
    "humaaxe": parsedCharacterData.characters["Huma (Axe)"],
    "humaaxe1": parsedCharacterData.characters["Huma (Axe) ☆1"],

    "crow": parsedCharacterData.characters["Crow"],
    "crow1": parsedCharacterData.characters["Crow ☆1"],
    "crow3": parsedCharacterData.characters["Crow ☆3"],
    "crow5": parsedCharacterData.characters["Crow ☆5"],
    "crow6": parsedCharacterData.characters["Crow ☆6"],

    "tsubasa": parsedCharacterData.characters["Tsubasa"],
    "tsubasa1": parsedCharacterData.characters["Tsubasa ☆1"],
    "tsubasa3": parsedCharacterData.characters["Tsubasa ☆3"],
    "tsubasa5": parsedCharacterData.characters["Tsubasa ☆5"],
    "tsubasa6": parsedCharacterData.characters["Tsubasa ☆6"],

    "frigg": parsedCharacterData.characters["Frigg"],
    "frigg1": parsedCharacterData.characters["Frigg ☆1"],
    "frigg3": parsedCharacterData.characters["Frigg ☆3"],
    "frigg5": parsedCharacterData.characters["Frigg ☆5"],
    "frigg6": parsedCharacterData.characters["Frigg ☆6"],
    "friggjetpack": parsedCharacterData.characters["Frigg (Jetpack)"],
    "friggjetpack1": parsedCharacterData.characters["Frigg ☆1 (Jetpack)"],
    "friggjetpack3": parsedCharacterData.characters["Frigg ☆3 (Jetpack)"],
    "friggjetpack6": parsedCharacterData.characters["Frigg ☆6 (Jetpack)"],

    "claudia": parsedCharacterData.characters["Claudia"],
    "claudia1": parsedCharacterData.characters["Claudia ☆1"],
    "claudia3": parsedCharacterData.characters["Claudia ☆3"],
    "claudia5": parsedCharacterData.characters["Claudia ☆5"],
    "claudia6": parsedCharacterData.characters["Claudia ☆6"],

    "cobalt-b": parsedCharacterData.characters["Cobalt-B"],
    "cobalt-b1": parsedCharacterData.characters["Cobalt-B ☆1"],
    "cobalt-b3": parsedCharacterData.characters["Cobalt-B ☆3"],
    "cobalt-b5": parsedCharacterData.characters["Cobalt-B ☆5"],
    "cobalt-b6": parsedCharacterData.characters["Cobalt-B ☆6"],

    "ruby": parsedCharacterData.characters["Ruby"],
    "ruby1": parsedCharacterData.characters["Ruby ☆1"],
    "ruby3": parsedCharacterData.characters["Ruby ☆3"],
    "ruby5": parsedCharacterData.characters["Ruby ☆5"],
    "ruby6": parsedCharacterData.characters["Ruby ☆6"],

    "saki": parsedCharacterData.characters["Saki Fuwa"],
    "saki1": parsedCharacterData.characters["Saki Fuwa ☆1"],
    "saki3": parsedCharacterData.characters["Saki Fuwa ☆3"],
    "saki6": parsedCharacterData.characters["Saki Fuwa ☆6"],

    "lin": parsedCharacterData.characters["Lin"],
    "lin1": parsedCharacterData.characters["Lin ☆1"],
    "lin3": parsedCharacterData.characters["Lin ☆3"],
    "lin5": parsedCharacterData.characters["Lin ☆5"],
    "lin6": parsedCharacterData.characters["Lin ☆6"],

    "lyra": parsedCharacterData.characters["Lyra"],
    "lyra1": parsedCharacterData.characters["Lyra ☆1"],
    "lyra3": parsedCharacterData.characters["Lyra ☆3"],
    "lyra6": parsedCharacterData.characters["Lyra ☆6"],

    "tian": parsedCharacterData.characters["Tian Lang"],
    "tian1": parsedCharacterData.characters["Tian Lang ☆1"],
    "tian3": parsedCharacterData.characters["Tian Lang ☆3"],
    "tian5": parsedCharacterData.characters["Tian Lang ☆5"],
    "tian6": parsedCharacterData.characters["Tian Lang ☆6"],

    "annagas": parsedCharacterData.characters["Annabella (Gas)"],
    "annagas1": parsedCharacterData.characters["Annabella (Gas) ☆1"],
    "annagas3": parsedCharacterData.characters["Annabella (Gas) ☆3"],
    "annagas5": parsedCharacterData.characters["Annabella (Gas) ☆5"],
    "annagas6": parsedCharacterData.characters["Annabella (Gas) ☆6"],
    "annaburn": parsedCharacterData.characters["Annabella (Burn)"],
    "annaburn1": parsedCharacterData.characters["Annabella (Burn) ☆1"],
    "annaburn3": parsedCharacterData.characters["Annabella (Burn) ☆3"],
    "annaburn5": parsedCharacterData.characters["Annabella (Burn) ☆5"],
    "annaburn6": parsedCharacterData.characters["Annabella (Burn) ☆6"],

    "alyss": parsedCharacterData.characters["Alyss"],
    "alyss1": parsedCharacterData.characters["Alyss ☆1"],
    "alyss3": parsedCharacterData.characters["Alyss ☆3"],
    "alyss5": parsedCharacterData.characters["Alyss ☆5"],
    "alyss6": parsedCharacterData.characters["Alyss ☆6"],

    "umi": parsedCharacterData.characters["Umi"],
    "umi1": parsedCharacterData.characters["Umi ☆1"],
    "umi3": parsedCharacterData.characters["Umi ☆3"],
    "umi5": parsedCharacterData.characters["Umi ☆5"],
    "umi6": parsedCharacterData.characters["Umi ☆6"],

    "fenrir": parsedCharacterData.characters["Fenrir"],
    "fenrir1": parsedCharacterData.characters["Fenrir ☆1"],
    "fenrir3": parsedCharacterData.characters["Fenrir ☆3"],
    "fenrir5": parsedCharacterData.characters["Fenrir ☆5"],
    "fenrir6": parsedCharacterData.characters["Fenrir ☆6"],

    "lan": parsedCharacterData.characters["Lan"],
    "lan1": parsedCharacterData.characters["Lan ☆1"],
    "lan3": parsedCharacterData.characters["Lan ☆3"],
    "lan5": parsedCharacterData.characters["Lan ☆5"],
    "lan6": parsedCharacterData.characters["Lan ☆6"],

    "icarus": parsedCharacterData.characters["Icarus"],
    "icarus1": parsedCharacterData.characters["Icarus ☆1"],
    "icarus3": parsedCharacterData.characters["Icarus ☆3"],
    "icarus5": parsedCharacterData.characters["Icarus ☆5"],
    "icarus6": parsedCharacterData.characters["Icarus ☆6"],

    "fiona": parsedCharacterData.characters["Fiona"],
    "fiona1": parsedCharacterData.characters["Fiona ☆1"],
    "fiona3": parsedCharacterData.characters["Fiona ☆3"],
    "fiona5": parsedCharacterData.characters["Fiona ☆5"],
    "fiona6": parsedCharacterData.characters["Fiona ☆6"],

    "gnonno": parsedCharacterData.characters["Gnonno"],
    "gnonno1": parsedCharacterData.characters["Gnonno ☆1"],
    "gnonno3": parsedCharacterData.characters["Gnonno ☆3"],
    "gnonno5": parsedCharacterData.characters["Gnonno ☆5"],
    "gnonno6": parsedCharacterData.characters["Gnonno ☆6"],

    "rubilia": parsedCharacterData.characters["Rubilia"],
    "rubilia1": parsedCharacterData.characters["Rubilia ☆1"],
    "rubilia3": parsedCharacterData.characters["Rubilia ☆3"],
    "rubilia5": parsedCharacterData.characters["Rubilia ☆5"],
    "rubilia6": parsedCharacterData.characters["Rubilia ☆6"],

    "liu": parsedCharacterData.characters["Liu Huo"],
    "liu1": parsedCharacterData.characters["Liu Huo ☆1"],
    "liu3": parsedCharacterData.characters["Liu Huo ☆3"],
    "liu5": parsedCharacterData.characters["Liu Huo ☆5"],
    "liu6": parsedCharacterData.characters["Liu Huo ☆6"],

    "yulanmartial": parsedCharacterData.characters["Yulan (Martial)"],
    "yulanmartial1": parsedCharacterData.characters["Yulan (Martial) ☆1"],
    "yulanmartial3": parsedCharacterData.characters["Yulan (Martial) ☆3"],
    "yulanmartial5": parsedCharacterData.characters["Yulan (Martial) ☆5"],
    "yulanmartial6": parsedCharacterData.characters["Yulan (Martial) ☆6"],
    "yulansweeping": parsedCharacterData.characters["Yulan (Sweeping)"],
    "yulansweeping1": parsedCharacterData.characters["Yulan (Sweeping) ☆1"],
    "yulansweeping3": parsedCharacterData.characters["Yulan (Sweeping) ☆3"],
    "yulansweeping5": parsedCharacterData.characters["Yulan (Sweeping) ☆5"],
    "yulansweeping6": parsedCharacterData.characters["Yulan (Sweeping) ☆6"],

    "zeke": parsedCharacterData.characters["Zeke"],
    "zeke1": parsedCharacterData.characters["Zeke ☆1"],
    "zeke3": parsedCharacterData.characters["Zeke ☆3"],
    "zeke5": parsedCharacterData.characters["Zeke ☆5"],
    "zeke6": parsedCharacterData.characters["Zeke ☆6"],

    "mimi": parsedCharacterData.characters["Mimi"],
    "mimi1": parsedCharacterData.characters["Mimi ☆1"],
    "mimi3": parsedCharacterData.characters["Mimi ☆3"],
    "mimi5": parsedCharacterData.characters["Mimi ☆5"],
    "mimi6": parsedCharacterData.characters["Mimi ☆6"],
};

const matriceSelections = {
    "huma2pc0": parsedMatriceData.matrices["Huma 2pc ☆0"],
    "huma2pc1": parsedMatriceData.matrices["Huma 2pc ☆1"],
    "huma2pc2": parsedMatriceData.matrices["Huma 2pc ☆2"],
    "huma2pc3": parsedMatriceData.matrices["Huma 2pc ☆3"],

    "cobalt4pc0": parsedMatriceData.matrices["Cobalt 4pc ☆0"],
    "cobalt4pc1": parsedMatriceData.matrices["Cobalt 4pc ☆1"],
    "cobalt4pc2": parsedMatriceData.matrices["Cobalt 4pc ☆2"],
    "cobalt4pc3": parsedMatriceData.matrices["Cobalt 4pc ☆3"],

    "meryl4pc0": parsedMatriceData.matrices["Meryl 4pc ☆0"],
    "meryl4pc1": parsedMatriceData.matrices["Meryl 4pc ☆1"],
    "meryl4pc2": parsedMatriceData.matrices["Meryl 4pc ☆2"],
    "meryl4pc3": parsedMatriceData.matrices["Meryl 4pc ☆3"],

    "claudia4pc0": parsedMatriceData.matrices["Claudia 4pc ☆0"],
    "claudia4pc1": parsedMatriceData.matrices["Claudia 4pc ☆1"],
    "claudia4pc2": parsedMatriceData.matrices["Claudia 4pc ☆2"],
    "claudia4pc3": parsedMatriceData.matrices["Claudia 4pc ☆3"],

    "frigg2pc0": parsedMatriceData.matrices["Frigg 2pc ☆0"],
    "frigg2pc1": parsedMatriceData.matrices["Frigg 2pc ☆1"],
    "frigg2pc2": parsedMatriceData.matrices["Frigg 2pc ☆2"],
    "frigg2pc3": parsedMatriceData.matrices["Frigg 2pc ☆3"],

    "frigg4pc0": parsedMatriceData.matrices["Frigg 4pc ☆0"],
    "frigg4pc1": parsedMatriceData.matrices["Frigg 4pc ☆1"],
    "frigg4pc2": parsedMatriceData.matrices["Frigg 4pc ☆2"],
    "frigg4pc3": parsedMatriceData.matrices["Frigg 4pc ☆3"],

    "saki2pc0": parsedMatriceData.matrices["Saki 2pc ☆0"],
    "saki2pc1": parsedMatriceData.matrices["Saki 2pc ☆1"],
    "saki2pc2": parsedMatriceData.matrices["Saki 2pc ☆2"],
    "saki2pc3": parsedMatriceData.matrices["Saki 2pc ☆3"],

    "saki4pc0": parsedMatriceData.matrices["Saki 4pc ☆0"],
    "saki4pc1": parsedMatriceData.matrices["Saki 4pc ☆1"],
    "saki4pc2": parsedMatriceData.matrices["Saki 4pc ☆2"],
    "saki4pc3": parsedMatriceData.matrices["Saki 4pc ☆3"],

    "ruby2pc0": parsedMatriceData.matrices["Ruby 2pc ☆0"],
    "ruby2pc1": parsedMatriceData.matrices["Ruby 2pc ☆1"],
    "ruby2pc2": parsedMatriceData.matrices["Ruby 2pc ☆2"],
    "ruby2pc3": parsedMatriceData.matrices["Ruby 2pc ☆3"],

    "ruby4pc0": parsedMatriceData.matrices["Ruby 4pc ☆0"],
    "ruby4pc1": parsedMatriceData.matrices["Ruby 4pc ☆1"],
    "ruby4pc2": parsedMatriceData.matrices["Ruby 4pc ☆2"],
    "ruby4pc3": parsedMatriceData.matrices["Ruby 4pc ☆3"],

    "lin2pc0": parsedMatriceData.matrices["Lin 2pc ☆0"],
    "lin2pc1": parsedMatriceData.matrices["Lin 2pc ☆1"],
    "lin2pc2": parsedMatriceData.matrices["Lin 2pc ☆2"],
    "lin2pc3": parsedMatriceData.matrices["Lin 2pc ☆3"],

    "lin4pc0": parsedMatriceData.matrices["Lin 4pc ☆0"],
    "lin4pc1": parsedMatriceData.matrices["Lin 4pc ☆1"],
    "lin4pc2": parsedMatriceData.matrices["Lin 4pc ☆2"],
    "lin4pc3": parsedMatriceData.matrices["Lin 4pc ☆3"],

    "nemesis2pc0": parsedMatriceData.matrices["Nemesis 2pc ☆0"],
    "nemesis2pc1": parsedMatriceData.matrices["Nemesis 2pc ☆1"],
    "nemesis2pc2": parsedMatriceData.matrices["Nemesis 2pc ☆2"],
    "nemesis2pc3": parsedMatriceData.matrices["Nemesis 2pc ☆3"],

    "nemesis4pc0": parsedMatriceData.matrices["Nemesis 4pc ☆0"],
    "nemesis4pc1": parsedMatriceData.matrices["Nemesis 4pc ☆1"],
    "nemesis4pc2": parsedMatriceData.matrices["Nemesis 4pc ☆2"],
    "nemesis4pc3": parsedMatriceData.matrices["Nemesis 4pc ☆3"],

    "samir4pc0": parsedMatriceData.matrices["Samir 4pc ☆0"],
    "samir4pc1": parsedMatriceData.matrices["Samir 4pc ☆1"],
    "samir4pc2": parsedMatriceData.matrices["Samir 4pc ☆2"],
    "samir4pc3": parsedMatriceData.matrices["Samir 4pc ☆3"],

    "shiro4pc0": parsedMatriceData.matrices["Shiro 4pc ☆0"],
    "shiro4pc1": parsedMatriceData.matrices["Shiro 4pc ☆1"],
    "shiro4pc2": parsedMatriceData.matrices["Shiro 4pc ☆2"],
    "shiro4pc3": parsedMatriceData.matrices["Shiro 4pc ☆3"],

    "crowshiro2pc0": parsedMatriceData.matrices["Crow+Shiro 2pc ☆0"],
    "crowshiro2pc1": parsedMatriceData.matrices["Crow+Shiro 2pc ☆1"],
    "crowshiro2pc2": parsedMatriceData.matrices["Crow+Shiro 2pc ☆2"],
    "crowshiro2pc3": parsedMatriceData.matrices["Crow+Shiro 2pc ☆3"],

    "crowsamir2pc0": parsedMatriceData.matrices["Crow+Samir 2pc ☆0"],
    "crowsamir2pc1": parsedMatriceData.matrices["Crow+Samir 2pc ☆1"],
    "crowsamir2pc2": parsedMatriceData.matrices["Crow+Samir 2pc ☆2"],
    "crowsamir2pc3": parsedMatriceData.matrices["Crow+Samir 2pc ☆3"],

    "crowhuma2pc0": parsedMatriceData.matrices["Crow+Huma 2pc ☆0"],
    "crowhuma2pc1": parsedMatriceData.matrices["Crow+Huma 2pc ☆1"],
    "crowhuma2pc2": parsedMatriceData.matrices["Crow+Huma 2pc ☆2"],
    "crowhuma2pc3": parsedMatriceData.matrices["Crow+Huma 2pc ☆3"],

    "samirshiro2pc0": parsedMatriceData.matrices["Samir+Shiro 2pc ☆0"],
    "samirshiro2pc1": parsedMatriceData.matrices["Samir+Shiro 2pc ☆1"],
    "samirshiro2pc2": parsedMatriceData.matrices["Samir+Shiro 2pc ☆2"],
    "samirshiro2pc3": parsedMatriceData.matrices["Samir+Shiro 2pc ☆3"],

    "samircobalt2pc0": parsedMatriceData.matrices["Samir+Cobalt 2pc ☆0"],
    "samircobalt2pc1": parsedMatriceData.matrices["Samir+Cobalt 2pc ☆1"],
    "samircobalt2pc2": parsedMatriceData.matrices["Samir+Cobalt 2pc ☆2"],
    "samircobalt2pc3": parsedMatriceData.matrices["Samir+Cobalt 2pc ☆3"],

    "samirhuma2pc0": parsedMatriceData.matrices["Samir+Huma 2pc ☆0"],
    "samirhuma2pc1": parsedMatriceData.matrices["Samir+Huma 2pc ☆1"],
    "samirhuma2pc2": parsedMatriceData.matrices["Samir+Huma 2pc ☆2"],
    "samirhuma2pc3": parsedMatriceData.matrices["Samir+Huma 2pc ☆3"],

    "shirohuma2pc0": parsedMatriceData.matrices["Shiro+Huma 2pc ☆0"],
    "shirohuma2pc1": parsedMatriceData.matrices["Shiro+Huma 2pc ☆1"],
    "shirohuma2pc2": parsedMatriceData.matrices["Shiro+Huma 2pc ☆2"],
    "shirohuma2pc3": parsedMatriceData.matrices["Shiro+Huma 2pc ☆3"],

    "samirtsubasa2pc0": parsedMatriceData.matrices["Samir+Tsubasa 2pc ☆0"],
    "samirtsubasa2pc1": parsedMatriceData.matrices["Samir+Tsubasa 2pc ☆1"],
    "samirtsubasa2pc2": parsedMatriceData.matrices["Samir+Tsubasa 2pc ☆2"],
    "samirtsubasa2pc3": parsedMatriceData.matrices["Samir+Tsubasa 2pc ☆3"],

    "shirotsubasa2pc0": parsedMatriceData.matrices["Shiro+Tsubasa 2pc ☆0"],
    "shirotsubasa2pc1": parsedMatriceData.matrices["Shiro+Tsubasa 2pc ☆1"],
    "shirotsubasa2pc2": parsedMatriceData.matrices["Shiro+Tsubasa 2pc ☆2"],
    "shirotsubasa2pc3": parsedMatriceData.matrices["Shiro+Tsubasa 2pc ☆3"],

    "kinghuma2pc0": parsedMatriceData.matrices["King+Huma 2pc ☆0"],
    "kinghuma2pc1": parsedMatriceData.matrices["King+Huma 2pc ☆1"],
    "kinghuma2pc2": parsedMatriceData.matrices["King+Huma 2pc ☆2"],
    "kinghuma2pc3": parsedMatriceData.matrices["King+Huma 2pc ☆3"],

    "kingshiro2pc0": parsedMatriceData.matrices["King+Shiro 2pc ☆0"],
    "kingshiro2pc1": parsedMatriceData.matrices["King+Shiro 2pc ☆1"],
    "kingshiro2pc2": parsedMatriceData.matrices["King+Shiro 2pc ☆2"],
    "kingshiro2pc3": parsedMatriceData.matrices["King+Shiro 2pc ☆3"],

    "lyra2pc0": parsedMatriceData.matrices["Lyra 2pc ☆0"],
    "lyra2pc1": parsedMatriceData.matrices["Lyra 2pc ☆1"],
    "lyra2pc2": parsedMatriceData.matrices["Lyra 2pc ☆2"],
    "lyra2pc3": parsedMatriceData.matrices["Lyra 2pc ☆3"],

    "lyra4pc0": parsedMatriceData.matrices["Lyra 4pc ☆0"],
    "lyra4pc1": parsedMatriceData.matrices["Lyra 4pc ☆1"],
    "lyra4pc2": parsedMatriceData.matrices["Lyra 4pc ☆2"],
    "lyra4pc3": parsedMatriceData.matrices["Lyra 4pc ☆3"],

    "lyrasamir2pc0": parsedMatriceData.matrices["Lyra+Samir 2pc ☆0"],
    "lyrasamir2pc1": parsedMatriceData.matrices["Lyra+Samir 2pc ☆1"],
    "lyrasamir2pc2": parsedMatriceData.matrices["Lyra+Samir 2pc ☆2"],
    "lyrasamir2pc3": parsedMatriceData.matrices["Lyra+Samir 2pc ☆3"],

    "lyrashiro2pc0": parsedMatriceData.matrices["Lyra+Shiro 2pc ☆0"],
    "lyrashiro2pc1": parsedMatriceData.matrices["Lyra+Shiro 2pc ☆1"],
    "lyrashiro2pc2": parsedMatriceData.matrices["Lyra+Shiro 2pc ☆2"],
    "lyrashiro2pc3": parsedMatriceData.matrices["Lyra+Shiro 2pc ☆3"],

    "tian2pc0": parsedMatriceData.matrices["Tian 2pc ☆0"],
    "tian2pc1": parsedMatriceData.matrices["Tian 2pc ☆1"],
    "tian2pc2": parsedMatriceData.matrices["Tian 2pc ☆2"],
    "tian2pc3": parsedMatriceData.matrices["Tian 2pc ☆3"],

    "tian4pc0": parsedMatriceData.matrices["Tian 4pc ☆0"],
    "tian4pc1": parsedMatriceData.matrices["Tian 4pc ☆1"],
    "tian4pc2": parsedMatriceData.matrices["Tian 4pc ☆2"],
    "tian4pc3": parsedMatriceData.matrices["Tian 4pc ☆3"],

    "umi4pc0": parsedMatriceData.matrices["Umi 4pc ☆0"],
    "umi4pc1": parsedMatriceData.matrices["Umi 4pc ☆1"],
    "umi4pc2": parsedMatriceData.matrices["Umi 4pc ☆2"],
    "umi4pc3": parsedMatriceData.matrices["Umi 4pc ☆3"],

    "anna4pc0": parsedMatriceData.matrices["Annabella 4pc ☆0"],
    "anna4pc1": parsedMatriceData.matrices["Annabella 4pc ☆1"],
    "anna4pc2": parsedMatriceData.matrices["Annabella 4pc ☆2"],
    "anna4pc3": parsedMatriceData.matrices["Annabella 4pc ☆3"],

    "alyss4pc0": parsedMatriceData.matrices["Alyss 4pc ☆0"],
    "alyss4pc1": parsedMatriceData.matrices["Alyss 4pc ☆1"],
    "alyss4pc2": parsedMatriceData.matrices["Alyss 4pc ☆2"],
    "alyss4pc3": parsedMatriceData.matrices["Alyss 4pc ☆3"],

    "fenrir4pc0": parsedMatriceData.matrices["Fenrir 4pc ☆0"],
    "fenrir4pc1": parsedMatriceData.matrices["Fenrir 4pc ☆1"],
    "fenrir4pc2": parsedMatriceData.matrices["Fenrir 4pc ☆2"],
    "fenrir4pc3": parsedMatriceData.matrices["Fenrir 4pc ☆3"],

    "lan4pc0": parsedMatriceData.matrices["Lan 4pc ☆0"],
    "lan4pc1": parsedMatriceData.matrices["Lan 4pc ☆1"],
    "lan4pc2": parsedMatriceData.matrices["Lan 4pc ☆2"],
    "lan4pc3": parsedMatriceData.matrices["Lan 4pc ☆3"],

    "scylla4pc0": parsedMatriceData.matrices["Scylla 4pc ☆0"],
    "scylla4pc1": parsedMatriceData.matrices["Scylla 4pc ☆1"],
    "scylla4pc2": parsedMatriceData.matrices["Scylla 4pc ☆2"],
    "scylla4pc3": parsedMatriceData.matrices["Scylla 4pc ☆3"],

    "haboela4pc0": parsedMatriceData.matrices["Haboela 4pc ☆0"],
    "haboela4pc1": parsedMatriceData.matrices["Haboela 4pc ☆1"],
    "haboela4pc2": parsedMatriceData.matrices["Haboela 4pc ☆2"],
    "haboela4pc3": parsedMatriceData.matrices["Haboela 4pc ☆3"],

    "icarus4pc0": parsedMatriceData.matrices["Icarus 4pc ☆0"],
    "icarus4pc1": parsedMatriceData.matrices["Icarus 4pc ☆1"],
    "icarus4pc2": parsedMatriceData.matrices["Icarus 4pc ☆2"],
    "icarus4pc3": parsedMatriceData.matrices["Icarus 4pc ☆3"],

    "fiona4pc0": parsedMatriceData.matrices["Fiona 4pc ☆0"],
    "fiona4pc1": parsedMatriceData.matrices["Fiona 4pc ☆1"],
    "fiona4pc2": parsedMatriceData.matrices["Fiona 4pc ☆2"],
    "fiona4pc3": parsedMatriceData.matrices["Fiona 4pc ☆3"],

    "gnonno4pc0": parsedMatriceData.matrices["Gnonno 4pc ☆0"],
    "gnonno4pc1": parsedMatriceData.matrices["Gnonno 4pc ☆1"],
    "gnonno4pc2": parsedMatriceData.matrices["Gnonno 4pc ☆2"],
    "gnonno4pc3": parsedMatriceData.matrices["Gnonno 4pc ☆3"],

    "rubilia4pc0": parsedMatriceData.matrices["Rubilia 4pc ☆0"],
    "rubilia4pc1": parsedMatriceData.matrices["Rubilia 4pc ☆1"],
    "rubilia4pc2": parsedMatriceData.matrices["Rubilia 4pc ☆2"],
    "rubilia4pc3": parsedMatriceData.matrices["Rubilia 4pc ☆3"],

    "liu4pc0": parsedMatriceData.matrices["Liu Huo 4pc ☆0"],
    "liu4pc1": parsedMatriceData.matrices["Liu Huo 4pc ☆1"],
    "liu4pc2": parsedMatriceData.matrices["Liu Huo 4pc ☆2"],
    "liu4pc3": parsedMatriceData.matrices["Liu Huo 4pc ☆3"],

    "yulan4pc0": parsedMatriceData.matrices["Yulan 4pc ☆0"],
    "yulan4pc1": parsedMatriceData.matrices["Yulan 4pc ☆1"],
    "yulan4pc2": parsedMatriceData.matrices["Yulan 4pc ☆2"],
    "yulan4pc3": parsedMatriceData.matrices["Yulan 4pc ☆3"],

    "zeke4pc0": parsedMatriceData.matrices["Zeke 4pc ☆0"],
    "zeke4pc1": parsedMatriceData.matrices["Zeke 4pc ☆1"],
    "zeke4pc2": parsedMatriceData.matrices["Zeke 4pc ☆2"],
    "zeke4pc3": parsedMatriceData.matrices["Zeke 4pc ☆3"],

    "mimi4pc0": parsedMatriceData.matrices["Mimi 4pc ☆0"],
    "mimi4pc1": parsedMatriceData.matrices["Mimi 4pc ☆1"],
    "mimi4pc2": parsedMatriceData.matrices["Mimi 4pc ☆2"],
    "mimi4pc3": parsedMatriceData.matrices["Mimi 4pc ☆3"],
};

const traitSelection = {
    "samir": parsedTraitData.traits["Samir"],
    "annabella": parsedTraitData.traits["Annabella"],
    "alyss": parsedTraitData.traits["Alyss"],
    "fenrir": parsedTraitData.traits["Fenrir"],
    "fiona": parsedTraitData.traits["Fiona"],
    "rubilia": parsedTraitData.traits["Rubilia"],
    "liu": parsedTraitData.traits["Liu Huo"],
    "yulan": parsedTraitData.traits["Yulan"],
    "zeke": parsedTraitData.traits["Zeke"],
    "mimi": parsedTraitData.traits["Mimi"],
};

const skillsSelection = {
    "crashingfalls": parsedSkillsData.skills["Crashing Falls"],
    "hydro": parsedSkillsData.skills["Hydro Focus"],
    "vortex": parsedSkillsData.skills["Vortex"],
    "torrential": parsedSkillsData.skills["Torrential Force"],
    "maelstrom": parsedSkillsData.skills["Maelstrom"],
    "aquashackles": parsedSkillsData.skills["Aqua Shackles"],
    "wellspring": parsedSkillsData.skills["Wellspring"],
    "NA": parsedSkillsData.skills["NA"],
};


function normalizeCharacterName(name) {
    // Remove spaces and convert to lowercase
    name = name.replace(/\s/g, '').toLowerCase();
  
    // Extract star advancement if present
    const starAdvancement = name.match(/\d+(?:\*|star|☆|★)?/);
    if (starAdvancement) {
      name = name.replace(starAdvancement[0], '');
      return `${name}${starAdvancement[0].replace(/\*|star|☆|★/g, '')}`;
    }
  
    return name;
}
  
  // Function to normalize matrix names
  function findClosestMatrixMatch(input) {
    // Convert input to lowercase and remove spaces
    input = input.toLowerCase().replace(/\s/g, '');
  
    const keys = Object.keys(matriceSelections);
  
    // Set up a fuse instance with custom options
    const fuse = new Fuse(keys, {
      shouldSort: true,
      threshold: 0.7, // Adjust the threshold as needed
      keys: ['value'], // Specify the property to match against
    });
  
    // Search for matches
    const results = fuse.search(input);
  
    if (results.length > 0) {
      const bestMatch = results[0].item;
      return bestMatch; // Return the best matching key as a string
    }
  
    // Handle no close match found
    return "No match found";
  }
  
  // Function to normalize trait names
  function normalizeTraitName(name) {
    return normalizeCharacterName(name);
  }
  

function calculateDPS(sCD1, sCD2, sCD3, sM1, sM2, sM3, sTrait, fionaSk1 = "NA", fionaSk2 = "NA") {

    if (!(sCD1 in characterSelections) || !(sCD2 in characterSelections) || !(sCD3 in characterSelections)) {
        return "Sorry, I don't understand the character input. You can use `/dpshelp` for help on how to input correctly.";
    }

    // Check if the provided matrice selections are valid
    if (!(sM1 in matriceSelections) || !(sM2 in matriceSelections) || !(sM3 in matriceSelections)) {
        return "Sorry, I don't understand the matrice input. You can use `/dpshelp` for help on how to input correctly.";
    }

    if (sCD1 == sCD2 && sCD1 == sCD3 && sCD2 == sCD3) {
        return "No duplicate character entries!! Thank you!!";
    }

    if (sCD1.includes("tian") || sCD2.includes("tian") || sCD3.includes("tian")) {
        return "Tian is broken rn, I WILL FIX SOON :D";
    }

    if (sCD1.includes("saki") || sCD2.includes("saki") || sCD3.includes("saki")) {
        return "Saki is broken rn, I will fix soon";
    }


    // Check if the provided trait selection is valid
    if (!(sTrait in traitSelection)) {
        return "Sorry, I don't understand the trait input. You can use `/dpshelp` for help on how to input correctly.";
    }

    const selectedCharacterData1 = characterSelections[sCD1];
    const selectedCharacterData2 = characterSelections[sCD2];
    const selectedCharacterData3 = characterSelections[sCD3];

    const selectedMatrice1 = matriceSelections[sM1];
    const selectedMatrice2 = matriceSelections[sM2];
    const selectedMatrice3 = matriceSelections[sM3];

    const selectedTrait = traitSelection[sTrait];

    const naturalCharge = 10;
    const encounterTime = 180;
    const phantasiaPerEncounter = 0;
    const ShatterPerEncounter = 3;

    const selectedMatricesNames = [sM1, sM2, sM3];
    const selectedCharacterNames = [sCD1, sCD2, sCD3];

    const selectedSkill1 = skillsSelection[fionaSk1];
    const selectedSkill2 = skillsSelection[fionaSk2];

    // Check if the provided skills selections are valid
    if (((fionaSk1 == "NA") || (fionaSk2 == "NA")) && (sCD1.includes("fiona") || sCD2.includes("fiona") || sCD3.includes("fiona"))) {
        return "Sorry, I don't understand the skills input. Please input the fiona skills you would like to use :D. You can use `/dpshelp` for help on how to input correctly.";
    } else if(fionaSk2 == "NA" && (sCD1.includes("fiona") || sCD2.includes("fiona") || sCD3.includes("fiona"))) {
        return "Sorry, I don't understand the skills input. Please input the fiona skills you would like to use :D. You can use `/dpshelp` for help on how to input correctly.";
    } else if(fionaSk1 == "NA" && (sCD1.includes("fiona") || sCD2.includes("fiona") || sCD3.includes("fiona"))) {
        return "Sorry, I don't understand the skills input. Please input the fiona skills you would like to use :D. You can use `/dpshelp` for help on how to input correctly.";
    }

    
    //simulacra 1 data
    const element1 = selectedCharacterData1.element;
    const maxAutoDPS1 = selectedCharacterData1.maxAutoDPS;
    let skillDamage1 = selectedCharacterData1.skillDamage;
    const endurancePerSecond1 = selectedCharacterData1.endurancePerSecond;
    const enduranceDPS1 = selectedCharacterData1.enduranceDPS;
    const dodgeHits1 = selectedCharacterData1.dodgeHits;
    const skillCooldown1 = selectedCharacterData1.skillCooldown;
    const passiveDPS1 = selectedCharacterData1.passiveDPS;
    const damageBuffAverage1 = selectedCharacterData1.damageBuffAverage;
    const buffType1 = selectedCharacterData1.buffType;
    let attackBuffAverage1 = selectedCharacterData1.attackBuffAverage;
    const attackBuffType1 = selectedCharacterData1.attackBuffType;
    const resonance1 = selectedCharacterData1.resonance;
    const debuffAverage1 = selectedCharacterData1.debuffAverage;
    const debuffType1 = selectedCharacterData1.debuffType;
    const dischargeTime1 = selectedCharacterData1.dischargeTime;
    const onFieldPassive1 = selectedCharacterData1.onFieldPassive;
    const specialSkillDamage1 = selectedCharacterData1.specialSkillDamage;
    const specialSkillCast1 = selectedCharacterData1.specialSkillCast;
    const specialSkillCooldown1 = selectedCharacterData1.specialSkillCooldown;

    const damagePerDodgeValue = [(selectedCharacterData1.dodgeDamage/selectedCharacterData1.dodgeTime), (selectedCharacterData2.dodgeDamage/selectedCharacterData2.dodgeTime), (selectedCharacterData3.dodgeDamage/selectedCharacterData3.dodgeTime)];
    const dodgeDamageValue = [selectedCharacterData1.dodgeDamage, selectedCharacterData2.dodgeDamage, selectedCharacterData3.dodgeDamage];
    const maxAutoDpsValue = [selectedCharacterData1.maxAutoDPS, selectedCharacterData2.maxAutoDPS, selectedCharacterData3.maxAutoDPS];
    const enduranceDpsValue = [selectedCharacterData1.enduranceDPS, selectedCharacterData2.enduranceDPS, selectedCharacterData3.enduranceDPS];
    const endurancePerSecondValue = [selectedCharacterData1.endurancePerSecond, selectedCharacterData2.endurancePerSecond, selectedCharacterData3.endurancePerSecond];
    const onfieldCritRate = [selectedCharacterData1.onFieldCritRate, selectedCharacterData2.onFieldCritRate, selectedCharacterData3.onFieldCritRate];
    const skillCast = [selectedCharacterData1.skillCast, selectedCharacterData2.skillCast, selectedCharacterData3.skillCast];
    const damagePerDischarge = [selectedCharacterData1.damagePerDischarge, selectedCharacterData2.damagePerDischarge, selectedCharacterData3.damagePerDischarge];
    const skillDamage = [selectedCharacterData1.skillDamage, selectedCharacterData2.skillDamage, selectedCharacterData3.skillDamage];
    const passiveDps = [selectedCharacterData1.passiveDPS, selectedCharacterData2.passiveDPS, selectedCharacterData3.passiveDPS];
    let skillCooldown = [selectedCharacterData1.skillCooldown, selectedCharacterData2.skillCooldown, selectedCharacterData3.skillCooldown];
    const specialSkillCooldown = [selectedCharacterData1.specialSkillCooldown, selectedCharacterData2.specialSkillCooldown, selectedCharacterData3.specialSkillCooldown];
    const specialSkillCast = [selectedCharacterData1.specialSkillCast, selectedCharacterData2.specialSkillCast, selectedCharacterData3.specialSkillCast];
    const dischargeTime = [selectedCharacterData1.dischargeTime, selectedCharacterData2.dischargeTime, selectedCharacterData3.dischargeTime];
    const enduranceDps = [selectedCharacterData1.enduranceDPS, selectedCharacterData2.enduranceDPS, selectedCharacterData3.enduranceDPS];
    const specialSkillDmg = [selectedCharacterData1.specialSkillDamage, selectedCharacterData2.specialSkillDamage, selectedCharacterData3.specialSkillDamage];  
    const dodgeTime = [selectedCharacterData1.dodgeTime, selectedCharacterData2.dodgeTime, selectedCharacterData3.dodgeTime];
    const onfieldPassive = [selectedCharacterData1.onFieldPassive, selectedCharacterData2.onFieldPassive, selectedCharacterData3.onFieldPassive];
    const typeValue = [selectedCharacterData1.type, selectedCharacterData2.type, selectedCharacterData3.type];
    let damageBuffAvg = [selectedCharacterData1.damageBuffAverage, selectedCharacterData2.damageBuffAverage, selectedCharacterData3.damageBuffAverage]

    //simulacra 2 dat
    const element2 = selectedCharacterData2.element;
    const maxAutoDPS2 = selectedCharacterData2.maxAutoDPS;
    let skillDamage2 = selectedCharacterData2.skillDamage;
    const endurancePerSecond2 = selectedCharacterData2.endurancePerSecond;
    const enduranceDPS2 = selectedCharacterData2.enduranceDPS;
    const dodgeHits2 = selectedCharacterData2.dodgeHits;
    const skillCooldown2 = selectedCharacterData2.skillCooldown;
    const passiveDPS2 = selectedCharacterData2.passiveDPS;
    const damageBuffAverage2 = selectedCharacterData2.damageBuffAverage;
    const buffType2 = selectedCharacterData2.buffType;
    let attackBuffAverage2 = selectedCharacterData2.attackBuffAverage;
    const attackBuffType2 = selectedCharacterData2.attackBuffType;
    const resonance2 = selectedCharacterData2.resonance;
    const debuffAverage2 = selectedCharacterData2.debuffAverage;
    const debuffType2 = selectedCharacterData2.debuffType;
    const dischargeTime2 = selectedCharacterData2.dischargeTime;
    const onFieldPassive2 = selectedCharacterData2.onFieldPassive;
    const specialSkillDamage2 = selectedCharacterData2.specialSkillDamage;
    const specialSkillCast2 = selectedCharacterData2.specialSkillCast;
    const specialSkillCooldown2 = selectedCharacterData2.specialSkillCooldown;

    //simulacra 3 data
    const element3 = selectedCharacterData3.element;
    const maxAutoDPS3 = selectedCharacterData3.maxAutoDPS;
    let skillDamage3 = selectedCharacterData3.skillDamage;
    const endurancePerSecond3 = selectedCharacterData3.endurancePerSecond;
    const enduranceDPS3 = selectedCharacterData3.enduranceDPS;
    const dodgeHits3 = selectedCharacterData3.dodgeHits;
    const skillCooldown3 = selectedCharacterData3.skillCooldown;
    const passiveDPS3 = selectedCharacterData3.passiveDPS;
    const damageBuffAverage3 = selectedCharacterData3.damageBuffAverage;
    const buffType3 = selectedCharacterData3.buffType;
    const attackBuffType3 = selectedCharacterData3.attackBuffType;
    let attackBuffAverage3 = selectedCharacterData3.attackBuffAverage; 
    const resonance3 = selectedCharacterData3.resonance;
    const debuffAverage3 = selectedCharacterData3.debuffAverage;
    const debuffType3 = selectedCharacterData3.debuffType;
    const dischargeTime3 = selectedCharacterData3.dischargeTime;
    const onFieldPassive3 = selectedCharacterData3.onFieldPassive;
    const specialSkillDamage3 = selectedCharacterData3.specialSkillDamage;
    const specialSkillCast3 = selectedCharacterData3.specialSkillCast;
    const specialSkillCooldown3 = selectedCharacterData3.specialSkillCooldown;


    const fieldFD = [selectedMatrice1.fieldFD, selectedMatrice2.fieldFD, selectedMatrice3.fieldFD];
    const fieldModN = [selectedMatrice1.fieldModN, selectedMatrice2.fieldModN, selectedMatrice3.fieldModN];
    const passiveDmg = [selectedMatrice1.passiveDmg, selectedMatrice2.passiveDmg, selectedMatrice3.passiveDmg];
    const matricefieldModE = [selectedMatrice1.fieldModE, selectedMatrice2.fieldModE, selectedMatrice3.fieldModE];
    const matriceExtra = [selectedMatrice1.extra, selectedMatrice2.extra, selectedMatrice3.extra];
    const matriceTotalCD = [selectedMatrice1.totalCD, selectedMatrice2.totalCD, selectedMatrice3.totalCD];
    const matriceTotalCR = [selectedMatrice1.totalCR, selectedMatrice2.totalCR, selectedMatrice3.totalCR];
    const matriceAdditional = [selectedMatrice1.additional, selectedMatrice2.additional, selectedMatrice3.additional]

    //matrice 1 data
    const matriceDodgeDmg1 = selectedMatrice1.matriceDodgeDmg;
    const matriceAdditional1 = selectedMatrice1.additional;
    const matriceFieldModN1 = selectedMatrice1.fieldModN;
    const matriceTotalMod1 = selectedMatrice1.totalMod;
    const matricePassiveDmg1 = selectedMatrice1.passiveDmg;
    const matriceFieldModE1 = selectedMatrice1.fieldModE;
    const matriceExtra1 = selectedMatrice1.extra;
    const matriceTotalCR1 = selectedMatrice1.totalCR;
    const matriceTotalCD1 = selectedMatrice1.totalCD;
    const matriceFieldFD1 = selectedMatrice1.fieldFD;
    const matriceglobalMult1 = selectedMatrice1.globalMult;

    //matrice2 data
    const matriceDodgeDmg2 = selectedMatrice2.matriceDodgeDmg;
    const matriceAdditional2 =selectedMatrice2.additional;
    const matriceFieldModN2 =selectedMatrice2.fieldModN;
    const matriceTotalMod2 =selectedMatrice2.totalMod;
    const matricePassiveDmg2 =selectedMatrice2.passiveDmg;
    const matriceFieldModE2 =selectedMatrice2.fieldModE;
    const matriceExtra2 =selectedMatrice2.extra;
    const matriceTotalCR2 =selectedMatrice2.totalCR;
    const matriceTotalCD2 =selectedMatrice2.totalCD;
    const matriceFieldFD2 =selectedMatrice2.fieldFD;
    const matriceglobalMult2 =selectedMatrice2.globalMult;

    const matriceDodgeDmg3 = selectedMatrice3.matriceDodgeDmg;
    const matriceAdditional3 = selectedMatrice3.additional;
    const matriceFieldModN3 = selectedMatrice3.fieldModN;
    const matriceTotalMod3 = selectedMatrice3.totalMod;
    const matricePassiveDmg3 = selectedMatrice3.passiveDmg;
    const matriceFieldModE3 = selectedMatrice3.fieldModE;
    const matriceExtra3 = selectedMatrice3.extra;
    const matriceTotalCR3 = selectedMatrice3.totalCR;
    const matriceTotalCD3 = selectedMatrice3.totalCD;
    const matriceFieldFD3 = selectedMatrice3.fieldFD;
    const matriceglobalMult3 = selectedMatrice3.globalMult;

    const tDodgedmg = selectedTrait.traitDodgedmg;
    const tAdditionalFM = selectedTrait.traitAdditionalFM;
    let tTotalMod = selectedTrait.traitTotalMod;

    const tPassiveDmg = selectedTrait.traitPassiveDmg;
    const tEleDmg = selectedTrait.traitEleDmg;
    const tExtra = selectedTrait.traitExtra;
    
    const fionaMultiplier1 = selectedSkill1.multiplier;
    const fionaTime1 = selectedSkill1.time;
    const fionaCooldown1 = selectedSkill1.cooldown;
    const fionaTotalPercent1 = selectedSkill1.totalPercent;
    const fionaPercentPerSecondPerCooldown1 = selectedSkill1.percentPerSecondPerCooldown;

    const fionaMultiplier2 = selectedSkill2.multiplier;
    const fionaTime2 = selectedSkill2.time;
    const fionaCooldown2 = selectedSkill2.cooldown;
    const fionaTotalPercent2 = selectedSkill2.totalPercent;
    const fionaPercentPerSecondPerCooldown2 = selectedSkill2.percentPerSecondPerCooldown;


    let frostAtk = 21000;
    let voltAtk = 21000;
    let physicalAtk = 21000;
    let fireAtk = 21000;
    let globalResonance = "N/A";

    if (
        ((element1.includes("Ice") && (resonance2.includes("Ice") || resonance3.includes("Ice"))) ||
        (element2.includes("Ice") && (resonance1.includes("Ice") || resonance3.includes("Ice"))) ||
        (element3.includes("Ice") && (resonance1.includes("Ice") || resonance2.includes("Ice"))))
    ) {
        frostAtk = 28000;
        globalResonance = "Ice";
    } 
    else if
        ((element1.includes("Volt") && (resonance2.includes("Volt") || resonance3.includes("Volt"))) ||
        (element2.includes("Volt") && (resonance1.includes("Volt") || resonance3.includes("Volt"))) ||
        (element3.includes("Volt") && (resonance1.includes("Volt") || resonance2.includes("Volt"))))
    {
        voltAtk = 28000;
        globalResonance = "Volt";
    }
    else if
        ((element1.includes("Physical") && (resonance2.includes("Physical") || resonance3.includes("Physical"))) ||
        (element2.includes("Physical") && (resonance1.includes("Physical") || resonance3.includes("Physical"))) ||
        (element3.includes("Physical") && (resonance1.includes("Physical") || resonance2.includes("Physical"))))
    {
        physicalAtk = 28000;
        globalResonance = "Physical";
    }
    else if
        ((element1.includes("Fire") && (resonance2.includes("Fire") || resonance3.includes("Fire"))) ||
        (element2.includes("Fire") && (resonance1.includes("Fire") || resonance3.includes("Fire"))) ||
        (element3.includes("Fire") && (resonance1.includes("Fire") || resonance2.includes("Fire"))))
    {
        fireAtk = 28000;
        globalResonance = "Fire";
    } 
    else if
        ((element1.includes("Altered") && (resonance2.includes("Altered") || resonance3.includes("Altered"))) ||
        (element2.includes("Altered") && (resonance1.includes("Altered") || resonance3.includes("Altered"))) ||
        (element3.includes("Altered") && (resonance1.includes("Altered") || resonance2.includes("Altered"))))
    {
        frostAtk = 28000;
        voltAtk = 28000;
        fireAtk = 28000;
        physicalAtk = 28000;
        globalResonance = "Altered";
    }
    else if(
        (resonance1.includes("All") && resonance2.includes("Fire") || resonance3.includes("Fire")) ||
        (resonance1.includes("All") && resonance2.includes("Physical") || resonance3.includes("Physical")) ||
        (resonance2.includes("All") && resonance1.includes("Fire") || resonance3.includes("Fire")) ||
        (resonance2.includes("All") && resonance1.includes("Physical") || resonance3.includes("Physical")) ||
        (resonance3.includes("All") && resonance1.includes("Fire") || resonance2.includes("Fire")) ||
        (resonance3.includes("All") && resonance1.includes("Physical") || resonance2.includes("Physical"))) 
    {
        frostAtk = 21000;
        voltAtk = 21000;
        fireAtk = 28000;
        physicalAtk = 28000;
        globalResonance = "All";
    } 

    const atkValues = {
        Ice: frostAtk,
        Fire: fireAtk,
        Physical: physicalAtk,
        Volt: voltAtk
    };

    let highestAtk2 = Math.min(frostAtk, fireAtk, physicalAtk, voltAtk);
    let highestAtkName = '';
    let highestAtkValue = -1
    for(const key in atkValues) {
        if(atkValues.hasOwnProperty(key)) {
            if(atkValues[key] > highestAtkValue) {
                highestAtkValue = atkValues[key];
                highestAtkName = key;
            }
        }
    }

    let alteredAtk = Math.max(voltAtk,physicalAtk,fireAtk,frostAtk);

    const elementTypes = [element1, element2, element3];

    const contains2elements = [...new Set(elementTypes)].length >= 2;
    const contains2types = [...new Set(typeValue)].length >= 2;
    const containsFiona = selectedCharacterNames.some(name => name.includes("fiona"));
    const containsFiona1 = selectedCharacterNames.some(name => name.includes("fiona1") || name.includes("fiona3") || name.includes("fiona5") || name.includes("fiona6"));
    const containsFiona5 = selectedCharacterNames.some(name => name.includes("fiona5") || name.includes("fiona6"));
    const containsFiona6 = selectedCharacterNames.some(name => name.includes("fiona6"));
    const containsSamir = selectedCharacterNames.some(name => name.includes("samir"));
    const containsFrigg = selectedCharacterNames.some(name => name.includes("frigg"));
    const containsFrigg3 = selectedCharacterNames.some(name => name.includes("frigg3") || name.includes("frigg5") || name.includes("frigg6"));
    const containsLin = selectedCharacterNames.some(name => name.includes("lin"));
    const containsLin3 = selectedCharacterNames.some(name => name.includes("lin3") || name.includes("lin5") || name.includes("lin6"));
    const containsLin5 = selectedCharacterNames.some(name => name.includes("lin5") || name.includes("lin6"));
    const containsLin6 = selectedCharacterNames.some(name => name.includes("lin6"));
    const containsLinSakiFrigg = selectedCharacterNames.some(name => name.includes("lin") && name.includes("saki") && name.includes("frigg"));
    const containsShiro3 = selectedCharacterNames.some(name => name.includes("shiro3") || name.includes("shiro5") || name.includes("shiro6"));
    const containsRuby5 = selectedCharacterNames.some(name => name.includes("ruby5") || name.includes("ruby6"));
    const containsYulan = selectedCharacterNames.some(name => name.includes("yulan"));
    const containsYulan1 = selectedCharacterNames.some(name => name.includes("martial1") || name.includes("martial3") || name.includes("martial5") || name.includes("martial6") ||
        name.includes("sweeping1") || name.includes("sweeping3") || name.includes("sweeping5") || name.includes("sweeping6"));
    const containsYulanMartial = selectedCharacterNames.some(name => name.includes("martial"));
    const containsMimi = selectedCharacterNames.some(name => name.includes("mimi"));
    const containsMimi1 = selectedCharacterNames.some(name => name.includes("mimi1") || name.includes("mimi3") || name.includes("mimi5") || name.includes("mimi6"));
    const containsMimi3 = selectedCharacterNames.some(name => name.includes("mimi3") || name.includes("mimi5") || name.includes("mimi6"));
    const containsMimi6 = selectedCharacterNames.some(name => name.includes("mimi6"));
    const containsAnna = selectedCharacterNames.some(name => name.includes("anna"));
    const containsAnna1 = selectedCharacterNames.some(name => name.includes("annagas1") || name.includes("annagas3") || name.includes("annagas5") || name.includes("annagas6"));
    const containsAnnaBurn = selectedCharacterNames.some(name => name.includes("annaburn"));
    const containsAnnaBurn5 = selectedCharacterNames.some(name => name.includes("annaburn5") || name.includes("annaburn6"));
    const containsAlyss = selectedCharacterNames.some(name => name.includes("alyss"));
    const containsAlyss1 = selectedCharacterNames.some(name => name.includes("alyss1") || name.includes("alyss3") || name.includes("alyss5") || name.includes("alyss6"));
    const containsAlyss3 = selectedCharacterNames.some(name => name.includes("alyss3") || name.includes("alyss5") || name.includes("alyss6"));
    const containsAlyss6 = selectedCharacterNames.some(name => name.includes("alyss6"));
    const containsIcarus = selectedCharacterNames.some(name => name.includes("icarus"));
    const containsLiuhuo = selectedCharacterNames.some(name => name.includes("liu"));
    const containsGnonno = selectedCharacterNames.some(name => name.includes("gnonno"));
    const containsGnonno6 = selectedCharacterNames.some(name => name.includes("gnonno6"));
    const containsRubilia = selectedCharacterNames.some(name => name.includes("rubilia"));
    const containsRubilia1 = selectedCharacterNames.some(name => name.includes("rubilia1") || name.includes("rubilia3") || name.includes("rubilia5") || name.includes("rubilia6"));
    const containsRubilia3 = selectedCharacterNames.some(name => name.includes("rubilia3") || name.includes("rubilia5") || name.includes("rubilia6"));
    const containsRubilia5 = selectedCharacterNames.some(name => name.includes("rubilia5") || name.includes("rubilia6"));
    const containsRubiliaMat4pc = selectedMatricesNames.some(name => name.includes("rubilia4pc"));
    const containsNemesis = selectedCharacterNames.some(name => name.includes("nemesis"));
    const containsNemesis6 = selectedCharacterNames.some(name => name.includes("nemesis6"));
    const containsLyra = selectedCharacterNames.some(name => name.includes("lyra"));
    const containsLyraMat = selectedMatricesNames.some(name => name.includes("lyra"));
    const containsRubyMat4pc = selectedMatricesNames.some(name => name.includes("ruby4pc"));
    const containsClaudiaMat4pc = selectedMatricesNames.some(name => name.includes("claudia4pc"));
    const containsCobaltMat4pc = selectedMatricesNames.some(name => name.includes("cobalt4pc"));
    const containsAnnabellaMat4pc = selectedMatricesNames.some(name => name.includes("anna4pc"));
    const containsUmi = selectedCharacterNames.some(name => name.includes("umi"));
    const containsUmi1 = selectedCharacterNames.some(name => name.includes("umi1") || name.includes("umi3") || name.includes("umi5") || name.includes("umi6"));
    const containsUmi3 = selectedCharacterNames.some(name => name.includes("umi3") || name.includes("umi5") || name.includes("umi6"));
    const containsClaudia = selectedCharacterNames.some(name => name.includes("claudia"));
    const containsClaudia1 = selectedCharacterNames.some(name => name.includes("claudia1") || name.includes("claudia3") || name.includes("claudia5") || name.includes("claudia6"));
    const containsClaudia5 = selectedCharacterNames.some(name => name.includes("claudia5") || name.includes("claudia6"));
    const containsUmi5 = selectedCharacterNames.some(name => name.includes("umi5") || name.includes("umi6"));
    const containsLan6 = selectedCharacterNames.some(name => name.includes("lan6"));
    const containsLan5 = selectedCharacterNames.some(name => name.includes("lan5") || name.includes("lan6"));
    const containsLan3 = selectedCharacterNames.some(name => name.includes("lan3") || name.includes("lan5") || name.includes("lan6"));
    const containsLan1 = selectedCharacterNames.some(name => name.includes("lan1") || name.includes("lan3") ||name.includes("lan5") || name.includes("lan6"));
    const containsLan = selectedCharacterNames.some(name => name.includes("lan"));
    const containsFenrir = selectedCharacterNames.some(name => name.includes("fenrir"));
    const containsFenrir1 = selectedCharacterNames.some(name => name.includes("fenrir1") || name.includes("fenrir3") || name.includes("fenrir5") || name.includes("fenrir6"));
    const containsFenrir3 = selectedCharacterNames.some(name => name.includes("fenrir3") || name.includes("fenrir5") || name.includes("fenrir6"));
    const containsFenrir6 = selectedCharacterNames.some(name => name.includes("fenrir6"));
    const containsFenrir5 = selectedCharacterNames.some(name => name.includes("fenrir5") || name.includes("fenrir6"));
    const containsCobalt3 = selectedCharacterNames.some(name => name.includes("cobalt3") || name.includes("cobalt5") || name.includes("cobalt6"));
    const containsTsubasa = selectedCharacterNames.some(name => name.includes("tsubasa"));
    const containsTsubasa3 = selectedCharacterNames.some(name => name.includes("tsubasa3") || name.includes("tsubasa5") || name.includes("tsubasa6"));
    const containsTian = selectedCharacterNames.some(name => name.includes("tian"));
    const containsTian1 = selectedCharacterNames.some(name => name.includes("tian1") || name.includes("tian3") || name.includes("tian5") || name.includes("tian6"));
    const containsTian3 = selectedCharacterNames.some(name => name.includes("tian3") || name.includes("tian5") || name.includes("tian6"));
    const containsTian5 = selectedCharacterNames.some(name => name.includes("tian5") || name.includes("tian6"));
    const containsTian6 = selectedCharacterNames.some(name => name.includes("tian6"));
    const containsSaki1 = selectedCharacterNames.some(name => name.includes("saki1") || name.includes("saki3") || name.includes("saki5") || name.includes("saki6"));
    const containsSaki3 = selectedCharacterNames.some(name => name.includes("saki3") || name.includes("saki5") || name.includes("saki6"));
    const containsZeke = selectedCharacterNames.some(name => name.includes("zeke"));
    const containsZeke1 = selectedCharacterNames.some(name => name.includes("zeke1") || name.includes("zeke3") || name.includes("zeke5") || name.includes("zeke6"));
    const containsZeke6 = selectedCharacterNames.some(name => name.includes("zeke6"));
    const annaGas = selectedCharacterNames.some(name => name.includes("annagas"));
    const containsVolt = (element1.includes("Volt") || element2.includes("Volt") || element3.includes("Volt"));
    const containsFrost = (element1.includes("Ice") || element2.includes("Ice") || element3.includes("Ice"));
    const containsAltered = (element1.includes("Altered") || element2.includes("Altered") || element3.includes("Altered"));  
    const containsFlame = (element1.includes("Fire") || element2.includes("Fire") || element3.includes("Fire"));
    const containsDuoFlame = (element1.includes("Fire") && element2.includes("Fire") || element3.includes("Fire")) || (element2.includes("Fire") && element3.includes("Fire")); 
    const containsPhysical = (element1.includes("Physical") || element2.includes("Physical") || element3.includes("Physical"));
    const containsDuoPhysical = (element1.includes("Physical") && element2.includes("Physical") || element3.includes("Physical")) || (element2.includes("Physical") && element3.includes("Physical")); 

    //FDMulti + All Ele full calc's

    let AllEleDmg = 1;
    let FDMulti = 1;
    let friggMatrice2pc = 0;
    let fionaMatrice2pc = 0;
    let claudiaMatrice2pc = 0;
    let linMatrice2pc = 0;
    let linMatrice4pc = 0;
    let sakiMatrice4pc = 0;
    let kingMatrice2pc = 0;
    let lanFrost4pc = 0;
    let lanFlame4pc = 0;
    let lanPhysical4pc = 0;
    let lanVolt4pc = 0;
    let voltCount = 0;
    let frostCount = 0;
    let flameCount = 0;
    let physicalCount = 0;
    let lan2pcDmg = 0;
    let lan2pcAtk = 0;
    let umiMatrice4pc = 0;
    let nemesisMatrice2pc = 0;
    let nemesisMatrice4pc = 0;
    let lyraMatrice2pc = 0;
    let rubiliaMatrice2pc = 0;
    let tianMatrice4pc = 0;
    let tianMatrice2pc = 0;
    let rubyMatrice2pc = 0;
    let zekeMatrice2pc = 0;
    let rubyMatrice4pc = 0;
    let friggMatrice4pc = 0;
    let yulanMatricePassive = 0;
    let alyss2pAdd = 0;
    let resistance = .45;
    let playerResistance = 40000;
    let umiMagicShowValue = 0;
    let totalTime =150;
    let claudiaMatrice4pc = 0;
    const resistShred =
        (annaGas ? 0.1 : 0) +
        (containsFenrir ? 0.2 : 0) +
        (containsUmi5 ? (0.1 * 20) / 30 : 0) +
        (fionaSk1 === "Aqua Shackles" || fionaSk2 === "Aqua Shackles"
            ? sTrait === "Fiona"
            ? 0.1
            : 0.08
            : 0) +
        Math.min(containsLiuhuo ? 0.15 + (containsYulan ? 0.15 : 0.15) : 0.15);
    const resistShredMulti = (1-resistance*(1-resistShred))/(1-resistance);

    //todo : working on spSkillDamagePercent

    let umiMultiplier = (containsUmi1 ? .15 : 0) + 1

    let umiAlt = 0;


    let umiSupportSlot = 0;
    let umiSupportValue = 0;
    let umiSupport = containsUmi3 && umiMagicShowValue < umiSupportValue ? true : false;
    let umiChargeTime = containsUmi5 ? (containsLyra || containsGnonno) ? (containsLyra || containsGnonno) ? 12 : 20 : 18 : 50
    let umiMagicShows = Math.floor(1+(totalTime - 30)/ Math.max((umiSupport ? 17: 30), ((umiSupport ? 4 : 18 ) + umiChargeTime), 1 )); 

      

    for (const characterMatrix of selectedMatricesNames) {
        
        FDMulti += matriceSelections[characterMatrix].globalFD;
        AllEleDmg += matriceSelections[characterMatrix].globalAllE;

        if (characterMatrix.includes("fiona4pc")) {
            if(containsFiona) {
                const fionaMatriceTotalMod = matriceSelections[characterMatrix].totalMod;
                FDMulti += fionaMatriceTotalMod + (alteredAtk / 1000000);
            }
          fionaMatrice2pc += matriceSelections[characterMatrix].additional;
        } else if (characterMatrix.includes("yulan4pc") && containsFrost) {
          const yulanMatriceAdditional = matriceSelections[characterMatrix].additional;  
          const yulanMatriceTotalMod = matriceSelections[characterMatrix].totalMod;
          yulanMatricePassive = matriceSelections[characterMatrix].passiveDmg;
          if (containsYulan) {
            FDMulti += yulanMatriceAdditional;
          } else {
            FDMulti += yulanMatriceAdditional - 0.06;
          }
          if(containsFrost) {
            AllEleDmg += yulanMatriceTotalMod;
          }
        } else if (characterMatrix.includes("haboela4pc")) {
            const habMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            FDMulti += habMatriceGlobal;
        } else if (characterMatrix.includes("lan4pc")) {
            if (containsAltered) {
                const lanMatriceGlobal = matriceSelections[characterMatrix].globalMult;
                if (containsFiona) {
                    if(containsLin) {
                        FDMulti += lanMatriceGlobal;
                    }
                } 
                FDMulti += lanMatriceGlobal;
            } else if (containsFlame) {
                lan2pcDmg = matriceSelections[characterMatrix].additional;
                lan2pcAtk = matriceSelections[characterMatrix].totalMod;
            }  
            let lanMatriceEle = matriceSelections[characterMatrix].extra;
            for(const elementsTotal of elementTypes) {
                if (elementsTotal.includes("Volt")) {
                    voltCount++;
                  }
                  if (elementsTotal.includes("Ice")) {
                    frostCount++;
                  }
                  if (elementsTotal.includes("Fire")) {
                    flameCount++;
                  }
                  if (elementsTotal.includes("Physical")) {
                    physicalCount++;
                  }
            }
            lanVolt4pc = (voltCount * lanMatriceEle);
            lanFrost4pc = (frostCount * lanMatriceEle);
            lanFlame4pc = (flameCount * lanMatriceEle);
            lanPhysical4pc = (physicalCount * lanMatriceEle);
        } else if (characterMatrix.includes("anna4pc")) {
            const annabellaMatriceGlobal = matriceSelections[characterMatrix].additional;
            if(containsDuoFlame) {
                FDMulti += annabellaMatriceGlobal;
            }
            else if(containsFlame && !containsDuoFlame) {
                FDMulti += annabellaMatriceGlobal - matriceSelections[characterMatrix].globalMult;
            }
        } else if (characterMatrix.includes("alyss4pc") && containsAlyss) {
            const alyssMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            alyss2pAdd = matriceSelections[characterMatrix].additional;
            FDMulti += (alyssMatriceGlobal + alyss2pAdd); 
        } else if (characterMatrix.includes("shiro4pc")) {
            const shiroMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            FDMulti += shiroMatriceGlobal;
        } else if (characterMatrix.includes("umi4pc")) {
            umiMatrice4pc = matriceSelections[characterMatrix].totalMod;
            const umiMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            const umiMatriceAdditional = matriceSelections[characterMatrix].additional;
            if(containsDuoPhysical) {
                FDMulti += umiMatriceGlobal + umiMatriceAdditional; 
            }
            else if(containsPhysical && !containsDuoPhysical) {
                FDMulti += umiMatriceAdditional;
            }
        } else if (characterMatrix.includes("fenrir4pc")) {
            const fenrirMatriceGlobal = matriceSelections[characterMatrix].additional;
            if(containsVolt) {
                FDMulti += fenrirMatriceGlobal;
            }
        } else if (characterMatrix.includes("liu4pc")) {
            const liuhuoMatriceGlobal = matriceSelections[characterMatrix].additional;
            const liuhuoMatriceTotalMod = matriceSelections[characterMatrix].totalMod;
            FDMulti += liuhuoMatriceGlobal;
            if (containsFlame) {
                AllEleDmg += liuhuoMatriceTotalMod
                if(containsLiuhuo) {
                    AllEleDmg += 0.055;
                }
            }
        } else if (characterMatrix.includes("zeke4pc")) {
            zekeMatrice2pc = matriceSelections[characterMatrix].additional;
            if(containsZeke) {
                zekeMatrice2pc+= .09
            }
            const zekeMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            FDMulti += zekeMatriceGlobal;
        } else if (characterMatrix.includes("icarus4pc")) {
            const icarusMatriceAdditional = matriceSelections[characterMatrix].additional;
            const icarusMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            if(containsIcarus) {
                AllEleDmg += (icarusMatriceAdditional + icarusMatriceGlobal);
            } else if(containsFrost && (contains2types || contains2elements)) {
                AllEleDmg += (icarusMatriceGlobal + icarusMatriceAdditional);
            } else if(contains2types || contains2elements) {
                AllEleDmg += icarusMatriceAdditional;
            } else if(containsFrost) {
                AllEleDmg += icarusMatriceGlobal;
            }
        } else if (characterMatrix.includes("scylla4pc")) {
            const scyllaMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            if(contains2elements || contains2types) {
                AllEleDmg += scyllaMatriceGlobal;
            }
        } else if (characterMatrix.includes("gnonno4pc")) {
            const gnonnoMatriceAdditional = matriceSelections[characterMatrix].additional;
            const gnonnoMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            if (containsPhysical) {
                AllEleDmg += (gnonnoMatriceAdditional + gnonnoMatriceGlobal);
            }
        } else if (characterMatrix.includes("rubilia")) {
            const rubiliaMatriceGlobal = matriceSelections[characterMatrix].globalMult;
            rubiliaMatrice2pc = matriceSelections[characterMatrix].additional;
            if (containsVolt) {
                AllEleDmg += rubiliaMatriceGlobal;
            }
        } else if (characterMatrix.includes("frigg4pc")) {
            friggMatrice2pc = matriceSelections[characterMatrix].totalMod;
            friggMatrice4pc = matriceSelections[characterMatrix].passiveDmg;
        } else if (characterMatrix.includes("lin4pc")) {
            linMatrice2pc = matriceSelections[characterMatrix].additional;
            if(containsLin) {
                linMatrice4pc = matriceSelections[characterMatrix].totalMod;
            }
        } else if (characterMatrix.includes("saki4pc")) {
            sakiMatrice4pc = matriceSelections[characterMatrix].totalMod;
        } else if (characterMatrix.includes("king")) {
            kingMatrice2pc = matriceSelections[characterMatrix].additional;
        } else if (characterMatrix.includes("ruby")) {
            rubyMatrice2pc = matriceSelections[characterMatrix].totalMod;
            rubyMatrice4pc = ((matriceSelections[characterMatrix].additional * 14) /15);
        } else if (characterMatrix.includes("nemesis")) {
            if(containsNemesis) {
                nemesisMatrice2pc = matriceSelections[characterMatrix].totalMod;
                nemesisMatrice4pc = matriceSelections[characterMatrix].additional * 2;
            }
        } else if (characterMatrix.includes("tian")) {
            tianMatrice4pc = matriceSelections[characterMatrix].additional;
            tianMatrice2pc = 0.06
        } else if (characterMatrix.includes("lyra")) {
            lyraMatrice2pc = matriceSelections[characterMatrix].additional;
        } else if (characterMatrix.includes("claudia")) {
            claudiaMatrice2pc = matriceSelections[characterMatrix].totalMod;
            claudiaMatrice4pc = matriceSelections[characterMatrix].additional;
        } 
    }


    let elementalist = 1;
    if(containsIcarus) {
        if(globalResonance === "All") {
            elementalist += 0.045;
        } else if (element1 === element2 && element2 === element3) {
            elementalist += 0.015;
        } else {
            elementalist += 0.03;
        }
    } else {
        elementalist += 0;
    }

    let universalResonance = 1;
    if(containsGnonno && (globalResonance === "Fire" || globalResonance === "Ice" || globalResonance === "Volt" || globalResonance === "Altered")) {
        universalResonance += .15;
    } 

    let linType = "";
    if(containsLin) {
        if(globalResonance === "All") {
            linType = "N/A";
        } else {
            linType = globalResonance;
        }
    }

    let linUptime = 0;
    if(containsLin) {
        if (selectedCharacterNames.some(name => name.includes("lin3")) || selectedCharacterNames.some(name => name.includes("lin5"))) {
            linUptime += (20 / 30);
        } else if (selectedCharacterNames.some(name => name.includes("lin6"))) {
            linUptime += (20 + 20 * (naturalCharge / 3) * 30 / encounterTime) / 30;
        } else {
            linUptime += (15 / 30);
        }
    }

    let linUptimeCapped;

    if (containsGnonno && containsLin && containsFiona) {
        if (fionaSk1 === "Maelstrom" || fionaSk2 === "Maelstrom") {
            linUptimeCapped = Math.min(0.5, linUptime);
        } else {
            linUptimeCapped = Math.min(1, linUptime);
        }
    } else {
        linUptimeCapped = Math.min(1, linUptime);
    }

    if(selectedCharacterNames[0] === "lin6") {
        attackBuffAverage1 = Math.max(linUptimeCapped, 20/30) * .23; 
    } else if(selectedCharacterNames[1] === "lin6") {
        attackBuffAverage2 = Math.max(linUptimeCapped, 20/30) * .23; 
    } else if(selectedCharacterNames[2] === "lin6") {
        attackBuffAverage3 = Math.max(linUptimeCapped, 20/30) * .23; 
    }


    let fionaMult1, fionaMult2, fionaMult3 = 1;
    let gnnLanMult1, gnnLanMult2, gnnLanMult3 = 1;
    let rubyMult1, rubyMult2, rubyMult3 = 1;


    let rubyWorthHeating = true;
    if(containsLiuhuo) {
        rubyWorthHeating = false;
    }

    if(selectedCharacterNames[0].includes("fiona") && containsUmi) {
       fionaMult1 = 0.5; 
    } else if(selectedCharacterNames[0].includes("fiona") && (containsGnonno && containsLan) || containsRubilia) {
        gnnLanMult1 = 0;
    } else if(selectedCharacterNames[0].includes("ruby") && !rubyWorthHeating) {
        rubyMult1 = 0;
    } 

    if (selectedCharacterNames[1].includes("fiona") && containsUmi) {
        fionaMult2 = 0.5;
    } else if (selectedCharacterNames[1].includes("fiona") && (containsGnonno && containsLan) || containsRubilia) {
        gnnLanMult2 = 0;
    } else if (selectedCharacterNames[1].includes("ruby") && !rubyWorthHeating) {
        rubyMult2 = 0;
    }
      
      // Check for selectedCharacterNames[2]
    if (selectedCharacterNames[2].includes("fiona") && containsUmi) {
        fionaMult3 = 0.5;
    } else if (selectedCharacterNames[2].includes("fiona") && (containsGnonno && containsLan) || containsRubilia) {
        gnnLanMult3 = 0;
    } else if (selectedCharacterNames[2].includes("ruby") && !rubyWorthHeating) {
        rubyMult3 = 0;
    }

    let polyfeather = 4;
    let lanMulti = 1;

    if(containsLan6) {
        polyfeather = 6;
    } 

    if(containsLan5) {
        lanMulti = (1 - resistance * (1 - 0.6)) / (1 - resistance);
    }

    let fieryCrashMult = (1*polyfeather*lanMulti);
    let devGlide = 660;
    let fieryCrash = (64.6 *fieryCrashMult);

    if(selectedCharacterNames[0].includes("lan")) {
        skillDamage1 = devGlide+fieryCrash;
    } else if(selectedCharacterNames[1].includes("lan")) {
        skillDamage2 = devGlide+fieryCrash;
    } else if(selectedCharacterNames[2].includes("lan")) {
        skillDamage3 = devGlide+fieryCrash;
    }


    if(elementTypes[0] == "Ice" && elementTypes[1] == "Ice" && elementTypes[2] == "Ice" && sTrait == "yulan") {
        if(selectedCharacterNames[findCharacterIndex("yulan")].includes("yulansweep")) {
            tTotalMod += .08
        } 
    } if(containsYulan) {
        if(selectedCharacterNames[findCharacterIndex("yulan")].includes("yulanmartial")){
            tTotalMod += .07;
        } 
    } 

    console.log("how", tTotalMod)

    const hp = 1200000;
    const hpBonus = (containsTian1 ? (containsFenrir && !containsTian3 ? 1 : 1.6) : 1);

    if(containsFiona) {
        if(selectedCharacterNames[findCharacterIndex("fiona")].includes("fiona")) {
            damageBuffAvg[findCharacterIndex("fiona")] = (1+((fionaSk1 == "hydro" || fionaSk2 == "hydro") ? (sTrait == "fiona" ? 0.12 : 0.06) : 0) + 
            ((fionaSk1 == "wellspring" || fionaSk2 == "wellspring") ? Math.min(0.09, hp/10000000) + (hp*hpBonus >=1600000 ? 0.07 : 0) : 0))-1
        }
    }

    let frostTrueMulti = (
        (1 + (buffType1 === 'All' || "Ice" === (buffType1) ? damageBuffAvg[0] : 0)) *
        (1 + (buffType2 === 'All' || "Ice" === (buffType2) ? damageBuffAvg[1] : 0)) *
        (1 + (buffType3 === 'All' || "Ice" === (buffType3) ? damageBuffAvg[2] : 0)) *
        (1 + tTotalMod + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
        (containsMimi6 ? 1.1 : 1) *
        (1 + (containsAlyss6 ? 0.12 : 0)) *
        elementalist *
        universalResonance    
        );


    let frostAttack = (
        (1 + (attackBuffType1 === 'All' || attackBuffType1 === "Ice" ? attackBuffAverage1 : 0) +
             (attackBuffType2 === 'All' || attackBuffType2 === "Ice" ? attackBuffAverage2 : 0) +
             (globalResonance === 'Altered' ? 0.2 : 0) +
             (attackBuffType3 === 'All' || attackBuffType3 === "Ice" ? attackBuffAverage3 : 0) +
             (globalResonance === "Ice" || globalResonance === "All" ? 0.15 : 0))
             + friggMatrice2pc + linMatrice2pc + fionaMatrice2pc 
             + (linType === "N/A" ? 0.15 * linUptimeCapped : 0) + (linType === "Ice" ? 0.1 * linUptimeCapped : 0)
              
    );

    console.log( (buffType3 === 'All' || "Ice" === (buffType3) ? damageBuffAvg[2] : 0))
      
    console.log("yep", (1 + (attackBuffType1 === 'All' || attackBuffType1 === "Ice" ? attackBuffAverage1 : 0) +
    (attackBuffType3 === 'All' || attackBuffType3 === "Ice" ? attackBuffAverage3 : 0) +
    (globalResonance === "Ice" || globalResonance === "All" ? 0.15 : 0)))


    let frostDebuff =
    (1 + (debuffType1 === "All" || debuffType1 === "Ice" ? debuffAverage1 : 0)) *
    (1 + (debuffType2 === "All" || debuffType2 === "Ice" ? debuffAverage2 : 0)) *
    (1 + (debuffType3 === "All" || debuffType3 === "Ice" ? debuffAverage3 : 0)) *
    (1 + sakiMatrice4pc);

    const atkWarning = (highestAtkName !== element1) && (highestAtkName !== element2) && (highestAtkName !== element3) && (highestAtkValue > highestAtk2);

    let frostGearMod = (frostAtk / (atkWarning ? (("Ice") === highestAtkName ? highestAtkValue : highestAtk2) : Math.max(fireAtk, voltAtk, physicalAtk, frostAtk)));

    let normalMulti = (1 + linMatrice4pc + kingMatrice2pc);

    let frostEleDmg = ((1 + lanFrost4pc ) + (alyss2pAdd ? 0.03 : 0));

    let frostResistMulti = (1 - resistance * (1 - (
        (containsFenrir ? 0.2 : 0) +
        ((fionaSk1 === "aquashackles" || fionaSk2 === "aquashackles") ? (sTrait === "fiona" ? 0.1 : 0.08) : 0) +
        (containsYulan ? 0.15 : 0)
      ))) / (1 - resistance);




      let flameTrueMulti = (
        (1 + ((buffType1 === 'All' || buffType1 === 'Fire' || buffType1 === 'Physical / Fire') ? damageBuffAvg[0] : 0)) *
        (1 + ((buffType2 === 'All' || buffType2 === 'Fire' || buffType2 === 'Physical / Fire') ? damageBuffAvg[1] : 0)) *
        (1 + ((buffType3 === 'All' || buffType3 === 'Fire' || buffType3 === 'Physical / Fire') ? damageBuffAvg[2] : 0)) *
        (1 + tTotalMod + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
        (containsMimi6 ? 1.1 : 1) *
        elementalist *
        universalResonance    
    );


    let flameAttack = (
        (1 + (attackBuffType1 === 'All' || attackBuffType1 === "Fire" ? attackBuffAverage1 : 0) +
             (attackBuffType2 === 'All' || attackBuffType2 === "Fire" ? attackBuffAverage2 : 0) +
             (globalResonance === 'Altered' ? 0.2 : 0) +
             (attackBuffType3 === 'All' || attackBuffType3 === "Fire" ? attackBuffAverage3 : 0) +
             (globalResonance === "Fire" || globalResonance === "All" ? 0.15 : 0))
             + lan2pcAtk + linMatrice2pc + fionaMatrice2pc + zekeMatrice2pc + rubyMatrice2pc 
             + (linType === "N/A" ? 0.15 * linUptimeCapped : 0) 
              
    );

    let flameDebuff =
    (1 + (debuffType1 === "All" || debuffType1 === "Fire" ? debuffAverage1 : 0)) *
    (1 + (debuffType2 === "All" || debuffType2 === "Fire" ? debuffAverage2 : 0)) *
    (1 + (debuffType3 === "All" || debuffType3 === "Fire" ? debuffAverage3 : 0));

    let flameGearMod = (fireAtk / (atkWarning ? (("Fire") === highestAtkName ? highestAtkValue : highestAtk2) : Math.max(fireAtk, voltAtk, physicalAtk, frostAtk)));

    let flameEleDmg = (1 + lanFlame4pc + lan2pcDmg + rubyMatrice4pc);

    let flameResistMulti = (1 - resistance * (1 - (
        (annaGas ? 0.1 : 0) + 
        (containsFenrir ? 0.2 : 0) +
        ((fionaSk1 === "aquashackles" || fionaSk2 === "aquashackles") ? (sTrait === "fiona" ? 0.1 : 0.08) : 0) +
        (containsLiuhuo ? 0.15 : 0)
      ))) / (1 - resistance);

    let voltSense = Math.max(0, (voltCount - 1) * (containsTian6 ? 0.1 : 0.06) * 25 / 30);

    let voltTrueMulti = (
        (1 + (buffType1 === 'All' || "Volt" === (buffType1) ? damageBuffAvg[0] : 0)) *
        (1 + (buffType2 === 'All' || "Volt" === (buffType2) ? damageBuffAvg[1] : 0)) *
        (1 + (buffType3 === 'All' || "Volt" === (buffType3) ? damageBuffAvg[2] : 0)) *
        (linType === 'Volt' ? 1 + 0.1 * linUptimeCapped : 1) *
        (1 + tTotalMod + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
        (containsMimi6 ? 1.1 : 1) *
        (1 + voltSense) *
        elementalist *
        universalResonance    
        );

    console.log()

    let voltAttack = (
        (1 + (attackBuffType1 === 'All' || attackBuffType1 === "Volt" ? attackBuffAverage1 : 0) +
             (attackBuffType2 === 'All' || attackBuffType2 === "Volt" ? attackBuffAverage2 : 0) +
             (globalResonance === 'Altered' ? 0.2 : 0) +
             (attackBuffType3 === 'All' || attackBuffType3 === "Volt" ? attackBuffAverage3 : 0) +
             (globalResonance === "Volt" || globalResonance === "All" ? 0.15 : 0)) +
             (linType === 'N/A' ? 0.15 * linUptimeCapped : 0) +
             linMatrice2pc + fionaMatrice2pc + rubiliaMatrice2pc + nemesisMatrice2pc          
    );

    let voltDebuff =
    (1 + (debuffType1 === "All" || debuffType1 === "Volt" ? debuffAverage1 : 0)) *
    (1 + (debuffType2 === "All" || debuffType2 === "Volt" ? debuffAverage2 : 0)) *
    (1 + (debuffType3 === "All" || debuffType3 === "Volt" ? debuffAverage3 : 0));

    let voltGearMod = (voltAtk / (atkWarning ? (("Volt") === highestAtkName ? highestAtkValue : highestAtk2) : Math.max(fireAtk, voltAtk, physicalAtk, frostAtk)));

    let voltEleDmg = (1+ tianMatrice4pc + tianMatrice2pc + lanVolt4pc);

    let voltResistMulti = (1 - resistance * (1 - (
        (containsFenrir ? 0.2 : 0) +
        ((fionaSk1 === "aquashackles" || fionaSk2 === "aquashackles") ? (sTrait === "fiona" ? 0.1 : 0.08) : 0) 
      ))) / (1 - resistance);


    let physicalTrueMulti = (
        (1 + (buffType1 === 'All' || buffType1 === "Physical" || "Physical / Fire"=== (buffType1) ? damageBuffAvg[0] : 0)) *
        (1 + (buffType2 === 'All' || buffType2 === "Physical" || "Physical / Fire" === (buffType2) ? damageBuffAvg[1] : 0)) *
        (1 + (buffType3 === 'All' || buffType3 === "Physical" || "Physical / Fire" === (buffType3) ? damageBuffAvg[2] : 0)) *
        (1 + tTotalMod + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
        (containsMimi6 ? 1.1 : 1) *
        elementalist *
        universalResonance    
        );

        let physicalAttack = (
            (1 +
                (attackBuffType1 === 'All' || attackBuffType1 === 'Physical' ? attackBuffAverage1 : 0) +
                (attackBuffType2 === 'All' || attackBuffType2 === 'Physical' ? attackBuffAverage2 : 0) +
                (globalResonance === 'Altered' ? 0.2 : 0) + // Define the 'resonance' variable
                (attackBuffType3 === 'All' || attackBuffType3 === 'Physical' ? attackBuffAverage3 : 0) +
                (globalResonance === 'Physical' || globalResonance === 'All' ? 0.15 : 0)) +
            (linType === 'N/A' ? 0.15 * linUptimeCapped : 0) +
            linMatrice2pc + fionaMatrice2pc + zekeMatrice2pc
        );

    let physicalDebuff =
    (1 + (debuffType1 === "All" || debuffType1 === "Physical" ? debuffAverage1 : 0)) *
    (1 + (debuffType2 === "All" || debuffType2 === "Physical" ? debuffAverage2 : 0)) *
    (1 + (debuffType3 === "All" || debuffType3 === "Physical" ? debuffAverage3 : 0));

    let physicalGearMod = (sTrait === "zeke" ? highestAtkValue : physicalAtk) / 
    (atkWarning ? (("Physical" || "Physical / Fire") === highestAtkName ? highestAtkValue : highestAtk2) : Math.max(fireAtk, voltAtk, physicalAtk, frostAtk));

    let physicalEleDmg = (1+ umiMatrice4pc + lanPhysical4pc);

    let physicalResistMulti = (1 - resistance * (1 - ((containsFenrir ? 0.2 : 0) + (containsUmi5 ? 0.1 * 20 / 30 : 0) + 
    (fionaSk1 === "Aqua Shackles" || fionaSk2 === "Aqua Shackles" ? (sTrait === "Fiona" ? 0.1 : 0.08) : 0)))) / (1 - resistance);

    let alteredTrueMulti = (
        (1 + (buffType1 === 'All' || "Altered" === (buffType1) ? damageBuffAvg[0] : 0)) *
        (1 + (buffType2 === 'All' || "Altered" === (buffType2) ? damageBuffAvg[1] : 0)) *
        (1 + (buffType3 === 'All' || "Altered" === (buffType3) ? damageBuffAvg[2] : 0)) *
        (1 + tTotalMod + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
        (containsMimi6 ? 1.1 : 1) *
        elementalist *
        universalResonance    
        );

    let alteredAttack = Math.max(physicalAttack, voltAttack, frostAttack, flameAttack);

    let alteredDebuff =
    (1 + (debuffType1 === "All" || debuffType1 === "Altered" ? debuffAverage1 : 0)) *
    (1 + (debuffType2 === "All" || debuffType2 === "Altered" ? debuffAverage2 : 0)) *
    (1 + (debuffType3 === "All" || debuffType3 === "Altered" ? debuffAverage3 : 0));

    let alteredGearMod = Math.max(physicalGearMod, voltGearMod, frostGearMod, flameGearMod);

    let alteredEleDmg = 1;

    let alteredResistMulti = (1 - resistance * (1 - (
        (containsFenrir ? 0.2 : 0) +
        ((fionaSk1 === "aquashackles" || fionaSk2 === "aquashackles") ? (sTrait === "fiona" ? 0.1 : 0.08) : 0) 
      ))) / (1 - resistance);
      

    const baseMultResults = [];

    for (const elementList of elementTypes) {
        let baseMult = 0;
      
        switch (elementList) {
          case "Fire":
            baseMult = (flameTrueMulti * flameAttack * flameDebuff * flameGearMod * normalMulti * flameResistMulti * (flameEleDmg + AllEleDmg - 1)) * FDMulti;
            break;
          case "Ice":
            baseMult = (frostTrueMulti * frostAttack * frostDebuff * frostGearMod * normalMulti * frostResistMulti * (frostEleDmg + AllEleDmg - 1)) * FDMulti;
            break;
          case "Volt":
            baseMult = (voltTrueMulti * voltAttack * voltDebuff * voltGearMod * normalMulti * voltResistMulti * (voltEleDmg + AllEleDmg - 1)) * FDMulti;
            break;
          case "Physical":
            baseMult = (physicalTrueMulti * physicalAttack * physicalDebuff * physicalGearMod * normalMulti * physicalResistMulti * (physicalEleDmg + AllEleDmg - 1)) * FDMulti;
            break;
          case "Altered":
            baseMult = (alteredTrueMulti * alteredAttack * alteredDebuff * alteredGearMod * normalMulti * alteredResistMulti * (alteredEleDmg + AllEleDmg - 1)) * FDMulti;
            break;
          default:
            // Handle cases where the element is not recognized
            break;
        }
      
        baseMultResults.push(baseMult);
      }

    

    function onfieldEleDmg(characterIndex) {
        const characterName = selectedMatricesNames[characterIndex];
    
        if (characterName.includes("lyra") && !containsPhysical) {
            return 1;
        }
    
        
        switch (elementTypes[characterIndex]) {
            
            case "Fire":
                return matricefieldModE[characterIndex] + flameEleDmg + AllEleDmg -1;
            case "Ice":
                return matricefieldModE[characterIndex] + frostEleDmg + AllEleDmg -1;
            case "Volt":
                return matricefieldModE[characterIndex] + voltEleDmg + AllEleDmg-1;
            case "Physical":
                return matricefieldModE[characterIndex] + physicalEleDmg + AllEleDmg-1;
            case "Altered":
                return matricefieldModE[characterIndex] + alteredEleDmg + AllEleDmg-1;
            default:
                // Handle cases where the character's element is not recognized
                return 0;
        }
    }

    function helperCalcOnfieldEleDmg(characterIndex) {
        switch (elementTypes[characterIndex]) {
            case "Fire":
                return flameEleDmg + AllEleDmg -1;
            case "Ice":
                return frostEleDmg + AllEleDmg -1;
            case "Volt":
                return voltEleDmg + AllEleDmg -1;
            case "Physical":
                return physicalEleDmg + AllEleDmg -1;
            case "Altered":
                return alteredEleDmg + AllEleDmg -1;
            default:
                // Handle cases where the character's element is not recognized
                return 0;
        }
    }


    const calcOnfieldEleDmg = [(onfieldEleDmg(0)/helperCalcOnfieldEleDmg(0)), (onfieldEleDmg(1)/helperCalcOnfieldEleDmg(1)), (onfieldEleDmg(2)/helperCalcOnfieldEleDmg(2))];
    

    function calcActiveMultiplier(characterIndex) {
        let attackBase = 0;
        if(elementTypes[characterIndex] === "Fire") {
            attackBase = flameAttack;
        } else if(elementTypes[characterIndex] === "Ice") {
            attackBase = frostAttack;
        } else if(elementTypes[characterIndex] === "Physical") {
            attackBase = physicalAttack;
        } else if(elementTypes[characterIndex] === "Volt") {
            attackBase = voltAttack;
        } else if(elementTypes[characterIndex] === "Altered") {
            attackBase = alteredAttack;
        }
        const characterName = selectedMatricesNames[characterIndex];

        return (1*((sTrait === "Annabella" && annaGas && characterName.includes("annabella") ) ? 1.3 : 1) *
        ((FDMulti + fieldFD[characterIndex]) * ((selectedCharacterNames[characterIndex].includes("samir") ? 1 : 1)/FDMulti)) *
        (normalMulti + (fieldModN[characterIndex])) / normalMulti)  * ((attackBase + (characterName.includes("lyra") ? lyraMatrice2pc : 0))/ attackBase);
      }


     
    let critRate = .7;
    let critDamage = .5;
    const bonusCritRate = (matriceTotalCD[0] + matriceTotalCD[1] + matriceTotalCD[2]);
    const bonusCritDamage = (matriceTotalCD[0] + matriceTotalCD[1] + matriceTotalCD[2]);
    let critMultiplierForm = (critRate*(1+critDamage) + (1-(critRate)));


    function critMutliplier(characterIndex) {
        const characterName = selectedMatricesNames[characterIndex];
        const matriceName = matriceSelections[characterName];

       
        const isScyllaOrCrow = characterName.includes("scylla") || characterName.includes("crow");

        const result = isScyllaOrCrow
        ? (
            (1 + (characterName.includes("crow") ? 0.6 : 1) *
            Math.min(critRate + onfieldCritRate[characterIndex] + bonusCritRate + (containsFenrir6 ? 0.18*fenrirA6Uptime() : 0), 1) *
            (critDamage + bonusCritDamage + matriceName.additional) +
            (characterName.includes("crow")
                ? (1 - 0.6) * (critRate + onfieldCritRate[characterIndex] + bonusCritRate + (containsFenrir6 ? 0.18*fenrirA6Uptime() : 0)) * (critDamage + bonusCritDamage)
                : 0)
            ) / (1 + critDamage * critRate)
            )
        : (
            Math.min(1, critRate + onfieldCritRate[characterIndex] + bonusCritRate + (containsFenrir6 ? 0.18*fenrirA6Uptime() : 0)) *
            (1 + critDamage + bonusCritDamage) +
            (1 - Math.min(1, critRate + onfieldCritRate[characterIndex] + bonusCritRate + (containsFenrir6 ? 0.18*fenrirA6Uptime() : 0)))
            ) / critMultiplierForm;

        return finalResult = (result < 1 ? 1 : result);

    }

    console.log(Math.min(1, critRate + onfieldCritRate[0] + bonusCritRate + (containsFenrir6 ? 0.18*fenrirA6Uptime() : 0)) *
    (1 + critDamage + bonusCritDamage) +
    (1 - Math.min(1, critRate + onfieldCritRate[0] + bonusCritRate + (containsFenrir6 ? 0.18*fenrirA6Uptime() : 0)))
    )

    console.log(critMultiplierForm)

    let maxAutoValue = 0;
      



    function calcMaxAutoDps(characterIndex) {
        return maxAutoDpsValue[characterIndex] * ((baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * calcActiveMultiplier(characterIndex)) 
        * critMutliplier(characterIndex)) * (containsClaudia ? normalMulti + claudiaMatrice2pc / normalMulti : 1)
    }

    if(containsMimi) {
        enduranceDpsValue[findCharacterIndex("mimi")] *= (normalMulti+.3/normalMulti)
    }

    function calcEnduranceDps(characterIndex) {
        return enduranceDpsValue[characterIndex] * ((baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * calcActiveMultiplier(characterIndex)) 
        * critMutliplier(characterIndex)) * (containsClaudia ? normalMulti + claudiaMatrice2pc / normalMulti : 1)
    }

    function calcDodgeDamage(characterIndex) {
        return dodgeDamageValue[characterIndex] * (baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * 
            calcActiveMultiplier(characterIndex) * critMutliplier(characterIndex))
    }

    function calcDodgeDps(characterIndex) {
        return damagePerDodgeValue[characterIndex] * (baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * 
            calcActiveMultiplier(characterIndex) * critMutliplier(characterIndex))
    }


    function calcTotalMulti(characterIndex) {
        return baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * calcActiveMultiplier(characterIndex) * critMutliplier(characterIndex) * calcAdditionalMulti(characterIndex);
    }

    function calcPassiveModBalanced() {
        const term1 = 1;
        const term2 = (calcOnfieldEleDmg[0] * calcActiveMultiplier(0) * critMutliplier(0) - 1) * 0.333;
        const term3 = (calcOnfieldEleDmg[1] * calcActiveMultiplier(1) * critMutliplier(1) - 1) * 0.333;
        const term4 = (calcOnfieldEleDmg[2] * calcActiveMultiplier(2) * critMutliplier(2) - 1) * 0.333;
    
        const result = term1 + term2 + term3 + term4;
    
        return result;
    }


    function fieldTime(characterIndex) {
        if(characterIndex == 0) {
            return (totalTimeSkillDmg(characterIndex) + totalTimeDischarge(characterIndex) + enduranceRevisedTime() + totalTimeDodge() +
            basicDmgRevisedTime() + basicDmgTotalTimePriority() + reqUptimeTotalTime(characterIndex) + reqUptimeTotalTimeExtra(characterIndex) + 
            totalTimeSpSkill(characterIndex))/totalTime 
        } else if(characterIndex == 1) {
            return (totalTimeSkillDmg(characterIndex) + totalTimeDischarge(characterIndex) + totalTimeDodge2() +
            basicDmgTotalTimePriority() + reqUptimeTotalTime(characterIndex) + reqUptimeTotalTimeExtra(characterIndex) + 
            totalTimeSpSkill(characterIndex))/totalTime 
        } else if(characterIndex == 2) {
            return (totalTimeSkillDmg(characterIndex) + totalTimeDischarge(characterIndex) + totalTimeDodge3() +
            basicDmgTotalTimePriority2() + reqUptimeTotalTime(characterIndex) + reqUptimeTotalTimeExtra(characterIndex) + 
            totalTimeSpSkill(characterIndex))/totalTime 
        } else {
            return 0
        }
    }


    function calcAdditionalMulti(characterIndex) {
        return (((umiSupportValue && selectedCharacterNames[characterIndex].includes("umi") == 0 && elementTypes[characterIndex] == "Physical") ? 1.25 : 1)) * 
        1+(((containsFiona) && (fionaSk1 === "maelstrom" || fionaSk2 === "maelstrom") && (Math.max(calcMaxAutoDps(characterIndex), calcEnduranceDps(characterIndex)) == 
        Math.max(calcMaxAutoDps(0), calcMaxAutoDps(1), calcMaxAutoDps(2), calcEnduranceDps(0), calcEnduranceDps(1), calcEnduranceDps(2)))) ? 
        ((sTrait === "fiona" && elementTypes[characterIndex] === "Physical") ? 0.61 : 0.28 * (selectedCharacterNames[characterIndex].includes("martial") 
        ? 0.78 : selectedCharacterNames[characterIndex].includes("gnonno") ? 0.68 : selectedCharacterNames[characterIndex].includes("umi") ? 0 : 0.7)): 0);
    }

    function calcDischargeMulti(characterIndex) {
        const result = (
            (fieldModN[characterIndex] + ((selectedCharacterNames[characterIndex].includes("lin5") || selectedCharacterNames[characterIndex].includes("lin6")) ? 0.15 * linUptimeCapped : 0) 
            + normalMulti + (dischargeMulti() - 1)) /
            (fieldModN[characterIndex] + normalMulti) *
            (FDMulti + (claudMatSlot(characterIndex) && calcClaudEligible(characterIndex) ? claudiaMatrice2pc : 0)) /
            FDMulti
          );
        return result;
    }

    function calcPriority() {
        // Create an array of indices to keep track of the original order
        const indices = [0, 1, 2];
    
        // Sort the indices based on bonusDmgSkill values (in descending order)
        indices.sort((a, b) => bonusDmgSkill(b) - bonusDmgSkill(a));
    
        // Create an array to store the priority values based on the sorted order
        const sortedPriorities = Array(3).fill(0);
    
        // Assign priorities based on the sorted order
        for (let i = 0; i < indices.length; i++) {
            sortedPriorities[indices[i]] = i + 1; // Add 1 to make it 1-based
        }
    
        return sortedPriorities;
    }

    const priorities = calcPriority()


    function rawPriorityDischarge(characterIndex) {
        const characterName = selectedCharacterNames[characterIndex];
        const characterBDPS = selectedCharacterNames.map((_, index) => bDpsDischarge(index));
    
        // Find Rubilia's index and BDPS
        const rubiliaBDPSIndex = selectedCharacterNames.findIndex(name => name.includes("rubilia"));
    
        if (rubiliaBDPSIndex === -1) {
            // Rubilia doesn't exist, calculate priorities normally
            const sortedIndices = characterBDPS
                .map((_, index) => index)
                .sort((a, b) => characterBDPS[b] - characterBDPS[a]);
            
            return sortedIndices.findIndex(index => index === characterIndex) + 1;
        } else {
            // Rubilia exists, assign the highest priority to Rubilia
            if (characterIndex === rubiliaBDPSIndex) {
                return 1;
            } else {
                // Assign other character priorities based on BDPS
                const sortedIndices = characterBDPS
                    .map((_, index) => index)
                    .filter(index => index !== rubiliaBDPSIndex)
                    .sort((a, b) => characterBDPS[b] - characterBDPS[a]);
                
                return sortedIndices.findIndex(index => index === characterIndex) + 2;
            }
        }
    }
    
    const sortedCharacterPriority = calcPriority()
    const priority = [sortedCharacterPriority[0], sortedCharacterPriority[1], sortedCharacterPriority[2]];


    function characterMatriceKey(characterIndex, returnKey = false) {
        // Check if the characterIndex is valid
        if (characterIndex >= 0 && characterIndex < selectedCharacterNames.length) {
            // Create an empty object
            var characterMatriceCombine = {};
    
            // Add a key-value pair to the object
            characterMatriceCombine[selectedCharacterNames[characterIndex]] = selectedMatricesNames[characterIndex];
    
            // Return the value if specified, otherwise return the key
            if (returnKey) {
                return selectedCharacterNames[characterIndex];
            } else {
                return selectedMatricesNames[characterIndex];
            }
        } else {
            // Handle invalid characterIndex
            return null; // You can return null or an error message, depending on your use case
        }
    }


    function calcSakiDelay() {
        for(let i = 0; i < 3; i++) {
            if(priority[i] == 3) {
                return skillCast[i]
            }
        }
    }

    function calcSkillCDOrder(arr) {
        if (arr.length === 0) {
            return null; // Return null for an empty array
        }
    
        // Create a copy of the original array
        const sortedArr = [...arr];
    
        // Sort the copied array in ascending order
        sortedArr.sort((a, b) => a - b);
    
        // Find the middle index
        const middleIndex = Math.floor(sortedArr.length / 2);
    
        // Return the middle element (which is now the middle largest)
        return sortedArr[middleIndex];
    }

    let sakiDelay = (skillCast[0] + skillCast[1] + skillCast[2]) - calcSakiDelay()


    function claudMatSlot(characterIndex) {
        if(containsClaudiaMat4pc) {
            if(characterMatriceKey(characterIndex).includes("claudia")) {
                return 1;
            }
        } else {
            return 0;
        }
    }

    function calcDodgeMatrix() {
        return 0 //I will implement this eventually
    }

    function calcDodgeBonus(characterIndex) {
        return selectedCharacterNames[characterIndex].includes("shiro") ? 24.2 + (characterMatriceKey(characterIndex).includes("cobalt") 
        ? 0 : calcDodgeMatrix()) * 60 * (selectedCharacterNames[characterIndex].includes("shiro") ? 1 : 1.3) : 0
    }

    function calcClaudCDR() {
        let claudiaCDR = 0;
        for(let i = 0; i<3; i++) {
            const characterName = selectedMatricesNames[i];
            claudiaCDR += (characterName.includes("claudia4pc")) ? matriceExtra[i] : 0;  
        }
        return claudiaCDR;
    }

    function totalTimeSpSkill(characterIndex) {
        return totalCastsSpSkill(characterIndex) * specialSkillCast[characterIndex];
    }

    function buffedDmgSpSkill(characterIndex) {
        return pbDmgSpSkill(characterIndex) * baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * calcActiveMultiplier(characterIndex) * critMutliplier(characterIndex) *
        calcSkillMulti(0) * calcAdditionalMulti(0);
    }

    function calcFenrirCloneUptime() {
        let fenrirCloneUptime = 0;
        for(let i = 0; i<3; i++) {
            fenrirCloneUptime += (15 * (selectedCharacterNames[i].includes("fenrir") ? adjCastsSkillDmg(i) : 0))/totalTime;
        }
        return fenrirCloneUptime;
    }


    const fenrirCloneShred = ((1/(1-resistance)) / resistShredMulti) * Math.min(1, calcFenrirCloneUptime()) + resistShredMulti * (1-Math.min(1, calcFenrirCloneUptime()));

    function pbDmgSpSkill(characterIndex) {
        return specialSkillDmg[characterIndex];
    }

    function totalCastsSpSkill(characterIndex) {
        if (selectedCharacterNames[characterIndex].includes("fenrir")) {
            return adjCastsSkillDmg(characterIndex) * (containsSaki1 ? 2 : 4);
          } else if (selectedCharacterNames[characterIndex].includes("icarus")) {
            return calcIcarusDischarge() * 2;
          } else if (selectedCharacterNames[characterIndex].includes("fiona")) {
            if (fionaSk2 === "torrential") {
              return totalTime / fionaTorrents();
            } else {
              return totalTime / specialSkillCooldown[characterIndex];
            }
          } else {
            return 0;
          }
    }


    
    function extraMultiBonusDmg(characterIndex) {
        return ((selectedCharacterNames[characterIndex].includes("ruby3") || selectedCharacterNames[characterIndex].includes("ruby5") || selectedCharacterNames[characterIndex].includes("ruby6"))
        ? .75 : .45 * (containsLan1 ? 1.3 : 1)) * (selectedCharacterNames[characterIndex].includes("shiro6") ? ((1+critDamage) * critRate + (1-critRate)) : 1) * 
        (selectedCharacterNames[characterIndex].includes("samir3") || selectedCharacterNames[characterIndex].includes("samir5") || selectedCharacterNames[characterIndex].includes("samir6")) ?
        (1+(Math.min(naturalCharge*11/totalTime, 1) * Math.min(critRate+.4,1)*critDamage+(1-Math.min(naturalCharge*11/totalTime,1)) * critRate*critDamage)) / (1+critRate*critDamage) : 1
    }

    function totalCastsBonusDmg(characterIndex) {
        return (selectedCharacterNames[characterIndex].includes("ruby") ? 0.75 * (containsAnna1 ? 1 : 1) : 
        (selectedCharacterNames[characterIndex].includes("king") || selectedCharacterNames[characterIndex].includes("frigg5") || selectedCharacterNames[characterIndex].includes("frigg6")) 
        ? ShatterPerEncounter : ((selectedCharacterNames[characterIndex].includes("tian") || selectedCharacterNames[characterIndex].includes("alyss") || selectedCharacterNames[characterIndex].includes("fenrir")
        || selectedCharacterNames[characterIndex].includes("lan") || selectedCharacterNames[characterIndex].includes("rubilia") || selectedCharacterNames[characterIndex].includes("yulan")) ? 1 : 
        (selectedCharacterNames[characterIndex].includes("zeke")) ? zekeA1Total : maxCastsSkillDmg(characterIndex)));
    }

    const chargeBurns = naturalCharge * 580;
    const cobaltBurn3 = (naturalCharge * 18 > totalTime) ? 1 : (naturalCharge * 18/totalTime)* 560 *(totalTime/10);
    const cobaltBurn5 = (600 * totalTime/6);
    const cobaltBurn6 = (870*totalTime/6 + 1566 * totalTime/20);
    const cobalt4pcBurn = (192 * totalTime/6);
    const kingBurn1 = (3240 * ShatterPerEncounter);
    const annabellaBurn = (1575 * totalTime/15);
    const burnMod = (containsAnnaBurn ? 1.2 : 1) + (containsAnnaBurn5 ? 0.1 : 0);
    
    function actualBurns() {
        let actualBurn = 0;
        for(let i = 0; i<3; i++) {
            actualBurn = chargeBurns + (selectedCharacterNames[i].includes("cobalt6") ? cobaltBurn6 : 0) + (selectedCharacterNames[i].includes("cobalt5") ? cobaltBurn5 : 0) +
            (selectedCharacterNames[i].includes("cobalt3") ? cobaltBurn3 : 0) + (selectedCharacterNames[i].includes("king") ? kingBurn1 : 0) + (characterMatriceKey(i).includes("cobalt4pc") ? cobalt4pcBurn : 0) +
            (selectedCharacterNames[i].includes("annaburn") ? annabellaBurn : 0) + (selectedCharacterNames[i].includes("lan") ? 420 : 0) + (selectedCharacterNames[i].includes("liu") ? 1200 : 0)
        }
        return actualBurn;
    }

    const eeCount = (containsNemesis ? 1 : 0) + (containsFenrir ? 1.5 : 2);
    const avgHp = 1;

    const skillCount = (Math.floor(maxCastsSkillDmg(0) + maxCastsSkillDmg(1) + maxCastsSkillDmg(2), 1));

    function fenrirA1Dodges() {
        let initialVal = (containsFenrir1 && containsSaki1) ? 2 : 4;
        let conditional = adjCastsSkillDmg(findCharacterIndex("fenrir"));
      
        // Ensure the denominator is never zero
        let denominator = containsMimi ? 4 : (containsRubilia ? 2 : 1);
      
        return initialVal * (conditional / denominator);
    }

    function physicalFieldTime() {
        let physicalField = 0;
        for(let i=0; i<3; i++) {
            physicalField += (elementTypes[i] == "Physical" ? fieldTime(i) : 0)
        }
        return physicalField;
    }


    function voltFieldTime() {
        let voltField = 0;
        for(let i=0; i<3; i++) {
            voltField += (elementTypes[i] == "Volt" ? fieldTime(i) : 0)
        }
        return voltField;
    }

    function voltPassiveMod() {
        const voltPassive1 = (elementTypes[0] === "Volt") ? (calcActiveMultiplier(0) * critMutliplier(0) - 1) * (fieldTime(0) / voltFieldTime()) : 0;
        const voltPassive2 = (elementTypes[1] === "Volt") ? (calcActiveMultiplier(1) * critMutliplier(1) - 1) * (fieldTime(1) / voltFieldTime()) : 0;
        const voltPassive3 = (elementTypes[2] === "Volt") ? (calcActiveMultiplier(2) * critMutliplier(2) - 1) * (fieldTime(2) / voltFieldTime()) : 0;
        
        return 1 + voltPassive1 + voltPassive2 + voltPassive3;
    }

    function frostFieldTime() {
        let frostField = 0;
        for(let i=0; i<3; i++) {
            frostField += (elementTypes[i] == "Ice" ? fieldTime(i) : 0)
        }
        return frostField;
    }

    function frostPassiveMod() {
        const frostPassive1 = (elementTypes[0] === "Ice") ? (calcActiveMultiplier(0) * critMutliplier(0) - 1) * (fieldTime(0) / frostFieldTime()) : 0;
        const frostPassive2 = (elementTypes[1] === "Ice") ? (calcActiveMultiplier(1) * critMutliplier(1) - 1) * (fieldTime(1) / frostFieldTime()) : 0;
        const frostPassive3 = (elementTypes[2] === "Ice") ? (calcActiveMultiplier(2) * critMutliplier(2) - 1) * (fieldTime(2) / frostFieldTime()) : 0;
        
        return 1 + frostPassive1 + frostPassive2 + frostPassive3;
    }

    
    function buffedDmgBonusDmg(characterIndex) { //need to finish this add yulan stuff
        return pbDmgBonusDmg(characterIndex) * ((selectedCharacterNames[characterIndex].includes("tian") ? baseMultResults[characterIndex] * voltPassiveMod() : 
        ((containsYulan ? baseMultResults[characterIndex] * frostPassiveMod() : baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * 
            calcActiveMultiplier(characterIndex) * calcAdditionalMulti(characterIndex) * critMutliplier(characterIndex)))))
    }

    function calcFenrirBonusCD() {
        let fenrirBonusCd = 1;
        for(let i = 0; i<3; i++) {
            fenrirBonusCd += (selectedCharacterNames[i].includes("fenrir") ? matriceAdditional[i] : 0) 
        }
        return fenrirBonusCd;
    }

    const maxCrMulti = (1+critDamage+bonusCritDamage+calcFenrirBonusCD())/((1+critDamage+bonusCritDamage+calcFenrirBonusCD())*critRate+(1-critRate));


    function extraMultiSpSkill(characterIndex) {
        return skillMulti * (selectedCharacterNames[characterIndex].includes("fenrir") ? 1 + Math.min(1, calcFenrirCloneUptime())*fenrirCloneShred * maxCrMulti / (1+(voltDebuff-1)/ 2) : 1) *
        ((selectedCharacterNames[characterIndex].includes("fiona") && fionaSk2 == "vortex") ? dischargeMulti(characterIndex)/(1+claudiaMatrice2pc) : 1) * 
        ((selectedCharacterNames[characterIndex].includes("fiona") && fionaSk2 == "vortex" && sTrait == "fiona") ? 1.3 : 1);
    }

    function bonusCastsSpSkill(characterIndex) {
        return Math.max(
            0,
            (
                (containsAlyss1 && (elementTypes[characterIndex] === "Ice" || (sTrait === "alyss" && elementTypes[characterIndex] !== "Altered")))
                    ? totalCastsSpSkill(characterIndex)
                    : 0
            ) - (
                (containsLin6 === 0)
                    ? 1
                    : (
                        (selectedCharacterNames[characterIndex].includes("alyss"))
                            ? 1
                            : 0
                    )
            )
        )
    }

    function calcSakiCycleFast() {
        if(containsSaki1 && containsIcarus>0) {
            return 8.65
        } else if(containsLin6 && containsAlyss1) {
            return 16.13
        } else if(containsLin6 && containsClaudia1) {
            return 15 - calcClaudCDR() + sakiDelay 
        } else if(containsFenrir1 && containsSaki1) {
            return 9
        } else {
            return calcSkillCDOrder(skillCooldown) - calcClaudCDR() + sakiDelay
        }
    }

    let alyssTime = 2.083;

    function calcSakiCycleSlow() {
        return 25 - calcClaudCDR() * 2 + 2.083
    }

    let fastCycles = Math.floor((totalTime/(calcSakiCycleSlow() * 2 + calcSakiCycleFast()), 1)+1)
    let slowCycles = Math.floor((totalTime - fastCycles*calcSakiCycleFast())/calcSakiCycleSlow(), 1);

    function dischargeMulti() {
        const dischargeMultiplier = () => {
            for(let i = 0; i<3; i++) {
                let claudMat4pcValue = 0;
                if (containsClaudiaMat4pc <= 0) {
                    claudMat4pcValue = 0;
                } else { 
                    claudMat4pcValue = 1.26
                }
            
                if (containsIcarus > 0 || containsUmi > 0) {
                    return claudMat4pcValue * (containsIcarus ? 1 : 15 / (totalTime))
                }
            
                if (characterMatriceKey(i).includes("claudia4pc")) { //todo sakiCycle
                    return claudMat4pcValue * Math.min(1, 15 / (containsSaki1 ? calcSakiCycleFast() : totalTime / adjCastsSkillDmg(i)));
                }
            
                return 0;
            }
          };
        
          const result =
            (1 + dischargeMultiplier()) *
            (sTrait === 'fiona' && containsFiona && (fionaSk1 === 'torrential' || fionaSk2 === 'torrential')
              ? 1.12
              : 1) +
            (containsLiuhuo ? 0.08 : 0);
        
          return result;
    }


    let secondarySplit = 0;
    let halfHalf = 0;
    let balanced = 0;
    let secondaryOnly = 0;
    let allOne = 0;

    const sortedArray = selectedCharacterNames.slice().sort();
    const formattedArray = sortedArray.map(character => character.replace(/\d+$/, ''));
    const characterKey = formattedArray.join('-');
        
    if(characterKey == "annagas-fiona-lan" || characterKey == "lan-liu-zeke" || characterKey == "annagas-lan-zeke" || characterKey == "fiona-yulanmartial-zeke") {
        secondarySplit = 1;
    } else if(characterKey == "fiona-lin-liu" || characterKey == "annaburn-lan-liu" || characterKey == "alyss-icarus-yulansweeping" || characterKey == "fiona-lin-yulansweeping" || characterKey == "fenrir-mimi-rubilia") {
        halfHalf = 1;
    } else if(characterKey == "annaburn-lan-liu" || characterKey == "fiona-icarus-yulansweeping") {
        balanced = 1;
    } else if(characterKey == "alyss-fiona-yulanmartial" || characterKey == "fiona-gnonno-zeke" || characterKey == "fiona-gnonno-umi") {
        secondaryOnly = 1;
    } else {
        allOne = 1;
    }


    function dischargeDistribution() {
        if(secondarySplit) {
            return .5
        } else if(halfHalf) {
            return .5
        } else if(balanced) {
            return .3334
        } else if(secondaryOnly) {
            return 1
        } else {
            return 1
        }
    }



    const linBonusDischarge = (containsLin5 ? ((linUptimeCapped * 30 * totalTime) / 1000) : 0) + (containsFiona && 
        (fionaSk1 == "torrential" || fionaSk2 == "torrential")) ? 60*totalTime / 1000 : 0
    const totalNaturalDischarges = naturalCharge + linBonusDischarge + calcRubyBonusDischarge()
    const zekeA1Total = (containsGnonno ? totalTime/30*42 : totalNaturalDischarges);
    const zekeDarkSlash = totalTime/200*4500;
    const mightyWind = (((containsZeke1 ? zekeA1Total : 0 ) + (basicDmgCharacterCheck().includes("zeke") ? basicDmgRevisedTime()/3.88 : 0)) * 25) /totalTime
    const gnonnoOcto = (containsGnonno ? (adjCastsSkillDmg(findCharacterIndex("gnonno")) * 12 + totalTime) / totalTime: 0)
    const tianSkillPerDischarge =Math.min(Math.max(4*voltAtk*voltAttack,avgHp*hp*hpBonus*0.3*0.45),30*voltAtk*voltAttack)/(voltAtk*voltAttack)*100;
    const eeDamage =Math.min(Math.max(voltAtk*voltAttack,((1-avgHp)*hp*hpBonus)*0.05),10*voltAtk*voltAttack)/(voltAtk*voltAttack)*100;
    const tianBonus = (containsTian ? (voltSD() * (eeDamage*eeCount*tianSkillPerDischarge)) : 0);
    const tianA3Charge = (containsTian3 ? (voltSD() * 2) : 0);
    const tianCharge = Math.min(Math.max(voltAtk*voltAttack,((1-avgHp)*hp*hpBonus)*0.03),10*voltAtk*voltAttack)/
    (voltAtk*voltAttack)*100+Math.min(Math.max(voltAtk*voltAttack*0.4,((1-avgHp)*hp)*0.02),4*voltAtk*voltAttack)/(voltAtk*voltAttack)*100*eeCount;
    if(containsZeke) {
        passiveDps[findCharacterIndex("zeke")] = 50+zekeDarkSlash/totalTime+mightyWind
    }

    function voltSD() {
        let voltSperD = 0;
        for(let i=0; i<3; i++) {
            voltSperD += (elementTypes[i] == "Volt") ? adjCastsSkillDmg(i) + totalCastsSpSkill(i) + totalCastsDischarge(i) : 0
        }
        return voltSperD;
    }


    function rubiliaDischarges() {
        let conditional = 0;
        for(let i =0; i<3; i++) {
            conditional +=(selectedCharacterNames[i].includes("rubilia") ? totalCastsDischarge(i) : 0);
        }
        return conditional
    }

    const rubiliaThorns = (containsRubilia3 ? (containsRubiliaMat4pc ? 6 : 5) : (3+((totalTime/20)-1) * (containsRubiliaMat4pc ? 6 : 5))/(totalTime/20));


    const rubiliaFeedback = (rubiliaDischarges() * rubiliaThorns * 72 * 2);

    function totalTimeSkillDmg(characterIndex) {
        return skillCast[characterIndex] * adjCastsSkillDmg(characterIndex) * ((selectedCharacterNames[characterIndex].includes("tian") && containsFenrir) ? .5 : 1 ) * 
        ((selectedCharacterNames[characterIndex].includes("saki") && containsFenrir) ? .1 : 1) * 
        ((containsSaki1 && containsIcarus && selectedCharacterNames[characterIndex].includes("alyss")) ? .5 : 1) * cancelFactorSkill(characterIndex)
    }

    function totalCastsDischarge(characterIndex) {
        return Math.floor(castCalcDischarge(characterIndex), 1);
    }



    function fionaDischarges() {
        let result = 0;
        for(let i =0; i<3; i++) {
            if(selectedCharacterNames[i].includes("fiona")) {
                return result += castCalcDischarge(i);
            }
        }
    }

    function fionaTorrentEFC() {
        return Math.floor(fionaDischarges === 0 ? 30 : Math.min(30, totalTime/fionaDischarges()));
    }

    function fionaTorrents() {
        return containsFiona ? (fionaSk1 == "torrential"  || fionaSk2 == "torrential") ? totalTime/fionaTorrentEFC() : 0 : 0
    }

    let zekeDischarge = containsZeke && basicDmgCharacterCheck().includes("zeke") ? 1 : 0

    function basicDmgBuffedDps() {
        // Calculate all three values and store them in an array with their corresponding indices
        const dpsValues = [
            { value: calcMaxAutoDps(0), index: 0 },
            { value: calcMaxAutoDps(1), index: 1 },
            { value: calcMaxAutoDps(2), index: 2 }
        ];
    
        // Find the index of the largest value
        const maxIndex = dpsValues.reduce((maxIdx, currentValue, currentIndex) => {
            if (currentValue.value > dpsValues[maxIdx].value) {
                return currentIndex;
            }
            return maxIdx;
        }, 0);
    
        // The largest value and its index
        const maxValue = dpsValues[maxIndex].value;
        const maxIndexValue = dpsValues[maxIndex].index;
    
        return { value: maxValue, index: maxIndexValue };
    }

    function basicDmgBuffedDps2() {
        // Calculate all three values and store them in an array with their corresponding indices
        const dpsValues = [
            { value: calcMaxAutoDps(0), index: 0 },
            { value: calcMaxAutoDps(1), index: 1 },
            { value: calcMaxAutoDps(2), index: 2 }
        ];
    
        // Sort the values in ascending order
        dpsValues.sort((a, b) => a.value - b.value);
    
        // The middle value (second-largest) and its index
        const middleValue = dpsValues[1].value;
        const middleIndex = dpsValues[1].index;
    
        return { value: middleValue, index: middleIndex };
    }

    function basicDmgExtraMulti() {
        let storedValues = [];
        const buffedCheck = basicDmgBuffedDps().index;
        const buffedCheck2 = basicDmgBuffedDps2().index;
        let value1 =0;
        let value2 =0;
        let value3 =1;
        let value4 =1;

        const indexCheck = findCharacterIndex(basicDmgCharacterCheck())
        const indexCheck2 = findCharacterIndex(basicDmgCharacterCheck2())
        
        value1 += (selectedCharacterNames[buffedCheck].includes("samir6") ? (1+(Math.min((naturalCharge*11/totalTime), 1) * Math.min(critRate+0.4, 1) * critDamage * 
            (1-Math.min(naturalCharge * 11 / totalTime, 1)) * critRate * critDamage)) / (1+critRate*critDamage) : 1) * 
            ((umiSupport && !selectedCharacterNames[buffedCheck].includes("umi") && containsPhysical) ? 1.25 : 1) * normalMulti;
        
            // Calculate the value you want to store for buffedCheck2
        value2 += (selectedCharacterNames[buffedCheck2].includes("samir6") ? (1+(Math.min((naturalCharge*11/totalTime), 1) * Math.min(critRate+0.4, 1) * critDamage * 
            (1-Math.min(naturalCharge * 11 / totalTime, 1)) * critRate * critDamage)) / (1+critRate*critDamage) : 1) * 
            ((umiSupport && !selectedCharacterNames[buffedCheck2].includes("umi") && containsPhysical) ? 1.25 : 1) * normalMulti;
        
        if (indexCheck != "N/A") {
            value3 = (selectedCharacterNames[indexCheck].includes("samir6") ? (1+(Math.min((naturalCharge*11/totalTime), 1) * Math.min(critRate+0.4, 1) * critDamage * 
            (1-Math.min(naturalCharge * 11 / totalTime, 1)) * critRate * critDamage)) / (1+critRate*critDamage) : 1) * 
            ((umiSupport && !selectedCharacterNames[indexCheck].includes("umi") && containsPhysical) ? 1.25 : 1) * normalMulti;
        }
        else if(indexCheck2 != "N/A") {
            // Calculate the value you want to store for indexCheck2
            value4 = (selectedCharacterNames[indexCheck2].includes("samir6") ? (1+(Math.min((naturalCharge*11/totalTime), 1) * Math.min(critRate+0.4, 1) * critDamage * 
            (1-Math.min(naturalCharge * 11 / totalTime, 1)) * critRate * critDamage)) / (1+critRate*critDamage) : 1) * 
            ((umiSupport && !selectedCharacterNames[indexCheck2].includes("umi") && containsPhysical) ? 1.25 : 1) * normalMulti;
        }
        // Push the calculated values into the storeValues array
        storedValues.push(value1, value2, value3, value4);
        return storedValues
    }


    function enduranceDmgBuffedDps() {
        let tianConditional = 0;
        let value = 0;
        for(let i = 0; i<3; i++) {
            tianConditional += characterMatriceKey(i, 1).includes("tian") ? calcEnduranceDps(i) : 0;
            value += ((containsTian && !containsFenrir) ? tianConditional : ((containsUmi && (containsGnonno || containsLyra) && (umiSupport = 0)) 
            ? calcEnduranceDps(i) : (Math.max(calcEnduranceDps(0), calcEnduranceDps(1), calcEnduranceDps(2)) > Math.max(calcMaxAutoDps(0), calcMaxAutoDps(1), calcMaxAutoDps(2))) 
            ? Math.max(calcEnduranceDps(0), calcEnduranceDps(1), calcEnduranceDps(2)) : 0)) 
        }
        return value;
    }

    function enduranceDmgPbDps() {
        let index;
        for(let i = 0; i<3; i++) {
            index = (Math.max(calcEnduranceDps(0), calcEnduranceDps(1), calcEnduranceDps(2)) == calcEnduranceDps(i)) ? i : 0
        }
        return (enduranceDmgBuffedDps() == 0) ? 0 : enduranceDps[index]; 
    }

    let baseEndurance = 1300;
    let enduranceRegen = 100;
    let potentialEndurance = baseEndurance + enduranceRegen* totalTime;
    let avgEndUsage = (linUptimeCapped*.5+(1-linUptimeCapped)*1);

    function enduranceTotalTime() {
        const result = Math.max(
            0,
            (
                buffedDmgDodge(0) > pbDmgBonusDmg(0) && maxDodges === 999 ? 0 :
                Math.min(
                    totalTime - (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2)) - (totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2)) 
                    - totalTimeDodge2() - totalTimeDodge3() - basicDmgTotalTimePriority() - basicDmgTotalTimePriority2() - (totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2)) 
                    - (reqUptimeTotalTime(0) + reqUptimeTotalTime(1) + reqUptimeTotalTime(2)) - (reqUptimeTotalTimeExtra(0) + reqUptimeTotalTimeExtra(1) + reqUptimeTotalTimeExtra(2)),
                    (
                        buffedDmgDodge(0) > enduranceDmgBuffedDps() ?
                        maxDodges * pbDpsDodge(0):
                        0.5 * potentialEndurance / ( enduranceDmgPbDps() * (containsLin ? avgEndUsage : 1))
                    )
                )
            )
        );
    
        return result;
    }

    function enduranceRevisedTime() {
        let index;
        for(let i = 0; i<3; i++) {
            index = (Math.max(calcEnduranceDps(0), calcEnduranceDps(1), calcEnduranceDps(2)) == calcEnduranceDps(i)) ? i : 0
        }
        return (tianAutoTime ? tianAutoTime : Math.max((selectedCharacterNames[index].includes("meryl6")), 
        Math.min(enduranceTotalTime(), (totalTime/2-totalTimeSkillDmg(index) - bDpsDischarge(index)))))
    }

    function enduranceMatch(characterIndex) {
        ((enduranceDmgBuffedDps() == calcEnduranceDps(characterIndex)) ? characterMatriceKey(characterIndex , 1) : "N/A");
    }    

    function basicDmgMatch(characterIndex) {
        ((basicDmgBuffedDps().value == calcMaxAutoDps(characterIndex)) ? characterMatriceKey(characterIndex, 1) : "N/A")
    }

    function basicDmgMatch2(characterIndex) {
        ((basicDmgBuffedDps2().value == calcMaxAutoDps(characterIndex)) ? characterMatriceKey(characterIndex, 1) : "N/A")
    }

    function dodgeMatch(characterIndex) {
        ((buffedDmgDodge(characterIndex) == calcDodgeDamage(characterIndex)) ? characterMatriceKey(characterIndex, 1) : "N/A");
    }

    function cancelDischarges() {
        if((containsUmi && !containsClaudia1) && (!containsLin || !containsFiona )) {
            return 1
        } else {
            return Math.max(buffedDmgDischarge(0), buffedDmgDischarge(1), buffedDmgDischarge(2)) < 
            Math.min(basicDmgBuffedDps().value, enduranceDmgBuffedDps()) * .66 || (containsSaki1 && containsFenrir) || (containsIcarus && (containsLin6 || containsSaki1))
        }  
    }

    function cancelDischarge(characterIndex) {
        return ((selectedCharacterNames[characterIndex].includes("zeke") || selectedCharacterNames[characterIndex].includes("anna")) && zekeDischarge) ||
        (containsMimi && (!selectedCharacterNames[characterIndex].includes("rubilia") && !selectedCharacterNames[characterIndex].includes("fiona")))
    }


    function totalTimeDischarge(characterIndex) {
        if( cancelDischarges() || cancelDischarge(characterIndex) || (containsIcarus && containsAlyss && selectedCharacterNames[characterIndex].includes("icarus"))) {
            return .25 * totalCastsDischarge(characterIndex);
        } else {
            return totalCastsDischarge(characterIndex) * dischargeTime[characterIndex];
        }
    }


    if(containsMimi3) {
        skillCooldown = skillCooldown.map(value => value * .8)
    }

    console.log(skillCooldown)

    function maxCastsSkillDmg(characterIndex) {
        let result = 0;
    
        if (selectedCharacterNames[characterIndex].includes("saki")) {
            if (
                ((containsSaki1 > 0 && !containsLinSakiFrigg) || calcPriority()[characterIndex] < 3) &&
                selectedCharacterNames[characterIndex].includes("lin") === false
            ) {
                result = totalTime / calcSakiCycleFast() * (skillCooldown[characterIndex] <= calcSakiCycleFast() ? 2 : 1);
            } else {
                result = totalTime / calcSakiCycleFast();
            }
        } else {
            result = totalTime / skillCooldown[characterIndex] + (containsShiro3 ? ShatterPerEncounter : 0);
    
            if (selectedCharacterNames[characterIndex].includes("lin") === true) {
                result += (naturalCharge + phantasiaPerEncounter + fionaTorrents()) / 3;
            }
    
            if (containsLin6 && containsSaki1 && selectedCharacterNames[characterIndex].includes("lin") === false) {
                result -= Math.floor((totalNaturalDischarges + phantasiaPerEncounter) / 3);
            }
        }
    
        return Math.floor(Math.max(0, result));
    }

    function calcClaudACDR() {
        for(let i = 0; i<3; i++) {
            if(containsClaudiaMat4pc) { 
                if (claudMatSlot(i)) {
                    let numerator = (maxCastsSkillDmg(i) /
                    (totalTime / skillCooldown[i]) +
                    (characterMatriceKey(i, 1).includes("fiona") && characterMatriceKey(i).includes("claudia") ? 0 : totalCastsSpSkill(i)) *
                    skillCooldown[i] /
                    totalTime);
                const result = Math.min(30, numerator * calcClaudCDR());
                return Math.max(result, 0);
                }
            }
        }
        return 0;
    }

    const claudCycle = (containsIcarus && containsFiona) ? 19 : 30
    
    if(containsFiona) {
        skillCooldown[findCharacterIndex("fiona")] = fionaCooldown1;
    } 

    function adjCastsSkillDmg(characterIndex) {
        if(characterIndex != "N/A") {
            const result = (containsUmi && containsGnonno) && (selectedCharacterNames[characterIndex].includes("gnonno") || selectedCharacterNames[characterIndex].includes("fiona"))
          ? umiMagicShows
          : fionaSk1 === "torrential" && selectedCharacterNames[characterIndex].includes("fiona")
            ? totalTime / fionaTorrentEFC()
            : selectedCharacterNames[characterIndex].includes("umi")
              ? umiMagicShows
              : containsSaki1 && containsLin6 && containsAlyss1
                ? selectedCharacterNames[characterIndex].includes("lin")
                  ? fastCycles + slowCycles + totalDischarges / 3
                  : skillCooldown[characterIndex] - calcClaudCDR() <= calcSakiCycleSlow()
                    ? 2
                    : 1 * slowCycles + fastCycles
                : Math.ceil(Math.max(
                    0,
                    containsSaki1
                      ? calcPriority(characterIndex) < 3
                        ? totalTime / calcSakiCycleFast() * (skillCooldown[characterIndex] - calcClaudCDR() - 1 <= calcSakiCycleFast() ? 2 : 1)
                        : totalTime / calcSakiCycleFast()
                      : totalTime / (calcClaudACDR() > skillCooldown[characterIndex] * 0.5 ? claudCycle : (skillCooldown[characterIndex] - calcClaudACDR())),
                    containsShiro3 ? ShatterPerEncounter : 0,
                    Math.floor(selectedCharacterNames[characterIndex].includes("lin6") ? (1 + (totalDischarges + fionaTorrents()) / 3) : 0)
                  ) -
                  ((containsLin6 && containsSaki1 && !calcPriority(characterIndex) < 3 && selectedCharacterNames[characterIndex].includes("alyss")) ? Math.floor((totalNaturalDischarges + phantasiaPerEncounter) / 3) : 0)
                );
      
        return result + (selectedCharacterNames[characterIndex].includes("mimi") ? 1 : 0);
        }
        else {
            return 0;
        }
    }


    function pbDmgDischarge(characterIndex) {
        let finalValue = 0;
        if(selectedCharacterNames[characterIndex].includes("meryl5") || selectedCharacterNames[characterIndex].includes("meryl6")) {
            finalValue = 0;
        } else if(selectedCharacterNames[characterIndex].includes("crow")){
            finalValue = ((350/critMutliplier(characterIndex))/critMultiplierForm)
        }
        return finalValue + damagePerDischarge[characterIndex];
    }

    function buffedDmgDischarge(characterIndex) {
        return pbDmgDischarge(characterIndex) * (baseMultResults[characterIndex] * (calcActiveMultiplier(characterIndex) - (selectedCharacterNames[characterIndex].includes("samir") ? fieldFD[characterIndex] : 0)) 
        * critMutliplier(characterIndex) * calcOnfieldEleDmg[characterIndex] * calcDischargeMulti(characterIndex) * calcAdditionalMulti(characterIndex))
    }

    if(containsFiona) {
        skillDamage[findCharacterIndex("fiona")] += (fionaMultiplier1 + fionaMultiplier2)
    }

    function pbDmgSkill(characterIndex) {
        if(selectedCharacterNames[characterIndex].includes("umi")) {
            return umiMagicShowValue;
        } else {
            return skillDamage[characterIndex] * cancelFactorSkill(characterIndex);
        }
    }

    function extraMultiSkill(characterIndex) {
        return skillMulti * (selectedCharacterNames[characterIndex].includes("shiro6") ? (1+critDamage)/((1+critDamage) * critRate+(1-critRate)) : 1) * 
        ((selectedCharacterNames[characterIndex].includes("samir3") || selectedCharacterNames[characterIndex].includes("samir5") || selectedCharacterNames[characterIndex].includes("samir6")) ? 
        (1 + (Math.min(naturalCharge*11/totalTime,1) * Math.min(critRate+.4,1) * critDamage + (1-Math.min(naturalCharge*11/totalTime,1)) * critRate * critDamage)) / (1+critRate*critDamage) : 1) *
        (((selectedCharacterNames[characterIndex].includes("saki") && containsFenrir) ? .1 : 1 )) * (((selectedCharacterNames[characterIndex].includes("fiona") && fionaSk1 == "vortex" && sTrait == "fiona") ?
        1.3*dischargeMulti(characterIndex)/(1+claudiaMatrice2pc) : 1)) * 1 + ((containsFiona && (fionaSk1 == "maelstrom" || fionaSk2 == "maelstrom") && (selectedCharacterNames[characterIndex].includes("umi"))) ? 
        (1+fionaCrystalBonus+((sTrait=="fiona") ? 0.33+.26 : .26) * .6) /(1+fionaCrystalBonus) - 1 : 0)
    }

    function cancelFactorSkill(characterIndex) {
        return ((containsGnonno && umiSupportSlot && selectedCharacterNames[characterIndex].includes("umi")) ? .01 : 1) 
        * (((selectedCharacterNames[characterIndex].includes("tian")) && containsFenrir) ? .5 : 1) * 
        (containsSaki1 && containsIcarus && ((selectedCharacterNames[characterIndex].includes("saki")) || (selectedCharacterNames[characterIndex].includes("alyss"))) ? .5 : 1)
        * (containsYulan && (selectedCharacterNames[characterIndex].includes("alyss") || (selectedCharacterNames[characterIndex].includes("zeke"))) ? .1 : 1);
    }

    let skillDischargeCountFinal;

    try {
    skillDischargeCountFinal = Math.floor(
        adjCastsSkillDmg(0) + adjCastsSkillDmg(1) + adjCastsSkillDmg(2) +
        totalCastsSpSkill(0) + totalCastsSpSkill(1) + totalCastsSpSkill(2) +
        totalCastsDischarge(0) + totalCastsDischarge(1) + totalCastsDischarge(2),
        1
    );
    } catch (error) {
        // Handle the error here, or simply assign a default value
        skillDischargeCountFinal = totalCastsDischarge(0) +
        totalCastsDischarge(1) +
        totalCastsDischarge(2) +
        maxCastsSkillDmg(0) +
        maxCastsSkillDmg(1) +
        maxCastsSkillDmg(2); // Replace 'defaultValue' with the value you want to return in case of an error
    }

    let fionaCrystalRampUp = (((totalTime/skillDischargeCountFinal)*(containsFiona5 ? 4 : 5))*2.5+(totalTime-(totalTime/skillDischargeCountFinal)*(containsFiona5 ? 4 : 5))*5)/totalTime;
    let fionaA1CrystalAvg = Math.min(5,((containsFiona5 ? 20 : 6)/(totalTime/(skillDischargeCountFinal/2)))*5)*fionaCrystalRampUp/5;
    let fionaA6CrystalBonus = 0.07*(fionaA1CrystalAvg+3)/2;
    let fionaA1CrystalBonus = 0.04*(fionaA1CrystalAvg+1)/2;
    let fionaCrystalBonus = containsFiona6 ? fionaA6CrystalBonus : containsFiona1 ? fionaA1CrystalBonus : 0; 

    function calcClaudEligible(characterIndex) {
        return (characterMatriceKey(characterIndex).includes("claudia") && characterMatriceKey(characterIndex, true).includes("frigg") || characterMatriceKey(characterIndex, true).includes("alyss")
        || characterMatriceKey(characterIndex, true).includes("fiona")) ? 0 : 1
    } 
   
    let skillMulti = (containsClaudia5 ? 1.2 : 1) * ((containsFiona && (fionaSk1 == "torrential" || fionaSk2 == "torrential")) ? 1.12 : 1) + (containsLiuhuo ? .08 : 0) 
    + selectedMatrice1.globalSkillDmg + selectedMatrice2.globalSkillDmg + selectedMatrice3.globalSkillDmg;

    function bonusDmgSkill(characterIndex) {
        return pbDmgSkill(characterIndex) * baseMultResults[characterIndex] * calcActiveMultiplier(characterIndex) * critMutliplier(characterIndex) * 
        calcOnfieldEleDmg[characterIndex] * calcSkillMulti(characterIndex) * ((selectedCharacterNames[characterIndex].includes("lin")) ? passiveDps[characterIndex] * 
        (containsLin3 ? 20 : 15) * baseMultResults[characterIndex]*calcPassiveMod(characterIndex) : 1)
    }

    function buffedDmgSkill(characterIndex) {
        return pbDmgSkill(characterIndex) * baseMultResults[characterIndex] * calcActiveMultiplier(characterIndex) * critMutliplier(characterIndex) * calcOnfieldEleDmg[characterIndex] * 
        calcSkillMulti(characterIndex) * calcAdditionalMulti(characterIndex);
    }

    function calcSkillMulti(characterIndex) {
        return normalMulti + fieldModN[characterIndex] + (characterMatriceKey(characterIndex).includes("claudia") && calcClaudEligible(characterIndex) 
        ? claudiaMatrice2pc : 0)/(normalMulti + fieldModN[characterIndex]) 
    }

    function calcRubyBonusDischarge() {
        return containsRuby5 ? (totalTime * 0.3 * 0.9 * 75)/1000 : 0
    }

    let totalDischarges = totalNaturalDischarges + phantasiaPerEncounter + bonusCastsDischarge(0) + bonusCastsDischarge(1) + bonusCastsDischarge(2); 
    const lanA3Bonus = (totalDischarges+ShatterPerEncounter) * (containsLan5 ? 385.2509091 : 258.4);

    function calcNemesisDischarge() {
        return Math.min((containsNemesis ? totalTime/35 : 0), naturalCharge )
    }

    function calcFrostSkillCount() {
        let frostSkill = 0;
        for(let i =0; i<3; i++) {
            if(elementTypes[i] == "Ice") {
                frostSkill += adjCastsSkillDmg(i);
                frostSkill += totalCastsSpSkill(i);
               
            }
        }
        return frostSkill;
    }

    function bonusCastsSkill(characterIndex) {
        return Math.max(
            0,
            (
                (containsAlyss1 && (elementTypes[characterIndex] === "Ice" || (sTrait === "alyss" && elementTypes[characterIndex] !== "Altered")))
                    ? adjCastsSkillDmg(characterIndex)
                    : 0
            ) - (
                (containsLin6 === 0)
                    ? 1
                    : (
                        (selectedCharacterNames[characterIndex].includes("alyss"))
                            ? 1
                            : 0
                    )
            )
        )
    }

    function bonusCastsDischarge(characterIndex) {
        if(containsAlyss1 && selectedCharacterNames[characterIndex].includes("alyss")) {
            return calcFrostSkillCount()
        } else {
            return 0
        }
    }

    console.log("natural", totalNaturalDischarges)

    function castCalcDischarge(characterIndex) {
        if ((secondaryOnly && rawPriorityDischarge(characterIndex) === 2) ||
            ((rawPriorityDischarge(characterIndex) === 1) && !secondarySplit) ||
            ((rawPriorityDischarge(characterIndex) === 2) && dischargeDistribution() <= 0.5) ||
            ((rawPriorityDischarge(characterIndex) === 3) && (dischargeDistribution() <= 0.34 || secondarySplit))) {
            return (totalNaturalDischarges + phantasiaPerEncounter) * dischargeDistribution() - 
                (((rawPriorityDischarge(characterIndex) === 1) && dischargeDistribution() === 1) ||
                ((rawPriorityDischarge(characterIndex) === 2) && (secondaryOnly || dischargeDistribution() <= 0.5))) ?
                calcNemesisDischarge() + ((!selectedCharacterNames[characterIndex].includes("claudia") && containsClaudia1) ? 1 : 0) +
                (((containsFiona && containsGnonno && containsLan) || (containsFiona && containsRubilia && containsFenrir)) ? 0 :
                (secondarySplit ? 0 :
                ((!selectedCharacterNames[characterIndex].includes("fiona") || (balanced && totalNaturalDischarges / 3 < (totalTime / 30))) ? totalTime / 30 : 0)))
                : 0;
        } else if (selectedCharacterNames[characterIndex].includes("nemesis")) {
            return calcNemesisDischarge();
        } else if ((selectedCharacterNames[characterIndex].includes("claudia") && containsClaudia1) ||
            (selectedCharacterNames[characterIndex].includes("fiona") && ((!containsGnonno && containsLan) || (!containsRubilia && containsMimi === 0)))) {
            return totalTime / 30;
        } else {
            return 0;
        }
    }


    function calcIcarusDischarge() {
        let result = 0;
        for(let i = 0; i<3; i++) {
            if(selectedCharacterNames[i].includes("icarus")) {
                result = totalCastsDischarge(i) + ((containsIcarus && fionaSk2 == "torrential") ? fionaTorrents() : 0) 
            }
        }
        return result
    }

    const yulanAnticipateDmg = ((containsYulan1 || (containsLin && containsFiona) ? 1350 : 938) * (skillCount + (containsIcarus ? calcIcarusDischarge()*2 : 0))) * (sTrait =="yulan" ? 
    1 + elementTypes.filter(element => element === "Ice").length * 0.09 : 1);

    function endurancePbDps(characterIndex) {
        return (enduranceDmgBuffedDps(characterIndex) == 0) ? 0 : enduranceDps[characterIndex]
    }

    function bDpsDischarge(characterIndex) {
        return buffedDmgDischarge(characterIndex) / dischargeTime[characterIndex];
    }


    const alyssHoarFrost = (totalCastsDischarge(0) + totalCastsDischarge(1) + totalCastsDischarge(2) + bonusCastsDischarge(0) + bonusCastsDischarge(1) + bonusCastsDischarge(2)) * 125.8


    let chargedAtkBonus = (containsLan ? 0.08 : 0)
    let twilightArcNoBullet = (37+180.4 * (1+chargedAtkBonus));
    
    function calcTianMulti(characterIndex) {
        return (selectedCharacterNames[characterIndex].includes("tian") ? baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * calcActiveMultiplier(characterIndex) * critMutliplier(characterIndex) : 0)
    }


    function pbDpsDodge(characterIndex) {
        if(buffedDmgDodge(characterIndex) == 0) {
            return 0;
        } else {
            return dodgeDamageValue[characterIndex];
        }
    }

    function buffedDmgDodge(characterIndex) {
        let bonusDamage = 0
        if(containsTian && !containsFenrir) {
            if(characterMatriceKey(characterIndex,1).includes("tian")) {
                return tianCharge/extraMultiDodge(characterIndex)*calcTianMulti(characterIndex)
            }
        } else if(containsAnna) {
            if(characterMatriceKey(characterIndex,1).includes("anna")) {
                bonusDamage += calcDodgeDps(characterIndex);
            } else if(containsLan1 && containsAnna) {
                return (twilightArcNoBullet * calcTotalMulti(characterIndex));
            }
        } else if(containsYulan) {
            if(characterMatriceKey(characterIndex,1).includes("yulan")) {
                bonusDamage += calcDodgeDps(characterIndex);
            }
        } else if(Math.max(calcDodgeDps(0), calcDodgeDps(1), calcDodgeDps(2)) > Math.max(calcMaxAutoDps(0), calcMaxAutoDps(1), calcMaxAutoDps(2))) {
            return calcDodgeDps(characterIndex)
        } else if(selectedCharacterNames[characterIndex].includes("meryl5") ||selectedCharacterNames[characterIndex].includes("meryl6") ) {
            return Math.max(calcDodgeDps(0), calcDodgeDps(1), calcDodgeDps(2));
        }
        return bonusDamage;
    }

    function annaDodges() {
        let getIndex;
        for (let i = 0; i < 3; i++) {
            getIndex = storeIndexCharacter(i, "annabella");
        }
    
        if (getIndex !== "N/A") {
            const annaSkillDamage = Math.floor(adjCastsSkillDmg(getIndex));
            if (containsLan1) {
                return annaSkillDamage * 2;
            } else if (containsAnna) {
                const baseDamage = annaSkillDamage * (annaGas ? (containsCobaltMat4pc || containsAnnabellaMat4pc ? 8 : 7) : 2);
                return Math.min(baseDamage, dodges * 2);
            } else {
                return dodges * 2;
            }
        }
        return 0;
    }

    const dodgeRegen = 4;
    let dodges = 3 + totalTime/dodgeRegen * (linType == "Volt" ? 6 : 1) * ((characterMatriceKey(0).includes("cobalt") || characterMatriceKey(1).includes("cobalt") || characterMatriceKey(2).includes("cobalt")) ? 1.66 : 1);
    let emptyAnnaDodges = ((containsLiuhuo && !containsLan) ? 0 : (sTrait == "annabella" ? annaDodges() * 2 : (containsFiona ? annaDodges()*4 : annaDodges()/2)));
    let tsubasaDodges = ((containsTsubasa ? totalTime/15 : 0)+ (containsTsubasa3 ? 2 : 0))

    function maxDodgesPrimary() {
        for(let i = 0; i<3; i++) {
            return Math.min(dodges, pbDpsDodge(i) == 0 ? 0 : ((containsLan1 && containsAnna) ? emptyAnnaDodges : (containsCobaltMat4pc ? totalTime / ((linType=="Fire") ? 8 : 4) : 
            (containsCobalt3 ? totalTime/10 : ((containsTian && !containsFenrir) ? (containsTian3 ? tianA3Charge : tianA3Charge) : ((containsLyra && selectedCharacterNames[i].includes("lyra")) ? 
            totalTime/15 : (containsFenrir ? Math.floor(fenrirCombos + fenrirA1Dodges(), 1) : tsubasaDodges)))))))
        }
    }

    function maxDodgesSecondary() {
        for(let i =0; i<3; i++) {
            if(pbDpsDodge(i) == 0) {
                return 0
            } else if(selectedCharacterNames[i].includes("frigg")) {
                return 999
            } else if(containsAnna) {
                return annaDodges()
            } else if(selectedCharacterNames[i].includes("cobalt")) {
                return dodges * 1.25
            } else if(selectedCharacterNames[i].includes("lyra")) {
                return totalTime/15
            } else {
                return dodges-maxDodgesPrimary()
            }
        }
    }



    let maxDodges = Math.min(dodges, )
    let dodgeMulti = (1 + (containsLiuhuo ? .1 : 0));

    function extraMultiDodge(characterIndex) {
        return tianAutoTime > 0 ?
            (buffedDmgDodge(0) - buffedDmgDodge(1)) *
            (1 + (linType === "Volt" ? 0.05 * linUptimeCapped : 0)) *
            (umiSupport && !selectedCharacterNames[characterIndex].includes("umi") && elementTypes[characterIndex] === "Physical" ? 1.25 : 1) *
            dodgeMulti :
            1; // Return 1 if the conditions are not met
    }


    function totalTimeDodge2() {
        return Math.min((totalTime - (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2)) - (totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2)) -
        (totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2))), ((pbDpsDodge(1) == 0) ? 0 : dodgeTime[1] * maxDodgesPrimary()))
    }

    function totalTimeDodge3() {
        return ((maxDodgesSecondary() === 999) && (buffedDmgDodge(2) > enduranceDmgBuffedDps()) && (buffedDmgDodge(2) > basicDmgBuffedDps().value) ? Math.max(totalTime - 
            (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2)) - (totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2)) - 
            (totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2)) - totalTimeDodge() - basicDmgTotalTimePriority() - ((buffedDmgDodge(0) > enduranceDmgBuffedDps()) ? maxDodges * dodgeDamageValue[0]: 0)) : 0)
    }

    function dmgPercentSkill(characterIndex) {
        return (
          buffedDmgSkill(characterIndex) *
          adjCastsSkillDmg(characterIndex) *
          extraMultiSkill(characterIndex) +
          (skillDamage[characterIndex] > 0
            ? (0.7 *
                bonusCastsSkill(characterIndex) *
                buffedDmgSkill(characterIndex) *
                extraMultiSkill(characterIndex) *
                skillDamage[characterIndex]) /
              pbDmgSkill(characterIndex) *
              (containsAlyss1 && selectedCharacterNames[characterIndex].includes("saki")
                ? 0.5
                : 1)
            : 0)
        );
    }

    function dmgPercentSpSk(characterIndex) {
        return totalCastsSpSkill(characterIndex) * buffedDmgSpSkill(characterIndex) * extraMultiSpSkill(characterIndex) + 
        (0.7 * bonusCastsSpSkill(characterIndex) * buffedDmgSpSkill(characterIndex) * extraMultiSpSkill(characterIndex));
    }

    const sakiWorthSurging = ((containsSaki1 && containsIcarus) || containsFenrir) ? 0 : 1

    function reqUptimeTotalTimeExtra(characterIndex) {
        return (selectedCharacterNames[characterIndex].includes("lin") ? (containsUmi ? totalTime/18 : 1) : 0) + ((selectedCharacterNames[characterIndex].includes("ruby") && rubyWorthHeating) ?
        (totalTime/25) * (selectedCharacterNames[characterIndex].includes("ruby6") ? 3.6 : 7.2) : 0 ) + ((containsSaki3 && selectedCharacterNames[characterIndex].includes("saki") && sakiWorthSurging) ? 
        totalTime/10 * 2.15 : 0) + ((selectedCharacterNames[characterIndex].includes("fiona") && containsGnonno && containsLan && containsFiona) ? totalTime/3 : 0)
    }

    function reqUptimeBonusDps(characterIndex) {
        return (selectedCharacterNames[characterIndex].includes("rubilia") || selectedCharacterNames[characterIndex].includes("yulan")) ? calcDodgeDps(characterIndex) : calcMaxAutoDps(characterIndex);
    }

    const quickswap = ((containsUmi && !containsLyra && containsClaudia1) || (containsGnonno && containsLan && containsFiona)) ? 1 : 0

    function reqUptimeQuickSwapTimes(characterIndex) {
        return (quickswap ? ((containsClaudia1 && containsUmi) ? (selectedCharacterNames[characterIndex].includes("claudia") ? umiMagicShows : 0) : 
        (reqUptimeBonusDps(characterIndex) == Math.max(reqUptimeBonusDps(0), reqUptimeBonusDps(1), reqUptimeBonusDps(2)) ? 0 
        : skillCooldown[characterIndex] == Math.min(skillCooldown[0], skillCooldown[1], skillCooldown[2]) ? totalTime / (skillCooldown[characterIndex] !== 
        (Math.min(skillCooldown[0], skillCooldown[1], skillCooldown[2]) && Math.max(skillCooldown[0], skillCooldown[1], skillCooldown[2])) ? skillCooldown[characterIndex] : 0): 0)) : 0) 
    }

    const rubiliaSkills = (containsRubilia ? adjCastsSkillDmg(findCharacterIndex("rubilia")) : 0);

    function reqUptimeTotalTime(characterIndex) {
        return Math.max(0,Math.max(0,3-dischargeTime[characterIndex]-skillCast[characterIndex])*
        (reqUptimeQuickSwapTimes(characterIndex)-Math.max(0,(reqUptimeQuickSwapTimes(characterIndex)-totalCastsDischarge(characterIndex))))+Math.max(0,3-skillCast[characterIndex])*
        (reqUptimeQuickSwapTimes(characterIndex)-(reqUptimeQuickSwapTimes(characterIndex)-Math.max(0,(reqUptimeQuickSwapTimes(characterIndex)-totalCastsDischarge(characterIndex))))))+
        (selectedCharacterNames[characterIndex].includes("rubilia") ? .7667 * rubiliaSkills *(containsMimi ? 1 : 2) : 0);
    }


    const fionaMainDps = ((globalResonance == "Altered" || (containsLan && containsClaudia1)) ? 1 : 0 );

    function basicDmgCharacterCheck() {
        const fionaMainDps = (globalResonance == "Altered" || (containsLan && containsClaudia1)) ? 1 : 0;
        if (fionaMainDps) {
            return "fiona";
          } else if (containsIcarus) {
            return "icarus";
          } else if (containsRubyMat4pc) {
            return "ruby4pc";
          } else if (
            containsTian > 0 &&
            !containsNemesis6 &&
            containsFenrir === 0
          ) {
            return "tian";
          } else if (!annaGas && containsAnnaBurn) {
            return "anna";
          } else if(annaGas) {
            return "annagas";
          } else if (containsUmi > 0) {
            return "umi";
          } else if (containsLin && containsFiona && containsYulan) {
            return "lin";
          } else {
            return "N/A";
          }
    }


    function findCharacterIndex(characterName) {
        for (let i = 0; i < 3; i++) {
            if (selectedCharacterNames[i].includes(characterName)) {
                return i; // Return the index when a match is found
            }
        }
        return "N/A"; // Return -1 if the character is not found in the array
    }

    function storeIndexCharacter(characterIndex, character) {
        const characterKey = characterMatriceKey(characterIndex, 1);
        if (characterKey.includes(character)) {
            return characterIndex;
        } else {
            return "N/A";
        }
    }

    function storeIndexMatrice(matriceIndex, matrice) {
        const matriceKey = characterMatriceKey(characterIndex);
        if (matriceKey.includes(matrice)) {
            return matriceIndex;
        } else {
            return "N/A";
        }
    }


    function basicDmgCharacterCheck2() {
        if (containsClaudia && containsLin) {
            if (containsUmi && umiSupport == 0) {
                return umiSupportSlot;
            } else {
                return "lin";
            }
        } else {
            return "N/A";
        }
    }

    function basicDmgTotalTimePriority2() {
        let indexCheck = 0;
        for(let i =0; i<3; i++) {
            indexCheck = storeIndexCharacter(i, basicDmgCharacterCheck2())
        }
        return ((containsClaudia && containsLin) ? Math.min(totalTime/15,(maxCastsSkillDmg(indexCheck))) * .6 : 0 ); 
    }


    function basicDmgBuffedDpsPriority() {
        let indexCheck;
        for(let i =0; i<3; i++) {
            indexCheck = storeIndexCharacter(i, basicDmgCharacterCheck())
        }
        if (indexCheck != "N/A") {
            const autoDps = calcMaxAutoDps(indexCheck);
            if (containsUmi) {
                const umiCondition = containsFiona && (fionaSk1 === "maelstrom" || fionaSk2 === "maelstrom") && containsUmi;
                const umiResult = umiMultiplier * (1 + (umiCondition ? (1 + fionaCrystalBonus + (sTrait === "fiona" ? 0.33 + 0.26 : 0.26) * 0.6) / (1 + fionaCrystalBonus) - 1 : 0));
                return autoDps * umiResult;
            } else {
                return autoDps * (1 + fionaCrystalBonus + (sTrait === "fiona" ? 0.33 + 0.26 : 0.26) * 0.6) / (1 + fionaCrystalBonus) - 1;
            }
        } else {
            return 0;
        }
    }

    function basicDmgBuffedDpsPriority2() {
        let indexCheck;
        for(let i =0; i<3; i++) {
            indexCheck = storeIndexCharacter(i, basicDmgCharacterCheck2())
        }
        if(indexCheck !== "N/A") {
            return baseMultResults[indexCheck] * calcOnfieldEleDmg[indexCheck] * calcActiveMultiplier(indexCheck) *
            critMutliplier(indexCheck) * 123.1666667;
        } else {
            return 0;
        }
    }

    function mimiEnduranceDps(characterIndex) {
        if(containsMimi1 && selectedCharacterNames[characterIndex].includes("mimi")) {
            return enduranceDps[characterIndex] * (normalMulti+0.3 + fieldModN[characterIndex])/(normalMulti+ fieldModN[characterIndex]);
        }
    }

    const critConstant1 = -3.71;
    const critConstant2 = 1151;
    const critConstant3 = -49787
    const charLevel = 95;

    function fenrirUptime() {
        return (containsMimi ? 0 : totalTime - (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2)) - (totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2)) -
        (totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2)) - basicDmgTotalTimePriority() - basicDmgTotalTimePriority2() - (reqUptimeTotalTime(1) + reqUptimeTotalTime(2) + reqUptimeTotalTime(0)
        +reqUptimeTotalTimeExtra(0) + reqUptimeTotalTimeExtra(1) + reqUptimeTotalTimeExtra(2)) - .81667 * fenrirA1Dodges())
    }

    function fenrirA6Uptime() {
        return (containsMimi ? (sTrait == "mimi" ? 1 : 0.25) : 1)
    }

    const fenrirNote = (containsFenrir5 ? 80 : 40);

    function pbDmgBonusDmg(characterIndex) {
        const characterName = selectedCharacterNames[characterIndex];
        let bonusDmg = 0;
      
        bonusDmg += characterName.includes("ruby")
          ? actualBurns() * burnMod
          : characterName.includes("king")
          ? 1800
          : calcDodgeBonus(characterIndex);
      
        if (characterName.includes("frigg5") || characterName.includes("frigg6")) {
          bonusDmg += 35 * 15 * 2;
        }
      
        if (characterName.includes("tian")) {
          bonusDmg += tianBonus;
          if (containsFenrir) {
            bonusDmg += tianA3Charge * tianCharge;
          }
        }
      
        if (characterName.includes("alyss")) {
          bonusDmg += alyssHoarFrost;
        }
      
        if (characterName.includes("fenrir")) {
          bonusDmg +=
            fenrirA1Dodges() * 3 * fenrirNote +
            fenrirCombos * 3.5 * fenrirNote +
            totalTime * calcDodgeMatrix();
        }
      
        if (containsLan3 && characterName.includes("lan")) {
          bonusDmg += lanA3Bonus;
        }
      
        if (characterName.includes("rubilia")) {
          bonusDmg += rubiliaFeedback;
        }
      
        if (characterName.includes("yulansweeping")) {
          bonusDmg += yulanAnticipateDmg;
        }
      
        if (containsZeke1 && characterName.includes("zeke")) {
          bonusDmg += 50;
        }
      
        return bonusDmg;
    }

    console.log("check", fenrirA1Dodges())

    const fenrirCombos = fenrirUptime() / (1.41667 + .81667)
    const timeWithoutRevision = totalTime - (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2)) - (totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2)) -
    (totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2)) - totalTimeDodge2() - basicDmgTotalTimePriority() - basicDmgTotalTimePriority2() - 
    (reqUptimeTotalTime(0) + reqUptimeTotalTime(1) + reqUptimeTotalTime(2) + reqUptimeTotalTimeExtra(0) + reqUptimeTotalTimeExtra(1) + reqUptimeTotalTimeExtra(2));

    const tianAutoTime = (containsMimi ? 0 : (containsTian && !containsFenrir) ? timeWithoutRevision - (timeWithoutRevision * .53 / (1.0167 * 2)) : 0);
    const yulanDodgeTime = (containsYulanMartial ? (totalTime - (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2)) - 
    (totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2)) - enduranceRevisedTime() - totalTimeDodge2() - basicDmgTotalTimePriority() - basicDmgTotalTimePriority2() - 
    (totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2)) - (reqUptimeTotalTime(0) + reqUptimeTotalTime(1) + reqUptimeTotalTime(2) 
    + reqUptimeTotalTimeExtra(0) + reqUptimeTotalTimeExtra(1) + reqUptimeTotalTimeExtra(2))) / (1.15 + 1.05): 0)


    if(containsGnonno && !containsGnonno6) {
        passiveDps[findCharacterIndex("gnonno")] = (115*(containsLan ? 4 : 1) + 20 * (containsLan ? 0.25 : 1) * Math.min(1,physicalFieldTime() + 0.2))*gnonnoOcto
    } else if(containsGnonno6) {
        passiveDps[findCharacterIndex("gnonno")] = (115*(containsLan ? 4 : 1) + 90 * (containsLan ? 0.25 : 1) * Math.min(1,physicalFieldTime() + 0.2))*gnonnoOcto
    } 

    function totalTimeDodge() {
        return (!(buffedDmgDodge(0) == 0) ? (containsYulan ? yulanDodgeTime : Math.min(totalTime - (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2)) - 
        (totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2)) - enduranceRevisedTime() - totalTimeDodge2() - basicDmgTotalTimePriority() - basicDmgTotalTimePriority2() -
        (totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2)), dodgeDamageValue[0] * maxDodges)) : 0)
    }


    function basicDmgTotalTime() {
        return totalTime - (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2)) - (totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2)) - 
        (totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2)) - (totalTimeDodge() - totalTimeDodge2() - totalTimeDodge3()) - enduranceRevisedTime() - basicDmgTotalTimePriority() 
        - basicDmgTotalTimePriority2() -(reqUptimeTotalTime(0) + reqUptimeTotalTime(1) + reqUptimeTotalTime(2) + reqUptimeTotalTimeExtra(0) + reqUptimeTotalTimeExtra(1) + reqUptimeTotalTimeExtra(2));
    }

    function basicDmgTotalTimePriority() {
        return Math.min(
            totalTime -
            (totalTimeSkillDmg(0) + totalTimeSkillDmg(1) + totalTimeSkillDmg(2) +
                totalTimeSpSkill(0) + totalTimeSpSkill(1) + totalTimeSpSkill(2) +
                totalTimeDischarge(0) + totalTimeDischarge(1) + totalTimeDischarge(2) +
                basicDmgTotalTimePriority2() +
                reqUptimeTotalTimeExtra(0) + reqUptimeTotalTimeExtra(1) + reqUptimeTotalTimeExtra(2)),
            fionaMainDps
                ? 999
                : containsIcarus
                    ? containsSaki1
                        ? 100
                        : (2 - 0.5667) * calcIcarusDischarge()
                    : 0,
            containsRubyMat4pc
                ? basicDmgCharacterCheck().includes("cobalt") ||
                basicDmgCharacterCheck().includes("anna") ||
                basicDmgCharacterCheck().includes("ruby")
                    ? 0
                    : totalTime / 15
                : containsTian && !containsNemesis6 && !containsFenrir
                    ? (totalTime / 30) * 4.15
                    : basicDmgCharacterCheck().includes("annagas")
                        ? (totalTime / 15) * 1.63
                        : 0,
            basicDmgCharacterCheck().includes("umi")
                ? containsGnonno && umiSupport
                    ? 0
                    : umiSupport
                        ? 0
                        : 18 - 2.083 /*umiskillcast*/ * umiMagicShows
                : 0,
            containsLin && containsYulan && containsFiona ? 999 : 0
        );
    }

    function dmgPercentDodge(characterIndex) {
        if(characterIndex == 0) {
           return buffedDmgDodge(characterIndex) * totalTimeDodge() * extraMultiDodge(characterIndex) 
        } else if(characterIndex == 1) {
            return buffedDmgDodge(characterIndex) * totalTimeDodge2() * extraMultiDodge(characterIndex)
        } else if(characterIndex == 2) {
            return buffedDmgDodge(characterIndex) * totalTimeDodge3() * extraMultiDodge(characterIndex)
        } else {
            return 0;
        }
        
    }

    function dmgPercentBonus(characterIndex) {
        return buffedDmgBonusDmg(characterIndex) * totalCastsBonusDmg(characterIndex) * extraMultiBonusDmg(characterIndex);
    }

    function basicDmgRevisedTime() {
        for(let i = 0; i<3; i++) {
            return ((selectedCharacterNames[i].includes("meryl5") || selectedCharacterNames[i].includes("meryl6")) ? 
            Math.min(basicDmgTotalTime(), totalTime/2 - totalTimeSkillDmg(i) - totalTimeDischarge(i) - enduranceRevisedTime()) : basicDmgTotalTime()) 
        } 
    }

    function enduranceExtraMulti() {
        if (containsSamir && calcEnduranceDps(findCharacterIndex("samir")) == (Math.max(calcEnduranceDps(0), calcEnduranceDps(1), calcEnduranceDps(2)))) {
            const critMultiplier = 1 + (Math.min(naturalCharge * 11 / totalTime, 1) * Math.min(critRate + 0.4, 1) * critDamage + (1 - Math.min(naturalCharge * 11 / totalTime, 1)) * 
            critRate * critDamage) / (1 + critRate * critDamage);
            return critMultiplier;
        } 
        let damageMultiplier = 1;
    
        if (umiSupport && (elementTypes[0] || elementTypes[1] || elementTypes[2]) === "Physical") {
            damageMultiplier *= 1.25;
        }
    
        if (containsFenrir) {
            damageMultiplier *= (1 + Math.min(1, calcFenrirCloneUptime()) * fenrirCloneShred * maxCrMulti / (1 + (voltTrueMulti - 1) / 2));
        }
    
        damageMultiplier *= normalMulti;
        return damageMultiplier;
    }

    function dmgPercentEndurance() {
        return enduranceDmgBuffedDps() * enduranceRevisedTime() * enduranceExtraMulti();
    }

    function extraMultiDischarge(characterIndex) {
        return ((selectedCharacterNames[characterIndex].includes("samir3") || selectedCharacterNames[characterIndex].includes("samir5") || selectedCharacterNames[characterIndex].includes("samir6"))
         ? (1+(Math.min(naturalCharge*11/totalTime,1)*Math.min(critRate+.4, 1)*critDamage+(1-Math.min(naturalCharge*11/totalTime,1)) * critRate*critDamage))/ (1+critRate*critDamage) : 1) *
         (selectedCharacterNames[characterIndex].includes("alyss") && containsAlyss3 ? 1.3 : 1)
    }

    function dmgPercentDischarge(characterIndex) {
        return (buffedDmgDischarge(characterIndex) + 0 /* soon to be extra*/) * (totalCastsDischarge(characterIndex) * (cancelDischarge(characterIndex) || cancelDischarges(characterIndex)
        || ((containsIcarus && containsAlyss && selectedCharacterNames[characterIndex].includes("icarus"))) ? 0 : 1) + bonusCastsDischarge(characterIndex) * .7) * extraMultiDischarge(characterIndex);
    }

    function basicDmgTotalTime2() {
        return basicDmgTotalTime() - basicDmgRevisedTime()
    }

    function dmgPercentBasicDmg(characterIndex) {
        if(characterIndex == 0) {
            return basicDmgBuffedDps().value * basicDmgRevisedTime() * basicDmgExtraMulti()[characterIndex]
        } else if(characterIndex == 1) {
            return basicDmgBuffedDps2().value * basicDmgTotalTime2() * basicDmgExtraMulti()[characterIndex]
        } else if(characterIndex == 2) {
            return basicDmgBuffedDpsPriority() * basicDmgTotalTimePriority() * basicDmgExtraMulti()[characterIndex]
        } else if(characterIndex == 3) {
            return basicDmgBuffedDpsPriority2() * basicDmgTotalTimePriority2() * basicDmgExtraMulti()[characterIndex]
        }
    }

    function dmgPercentReqUptime(characterIndex) {
        return reqUptimeBonusDps(characterIndex) * (reqUptimeTotalTime(characterIndex) + reqUptimeTotalTimeExtra(characterIndex))
    }

    function calcPassiveMod() {
        return (1+((calcOnfieldEleDmg[0] * calcActiveMultiplier(0) * critMutliplier(0) * calcAdditionalMulti(0) - 1) * fieldTime(0) + (calcOnfieldEleDmg[1] * calcActiveMultiplier(1) * 
        critMutliplier(1) * calcAdditionalMulti(1) - 1) * fieldTime(1) + (calcOnfieldEleDmg[2] * calcActiveMultiplier(2) * critMutliplier(2) * calcAdditionalMulti(0)-1)* fieldTime(2))) 
    }

    const linSkillQMult = (selectedCharacterNames[0].includes("lin") ? adjCastsSkillDmg(0) : selectedCharacterNames[1].includes("lin") ? adjCastsSkillDmg(1) : 
    selectedCharacterNames[2].includes("lin") ? adjCastsSkillDmg(2) : 0)/(totalTime/30)
    const zekeFieldTime = (selectedCharacterNames[0].includes("zeke") ? fieldTime(0) : selectedCharacterNames[1].includes("zeke") ? fieldTime(1) : 
    selectedCharacterNames[2].includes("zeke") ? fieldTime(2) : 0);
    const icarusSkills = (selectedCharacterNames[0].includes("icarus") ? adjCastsSkillDmg(0) : selectedCharacterNames[1].includes("icarus") ? adjCastsSkillDmg(1) : 
    selectedCharacterNames[2].includes("icarus") ? adjCastsSkillDmg(2) : 0);
    const weightedOnfieldEle = (calcOnfieldEleDmg[0] * fieldTime(0)) + (calcOnfieldEleDmg[1] * fieldTime(1)) + (calcOnfieldEleDmg[2] * fieldTime(2));
    const frostDischarges = (elementTypes[0] == "Ice" ? totalCastsDischarge(0) : 0) + (elementTypes[1] == "Ice" ? totalCastsDischarge(1) : 0) + 
    (elementTypes[2] == "Ice" ? totalCastsDischarge(2) : 0) + (containsAlyss1 ? calcFrostSkillCount() : 0)
    const friggA3Count = (Math.max(0, frostDischarges-((containsAlyss1 && (containsLin6 === 0)) ? adjCastsSkillDmg(findCharacterIndex("frigg"))/2 : 0)-1))
    const friggA3Dmg = (containsFrigg3 ? (calcPassiveMod() * friggA3Count * frostTrueMulti * frostAttack * frostDebuff * frostGearMod * normalMulti * 500)/totalTime : 0);
    const zekeTransfer = (containsZeke ? (containsZeke6 ? .5 : .3) : 0);
    const liuFiery = (0.015*hp + (1.05*fireAtk*flameAttack) + playerResistance+2*critRate*(critConstant1*(charLevel^2)+critConstant2*charLevel+critConstant3))/(fireAtk)*100
    const liuExplosions = (liuFiery * ((containsFrost || containsPhysical || containsVolt) ? 1.3 : 1));
    const yulanSwiftCut = (0.004*hp + (0.4*frostAtk*frostAttack) + 0.15*playerResistance+.55*critRate*(critConstant1*(charLevel^2)+critConstant2*charLevel+critConstant3))/(frostAtk)*100
    const yulanSwiftCutFinal = (yulanSwiftCut * ((containsFlame || containsPhysical || containsVolt) ? 1.3 : 1));
    const zekePassive = (0.01*hp + (0.7 * physicalAtk*physicalAttack) + .36*playerResistance+1.35*critRate*(critConstant1*(charLevel^2)+critConstant2*charLevel+critConstant3))/(physicalAtk)*100
    const zekePassiveFinal = (zekePassive * ((containsFlame || containsFrost || containsVolt) ? 1.3 : 1));
    const mimiThunderboom = (0.019 * hp + (voltAtk * voltAttack) + 0.688*playerResistance+2.5*critRate*(critConstant1*(charLevel^2) + critConstant2*charLevel+critConstant3))/(voltAtk)*100
    const fenrirQuakes = Math.floor(((containsFenrir1 && containsSaki1) ? 2 : 4+(containsFenrir5 ? 1 : 0) + (containsTian ? (avgHp*4*.3)/.45 : 0)),1)*(adjCastsSkillDmg(findCharacterIndex("fenrir")))
    + (rubiliaSkills*rubiliaThorns*((containsRubilia5 || containsMimi1) ? 100 :(100+50*(totalTime/20)-1)/(totalTime/20)))/45
    const mimiPassive = (mimiThunderboom * ((containsFlame || containsFrost || containsPhysical) ? 1.3 : 1)) + (phantasiaPerEncounter * 5000)/ totalTime;
    if(elementTypes[0] == "Volt" && elementTypes[1] == "Volt" && elementTypes[2] == "Volt" && containsMimi) {
        passiveDps[findCharacterIndex("mimi")] = 125 * skillMulti
    } 

    if(containsRubilia1) {
        passiveDps[findCharacterIndex("rubilia")] = rubiliaThorns * 66.7 / 2
    }

    if(containsFenrir3) {
        passiveDps[findCharacterIndex("fenrir")] = (650 * fenrirQuakes) / totalTime + ((hpBonus*hp*0.015) / voltAtk*100)/voltAttack^2;
    }

    console.log(passiveDps[1])
    console.log(fenrirQuakes)
    console.log(rubiliaSkills)

    function calcPassiveDps(characterIndex) {
        const part1 = calcPassiveMod() * baseMultResults[characterIndex] * calcOnfieldEleDmg[characterIndex] * (
            (passiveDps[characterIndex] * (elementTypes[characterIndex] === "Fire" ? burnMod : 1) * (selectedCharacterNames[characterIndex].includes("lin") ? linSkillQMult : 1) *
                (sTrait === "zeke" && containsZeke && selectedCharacterNames[characterIndex].includes("gnonno") ? 0.5 * zekeFieldTime + 1 : 1) *
                (selectedCharacterNames[characterIndex].includes("gnonno") ? normalMulti : 1) +
                (characterMatriceKey(characterIndex).includes("huma") ? calcDodgeMatrix() * (totalTime - 0) / totalTime : 0) +
                (characterMatriceKey(characterIndex).includes("cobalt") && pbDpsDodge(characterIndex) > 0 ? calcDodgeMatrix() * 2 * burnMod : 0)
            ) +
            (characterMatriceKey(characterIndex).includes("frigg") && containsFrigg ? friggMatrice4pc : 0) +
            (selectedCharacterNames[characterIndex].includes("icarus") ? (totalDischarges * calcIcarusDischarge() + skillCount * icarusSkills) / totalTime : 0) +
            ((containsYulan === 0 && characterMatriceKey(characterIndex).includes("yulan")) || selectedCharacterNames[characterIndex].includes("yulan") ? yulanMatricePassive : 0)
        );
    
        const part2 = onfieldPassive[characterIndex] * baseMultResults[characterIndex] * calcActiveMultiplier(characterIndex) * critMutliplier(characterIndex);
    
        const part3 = (selectedCharacterNames[characterIndex].includes("lin") && linType === "Physical") ? 
            (calcPassiveMod() / baseMultResults[characterIndex] * 50 * physicalTrueMulti * physicalAttack * physicalDebuff * physicalGearMod * normalMulti * linUptimeCapped * weightedOnfieldEle *
                (containsUmi ? (umiMagicShows * 18 / totalTime) * (umiMultiplier - 1) + 1 : 1)
            ) : 0;
    
        const part4 = selectedCharacterNames[characterIndex].includes("frigg") ? friggA3Dmg : 0;
    
        return part1 + part2 + part3 + part4;
    }

    function dmgPercentPassive() {
        return (calcPassiveDps(0) + calcPassiveDps(1) + calcPassiveDps(2)) * totalTime;
    }

    function finalMultiplier() {
        return 1+ fionaCrystalBonus + (checkTypeResonance(typeValue) - 1);
    }

    function echoDamage() {
        return containsZeke
        ? zekeTransfer * (
          (dmgPercentSkill(0) + dmgPercentSkill(1) + dmgPercentSkill(2)) + (dmgPercentSpSk(0) + dmgPercentSpSk(1) + dmgPercentSpSk(2)) + (dmgPercentDischarge(0) + dmgPercentDischarge(1) + dmgPercentDischarge(2)) 
          + (dmgPercentBonus(0) + dmgPercentBonus(1) + dmgPercentBonus(2)) + dmgPercentEndurance() + (dmgPercentDodge(0)+ dmgPercentDodge(1) + dmgPercentDodge(2)) +
          (dmgPercentBasicDmg(0) + dmgPercentBasicDmg(1) + dmgPercentBasicDmg(2) + dmgPercentBasicDmg(3)) + (dmgPercentReqUptime(0) + dmgPercentReqUptime(1) + dmgPercentReqUptime(2)) + totalTime * 
          (
            calcPassiveDps(0) * (containsZeke ? zekeTransfer * fieldTime(0) : 0) +
            calcPassiveDps(1) * (containsZeke ? zekeTransfer * fieldTime(1) : 0) +
            calcPassiveDps(2) * (containsZeke ? zekeTransfer * fieldTime(2) : 0)
          )
        )
        : 0;
    }

    function finalDamage() {
        return (dmgPercentSkill(0) + dmgPercentSkill(1) + dmgPercentSkill(2)) + (dmgPercentSpSk(0) + dmgPercentSpSk(1) + dmgPercentSpSk(2)) + (dmgPercentBonus(0) + dmgPercentBonus(1) + dmgPercentBonus(2)) 
        + (dmgPercentDischarge(0) + dmgPercentDischarge(1) + dmgPercentDischarge(2)) + dmgPercentEndurance() + (dmgPercentDodge(0) + dmgPercentDodge(1) + dmgPercentDodge(2))
        + (dmgPercentBasicDmg(0) + dmgPercentBasicDmg(1) + dmgPercentBasicDmg(2) + dmgPercentBasicDmg(3)) + (dmgPercentReqUptime(0) + dmgPercentReqUptime(1) + dmgPercentReqUptime(2)) + (dmgPercentPassive()) + echoDamage()
    }

  
    function finalFlat() {
        let mimiFieldtime = 0;
        for(let i = 0; i<3; i++) {
            mimiFieldtime += selectedCharacterNames[i].includes("mimi") ? fieldTime(i) : 0
        }

        return (
            (containsLiuhuo ? liuExplosions * totalTime / 1.5 : 0) +
            (containsYulan ? yulanSwiftCutFinal * totalTime * 2 : 0) +
            (containsZeke ? zekePassiveFinal * totalTime : 0) +
            (containsMimi ? mimiPassive * totalTime * mimiFieldtime : 0)
        );
    }

    function checkTypeResonance(typeValue) {
        const resonanceTypes = {}; // Initialize an object to count resonance types
    
        // Count the number of each resonance type in the party
        typeValue.forEach(value => {
            resonanceTypes[value] = (resonanceTypes[value] || 0) + 1;
        });
    
        // Check for resonance effects
        if (resonanceTypes['Attack'] === 2) {
            return 1.10;
        } else if (resonanceTypes['Benediction'] === 2) {
            return 1;
        } else if (resonanceTypes['Fortitude'] === 2) {
            return 1;
        } else if (
            resonanceTypes['Attack'] === 1 &&
            resonanceTypes['Benediction'] === 1 &&
            resonanceTypes['Fortitude'] === 1
        ) {
            return 1.05;
        } else {
            return 1;
        }
    }

    function greviousAssumption() {
        if(globalResonance == "Physical") {
            return 1;
        }
        else {
            return 0;
        }
    }

    
    function totalDmgPercent() {
        return (finalDamage()*finalMultiplier() + finalFlat())
    }

    function dmgPercentPerMin() {
        return totalDmgPercent() / (totalTime/60) * (greviousAssumption() ? 1 + .2 : 1)
    }

    function dmgTotal() {
        return (dmgPercentPerMin()/100000*alteredAtk*((critRate)*(1-critDamage)+ (1-critRate)))*1.1;
    }

    console.log("FDMulti:", FDMulti);
    console.log("AllEleDmg:", AllEleDmg);  
    console.log("flameTrueMulti:", flameTrueMulti);
    console.log("flameAttack:", flameAttack);
    console.log("flameDebuff:", flameDebuff);
    console.log("flameGearMod:", flameGearMod);
    console.log("normalMulti:", normalMulti);
    console.log("flameEleDmg:", flameEleDmg);
    console.log("flameResistMulti:", flameResistMulti);

    console.log("frostTrueMulti:", frostTrueMulti);
    console.log("frostAttack:", frostAttack);
    console.log("frostDebuff:", frostDebuff);
    console.log("frostGearMod:", frostGearMod);
    console.log("frostEleDmg:", frostEleDmg);
    console.log("frostResistMulti:", frostResistMulti);
 
    console.log("physicalTrueMulti:", physicalTrueMulti);
    console.log("physicalAttack:", physicalAttack);
    console.log("physicalDebuff:", physicalDebuff);
    console.log("physicalGearMod:", physicalGearMod);
    console.log("physicalEleDmg:", physicalEleDmg);
    console.log("physicalResistMulti:", physicalResistMulti);
 
    console.log("voltTrueMulti:", voltTrueMulti);
    console.log("voltAttack:", voltAttack);
    console.log("voltDebuff:", voltDebuff);
    console.log("voltGearMod:", voltGearMod);
    console.log("voltEleDmg:", voltEleDmg);
    console.log("voltResistMulti:", voltResistMulti);

    console.log("base mult results", baseMultResults[0], baseMultResults[1], baseMultResults[2])
    console.log("onfield ele", calcOnfieldEleDmg[0], calcOnfieldEleDmg[1], calcOnfieldEleDmg[2])
    console.log("active multi", calcActiveMultiplier(0), calcActiveMultiplier(1), calcActiveMultiplier(2))
    console.log("crit multi", critMutliplier(0), critMutliplier(1), critMutliplier(2))
    console.log("max auto", calcMaxAutoDps(0), calcMaxAutoDps(1), calcMaxAutoDps(2))
    console.log("endurance dps", calcEnduranceDps(0), calcEnduranceDps(1), calcEnduranceDps(2))
    console.log("dodge dps", calcDodgeDps(0), calcDodgeDps(1), calcDodgeDps(2))
    console.log("dmgperDodge", calcDodgeDamage(0), calcDodgeDamage(1), calcDodgeDamage(2))
    console.log("passivedps", calcPassiveDps(0), calcPassiveDps(1), calcPassiveDps(2))
    console.log("fieldtime", fieldTime(0), fieldTime(1), fieldTime(2))
    console.log("skill multi", calcSkillMulti(0), calcSkillMulti(1), calcSkillMulti(2))
    console.log("dscharge multi", calcDischargeMulti(0), calcDischargeMulti(1), calcDischargeMulti(2))
    console.log("additional multi", calcAdditionalMulti(0), calcAdditionalMulti(1), calcAdditionalMulti(2))
    console.log("total multi", calcTotalMulti(0), calcTotalMulti(1), calcTotalMulti(2))

    console.log("\n")

    console.log("skilldmgpb", pbDmgSkill(0), pbDmgSkill(1), pbDmgSkill(2))
    console.log("buffeddmgskill", buffedDmgSkill(0), buffedDmgSkill(1), buffedDmgSkill(2))
    console.log("totaltimeskill", totalTimeSkillDmg(0), totalTimeSkillDmg(1), totalTimeSkillDmg(2))
    console.log("maxcastsskill", maxCastsSkillDmg(0), maxCastsSkillDmg(1), maxCastsSkillDmg(2))
    console.log("adjcastsskill", adjCastsSkillDmg(0), adjCastsSkillDmg(1), adjCastsSkillDmg(2))
    console.log("extramultiskill", extraMultiSkill(0), extraMultiSkill(1), extraMultiSkill(2))
    console.log("bonuscastsskill", bonusCastsSkill(0), bonusCastsSkill(1), bonusCastsSkill(2))
    console.log("dmgpercentskill", dmgPercentSkill(0), dmgPercentSkill(1), dmgPercentSkill(2))
    console.log("cancelfactorskill", cancelFactorSkill(0), cancelFactorSkill(1), cancelFactorSkill(2))
    console.log("priority", calcPriority()[0], calcPriority()[1], calcPriority()[2])
    console.log("bonusdmgskill", bonusDmgSkill(0), bonusDmgSkill(1), bonusDmgSkill(2))

    console.log("\n")

    console.log("dischargedmgpb", pbDmgDischarge(0), pbDmgDischarge(1), pbDmgDischarge(2))
    console.log("dischargebdmg", buffedDmgDischarge(0), buffedDmgDischarge(1), buffedDmgDischarge(2))
    console.log("dischargebdps", bDpsDischarge(0), bDpsDischarge(1), bDpsDischarge(2))
    console.log("dischargebextradmg")
    console.log("dischargetotaltime", totalTimeDischarge(0), totalTimeDischarge(1), totalTimeDischarge(2))
    console.log("dischargetotalcasts", totalCastsDischarge(0), totalCastsDischarge(1), totalCastsDischarge(2))
    console.log("dischargebonuscasts", bonusCastsDischarge(0), bonusCastsDischarge(1), bonusCastsDischarge(2))
    console.log("dischargeextramulti", extraMultiDischarge(0), extraMultiDischarge(1), extraMultiDischarge(2))
    console.log("dischargedmgpercent", dmgPercentDischarge(0), dmgPercentDischarge(1), dmgPercentDischarge(2))
    console.log("dischargeadjprior", rawPriorityDischarge(0), rawPriorityDischarge(1), rawPriorityDischarge(2))
    console.log("dischargecastcalc", castCalcDischarge(0), castCalcDischarge(1), castCalcDischarge(2))
    console.log("dischargecancel", cancelDischarge(0), cancelDischarge(1), cancelDischarge(2))

    console.log("\n")

    console.log("pbdpsdodge", pbDpsDodge(0), pbDpsDodge(1), pbDpsDodge(2))
    console.log("buffeddmgdodge", buffedDmgDodge(0), buffedDmgDodge(1), buffedDmgDodge(2))
    console.log("dodgedmgpercent", dmgPercentDodge(0), dmgPercentDodge(1) ,dmgPercentDodge(2))
    console.log("dodgetotaltime", totalTimeDodge(), totalTimeDodge2(), totalTimeDodge3())
    console.log("maxdodges", maxDodges, maxDodgesPrimary(), maxDodgesSecondary())

    console.log("\n")

    console.log("basicdmgbuffed", basicDmgBuffedDps().value)
    console.log("basicdmgbuffedsecondary", basicDmgBuffedDps2().value)
    console.log("basicdmgbuffedprio", basicDmgBuffedDpsPriority())
    console.log("basicdmgbuffedprio2", basicDmgBuffedDpsPriority2())
    console.log("basicdmgtotaltime", basicDmgTotalTime(), basicDmgTotalTime2(), basicDmgTotalTimePriority(), basicDmgTotalTimePriority2())
    console.log("basicdmgrev", basicDmgRevisedTime())
    console.log("basicdmgextramulti", basicDmgExtraMulti()[0], basicDmgExtraMulti()[1], basicDmgExtraMulti()[2])
    console.log("basicdmgpercent", dmgPercentBasicDmg(0), dmgPercentBasicDmg(1), dmgPercentBasicDmg(2), dmgPercentBasicDmg(3))

    console.log("\n")

    console.log("bonusdmgpbdmg", pbDmgBonusDmg(0), pbDmgBonusDmg(1), pbDmgBonusDmg(2))
    console.log("bonusdmgbuff", buffedDmgBonusDmg(0), buffedDmgBonusDmg(1), buffedDmgBonusDmg(2))
    console.log("bonusdmgtotalcasts", totalCastsBonusDmg(0), totalCastsBonusDmg(1), totalCastsBonusDmg(2))
    console.log("bonusextramulti", extraMultiBonusDmg(0), extraMultiBonusDmg(1), extraMultiBonusDmg(2))
    console.log("bonusdmgpercent", dmgPercentBonus(0), dmgPercentBonus(1), dmgPercentBonus(2))

    console.log("\n")

    console.log("requptimetotaltime", reqUptimeTotalTime(0), reqUptimeTotalTime(1), reqUptimeTotalTime(2))
    console.log("requptimetotaltimeextra", reqUptimeTotalTimeExtra(0), reqUptimeTotalTimeExtra(1), reqUptimeTotalTimeExtra(2))

    console.log("\n")

    console.log("passivedps", dmgPercentPassive())
    console.log("dmgpercent", totalDmgPercent())
    console.log("finaldmg", finalDamage())
    console.log("finalmulti", finalMultiplier())
    console.log("finalflat", finalFlat())
    console.log("echodmg", echoDamage())

    return {
        totalDmgPercent: totalDmgPercent().toFixed(2),
        dmgPercentPerMin: dmgPercentPerMin().toFixed(2),
        dmgTotal: dmgTotal().toFixed(2),
    };
}


function formatCharacterInput(input) {
    // Extract the character name and star rating from the input
    const matches = input.match(/^([a-zA-Z]+)(\d*)$/);
  
    if (matches) {
      const characterName = matches[1];
      const starRating = matches[2] ? ` **${matches[2]}☆` : ''; // Bold star rating
      return `${characterName.charAt(0).toUpperCase()}${characterName.slice(1)}${starRating}**`;
    } else {
      // Handle invalid input
      return 'Invalid Character';
    }
}

function formatMatrixInput(input) {
    // Extract the matrix name, star rating, and pc number from the input
    const matches = input.match(/^([a-zA-Z0-9]+)(\d+)pc(\d+)$/);
  
    if (matches) {
      const matrixName = matches[1];
      const starRating = matches[3] ? ` ${matches[3]}☆` : ''; // Include the star rating with space
      const pcNumber = matches[2] ? `${matches[2]}pc` : ''; // Include pc number without space
      return `**${matrixName.charAt(0).toUpperCase()}${matrixName.slice(1)}${pcNumber}${starRating}**`;
    } else {
      // Handle invalid input
      return 'Invalid Matrix';
    }
}

function formatTraitInput(input) {
    return input.replace(/\b\w/g, (match) => match.toUpperCase());
}

function getMatrixEmoji(matrixInput) {
    const matrixNames = Object.keys(matriceEmoji);
    const matches = stringSimilarity.findBestMatch(matrixInput, matrixNames);
  
    // Get the best match
    const bestMatch = matches.bestMatch;
  
    // Lower the similarity threshold (e.g., 0.6) to make matching less strict
    if (bestMatch.rating >= 0.3) {
      const matrixName = bestMatch.target;
      return matriceEmoji[matrixName];
    } else {
      // If no suitable match is found, return 'Invalid Matrix'
      return 'Invalid Matrix';
    }
}

function getCharacterEmoji(characterInput) {
    const characterNames = Object.keys(characterEmoji);
    const matches = stringSimilarity.findBestMatch(characterInput, characterNames);
  
    // Get the best match
    const bestMatch = matches.bestMatch;
  
    // Lower the similarity threshold (e.g., 0.6) to make matching less strict
    if (bestMatch.rating >= 0.3) {
      const characterName = bestMatch.target;
      return characterEmoji[characterName];
    } else {
      // If no suitable match is found, return 'Invalid Character'
      return 'Invalid Character';
    }
}

function formatSkillInput(input) {
   return input.replace(/\b\w/g, (match) => match.toUpperCase());
}

// Function to get the emoji for a skill name
function getSkillEmoji(skillInput) {
    const skillNames = Object.keys(skillEmoji);
    const matches = stringSimilarity.findBestMatch(skillInput, skillNames);

    // Get the best match
    const bestMatch = matches.bestMatch;

    // Lower the similarity threshold (e.g., 0.3) to make matching less strict
    if (bestMatch.rating >= 0.3) {
        const skillName = bestMatch.target;
        return skillEmoji[skillName];
    } else {
        // If no suitable match is found, return 'Invalid Skill'
        return 'Invalid Skill';
    }
}

async function finalDmg(interaction) {
    const { commandName, options } = interaction;

    if (commandName === 'dps') {
        const sCD1 = options.getString('character1');
        const sCD2 = options.getString('character2');
        const sCD3 = options.getString('character3');
        const sM1 = options.getString('matrices1');
        const sM2 = options.getString('matrices2');
        const sM3 = options.getString('matrices3');
        const sTrait = options.getString('trait');
        let fionaSk1 = "NA"
        let fionaSk2 = "NA"
        if(options.getString('skill1') == null || options.getString('skill2') == null) {
            fionaSk1 = "NA"
            fionaSk2 = "NA"
        } else {
            fionaSk1 = options.getString('skill1');
            fionaSk2 = options.getString('skill2');
        }

        const normalizedCharacter1 = normalizeCharacterName(sCD1); // Outputs: "fionaX6"
        const normalizedCharacter2 = normalizeCharacterName(sCD2);
        const normalizedCharacter3 = normalizeCharacterName(sCD3);
        const normalizedMatrix1 = findClosestMatrixMatch(sM1); // Outputs: "fiona4pc3"
        const normalizedMatrix2 = findClosestMatrixMatch(sM2);
        const normalizedMatrix3 = findClosestMatrixMatch(sM3);
        const normalizedTrait = normalizeTraitName(sTrait); // Outputs: "yulan"
        
        const formattedCharacter1 = formatCharacterInput(normalizedCharacter1);
        const formattedCharacter2 = formatCharacterInput(normalizedCharacter2);
        const formattedCharacter3 = formatCharacterInput(normalizedCharacter3);

        const characterEmoji1 = getCharacterEmoji(normalizedCharacter1);
        const characterEmoji2 = getCharacterEmoji(normalizedCharacter2);
        const characterEmoji3 = getCharacterEmoji(normalizedCharacter3);

        const formattedMatrix1 = formatMatrixInput(normalizedMatrix1);
        const formattedMatrix2 = formatMatrixInput(normalizedMatrix2);
        const formattedMatrix3 = formatMatrixInput(normalizedMatrix3);

        const matriceEmoji1 = getMatrixEmoji(normalizedMatrix1);
        const matriceEmoji2 = getMatrixEmoji(normalizedMatrix2);
        const matriceEmoji3 = getMatrixEmoji(normalizedMatrix3);

        const formattedTrait = formatTraitInput(normalizedTrait);
        const traitEmoji = getCharacterEmoji(normalizedTrait);

        const formattedSkill1 = formatSkillInput(fionaSk1);
        const formattedSkill2 = formatSkillInput(fionaSk2);

        const skillEmoji1 = getSkillEmoji(fionaSk1);
        const skillEmoji2 = getSkillEmoji(fionaSk2);

        dpsCalcFinal = calculateDPS(normalizedCharacter1, normalizedCharacter2, normalizedCharacter3, normalizedMatrix1, normalizedMatrix2, normalizedMatrix3,
            normalizedTrait, fionaSk1, fionaSk2);

        if (typeof dpsCalcFinal === 'string') {
            // This means there was an error in the inputs, return the error message
            await interaction.reply({ content: dpsCalcFinal, ephemeral: true });
        } else {
            // Inputs are valid, proceed with the embed
            const dpsTitle = `**Damage Calculator V1.0.1**`;

            const embed = new EmbedBuilder()
                .setTitle(dpsTitle)
                .setColor(0x18e1ee)
                .setTimestamp(Date.now())
                .setDescription(`**Team Details**`)
                .addFields(
                    {
                        name: `${characterEmoji1} ${formattedCharacter1}`,
                        value: `${matriceEmoji1} ${formattedMatrix1}`,
                        inline: true, // Display fields inline
                    },
                    {
                        name: `${characterEmoji2} ${formattedCharacter2}`,
                        value: `${matriceEmoji2} ${formattedMatrix2}`,
                        inline: true,
                    },
                    {
                        name: `${characterEmoji3} ${formattedCharacter3}`,
                        value: `${matriceEmoji3} ${formattedMatrix3}`,
                        inline: true,
                    },
                    {
                        name: `**Trait**`,
                        value: `${traitEmoji} ${formattedTrait}`,
                        inline: true,
                    },
                    {
                        name: `**Skill 1**`,
                        value: `${skillEmoji1} ${formattedSkill1}`,
                        inline: true,
                    },
                    {
                        name: `**Skill 2**`,
                        value: `${skillEmoji2} ${formattedSkill2}`,
                        inline: true,
                    },
                    { name: '\u200B', value: '\u200B' },
                    {
                        name: 'Total Damage%',
                        value: `\`${dpsCalcFinal.totalDmgPercent}\``,
                        inline: true,
                    },
                    {
                        name: 'Dmg% Per Min',
                        value: `\`${dpsCalcFinal.dmgPercentPerMin}\``,
                        inline: true,
                    },
                    {
                        name: 'Damage Total',
                        value: `\`${dpsCalcFinal.dmgTotal}\``,
                        inline: true,
                    }
                )
                .setColor('#ff9900');

            await interaction.reply({ embeds: [embed] });
        }
    }
}



module.exports = {
    finalDmg,
    calculateDPS
};



    //  =IF(AND(umiSupport,REGEXMATCH($A21,"Umi")=FALSE,$B21="Physical"),1.25,1)*(1+IF(AND(fionaSlot,OR(fionaS1="Maelstrom",fionaS2="Maelstrom")
    //  ,MAX($G21,$H21)=LARGE($G$21:$H$23,1)),IF(AND(trait="Fiona",$B21="Physical"),0.61,0.28)*IF(yulanDPS,0.78,IF(gnnSlot,0.68,IF(umiSlot,0,0.7))),0))


calculateDPS("yulansweeping6", "fiona6", "icarus6", "fiona4pc3", "yulan4pc3", "icarus4pc3", "yulan", "hydro", "torrential");
console.log(findClosestMatrixMatch("fionamatrice4piece3")); 
// Now you can access the data for a specific character selection

  