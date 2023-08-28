const fs = require('fs');

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

    "sakifuwa": parsedCharacterData.characters["Saki Fuwa"],
    "sakifuwa1": parsedCharacterData.characters["Saki Fuwa ☆1"],
    "sakifuwa3": parsedCharacterData.characters["Saki Fuwa ☆3"],
    "sakifuwa6": parsedCharacterData.characters["Saki Fuwa ☆6"],

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

    "annabellagas": parsedCharacterData.characters["Annabella (Gas)"],
    "annabellagas1": parsedCharacterData.characters["Annabella (Gas) ☆1"],
    "annabellagas3": parsedCharacterData.characters["Annabella (Gas) ☆3"],
    "annabellagas5": parsedCharacterData.characters["Annabella (Gas) ☆5"],
    "annabellagas6": parsedCharacterData.characters["Annabella (Gas) ☆6"],
    "annabellaburn": parsedCharacterData.characters["Annabella (Burn)"],
    "annabellaburn1": parsedCharacterData.characters["Annabella (Burn) ☆1"],
    "annabellaburn3": parsedCharacterData.characters["Annabella (Burn) ☆3"],
    "annabellaburn5": parsedCharacterData.characters["Annabella (Burn) ☆5"],
    "annabellaburn6": parsedCharacterData.characters["Annabella (Burn) ☆6"],

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

    "gnonno": parsedCharacterData.characters["Gnunno"],
    "gnonno1": parsedCharacterData.characters["Gnunno ☆1"],
    "gnonno3": parsedCharacterData.characters["Gnunno ☆3"],
    "gnonno5": parsedCharacterData.characters["Gnunno ☆5"],
    "gnonno6": parsedCharacterData.characters["Gnunno ☆6"],

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
    "zeke6": parsedCharacterData.characters["Zeke ☆6"]
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

    "annabella4pc0": parsedMatriceData.matrices["Annabella 4pc ☆0"],
    "annabella4pc1": parsedMatriceData.matrices["Annabella 4pc ☆1"],
    "annabella4pc2": parsedMatriceData.matrices["Annabella 4pc ☆2"],
    "annabella4pc3": parsedMatriceData.matrices["Annabella 4pc ☆3"],

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
};

const skillsSelection = {
    "crashingfalls": parsedSkillsData.skills["Crashing Falls"],
    "hydro": parsedSkillsData.skills["Hydro Focus"],
    "vortex": parsedSkillsData.skills["Vortex"],
    "torrential": parsedSkillsData.skills["Torrential Force"],
    "maelstrom": parsedSkillsData.skills["Maelstrom"],
    "aquashackles": parsedSkillsData.skills["Aqua Shackles"],
    "wellspring": parsedSkillsData.skills["Wellspring"],
};






