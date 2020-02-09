import os
import subprocess
import time
import signal
from configs import configs_defined, generate_configs
from game import game_defined, generate_game

CONFIGS_PATH = os.environ['CONFIGS_PATH']
GAME_PATH = os.environ['GAME_PATH']

ADMIN_PLAYERS_CONFIG = os.path.join(CONFIGS_PATH, 'server-adminlist.json')
WHITELISTED_PLAYERS_CONFIG = os.path.join(CONFIGS_PATH, 'server-whitelist.json')


class ProcessSignals:
  exiting = False
  def __init__(self):
    signal.signal(signal.SIGINT, self.exit)
    signal.signal(signal.SIGTERM, self.exit)

  def exit(self, *args, **kwargs):
    self.exiting = True

if __name__ == '__main__':
    if not configs_defined():
        generate_configs()
    if not game_defined():
        generate_game()

    game_path=os.path.join(GAME_PATH, 'game.zip')
    server_settings_path=os.path.join(CONFIGS_PATH, 'server-settings.json')
    map_gen_settings_path=os.path.join(CONFIGS_PATH, 'map-gen-settings.json')
    map_settings_path=os.path.join(CONFIGS_PATH, 'map-settings.json')
    command = [
        "/opt/factorio/bin/x64/factorio",
        "--start-server", 
        "{game_path}".format(game_path=game_path),
        "--server-settings",
        "{server_settings_path}".format(server_settings_path=server_settings_path),
        "--map-gen-settings",
        "{map_gen_settings_path}".format(map_gen_settings_path=map_gen_settings_path),
        "--map-settings",
        "{map_settings_path}".format(map_settings_path=map_settings_path),
        "--port",
        "{bind_port}".format(bind_port=os.environ['BIND_PORT']),
        "--bind",
        "{bind_ip}".format(bind_ip=os.environ['BIND_IP'])
    ]
    if os.path.isfile(WHITELISTED_PLAYERS_CONFIG):
        command = command + ["--use-server-whitelist", "--server-whitelist", "{whitelist_path}".format(whitelist_path=WHITELISTED_PLAYERS_CONFIG)]
    if os.path.isfile(ADMIN_PLAYERS_CONFIG):
        command = command + ["--server-adminlist", "{admin_path}".format(admin_path=ADMIN_PLAYERS_CONFIG)]
    
    process = subprocess.Popen(
        command,
        stdin=subprocess.PIPE
    )
    process_pid = process.pid

    #Working around the fact that the Factorio server doesn't handle EOF on input well
    signal_handler = ProcessSignals()
    while not signal_handler.exiting:
        time.sleep(1)
    os.killpg(os.getpgid(process.pid), signal.SIGTERM)
    
    while True:
        try:
            os.kill(process_pid, 0)
        except OSError:
            break