import os

from jinja2 import Environment, FileSystemLoader

CONFIGS_PATH = os.environ['CONFIGS_PATH']
TEMPLATES_PATH = os.environ['TEMPLATES_PATH']

TEMPLATE_ENV = Environment(
    loader=FileSystemLoader(TEMPLATES_PATH),
    trim_blocks=True
)

TEMPLATES = [
    {
        'source': 'server-settings.json.j2',
        'destination': 'server-settings.json',
        'environment': {
            'game_name': os.environ.get('GAME_NAME', 'The Game'),
            'game_description': os.environ.get('GAME_DESCRIPTION', 'Friendly Game'),
            'game_password': os.environ['GAME_PASSWORD'],
            'max_players': int(os.environ.get('MAX_PLAYERS', '0')),
            'auto_save_interval': int(os.environ.get('AUTO_SAVE_INTERVAL', '10')),
            'auto_save_slots': int(os.environ.get('AUTO_SAVE_SLOTS', '5'))
        }
    },
    {
        'source': 'map-settings.json.j2',
        'destination': 'map-settings.json',
        'environment': {
            'pollution_enabled': os.environ.get('POLLUTION_ENABLED', 'true'),
            'evolution_enabled': os.environ.get('EVOLUTION_ENABLED', 'true'),
            'expansion_enabled': os.environ.get('EXPANSION_ENABLED', 'true'),
            'min_expansion_cooldown': int(os.environ.get('MIN_EXPANSION_COOLDOWN', '4'))*3600,
            'max_expansion_cooldown': int(os.environ.get('MAX_EXPANSION_COOLDOWN', '60'))*3600,
            'min_settler_group_size': int(os.environ.get('MIN_SETTLER_GROUP_SIZE', '5')),
            'max_settler_group_size': int(os.environ.get('MAX_SETTLER_GROUP_SIZE', '20')),
            'technology_price_multiplier': int(os.environ.get('TECHNOLOGY_PRICE_MULTIPLIER', '1')),
            'evolution_time_factor': os.environ.get('EVOLUTION_TIME_FACTOR', '0.000004'),
            'evolution_destroy_factor': os.environ.get('EVOLUTION_DESTROY_FACTOR', '0.002'),
            'evolution_pollution_factor': os.environ.get('EVOLUTION_POLLUTION_FACTOR', '0.0000009')
        }
    },
    {
        'source': 'map-gen-settings.json.j2',
        'destination': 'map-gen-settings.json',
        'environment': {
            'seed': os.environ.get('SEED', 'null'),
            'map_width': int(os.environ.get('MAP_WIDTH', '0')),
            'map_height': int(os.environ.get('MAP_HEIGHT', '0')),
            'biter_free_starting_area': int(os.environ.get('BITER_FREE_STARTING_AREA', '1')),
            'water_elevation': int(os.environ.get('WATER_ELEVATION', '1')),
            'peaceful_mode': os.environ.get('PEACEFUL_MODE', 'false'),
            'coal': {
                'frequency': int(os.environ.get('COAL_FREQUENCY', '1')),
                'size': int(os.environ.get('COAL_SIZE', '1')),
                'richness': int(os.environ.get('COAL_RICHNESS', '1'))
            },
            'stone': {
                'frequency': int(os.environ.get('STONE_FREQUENCY', '1')),
                'size': int(os.environ.get('STONE_SIZE', '1')),
                'richness': int(os.environ.get('STONE_RICHNESS', '1'))
            },
            'copper_ore': {
                'frequency': int(os.environ.get('COPPER_ORE_FREQUENCY', '1')),
                'size': int(os.environ.get('COPPER_ORE_SIZE', '1')),
                'richness': int(os.environ.get('COPPER_ORE_RICHNESS', '1'))
            },
            'iron_ore': {
                'frequency': int(os.environ.get('IRON_ORE_FREQUENCY', '1')),
                'size': int(os.environ.get('IRON_ORE_SIZE', '1')),
                'richness': int(os.environ.get('IRON_ORE_RICHNESS', '1'))
            },
            'uranium_ore': {
                'frequency': int(os.environ.get('URANIUM_ORE_FREQUENCY', '1')),
                'size': int(os.environ.get('URANIUM_ORE_SIZE', '1')),
                'richness': int(os.environ.get('URANIUM_ORE_RICHNESS', '1'))
            },
            'crude_oil': {
                'frequency': int(os.environ.get('CRUDE_OIL_FREQUENCY', '1')),
                'size': int(os.environ.get('CRUDE_OIL_SIZE', '1')),
                'richness': int(os.environ.get('CRUDE_OIL_RICHNESS', '1'))
            },
            'trees': {
                'frequency': int(os.environ.get('TREES_FREQUENCY', '1')),
                'size': int(os.environ.get('TREES_SIZE', '1')),
                'richness': int(os.environ.get('TREES_RICHNESS', '1'))
            },
            'enemy_base': {
                'frequency': int(os.environ.get('ENEMY_BASE_FREQUENCY', '1')),
                'size': int(os.environ.get('ENEMY_BASE_SIZE', '1')),
                'richness': int(os.environ.get('ENEMY_BASE_RICHNESS', '1'))
            }
        }
    }
]

if os.environ.get('ADMIN_PLAYERS', None) is not None:
    TEMPLATES.append(
        {
            'source': 'server-adminlist.json.j2',
            'destination': 'server-adminlist.json',
            'environment': {
                'players': map(lambda val: "\"{val}\"".format(val=val), os.environ.get('ADMIN_PLAYERS').split(','))
            }
        }
    )

if os.environ.get('WHITELISTED_PLAYERS', None) is not None:
    TEMPLATES.append(
        {
            'source': 'server-whitelist.json.j2',
            'destination': 'server-whitelist.json',
            'environment': {
                'players': map(lambda val: "\"{val}\"".format(val=val), os.environ.get('WHITELISTED_PLAYERS').split(','))
            }
        }
    )

def configs_defined():
    return os.path.isdir(CONFIGS_PATH)

def generate_configs():
    os.makedirs(CONFIGS_PATH)
    for template in TEMPLATES:
        renderer = TEMPLATE_ENV.get_template(template['source'])
        config_file_path = os.path.join(CONFIGS_PATH, template['destination'])
        with open(config_file_path, 'w+') as config_file:
            config_file.write(renderer.render(template['environment']))
