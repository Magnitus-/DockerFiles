import os

CONFIGS_PATH = os.environ['CONFIGS_PATH']
GAME_PATH = os.environ['GAME_PATH']

def game_defined():
    return os.path.isdir(GAME_PATH)

def generate_game():
    os.makedirs(GAME_PATH)
    code = os.system(
        "/opt/factorio/bin/x64/factorio --create {game_path} --server-settings {server_settings_path} --map-gen-settings {map_gen_settings_path} --map-settings {map_settings_path}".format(
            game_path=os.path.join(GAME_PATH, 'game.zip'),
            server_settings_path=os.path.join(CONFIGS_PATH, 'server-settings.json'),
            map_gen_settings_path=os.path.join(CONFIGS_PATH, 'map-gen-settings.json'),
            map_settings_path=os.path.join(CONFIGS_PATH, 'map-settings.json'),
        )
    )
    if code != 0:
        exit(code)