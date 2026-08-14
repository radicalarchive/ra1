#!/bin/sh
# Radical Aces, the original desktop build. Needs a display.
#
# The jar runs unpatched on a modern JDK: it vendors its own copy of
# sun.audio, which Java 9 removed. That is the difference from the sibling nfm
# port, whose jar needed seven bytecode patches before it would start.
#
# It reads its assets by relative path, so it must run from the repo root.
cd "$(dirname "$0")"
java -jar java/ra1.jar
