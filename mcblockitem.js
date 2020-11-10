const WebSocket = require('ws');
const app  = require('express');
const server = require('http').Server(app);
const util = require('util');
const _ = require('underscore');

var settings ={
 host: 'localhost',
 port: 19131,
};

// mode 1 set random block only, mode 2 give random item only,
// mode 3 both, mode 4 either or (only one can happen)
var mode = 1;

// delay in miliseconds + random milliseconds
var blockdelay = 2250 + getRandInt(100, 250);
var itemdelay = 5250 + getRandInt(25, 250);
var unidelay = 2500 + getRandInt(250, 2000);
// block list
var blocks = ['tripwire_hook','air','noteblock','gravel','lit_redstone_lamp','stone','golden_rail','gold_block','bedrock','turtle_egg','element_72','oak_stairs','element_7','grass','detector_rail','planks','dark_oak_pressure_plate','dirt','coal_ore','diamond_block','cobblestone','element_12','lava','dark_oak_trapdoor','element_63','double_stone_slab2','slime','stonebrick','sapling','cauldron','flowing_water','spruce_pressure_plate','piston','stained_glass','water','flowing_lava','furnace','element_81','sand','gold_ore','wooden_door','tallgrass','iron_ore','underwater_torch','web','log','element_47','stripped_oak_log','leaves','ladder','yellow_flower','element_113','sponge','sweet_berry_bush','birch_fence_gate','standing_sign','monster_egg','glass','conduit','element_43','lapis_ore','spruce_button','bookshelf','bed','element_79','powered_comparator','wooden_pressure_plate','lapis_block','element_116','stripped_acacia_log','spruce_door','dispenser','wheat','diamond_ore','sandstone','obsidian','wool','brick_block','reeds','sticky_piston','deadbush','dried_kelp_block','pistonArmCollision','red_flower','green_glazed_terracotta','brown_mushroom','red_mushroom','spruce_fence_gate','iron_block','stone_slab','double_stone_slab','rail','tnt','mossy_cobblestone','quartz_stairs','torch','mob_spawner','lava_cauldron','element_82','chest','jungle_standing_sign','element_41','redstone_wire','crafting_table','element_39','dark_oak_door','farmland','lit_furnace','stone_stairs','wall_sign','lever','stone_pressure_plate','element_48','iron_door','redstone_ore','lectern','lit_redstone_ore','unlit_redstone_torch','red_nether_brick_stairs','redstone_torch','stone_button','snow_layer','brown_mushroom_block','ice','snow','cactus','element_88','command_block','clay','jukebox','fence','pumpkin','acacia_door','nether_brick_stairs','netherrack','log2','soul_sand','glowstone','portal','lit_pumpkin','beetroot','cake','unpowered_repeater','powered_repeater','invisibleBedrock','coral_fan_hang3','acacia_stairs','trapdoor','jungle_door','red_mushroom_block','iron_bars','coral','chain_command_block','glass_pane','element_114','melon_block','coral_fan_hang2','emerald_block','pumpkin_stem','chemical_heat','melon_stem','vine','element_84','standing_banner','fence_gate','element_106','brick_stairs','stone_brick_stairs','mycelium','waterlily','smooth_stone','nether_brick','sandstone_stairs','nether_brick_fence','element_107','nether_wart','element_94','enchanting_table','brewing_stand','purpur_block','end_portal','end_portal_frame','element_4','end_stone','fletching_table','element_13','dragon_egg','loom','granite_stairs','redstone_lamp','dropper','activator_rail','coral_block','cocoa','wood','emerald_ore','hard_stained_glass_pane','observer','ender_chest','info_update','unpowered_comparator','tripWire','spruce_stairs','birch_stairs','stonecutter_block','jungle_stairs','coral_fan_hang','element_90','beacon','cobblestone_wall','flower_pot','carrots','potatoes','wooden_button','grindstone','skull','anvil','stone_slab4','element_21','trapped_chest','light_weighted_pressure_plate','element_25','purple_glazed_terracotta','heavy_weighted_pressure_plate','daylight_detector','stripped_jungle_log','redstone_block','quartz_ore','hopper','element_97','quartz_block','wooden_slab','element_53','double_wooden_slab','leaves2','stained_hardened_clay','carved_pumpkin','stained_glass_pane','dark_oak_stairs','iron_trapdoor','prismarine','seaLantern','element_96','hay_block','element_37','carpet','hardened_clay','element_44','coal_block','packed_ice','element_118','chemistry_table','black_glazed_terracotta','purpur_stairs','double_plant','wall_banner','daylight_detector_inverted','red_sandstone','red_sandstone_stairs','spruce_trapdoor','element_27','stone_slab2','jungle_fence_gate','dark_oak_fence_gate','acacia_fence_gate','repeating_command_block','birch_door','grass_path','frame','normal_stone_stairs','element_1','chorus_flower','jungle_pressure_plate','undyed_shulker_box','element_10','end_bricks','smoker','frosted_ice','diorite_stairs','structure_block','end_rod','element_16','blue_glazed_terracotta','end_gateway','magma','bell','stone_slab3','element_26','movingBlock','nether_wart_block','red_nether_brick','bone_block','structure_void','shulker_box','white_glazed_terracotta','orange_glazed_terracotta','magenta_glazed_terracotta','light_blue_glazed_terracotta','colored_torch_bp','yellow_glazed_terracotta','element_59','lime_glazed_terracotta','pink_glazed_terracotta','barrier','gray_glazed_terracotta','silver_glazed_terracotta','cyan_glazed_terracotta','glowingobsidian','brown_glazed_terracotta','red_glazed_terracotta','concrete','acacia_trapdoor','concretePowder','scaffolding','element_54','chorus_plant','podzol','stonecutter','netherreactor','element_34','info_update2','element_3','reserved6','element_31','prismarine_stairs','bamboo','element_76','dark_prismarine_stairs','prismarine_bricks_stairs','stripped_spruce_log','stripped_birch_log','cartography_table','stripped_dark_oak_log','blue_ice','fire','hard_glass','acacia_standing_sign','hard_stained_glass','hard_glass_pane','colored_torch_rg','element_0','element_2','element_5','blast_furnace','element_6','element_8','element_9','mossy_cobblestone_stairs','element_11','andesite_stairs','element_14','element_15','element_17','element_18','element_19','element_20','acacia_button','element_22','element_23','element_24','element_28','element_29','element_30','element_32','element_33','element_35','element_36','element_38','element_40','element_42','element_45','smooth_red_sandstone_stairs','seagrass','element_46','element_49','element_50','element_51','sea_pickle','element_52','element_55','element_56','element_57','element_58','element_60','element_61','double_stone_slab3','element_62','element_64','double_stone_slab4','element_65','element_66','element_67','element_68','element_69','element_70','element_71','element_73','element_74','element_75','bamboo_sapling','element_77','element_78','element_80','element_83','element_85','element_86','jungle_button','element_87','element_89','birch_pressure_plate','element_91','element_92','element_93','birch_wall_sign','element_95','element_98','element_99','element_100','element_101','element_102','element_103','element_104','element_105','element_108','element_109','jungle_trapdoor','element_110','element_111','element_112','element_115','element_117','coral_fan','coral_fan_dead','kelp','birch_button','dark_oak_button','birch_trapdoor','acacia_pressure_plate','bubble_column','polished_granite_stairs','polished_diorite_stairs','polished_andesite_stairs','mossy_stone_brick_stairs','smooth_sandstone_stairs','end_brick_stairs','smooth_quartz_stairs','spruce_standing_sign','spruce_wall_sign','birch_standing_sign','smithing_table','jungle_wall_sign','acacia_wall_sign','darkoak_standing_sign','darkoak_wall_sign','lit_smoker','barrel','lantern','campfire','jigsaw','composter','lit_blast_furnace'];
// item list
var items = ['spawn_egg','planks','crimsion_planks','warped_planks','bed','wool','glass','stained_glass','glass_pane','stained_glass_pane','hardened_clay','stained_hardened_clay','banner','banner_pattern','bucket','coral'];

