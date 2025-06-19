import sys
import numpy as np
from PIL import Image

def dummy_inference():
    img_array = np.random.randint(0, 256, (256, 256, 3), dtype=np.uint8)
    return Image.fromarray(img_array, 'RGB')
   
def main():
    if len(sys.argv) != 3:
        print("Usage: python dummy_inference.py <input_path> <output_path>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    img = dummy_inference()
    img.save(output_path)
    
    print(f"Random image saved to {output_path}")


if __name__ == "__main__":
    main()
