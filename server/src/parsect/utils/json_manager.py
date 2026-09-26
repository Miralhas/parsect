import json
import logging
from pathlib import Path
from typing import Dict

logging.basicConfig(level=logging.INFO)

def load_json(file_path: Path) -> Dict:
    """Load JSON data from a file."""
    try:
        with file_path.open("r", encoding="utf-8") as f:
            # logging.info("Loading JSON file into a dictionary...")
            return json.load(f)
    except Exception as e:
        raise RuntimeError(f"Failed to load JSON from {file_path}: {e}")


def dump_json(output_path: Path, data: Dict) -> None:
    """Dump data into a JSON file"""
    try:
        with open(output_path, "w", encoding="utf-8") as json_file:
            logging.info("Dumping data into a JSON file...")
            json.dump(data, json_file, ensure_ascii=False, indent=4)
    except Exception as e:
        raise RuntimeError(f"Failed to dump JSON file on {output_path}: {e}")