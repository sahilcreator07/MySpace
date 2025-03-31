from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from diffusers import (
    ControlNetModel,
    StableDiffusionControlNetPipeline,
    UniPCMultistepScheduler,
)
from controlnet_aux import MLSDdetector
from PIL import Image, UnidentifiedImageError
from io import BytesIO
import torch
import os
from uuid import uuid4

app = FastAPI()

# ✅ Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create required folders
os.makedirs("uploads", exist_ok=True)
os.makedirs("generated_images", exist_ok=True)

# ✅ Serve static folders
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/generated_images", StaticFiles(directory="generated_images"), name="generated_images")

# ✅ Load models once
CONTROLNET_CHECKPOINT = "razor7x/controlnet-trained-model"
SD_MODEL = "runwayml/stable-diffusion-v1-5"

processor = MLSDdetector.from_pretrained("lllyasviel/ControlNet")
controlnet = ControlNetModel.from_pretrained(CONTROLNET_CHECKPOINT, torch_dtype=torch.float32)
pipe = StableDiffusionControlNetPipeline.from_pretrained(
    SD_MODEL,
    controlnet=controlnet,
    torch_dtype=torch.float32
)
pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
pipe.to("cpu")  # Change to "cuda" if you're using GPU

@app.get("/")
def home():
    return {"message": "ControlNet Stable Diffusion API is running."}

@app.post("/generate/")
async def generate_image(
    file: UploadFile = File(...),
    prompt: str = Form(...)
):
    if not file or not prompt.strip():
        raise HTTPException(status_code=400, detail="Missing file or prompt")

    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Invalid image file. Please upload a valid JPG or PNG.")

    # ✅ Save uploaded image
    upload_id = str(uuid4())
    upload_path = f"uploads/{upload_id}.png"
    image.save(upload_path)
    print("✅ Uploaded image saved:", upload_path)

    # ✅ Process image with ControlNet
    control_image = processor(image)
    control_path = "generated_images/control_image.png"
    control_image.save(control_path)
    print("✅ Control image saved")

    # ✅ Generate output image
    generator = torch.manual_seed(0)
    output_image = pipe(
        prompt,
        negative_prompt="not a room, no people, no cartoon, no text",
        num_inference_steps=30,
        generator=generator,
        image=control_image
    ).images[0]

    output_path = f"generated_images/generated_output.png"
    output_image.save(output_path)
    print("✅ Generated design saved:", output_path)

    return {
        "original_image_url": f"http://127.0.0.1:8000/{upload_path}",
        "generated_image_url": f"http://127.0.0.1:8000/{output_path}"
    }