function calculateDPS(sCD1, sCD2, sCD3, sM1, sM2, sM3, sTrait, fionaSk1, fionaSk2) {


    const selectedCharacterData1 = characterSelections[sCD1];
    const selectedCharacterData2 = characterSelections[sCD2];
    const selectedCharacterData3 = characterSelections[sCD3];

    const selectedMatrice1 = matriceSelections[sM1];
    const selectedMatrice2 = matriceSelections[sM2];
    const selectedMatrice3 = matriceSelections[sM3];

    const selectedTrait = traitSelection[sTrait];

    const selectedSkill1 = skillsSelection[fionaSk1];
    const selectedSkill2 = skillsSelection[fionaSk2];

    const naturalCharge = 12;
    const encounterTime = 180;
    const phantasiaPerEncounter = 0;
    const ShatterPerEncounter = 3;

    const selectedMatrices = [selectedMatrice1, selectedMatrice2, selectedMatrice3];
    const selectedMatricesNames = [sM1, sM2, sM3];
    const selectedCharacterNames = [sCD1, sCD2, sCD3];

    
    //simulacra 1 data
    const type1 = selectedCharacterData1.type;
    const element1 = selectedCharacterData1.element;
    const maxAutoDPS1 = selectedCharacterData1.maxAutoDPS;
    let skillDamage1 = selectedCharacterData1.skillDamage;
    const endurancePerSecond1 = selectedCharacterData1.endurancePerSecond;
    const enduranceDPS1 = selectedCharacterData1.enduranceDPS;
    const dodgeTime1 = selectedCharacterData1.dodgeTime;
    const dodgeDamage1 = selectedCharacterData1.dodgeDamage;
    const dodgeHits1 = selectedCharacterData1.dodgeHits;
    const skillCooldown1 = selectedCharacterData1.skillCooldown;
    const skillCast1 = selectedCharacterData1.skillCast;
    const damagePerDischarge1 = selectedCharacterData1.damagePerDischarge;
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
    const onFieldCritRate1 = selectedCharacterData1.onFieldCritRate;
    const specialSkillDamage1 = selectedCharacterData1.specialSkillDamage;
    const specialSkillCast1 = selectedCharacterData1.specialSkillCast;
    const specialSkillCooldown1 = selectedCharacterData1.specialSkillCooldown;

    const damagePerDodgeValue = [(selectedCharacterData1.dodgeDamage/selectedCharacterData1.dodgeTime), (selectedCharacterData2.dodgeDamage/selectedCharacterData2.dodgeTime), (selectedCharacterData3.dodgeDamage/selectedCharacterData3.dodgeTime3)];
    const dodgeDamageValue = [selectedCharacterData1.dodgeDamage, selectedCharacterData2.dodgeDamage, selectedCharacterData3.dodgeDamage];
    const maxAutoDpsValue = [selectedCharacterData1.maxAutoDPS, selectedCharacterData2.maxAutoDPS, selectedCharacterData3.maxAutoDPS];
    const enduranceDpsValue = [selectedCharacterData1.enduranceDPS, selectedCharacterData2.enduranceDPS2, selectedCharacterData3.enduranceDPS];
    const endurancePerSecondValue = [selectedCharacterData1.endurancePerSecond, selectedCharacterData2.enduranceDPS2, selectedCharacterData3.enduranceDPS3];

    //simulacra 2 dat
    const type2 = selectedCharacterData2.type;
    const element2 = selectedCharacterData2.element;
    const maxAutoDPS2 = selectedCharacterData2.maxAutoDPS;
    let skillDamage2 = selectedCharacterData2.skillDamage;
    const endurancePerSecond2 = selectedCharacterData2.endurancePerSecond;
    const enduranceDPS2 = selectedCharacterData2.enduranceDPS;
    const dodgeTime2 = selectedCharacterData2.dodgeTime;
    const dodgeDamage2 = selectedCharacterData2.dodgeDamage;
    const dodgeHits2 = selectedCharacterData2.dodgeHits;
    const skillCooldown2 = selectedCharacterData2.skillCooldown;
    const skillCast2 = selectedCharacterData2.skillCast;
    const damagePerDischarge2 = selectedCharacterData2.damagePerDischarge;
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
    const onFieldCritRate2 = selectedCharacterData2.onFieldCritRate;
    const specialSkillDamage2 = selectedCharacterData2.specialSkillDamage;
    const specialSkillCast2 = selectedCharacterData2.specialSkillCast;
    const specialSkillCooldown2 = selectedCharacterData2.specialSkillCooldown;

    //simulacra 3 data
    const type3 = selectedCharacterData3.type;
    const element3 = selectedCharacterData3.element;
    const maxAutoDPS3 = selectedCharacterData3.maxAutoDPS;
    let skillDamage3 = selectedCharacterData3.skillDamage;
    const endurancePerSecond3 = selectedCharacterData3.endurancePerSecond;
    const enduranceDPS3 = selectedCharacterData3.enduranceDPS;
    const dodgeTime3 = selectedCharacterData3.dodgeTime;
    const dodgeDamage3 = selectedCharacterData3.dodgeDamage;
    const dodgeHits3 = selectedCharacterData3.dodgeHits;
    const skillCooldown3 = selectedCharacterData3.skillCooldown;
    const skillCast3 = selectedCharacterData3.skillCast;
    const damagePerDischarge3 = selectedCharacterData3.damagePerDischarge;
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
    const onFieldCritRate3 = selectedCharacterData3.onFieldCritRate;
    const specialSkillDamage3 = selectedCharacterData3.specialSkillDamage;
    const specialSkillCast3 = selectedCharacterData3.specialSkillCast;
    const specialSkillCooldown3 = selectedCharacterData3.specialSkillCooldown;

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
    const tTotalMod = selectedTrait.traitTotalMod;
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


    let frostAtk = 28000;
    let voltAtk = 21000;
    let physicalAtk = 21000;
    let fireAtk = 21000;
    let globalResonance = "N/A";
    const atkValues = {
        Ice: frostAtk,
        Fire: fireAtk,
        Physical: physicalAtk,
        Volt: voltAtk
      };

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
    else if(resonance1.includes("All") || resonance2.includes("All") || resonance3.includes("All")) {
        frostAtk = 28000;
        voltAtk = 28000;
        fireAtk = 28000;
        physicalAtk = 28000;
        globalResonance = "All";
    }

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
    const characterTypes = [type1, type2, type3];

    const contains2elements = [...new Set(elementTypes)].length >= 2;
    const contains2types = [...new Set(characterTypes)].length >= 2;
    const containsFiona = selectedCharacterNames.some(name => name.includes("fiona"));
    const containsLin = selectedCharacterNames.some(name => name.includes("lin"));
    const containsLin6 = selectedCharacterNames.some(name => name.includes("lin6"));
    const containsYulan = selectedCharacterNames.some(name => name.includes("yulan"));
    const containsAlyss = selectedCharacterNames.some(name => name.includes("alyss"));
    const containsAlyss6 = selectedCharacterNames.some(name => name.includes("alyss6"));
    const containsIcarus = selectedCharacterNames.some(name => name.includes("icarus"));
    const containsLiuhuo = selectedCharacterNames.some(name => name.includes("liu"));
    const containsGnonno = selectedCharacterNames.some(name => name.includes("gnonno"));
    const containsRubilia = selectedCharacterNames.some(name => name.includes("rubilia"));
    const containsNemesis = selectedCharacterNames.some(name => name.includes("nemesis"));
    const containsLyra = selectedCharacterNames.some(name => name.includes("lyra"));
    const containsLyraMat = selectedMatricesNames.some(name => name.includes("lyra"));
    const containsUmi = selectedCharacterNames.some(name => name.includes("umi"));
    const containsUmi1 = selectedCharacterNames.some(name => name.includes("umi1") || name.includes("umi3") || name.includes("umi5") || name.includes("umi6"));
    const containsUmi3 = selectedCharacterNames.some(name => name.includes("umi3") || name.includes("umi5") || name.includes("umi6"));
    const containsClaudia = selectedCharacterNames.some(name => name.includes("claudia"));
    const containsUmi5 = selectedCharacterNames.some(name => name.includes("umi5") || name.includes("umi6"));
    const containsLan6 = selectedCharacterNames.some(name => name.includes("lan6"));
    const containsLan5 = selectedCharacterNames.some(name => name.includes("lan5") || name.includes("lan6"));
    const containsLan = selectedCharacterNames.some(name => name.includes("lan"));
    const containsFenrir = selectedCharacterNames.some(name => name.includes("fenrir"));
    const containsFenrir6 = selectedCharacterNames.some(name => name.includes("fenrir6"));
    const containsTian6 = selectedCharacterNames.some(name => name.includes("tian6"));
    const annaGas = selectedCharacterNames.some(name => name.includes("annabellagas"));
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
    let alyss2pAdd = 0;
    let resistance = .45;
    let umiMagicShowValue = 0;
    let umiSupportValue = 0;
    let umiMultiplier = 0;

    umiMultiplier = (containsUmi1 ? .15 : 0) + 1

    let umiChargeTime = containsUmi5 ? (containsLyra || containsGnonno) ? (containsLyra || containsGnonno) ? 12 : 20 : 18 : 50
    let umiMagicShowTotal = Math.floor(1+(totalTime))
      

    for (const characterMatrix of selectedMatricesNames) {
        if (characterMatrix.includes("fiona4pc")) {
            if(containsFiona) {
                const fionaMatriceTotalMod = matriceSelections[characterMatrix].totalMod;
                FDMulti += fionaMatriceTotalMod + (alteredAtk / 1000000);
            }
          fionaMatrice2pc += matriceSelections[characterMatrix].additional;
        } else if (characterMatrix.includes("yulan4pc") && containsFrost) {
          const yulanMatriceAdditional = matriceSelections[characterMatrix].additional;  
          const yulanMatriceTotalMod = matriceSelections[characterMatrix].totalMod;
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
        } else if (characterMatrix.includes("annabella4pc")) {
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
        } else if (characterMatrix.includes("zeke")) {
            zekeMatrice2pc = matriceSelections[characterMatrix].additional;
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

    let frostTrueMulti = (
        (1 + (buffType1 === 'All' || "Ice" === (buffType1) ? damageBuffAverage1 : 0)) *
        (1 + (buffType2 === 'All' || "Ice" === (buffType2) ? damageBuffAverage2 : 0)) *
        (1 + (buffType3 === 'All' || "Ice" === (buffType3) ? damageBuffAverage3 : 0)) *
        (1 + tPassiveDmg + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
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
        (1 + (buffType1 === 'All' || "Fire" === (buffType1) ? damageBuffAverage1 : 0)) *
        (1 + (buffType2 === 'All' || "Fire" === (buffType2) ? damageBuffAverage2 : 0)) *
        (1 + (buffType3 === 'All' || "Fire" === (buffType3) ? damageBuffAverage3 : 0)) *
        (1 + tPassiveDmg + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
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
        (1 + (buffType1 === 'All' || "Volt" === (buffType1) ? damageBuffAverage1 : 0)) *
        (1 + (buffType2 === 'All' || "Volt" === (buffType2) ? damageBuffAverage2 : 0)) *
        (1 + (buffType3 === 'All' || "Volt" === (buffType3) ? damageBuffAverage3 : 0)) *
        (linType === 'Volt' ? 1 + 0.1 * linUptimeCapped : 1) *
        (1 + tPassiveDmg + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
        (1 + voltSense) *
        elementalist *
        universalResonance    
        );

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
        (1 + (buffType1 === 'All' || "Physical" === (buffType1) ? damageBuffAverage1 : 0)) *
        (1 + (buffType2 === 'All' || "Physical" === (buffType2) ? damageBuffAverage2 : 0)) *
        (1 + (buffType3 === 'All' || "Physical" === (buffType3) ? damageBuffAverage3 : 0)) *
        (1 + tPassiveDmg + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
        elementalist *
        universalResonance    
        );

    let physicalAttack = (
        (1 + (attackBuffType1 === 'All' || attackBuffType1 === "Physical" ? attackBuffAverage1 : 0) +
             (attackBuffType2 === 'All' || attackBuffType2 === "Physical" ? attackBuffAverage2 : 0) +
             (globalResonance === 'Altered' ? 0.2 : 0) +
             (attackBuffType3 === 'All' || attackBuffType3 === "Physical" ? attackBuffAverage3 : 0) +
             (globalResonance === "Physical" || globalResonance === "All" ? 0.15 : 0)) +
             (linType === 'N/A' ? 0.15 * linUptimeCapped : 0) +
             linMatrice2pc + fionaMatrice2pc + zekeMatrice2pc        
    );

    let physicalDebuff =
    (1 + (debuffType1 === "All" || debuffType1 === "Physical" ? debuffAverage1 : 0)) *
    (1 + (debuffType2 === "All" || debuffType2 === "Physical" ? debuffAverage2 : 0)) *
    (1 + (debuffType3 === "All" || debuffType3 === "Physical" ? debuffAverage3 : 0));

    let physicalGearMod = (sTrait === "zeke" ? highestAtkValue : physicalAtk) / 
    (atkWarning ? (("Physical") === highestAtkName ? highestAtkValue : highestAtk2) : Math.max(fireAtk, voltAtk, physicalAtk, frostAtk));

    let physicalEleDmg = (1+ umiMatrice4pc + lanPhysical4pc);

    let physicalResistMulti = (1 - resistance * (1 - ((containsFenrir ? 0.2 : 0) + (containsUmi5 ? 0.1 * 20 / 30 : 0) + 
    (fionaSk1 === "Aqua Shackles" || fionaSk2 === "Aqua Shackles" ? (sTrait === "Fiona" ? 0.1 : 0.08) : 0)))) / (1 - resistance);

    let alteredTrueMulti = (
        (1 + (buffType1 === 'All' || "Altered" === (buffType1) ? damageBuffAverage1 : 0)) *
        (1 + (buffType2 === 'All' || "Altered" === (buffType2) ? damageBuffAverage2 : 0)) *
        (1 + (buffType3 === 'All' || "Altered" === (buffType3) ? damageBuffAverage3 : 0)) *
        (1 + tPassiveDmg + (sTrait === 'fenrir' && (globalResonance === 'All' || globalResonance === 'N/A') ? 0.05 : 0)) *
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
      

      console.log("FDMulti:", FDMulti);
      console.log("AllEleDmg:", AllEleDmg);
      
      console.log("frostTrueMulti:", frostTrueMulti);
      console.log("frostAttack:", frostAttack);
      console.log("frostDebuff:", frostDebuff);
      console.log("frostGearMod:", frostGearMod);
      console.log("normalMulti:", normalMulti);
      console.log("frostEleDmg:", frostEleDmg);
      console.log("frostResistMulti:", frostResistMulti);

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

    console.log(baseMultResults);
    

    let onfieldEleDmg = [0,0,0];

    function calcOnfieldEleDmg(characterIndex) {
        const characterName = selectedMatricesNames[characterIndex];
        const matriceName = matriceSelections[characterName];
    
        if (characterName.includes("lyra") && !containsPhysical) {
            onfieldEleDmg[characterIndex] = 0;
        }
    
        
        switch (elementTypes[characterIndex]) {
            
            case "Fire":
                return matriceName.fieldModE + flameEleDmg + AllEleDmg -1;
            case "Ice":
                return matriceName.fieldModE + frostEleDmg + AllEleDmg -1;
            case "Volt":
                return matriceName.fieldModE + voltEleDmg + AllEleDmg-1;
            case "Physical":
                return matriceName.fieldModE + physicalEleDmg + AllEleDmg-1;
            case "Altered":
                return matriceName.fieldModE + alteredEleDmg + AllEleDmg-1;
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


    onfieldEleDmg = [(calcOnfieldEleDmg(0)/helperCalcOnfieldEleDmg(0)), (calcOnfieldEleDmg(1)/helperCalcOnfieldEleDmg(1)), (calcOnfieldEleDmg(2)/helperCalcOnfieldEleDmg(2))];
    

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
        const matriceName = matriceSelections[characterName];

        return (1*((sTrait === "Annabella" && annaGas && characterName.includes("annabella") ) ? 1.3 : 1) *
        ((FDMulti + matriceName.fieldFD) * ((selectedCharacterNames[characterIndex].includes("samir") ? 1 : 1)/FDMulti)) *
        (normalMulti + (matriceName.fieldModN)) / normalMulti)  * ((attackBase + (characterName.includes("lyra") ? lyraMatrice2pc : 0))/ attackBase);
      }


     
    let critRate = .7;
    let critDamage = .5;
    let bonusCritrate = (matriceTotalCR1 + matriceTotalCR2 + matriceTotalCR3);
    let bonusCritDamage = (matriceTotalCD1 + matriceTotalCD2 + matriceTotalCD3);

    function critMutliplier(characterIndex) {
        const characterName = selectedMatricesNames[characterIndex];
        const matriceName = matriceSelections[characterName];
        return (characterName.includes("scylla" | "crow") ? 1 + characterName.includes("crow") ? .6 : .6 : 1) * 
        (Math.min(critRate +  bonusCritrate +(containsFenrir6 ? .18 : 0), 1)) * (critDamage + bonusCritDamage + matriceName.additional) + 
        ((characterName.includes("crow") ? ((1-.6) * (critRate + (containsFenrir6 ? .18 : 0)) * critDamage + bonusCritDamage)  : 0) / 
        (1 + critRate + critDamage))
    };

    const critMulti = 1;
    let maxAutoValue = 0;
      



    function calcMaxAutoDps(characterIndex) {
        return maxAutoDpsValue[characterIndex] * ((baseMultResults[characterIndex] * onfieldEleDmg[characterIndex] * calcActiveMultiplier(characterIndex)) 
        * critMulti) * (containsClaudia ? normalMulti + claudiaMatrice2pc / normalMulti : 1)
    }

    function calcEnduranceDps(characterIndex) {
        return enduranceDpsValue[characterIndex] * ((baseMultResults[characterIndex] * onfieldEleDmg[characterIndex] * calcActiveMultiplier(characterIndex)) 
        * critMulti) * (containsClaudia ? normalMulti + claudiaMatrice2pc / normalMulti : 1)
    }

    function calcDodgeDamage(characterIndex) {
        return dodgeDamageValue[characterIndex] * (baseMultResults[characterIndex] * onfieldEleDmg[characterIndex] * 
            calcActiveMultiplier(characterIndex) * critMulti)
    }

    function calcDodgeDps(characterIndex) {
        return damagePerDodgeValue[characterIndex] * (baseMultResults[characterIndex] * onfieldEleDmg[characterIndex] * 
            calcActiveMultiplier(characterIndex) * critMulti)
    }

    function calcPassiveMod(characterIndex) {
        return (1+((onfieldEleDmg[characterIndex] * calcActiveMultiplier(0) * critMulti)))
    }

    function calcAdditionalMulti(characterIndex) {

    }

    console.log();

  };


calculateDPS("yulanmartial6", "fiona6", "alyss6", "lyrasamir2pc3", "alyss4pc3", "yulan4pc3", "yulan", "wellspring", "maelstrom");

// Now you can access the data for a specific character selection

  