//random inclusive number 
function getRandInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

// socket functions
function sendcmd(cmd){
  return JSON.stringify({
    "body": {
	"origin": {
		"type": "player"
	},
        "commandLine": util.format(cmd),
	 "version": 1
			},
			"header": {
				"requestId": "00000000-0001-0000-000000000000",
				"messagePurpose": "commandRequest",
				"version": 1,
				"messageType": "commandRequest"
	                         }
			       });
                              }

// websocket

const wss = new WebSocket.Server({server});

wss.on('connection', socket => {
socket.send(sendcmd('say hello!'));
socket.send(sendcmd('give @a cookie 1'));
socket.send(sendcmd('say set commandblockoutput to false'));
socket.send(sendcmd('gamerule commandblockoutput false'));

if(mode === 1 || 3) {
// sets random block
var setblock = setInterval(function() {
 var randblock = _.sample(blocks);
socket.send(sendcmd('execute @a ~~~ /setblock ~~-1~ ' + randblock ));
console.log("block set");
}, blockdelay);
}
if(mode === 2 || 3) {
//gives random item
var giveitem = setInterval(function() {
var rancolor = getRandomInclusive(0,16);
switch (_.sample(items)) {
  case 'spawn_egg':
    var ranmob = getRandInt(1,126);
     socket.send(sendcmd('give @a spawn_egg 1 ' + ranmob));
    break;
  case 'planks':
    var ranplanks = getRandInt(0,5);
    socket.send(sendcmd('give @a planks 1 ' + ranplanks));
    break;
  case 'crimsion_planks':
    socket.send(sendcmd('give @a crimsion_planks 1'));
    break;
  case 'warped_planks':
    socket.send(sendcmd('give @a warped_planks 1'));
    break;
  case 'bed':
    socket.send(sendcmd('give @a bed 1 ' + rancolor));
    break;
  case 'wool':
    socket.send(sendcmd('give @a wool 1 ' + rancolor));
    break;
  case 'glass':
    socket.send(sendcmd('give @a glass 1'));
    break;
  case 'stained_glass':
   socket.send(sendcmd('give @a stained_glass 1 ' + rancolor));
   break;
  case 'glass_pane':
    socket.send(sendcmd('give @a glass_pane 1'));
    break;
  case 'stained_glass_pane':
   socket.send(sendcmd('give @a stained_glass_pane 1 ' + rancolor));
   break;
  case 'hardened_clay':
   socket.send(sendcmd('give @a hardened_clay 1'));
   break;
  case 'stained_hardened_clay':
   socket.send(sendcmd('give @a stained_hardened_clay 1 ' + rancolor));
   break;
  case 'banner':
   socket.send(sendcmd('give @a banner 1 ' + rancolor));
   break;
  case 'banner_pattern':
   socket.send(sendcmd('give @a banner_pattern 1 ' + rancolor));
   break;
  case 'bucket':
    var ranbucket = getRandInt(0,10);
   socket.send(sendcmd('give @a bucket 1 ' + ranbucket));
   break;
  case 'coral':
    var rancoral = getRandInt(0,12);
   socket.send(sendcmd('give @a coral 1 ' + rancoral));
   break;
}
}, itemdelay);
}
/*
var fillair = setInterval(function() {
  socket.send(sendcmd('execute @a ~~~ /fill ~10 ~10 ~10 ~-10~-10~-10 air'));
}, 300);
var tnt = setInterval(function() {
   socket.send(sendcmd('execute @a ~~10~ /summon tnt'));
   socket.send(sendcmd('execute @a ~-1~~ /summon ender_crystal'));
}, 200);
*/
});//socket

server.listen(settings.port, () => {
    console.log('listening on ' + settings.port);
});
