import sys
import time
import json
import os

def dummy_inference(image_path):
    time.sleep(2)

    result = {
        "input_file": os.path.basename(image_path),
        "status": "processed",
        "detections": [
            {"label": "cat", "confidence": 0.87},
            {"label": "dog", "confidence": 0.76}
        ],
        "timestamp": time.time()
    }
    return result

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python inference.py [input_image_path] [output_json_path]")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    result = dummy_inference(input_path)

    with open(output_path, 'w') as f:
        json.dump(result, f)

    print(f"Inference complete. Results written to {output_path}")
