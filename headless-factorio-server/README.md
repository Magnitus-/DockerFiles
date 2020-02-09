# Overview

This image facilitates the operation of a headless Factorio server by wrapping the headless server factorio binary with some python scripts.

Given that the binary is not MIT, I won't publish the image on Docker Hub, but you can build it yourself from the Dockerfile here.

# Environment Variables

The behavior of the server is customizable with the following environment variables:

- GAME_NAME: Name to give your game
- GAME_DESCRIPTION: Description to give your game
- GAME_PASSWORD: Password users will need to supply to join your game
- MAX_PLAYERS: Integer specifying the max number of players who can join. Defaults to unlimited
- AUTO_SAVE_INTERVAL: Interval of time in minutes between automated saves (defaults to 10)
- AUTO_SAVE_SLOTS: Number of save slots that are kept (defaults to 5)
- POLLUTION_ENABLED: Whether pollution exists in the game. Game be 'true' or 'false'. Defaults to 'true'.
- EVOLUTION_ENABLED: Whether enemies evolve. Game be 'true' or 'false'. Defaults to 'true'.
- EXPANSION_ENABLED: Whether enemies build new bases. Game be 'true' or 'false'. Defaults to 'true'.
- MIN_EXPANSION_COOLDOWN: Minimum period of time in minutes before enemies try to build a new base. Defaults to 4.
- MAX_EXPANSION_COOLDOWN: Maximum period of time in minutes before enemies try to build a new base. Defaults to 60.
- MIN_SETTLER_GROUP_SIZE: Minimum size of the group enemies send to build a new base. Defaults to 5. 
- MAX_SETTLER_GROUP_SIZE: Maximum size of the group enemies send to build a new base. Defaults to 20. 
- TECHNOLOGY_PRICE_MULTIPLIER: Cost multiplier on normal costs to research technologies as an integer. Defaults to 1.
- EVOLUTION_TIME_FACTOR: How much enemies evolve over time as a real number. Defaults to 0.000004.
- EVOLUTION_DESTROY_FACTOR: How much enemies evolve when you destroy their buildings as a real number. Defaults to 0.002.
- EVOLUTION_POLLUTION_FACTOR: How enemies evolve given the amount of pollution you generate as a real number. Defaults to 0.0000009.
- SEED: Provide a seed to generate a game identical to a past game you generated. Defaults to null for a random game.
- MAP_WIDTH: Width of the map in tiles. Defaults to 0 for maximum (a very large map)
- MAP_HEIGHT: Height of the map in tiles. Defaults to 0 for maximum (a very large map)
- BITER_FREE_STARTING_AREA: Multiplier of the normal enemy free radius in the early game as an integer. Defaults to 1.
- WATER_ELEVATION: Multiplier on the normal water levels (to have more water, less land), with a log applied to it before multiplying. Defaults to 1.
- PEACEFUL_MODE: Whether you have enemies or not as 'true' or 'false'. Defaults to 'false' (ie, you have enemies)
- ADMIN_PLAYERS: Comma separated list of players that you want to be admin. If missing, the will be no admin.
- WHITELISTED_PLAYERS: Comma separated list of players to allow. If missing, anyone who can supply the game's password is allowed.

There are also various environment variables to set the amount (frequency, size, richness) of various starting resources, but I'm getting lazy. Please, look at the configs.py code file for their names.

Note that the headless server binary supplied by the makers of Factorio is highly configurable. This is just a subset of possible configurations that I found interesting to play with.

# Requisite volumes

You should mount a bind a volume on your machine to the following path in the container to persist data: /opt/data

# Caveats

Currently, only non-public mode with no centralized account and no LAN broadcast is supported because that was my use-case which I could troubleshoot.

Also, I could not make it work inside a docker network with port fowarding so right now, it only works if you run the container on the host network.