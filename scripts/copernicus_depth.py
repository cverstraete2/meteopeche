#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.copernicus_depth import get_depth_current


def main():
    params = json.loads(sys.argv[1])
    print(json.dumps(get_depth_current(params), ensure_ascii=False))


if __name__ == "__main__":
    main()
