#!/usr/bin/env bash
VERSION=$(ls /opt/terraria)

chmod +x /opt/terraria/$VERSION/Linux/TerrariaServer.bin.x86_64

/opt/terraria/$VERSION/Linux/TerrariaServer.bin.x86_64 "$@"